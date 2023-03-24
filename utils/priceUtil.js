const BigNumber = require('bignumber.js')
const { multicall } = require('./multicall')
const { addresses } = require('../configs/constants/contracts')
const erc20Abi = require('../configs/abi/erc20.json')
const { farms } = require('../configs/constants/farms')
const { QuoteToken } = require('../configs/constants/quote')
const { getVaultTotalTVL, getRaffleTVL } = require('./vaultUtil')

const getBNBPrice = async () => {
  const calls = [
    {
      address: addresses.busd,
      name: 'balanceOf',
      params: [addresses.pancakeBnbBusdLP],
    },
    {
      address: addresses.wbnb,
      name: 'balanceOf',
      params: [addresses.pancakeBnbBusdLP],
    },
  ]
  const [_busdBalance, _wbnbBalance] = await multicall(erc20Abi, calls)
  const wbnbBalance = new BigNumber(_wbnbBalance).div(1e18).toNumber()
  const busdBalance = new BigNumber(_busdBalance).div(1e18).toNumber()

  return wbnbBalance > 0 ? busdBalance / wbnbBalance : 0
}

const getDefiPrice = async (bnbPrice) => {
  const calls = [
    {
      address: addresses.defi,
      name: 'balanceOf',
      params: [addresses.defiBusdLP],
    },
    {
      address: addresses.busd,
      name: 'balanceOf',
      params: [addresses.defiBusdLP],
    },

    {
      address: addresses.defi,
      name: 'balanceOf',
      params: [addresses.defiBnbLP],
    },
    {
      address: addresses.wbnb,
      name: 'balanceOf',
      params: [addresses.defiBnbLP],
    },
  ]
  const [_defiInDefiBusd, _busdInDefiBusd, _defiInDefiBnb, _busdInDefiBnb] = await multicall(erc20Abi, calls)

  const defiInDefiBusd = new BigNumber(_defiInDefiBusd)
  const busdInDefiBusd = new BigNumber(_busdInDefiBusd)
  const defiInDefiBnb = new BigNumber(_defiInDefiBnb)
  const busdInDefiBnb = new BigNumber(_busdInDefiBnb)

  const totalDefi = defiInDefiBusd.plus(defiInDefiBnb)
  const totalBusd = busdInDefiBusd.plus(busdInDefiBnb.times(bnbPrice))

  return totalDefi.isZero() ? 0 : totalBusd.div(totalDefi).toNumber()
}

const getTVL = async (defiPrice, bnbPrice) => {
  const calls = []
  const [_totalStaked] = await multicall(erc20Abi, [
    {
      address: addresses.defi,
      name: 'balanceOf',
      params: [addresses.masterChef],
    },
  ])

  const totalStaked = new BigNumber(_totalStaked)
  const poolTVL = totalStaked.div(1e18).times(defiPrice)

  const _farms = farms.filter((i) => i.pid !== 0)
  _farms.forEach((farm) => {
    calls.push({
      address: farm.quoteTokenAddress,
      name: 'balanceOf',
      params: [farm.lpAddress],
    })
    calls.push({
      address: farm.lpAddress,
      name: 'balanceOf',
      params: [addresses.masterChef],
    })
    calls.push({
      address: farm.lpAddress,
      name: 'totalSupply',
      params: [],
    })
  })
  const results = await multicall(erc20Abi, calls)

  const farmsWithTVL = _farms.map((farm, index) => {
    let lpTotalInQuoteToken = new BigNumber(0)

    const quoteTokenBlanceLP = new BigNumber(results[index * 3])
    const lpTokenBalanceMC = new BigNumber(results[index * 3 + 1])
    const lpTotalSupply = new BigNumber(results[index * 3 + 2])

    const lpTokenRatio = lpTotalSupply.isZero() ? new BigNumber(0) : lpTokenBalanceMC.div(lpTotalSupply)
    lpTotalInQuoteToken = quoteTokenBlanceLP.div(1e18).times(2).times(lpTokenRatio)

    let tvl = lpTotalInQuoteToken
    if (farm.quoteTokenSymbol === QuoteToken.DEFI) {
      tvl = lpTotalInQuoteToken.times(defiPrice)
    } else if (farm.quoteTokenSymbol === QuoteToken.WBNB) {
      tvl = lpTotalInQuoteToken.times(bnbPrice)
    }

    return { ...farm, lpTotalInQuoteToken, defiPrice, tvl }
  })

  const farmTVL = BigNumber.sum.apply(
    null,
    farmsWithTVL.map((i) => {
      return i.tvl
    })
  )

  const vaultTVL = await getVaultTotalTVL(bnbPrice, defiPrice)
  const raffleTVL = await getRaffleTVL(bnbPrice)

  return poolTVL.plus(farmTVL).plus(vaultTVL).plus(raffleTVL).toNumber()
}

module.exports.getDefiPrice = getDefiPrice
module.exports.getBNBPrice = getBNBPrice
module.exports.getTVL = getTVL
