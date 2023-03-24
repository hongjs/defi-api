const apicache = require('apicache')
const router = require('express').Router()
const { getDefiPrice, getBNBPrice, getTVL } = require('../utils/priceUtil')
const { getVaultsInfo, getRaffleInfo } = require('../utils/vaultUtil')
const { getPrice } = require('../utils/dexguru')
const contracts = require('../configs/constants/contracts').addresses

const cache = apicache.middleware

router.get('/info', cache('1 minutes'), async (req, res, next) => {
  try {
    const bnbPrice = await getBNBPrice()
    const defiPrice = await getDefiPrice(bnbPrice)
    const tvl = await getTVL(defiPrice, bnbPrice)

    res.send({
      price: Math.round(defiPrice * 1000000) / 1000000,
      bnbPrice: Math.round(bnbPrice * 10000) / 10000,
      tvl: Math.round(tvl * 10000) / 10000,
      currency: 'USD',
    })
  } catch (e) {
    console.log(e)
    next({ message: 'An unknown error has occurred' })
  }
})

router.get('/price', cache('1 minutes'), async (req, res, next) => {
  try {
    const tokens = [contracts.wbnb, contracts.defi, contracts.eth, contracts.btc]
    const results = await Promise.all(
      tokens.map(async (token) => {
        return await getPrice(token)
      })
    )

    const bnbPrice = results.some((i) => i.token === contracts.wbnb)
      ? results.find((i) => i.token === contracts.wbnb).price
      : 0
    const defiPrice = results.some((i) => i.token === contracts.defi)
      ? results.find((i) => i.token === contracts.defi).price
      : 0
    const ethPrice = results.some((i) => i.token === contracts.eth)
      ? results.find((i) => i.token === contracts.eth).price
      : 0
    const btcPrice = results.some((i) => i.token === contracts.btc)
      ? results.find((i) => i.token === contracts.btc).price
      : 0

    res.send({
      defi: Math.round(defiPrice * 1000000) / 1000000,
      bnb: Math.round(bnbPrice * 10000) / 10000,
      eth: Math.round(ethPrice * 10000) / 10000,
      btc: Math.round(btcPrice * 10000) / 10000,
      currency: 'USD',
    })
  } catch (e) {
    console.log(e)
    next({ message: 'An unknown error has occurred' })
  }
})

router.get('/vault', async (req, res, next) => {
  try {
    const bnbPrice = await getBNBPrice()
    const defiPrice = await getDefiPrice(bnbPrice)
    const data = await getVaultsInfo(bnbPrice, defiPrice)
    res.send({ data, currency: 'USD' })
  } catch (e) {
    console.log(e)
    next({ message: 'An unknown error has occurred', detail: e })
  }
})

router.get('/raffle', async (req, res, next) => {
  try {
    const bnbPrice = await getBNBPrice()
    const data = await getRaffleInfo(bnbPrice)
    res.send({ data })
  } catch (e) {
    console.log(e)
    next({ message: 'An unknown error has occurred', detail: e })
  }
})

module.exports = router
