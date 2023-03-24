const contracts = require('./contracts').addresses
const { QuoteToken } = require('./quote')

const farms = [
  {
    pid: 0,
    lpAddress: contracts.defi,
    tokenAddress: contracts.defi,
    quoteTokenAddress: contracts.defi,
    quoteTokenSymbol: QuoteToken.DEFI,
  },
  {
    pid: 1,
    lpAddress: contracts.defiBnbLP,
    tokenAddress: contracts.wbnb,
    quoteTokenAddress: contracts.defi,
    quoteTokenSymbol: QuoteToken.DEFI,
  },
  {
    pid: 2,
    lpAddress: contracts.defiBusdLP,
    tokenAddress: contracts.busd,
    quoteTokenAddress: contracts.defi,
    quoteTokenSymbol: QuoteToken.DEFI,
  },
  {
    pid: 3,
    lpAddress: contracts.bnbBusdLP,
    tokenAddress: contracts.busd,
    quoteTokenAddress: contracts.wbnb,
    quoteTokenSymbol: QuoteToken.WBNB,
  },
  {
    pid: 4,
    lpAddress: contracts.usdtBusdLP,
    tokenAddress: contracts.usdt,
    quoteTokenAddress: contracts.busd,
    quoteTokenSymbol: QuoteToken.BUSD,
  },
  {
    pid: 5,
    lpAddress: contracts.kMaticBnbLP,
    tokenAddress: contracts.kMatic,
    quoteTokenAddress: contracts.wbnb,
    quoteTokenSymbol: QuoteToken.WBNB,
  },
]

module.exports.farms = farms
