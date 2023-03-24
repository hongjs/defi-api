const router = require('express').Router()
const passport = require('passport')
const godUtils = require('../utils/godfatherUtils')
const pupUtils = require('../utils/puppyUtils')
const canvasUtils = require('../utils/canvasUtils')
const nftUtils = require('../utils/nftUtils')

router.get('/:account', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { account } = req.params
  if (!account.startsWith('0x')) {
    res.status(400).send({ message: 'Incorrect account address' })
    return
  }

  try {
    const godfahterIds = await godUtils.getList(account)
    const puppyIds = await pupUtils.getList(account)

    const godfathers = await godUtils.getInfos(godfahterIds)
    const puppys = await pupUtils.getInfos(puppyIds)

    res.send({ godfathers, puppys })
  } catch (e) {
    next({ message: 'An unknown error has occurred' })
  }
})

router.get(
  '/godfather/:ticketNumber/info',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { ticketNumber } = req.params
    if (isNaN(ticketNumber) || Number(ticketNumber) < 0) {
      res.status(400).send({ message: 'Incorrect ticketNumber' })
      return
    }

    try {
      const info = await godUtils.getInfo(ticketNumber)

      res.send({ ...info })
    } catch (e) {
      next({ message: 'An unknown error has occurred' })
    }
  }
)

router.get('/puppy/:ticketNumber/info', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { ticketNumber } = req.params
  if (isNaN(ticketNumber) || Number(ticketNumber) < 0) {
    res.status(400).send({ message: 'Incorrect ticketNumber' })
    return
  }

  try {
    const info = await pupUtils.getInfo(ticketNumber)

    res.send({ ...info })
  } catch (e) {
    next({ message: 'An unknown error has occurred' })
  }
})

router.get('/godfather/:ticketNumber', async (req, res, next) => {
  let { ticketNumber } = req.params
  let { rarity, size } = req.query

  if (isNaN(ticketNumber) || Number(ticketNumber) < 0) {
    res.status(400).send({ message: 'Incorrect ticketNumber' })
    return
  } else if ((rarity && isNaN(rarity)) || Number(rarity) < 1 || Number(rarity) > 6) {
    res.status(400).send({ message: 'Incorrect rarity' })
    return
  }
  try {
    if (!size) size = 'small'
    rarity = rarity ? Number(rarity) : 1
    ticketNumber = Number(ticketNumber)
    const ticketHex = nftUtils.toNumberHex(ticketNumber, 6)
    const canvasDataUrl = await canvasUtils.renderGodfather(ticketHex, ticketNumber, rarity, size)

    var base64Data = canvasDataUrl.replace(/^data:image\/png;base64,/, '')
    var img = Buffer.from(base64Data, 'base64')
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    })
    res.end(img)
  } catch (e) {
    console.error(e)
    next({ message: `An unknown error has occurred: ${e}` })
  }
})

router.get('/puppy/:ticketNumber', async (req, res, next) => {
  let { ticketNumber } = req.params
  let { pack, size } = req.query

  if (isNaN(ticketNumber) || Number(ticketNumber) < 0) {
    res.status(400).send({ message: 'Incorrect ticketNumber' })
    return
  }

  try {
    if (!size) size = 'small'
    ticketNumber = Number(ticketNumber)
    pack = pack ? Number(pack) : Math.floor(ticketNumber / 256)
    const _ticketNumber = ticketNumber % 256
    const ticketHex = nftUtils.toNumberHex(_ticketNumber, 2)
    const canvasDataUrl = await canvasUtils.renderPuppy(ticketHex, _ticketNumber, pack, size)

    var base64Data = canvasDataUrl.replace(/^data:image\/png;base64,/, '')
    var img = Buffer.from(base64Data, 'base64')
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    })

    res.end(img)
  } catch (e) {
    console.error(e)
    next({ message: `An unknown error has occurred: ${e}` })
  }
})

module.exports = router
