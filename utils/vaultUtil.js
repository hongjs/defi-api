const BigNumber = require('bignumber.js')
const { multicall } = require('./multicall')
const contracts = require('../configs/constants/contracts').addresses
const vContracts = require('../configs/constants/vaultContracts').addresses
const { vaults } = require('../configs/constants/vaults')
const { QuoteToken } = require('../configs/constants/quote')
const erc20Abi = require('../configs/abi/erc20.json')
const vaultAbi = require('../configs/abi/vaultLP.json')
// const babyMasterChefAbi = require('../configs/abi/babyMasterChef.json')
const biswapMasterChefAbi = require('../configs/abi/biswapMasterChef.json')
const kswMasterchefAbi = require('../configs/abi/kswMasterchef.json')
const vaultRaffleAbi = require('../configs/abi/vaultRaffle.json')

const getVaultTotalTVL = async (bnbPrice, defiPrice) => {
  try {
    const vaults = await getVaultsInfo(bnbPrice, defiPrice)
    const vaultTVL = vaults
      .map((i) => i.tvl)
      .reduce((sum, number) => {
        return sum + number
      }, 0)
    return vaultTVL
  } catch {
    return 0
  }
}

const getVaultsInfo = async (bnbPrice, defiPrice) => {
  const data = await Promise.all(
    vaults.map(async (vault) => {
      let res = {}
      try {
        if (vault.platform === 'KillSwitch') {
          res = await getKillSwitchVault(vault, bnbPrice, defiPrice)
        } else {
          res = await getCommonVault(vault, bnbPrice)
        }
        res.strategy = `https://bscscan.com/address/${res.strategy}#writeContract`
        res.helper = `https://bscscan.com/address/${res.helper}`

        return res
      } catch (error) {
        console.log(error)
        return {
          symbol: vault.lpSymbol,
        }
      }
    })
  )
  return data
}

const getKillSwitchVault = async (vault, bnbPrice, defiPrice) => {
  const [_strategy, _vaultBalance] = await multicall(vaultAbi, [
    {
      address: vault.vaultAddress,
      name: 'strategy',
    },
    {
      address: vault.vaultAddress,
      name: 'balance',
    },
  ])

  const tvl = new BigNumber(_vaultBalance).div(1e18).times(defiPrice)

  // KillSwitch
  const [_pendingReward] = await multicall(kswMasterchefAbi, [
    {
      address: vault.masterchefAddress,
      name: vault.pendingRewardField,
      params: [vault.kswIzlude, _strategy.toString()],
    },
  ])
  const pendingReward = new BigNumber(_pendingReward).div(1e18)
  const kswPriceUSD = await getRewardTokenPrice(vault, bnbPrice)

  return {
    symbol: vault.lpSymbol,
    tvl: Math.round(tvl.toNumber() * 10000) / 10000,
    pendingReward: Math.round(pendingReward.times(kswPriceUSD).toNumber() * 10000) / 10000,
    strategy: _strategy.toString(),
    helper: vault.helper,
  }
}

const getCommonVault = async (vault, bnbPrice) => {
  let masterChefAbi = null
  // if (vault.platform === 'BabySwap') masterChefAbi = babyMasterChefAbi
  if (vault.platform === 'BiSwap') masterChefAbi = biswapMasterChefAbi

  const [_strategy, _vaultBalance] = await multicall(vaultAbi, [
    {
      address: vault.vaultAddress,
      name: 'strategy',
    },
    {
      address: vault.vaultAddress,
      name: 'balance',
    },
  ])

  const [_lpTotalSupply, _quoteTokenBalanceOfLP, _rewardBalaneOfStrategy] = await multicall(erc20Abi, [
    { address: vault.lpAddress, name: 'totalSupply' },
    { address: vault.quoteTokenAddress, name: 'balanceOf', params: [vault.lpAddress] },
    { address: vault.rewardTokenAddress, name: 'balanceOf', params: [_strategy.toString()] },
  ])

  const quoteTokenOfLPRatio = new BigNumber(_lpTotalSupply).gt(0)
    ? new BigNumber(_quoteTokenBalanceOfLP).div(_lpTotalSupply)
    : new BigNumber(0)
  let tvl = new BigNumber(0)
  if ([QuoteToken.BNB, QuoteToken.WBNB].includes(vault.quoteTokenSymbol)) {
    tvl = new BigNumber(_vaultBalance).times(quoteTokenOfLPRatio).times(2).times(bnbPrice).div(1e18)
  } else {
    tvl = new BigNumber(_vaultBalance).times(quoteTokenOfLPRatio).times(2).div(1e18)
  }
  const [_pendingReward] = await multicall(masterChefAbi, [
    {
      address: vault.masterchefAddress,
      name: vault.pendingRewardField,
      params: [vault.pid, _strategy.toString()],
    },
  ])
  const pendingReward = new BigNumber(_pendingReward).plus(new BigNumber(_rewardBalaneOfStrategy)).div(1e18)
  const rewardTokenPriceUSD = await getRewardTokenPrice(vault, bnbPrice)

  return {
    symbol: vault.lpSymbol,
    tvl: Math.round(tvl.toNumber() * 10000) / 10000,
    pendingReward: Math.round(pendingReward.times(rewardTokenPriceUSD).toNumber() * 10000) / 10000,
    strategy: _strategy.toString(),
    helper: vault.helper,
  }
}

