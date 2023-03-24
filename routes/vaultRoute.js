const router = require('express').Router()
const { getDefiPrice, getBNBPrice, getTVL } = require('../utils/priceUtil')
const { getVaultsEarning } = require('../utils/vaultUtil')

router.get('/info', async (req, res, next) => {
  try {
    const bnbPrice = await getBNBPrice()
    const defiPrice = await getDefiPrice(bnbPrice)
    const tvl = await getTVL(defiPrice, bnbPrice)

    res.send({ platform: 'Defi Finance', price: defiPrice, tvl })
  } catch (e) {
    next({ message: 'An unknown error has occurred' })
  }
})

router.get('/earning', async (req, res, next) => {
  try {
    const bnbPrice = await getBNBPrice()
    const data = await getVaultsEarning(bnbPrice)
    res.send({ data })
  } catch (e) {
    console.log(e)
    next({ message: 'An unknown error has occurred', detail: e })
  }
})

module.exports = router
