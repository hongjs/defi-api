const sharp = require('sharp')
const axios = require('axios')
const path = require('path')
const { SizeEnum, RarityEnum, GodfaterBuffer, PuppyBuffer, TrophyBuffer, romanize } = require('./imageBuffer')

const ASSET_PATH = process.env.ASSET_PATH ? process.env.ASSET_PATH : path.join(__dirname, '../assets')

const renderGodfather = async (ticketHex, ticketNumber, rarity, size) => {
  const { PATH, WIDTH, HEIGHT, TROPHY_WIDTH, TROPHY_TOP, TROPHY_LEFT } = SizeEnum[size]
  const numberFontSize = Math.floor(HEIGHT * 0.069)

  const baseImage = await readGodfather(zeroPad(ticketNumber % 16, 2), PATH)
  const context = sharp(baseImage)
  const composites = []

  // Draw Number
  const textBuffer = Buffer.from(`
  <svg width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="MyGradient">
        <stop offset="5%"  stop-color="#7B9FF2"/>
        <stop offset="95%" stop-color="#4259C3"/>
    </linearGradient>
  </defs>

    <style>
    .title { font-family: tahoma; fill: url(#MyGradient); font-size: ${numberFontSize}px;}
    </style>
    <text x="50%" y="82.5%" text-anchor="middle" class="title">${ticketHex}</text>
  </svg>
  `)
  composites.push({ input: textBuffer, top: 0, left: 0 })

  // Draw Trophy
  const trophyImage = await readTrophy(rarity)
  var _trophyImage = await sharp(trophyImage).resize({ width: TROPHY_WIDTH }).toBuffer()
  composites.push({ input: _trophyImage, top: TROPHY_TOP, left: TROPHY_LEFT })

  context.composite(composites)
  const buffer = await context.toBuffer()
  const dataUrl = buffer.toString('base64')
  return dataUrl
}

const renderPuppy = async (ticketHex, ticketNumber, pack, size) => {
  const { PATH, WIDTH, HEIGHT, SHADOW_OFFSET } = SizeEnum[size]
  const numberFontSize = Math.round(HEIGHT * 0.13)
  const packFontSize = Math.round(HEIGHT * 0.08)
  const baseImage = await readPuppy(zeroPad(ticketNumber % 16, 2), PATH)
  const context = sharp(baseImage)
  const composites = []

  // Draw Number
  const textBuffer = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}">
<defs>
  <linearGradient id="MyGradient">
      <stop offset="5%"  stop-color="magenta"/>
      <stop offset="95%" stop-color="blue"/>
  </linearGradient>
</defs>

  <style>
  .title { font-family: tahoma; fill: url(#MyGradient); font-size: ${numberFontSize}px;}
  </style>
  <text x="50%" y="68%" text-anchor="middle" class="title">${ticketHex}</text>
</svg>
`)
  composites.push({ input: textBuffer, top: 0, left: 0 })

  // Draw Pack
  const packBuffer = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}">
 
      <style>
      .title { font-family: tahoma; fill: white; font-size: ${packFontSize}px;}
      </style>
      <text x="84.5%" y="80%" text-anchor="middle" class="title">${romanize(pack)}</text>
    </svg>
    `)
  composites.push({ input: packBuffer, top: 0, left: 0 })

  context.composite(composites)
  const buffer = await context.toBuffer()
  const dataUrl = buffer.toString('base64')
  return dataUrl
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

const readGodfather = async (number, size) => {
  if (GodfaterBuffer[size] && GodfaterBuffer[size][number]) {
    return GodfaterBuffer[size][number]
  } else {
    const imageUrl = `${ASSET_PATH}/godfather/${number}_${size}.png`
    const buffer = await getImageBuffer(imageUrl)
    GodfaterBuffer[size][number] = buffer
    return buffer
  }
}

const readPuppy = async (number, size) => {
  if (PuppyBuffer[size] && PuppyBuffer[size][number]) {
    return PuppyBuffer[size][number]
  } else {
    const imageUrl = `${ASSET_PATH}/puppy/${number}_${size}.png`
    const buffer = await getImageBuffer(imageUrl)
    PuppyBuffer[size][number] = buffer
    return buffer
  }
}

const readTrophy = async (rarity, width) => {
  if (!TrophyBuffer[rarity]) {
    const imageUrl = `${ASSET_PATH}/rarity/${RarityEnum[rarity]}.png`
    const buffer = await getImageBuffer(imageUrl)
    TrophyBuffer[rarity] = buffer
  }
  return TrophyBuffer[rarity]
}

const getImageBuffer = async (imageUrl) => {
  const res = await axios({
    url: imageUrl,
    responseType: 'arraybuffer',
  })
  return res.data
}

module.exports.renderGodfather = renderGodfather
module.exports.renderPuppy = renderPuppy