const getRewardTokenPrice = async (vault, bnbPrice) => {
  const [_tokenBalanceOfRewardLP, _quoteTokenBalanceOfRewardLP] = await multicall(erc20Abi, [
    { address: vault.rewardTokenAddress, name: 'balanceOf', params: [vault.rewardTokenPriceLPAddress] },
    { address: vault.quoteTokenAddressOfRewardLP, name: 'balanceOf', params: [vault.rewardTokenPriceLPAddress] },
  ])

  let rewardTokenPriceUSD = new BigNumber(0)
  if ([QuoteToken.BNB, QuoteToken.WBNB].includes(vault.quoteTokenSymbolOfRewardLP)) {
    rewardTokenPriceUSD = new BigNumber(_quoteTokenBalanceOfRewardLP).times(bnbPrice).div(_tokenBalanceOfRewardLP)
  } else {
    rewardTokenPriceUSD = new BigNumber(_quoteTokenBalanceOfRewardLP).div(_tokenBalanceOfRewardLP)
  }

  return rewardTokenPriceUSD
}
const getRaffleTVL = async (bnbPrice) => {
  const [_wbnbBalanceOfRaffle] = await multicall(erc20Abi, [
    { address: contracts.wbnb, name: 'balanceOf', params: [vContracts.raffle] },
  ])
  return new BigNumber(_wbnbBalanceOfRaffle).times(bnbPrice).div(1e18).toNumber()
}

const getRaffleInfo = async (bnbPrice) => {
  const [_wbnbBalanceOfRaffle] = await multicall(erc20Abi, [
    { address: contracts.wbnb, name: 'balanceOf', params: [vContracts.raffle] },
  ])

  const [[keys], _minRaffleAmount, _minVaultAmount, _minVaultCount] = await multicall(vaultRaffleAbi, [
    { address: vContracts.raffle, name: 'getKeys' },
    { address: vContracts.raffle, name: 'minRaffleAmount' },
    { address: vContracts.raffle, name: 'minVaultAmount' },
    { address: vContracts.raffle, name: 'minVaultCount' },
  ])

  const minRaffleAmount = new BigNumber(_minRaffleAmount)
  const minVaultAmount = new BigNumber(_minVaultAmount)
  const minVaultCount = new BigNumber(_minVaultCount)

  const entries = await Promise.all(
    keys.map(async (key) => {
      const vault = vaults.some((i) => i.vaultAddress === key) ? vaults.find((i) => i.vaultAddress === key) : {}
      const [[entry]] = await multicall(vaultRaffleAbi, [
        { address: vContracts.raffle, name: 'getEntryByKey', params: [key] },
      ])

      const balance = new BigNumber(entry.balance._hex).div(1e18)

      return {
        symbol: vault.lpSymbol,
        vault: `https://bscscan.com/address/${vault.vaultAddress}`,
        balance: Math.round(balance.toNumber() * 1000000) / 1000000,
        balanceUSD: Math.round(balance.times(bnbPrice).toNumber() * 10000) / 10000,
      }
    })
  )

  const balance = new BigNumber(_wbnbBalanceOfRaffle).div(1e18)

  let winner = null
  try {
    const [_winner] = await multicall(vaultRaffleAbi, [{ address: vContracts.raffle, name: 'getWinner' }])
    if (_winner && _winner.winner && _winner.winner.value)
      winner = `https://bscscan.com/address/${_winner.winner.value.vault}`
  } catch (err) {}
  return {
    balance: Math.round(balance.toNumber() * 1000000) / 1000000,
    balanceUSD: Math.round(balance.times(bnbPrice).toNumber() * 10000) / 10000,
    currency: 'BNB',
    vaults: entries,
    minRaffleAmount: minRaffleAmount.div(1e18).toNumber(),
    minVaultAmount: minVaultAmount.div(1e18).toNumber(),
    minVaultCount: minVaultCount.toNumber(),
    raffle: `https://bscscan.com/address/${vContracts.raffle}#writeContract`,
    winner,
  }
}

module.exports.getVaultsInfo = getVaultsInfo
module.exports.getVaultTotalTVL = getVaultTotalTVL
module.exports.getRaffleTVL = getRaffleTVL
module.exports.getRaffleInfo = getRaffleInfo
