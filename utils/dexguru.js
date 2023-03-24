const axios = require('axios')

const CHAIN_ID = 56

const getPrice = async (tokenAddress) => {
  const res = await axios.get(`https://api.dev.dex.guru/v1/chain/${CHAIN_ID}/tokens/${tokenAddress}/market`, {
    headers: {
      'api-key': process.env.DEX_GURU_KEY,
    },
  })
  return { token: tokenAddress, price: res.data.price_usd }
}

module.exports.getPrice = getPrice
