const { QuoteToken } = require('./quote')
const contracts = require('./contracts').addresses
const vContracts = require('./vaultContracts').addresses

const platform = {
  // babyswap: {
  //   platform: 'BabySwap',
  //   pendingRewardField: 'pendingCake',
  //   masterchefAddress: vContracts.babyMasterChef,
  //   rewardTokenPriceLPAddress: vContracts.BABYxBabyBnbLP,
  //   rewardTokenAddress: vContracts.babyToken,
  //   quoteTokenAddressOfRewardLP: contracts.wbnb,
  //   quoteTokenSymbolOfRewardLP: QuoteToken.BNB,
  //   helper: vContracts.babyVaultHelper,
  // },
  biswap: {
    platform: 'BiSwap',
    pendingRewardField: 'pendingBSW',
    masterchefAddress: vContracts.bswMasterChef,
    rewardTokenPriceLPAddress: vContracts.BSWxBswBusdLP,
    rewardTokenAddress: vContracts.bswToken,
    quoteTokenAddressOfRewardLP: contracts.busd,
    quoteTokenSymbolOfRewardLP: QuoteToken.BUSD,
    helper: vContracts.bswVaultHelper,
  },
  killswitch: {
    platform: 'KillSwitch',
    pendingRewardField: 'pendingKSW',
    masterchefAddress: vContracts.kswMasterChef,
    rewardTokenPriceLPAddress: vContracts.KSWxKswBnbLP,
    rewardTokenAddress: vContracts.kswToken,
    quoteTokenAddressOfRewardLP: contracts.wbnb,
    quoteTokenSymbolOfRewardLP: QuoteToken.BNB,
    helper: vContracts.kswVaultHelper,
  },
}
const vaults = [
  {
    ...platform.killswitch,
    pid: 52,
    lpSymbol: QuoteToken.DEFI,
    vaultAddress: vContracts.KSWxDefiVault,
    lpAddress: contracts.defi,
    tokenSymbol: QuoteToken.DEFI,
    tokenAddress: contracts.defi,
    quoteTokenSymbol: QuoteToken.DEFI,
    quoteTokenAddress: contracts.defi,

    kswIzlude: vContracts.KSWxDefiIzlude,
    finalMasterchefAddress: contracts.masterChef,
    finalMasterchefpid: 0,
  },
  {
    ...platform.biswap,
    pid: 3,
    lpSymbol: QuoteToken.BNBBUSD,
    vaultAddress: vContracts.BSWxBnbBusdVault,
    lpAddress: vContracts.BSWxBnbBusdLP,
    tokenSymbol: QuoteToken.BNB,
    tokenAddress: contracts.wbnb,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddress: contracts.busd,
  },
  {
    ...platform.biswap,
    pid: 76,
    lpSymbol: QuoteToken.AVAXBNB,
    vaultAddress: vContracts.BSWxAvaxBnbVault,
    lpAddress: vContracts.BSWxAvaxBnbLP,
    tokenSymbol: QuoteToken.AVAX,
    tokenAddress: vContracts.avaxToken,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAddress: contracts.wbnb,
  },
  {
    ...platform.biswap,
    pid: 92,
    lpSymbol: QuoteToken.GALABNB,
    vaultAddress: vContracts.BSWxGalaBnbVault,
    lpAddress: vContracts.BSWxGalaBnbLP,
    tokenSymbol: QuoteToken.GALA,
    tokenAddress: vContracts.galaToken,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAddress: contracts.wbnb,
  },
  {
    ...platform.biswap,
    pid: 70,
    lpSymbol: QuoteToken.MATICBNB,
    vaultAddress: vContracts.BSWxMaticBnbVault,
    lpAddress: vContracts.BSWxMaticBnbLP,
    tokenSymbol: QuoteToken.MATIC,
    tokenAddress: vContracts.maticToken,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAddress: contracts.wbnb,
  },
  {
    ...platform.biswap,
    pid: 1,
    lpSymbol: QuoteToken.USDTBUSD,
    vaultAddress: vContracts.BSWxUsdtBusdVault,
    lpAddress: vContracts.BSWxUsdtBusdLP,
    tokenSymbol: QuoteToken.USDT,
    tokenAddress: contracts.usdt,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddress: contracts.busd,
  },
  // {
  //   ...platform.babyswap,
  //   pid: 110,
  //   lpSymbol: QuoteToken.GALAUSDT,
  //   vaultAddress: vContracts.BABYxGalaUsdtVault,
  //   lpAddress: vContracts.BABYxGalaUsdtLP,
  //   tokenSymbol: QuoteToken.GALA,
  //   tokenAddress: vContracts.galaToken,
  //   quoteTokenSymbol: QuoteToken.USDT,
  //   quoteTokenAddress: contracts.usdt,
  // },
  // {
  //   ...platform.babyswap,
  //   pid: 17,
  //   lpSymbol: QuoteToken.MATICUSDT,
  //   vaultAddress: vContracts.BABYxMaticUsdtVault,
  //   lpAddress: vContracts.BABYxMaticUsdtLP,
  //   tokenSymbol: QuoteToken.MATIC,
  //   tokenAddress: vContracts.maticToken,
  //   quoteTokenSymbol: QuoteToken.USDT,
  //   quoteTokenAddress: contracts.usdt,
  // },
]

module.exports.vaults = vaults
