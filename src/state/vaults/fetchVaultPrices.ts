import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterVaultsByQuoteToken } from 'utils/vaultsPriceHelpers'
import { Vault } from 'state/types'

const getFarmFromTokenSymbol = (vaults: Vault[], tokenSymbol: string, preferredQuoteTokens?: string[]): Vault => {
  const vaultsWithTokenSymbol = vaults.filter((vault) => vault.token.symbol === tokenSymbol)
  const filteredFarm = filterVaultsByQuoteToken(vaultsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getVaultBaseTokenPrice = (vault: Vault, quoteTokenFarm: Vault, maticPriceUsdc: BigNumber): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(vault.tokenPriceVsQuote)

  // changed BNB to WMATIC and BUSD to USDC

  if (vault.quoteToken.symbol === 'USDC') {
    return hasTokenPriceVsQuote ? new BigNumber(vault.tokenPriceVsQuote) : BIG_ZERO
  }

  if (vault.quoteToken.symbol === 'WMATIC') {
    return hasTokenPriceVsQuote ? maticPriceUsdc.times(vault.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'WMATIC') {
    const quoteTokenInBusd = maticPriceUsdc.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(vault.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'USDC') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(vault.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getVaultQuoteTokenPrice = (vault: Vault, quoteTokenFarm: Vault, maticPriceUsdc: BigNumber): BigNumber => {
  // changed BNB to WMATIC and BUSD to USDC

  if (vault.quoteToken.symbol === 'WMATIC') {
    return maticPriceUsdc
  }

  if (vault.quoteToken.symbol === 'USDC') {
    return BIG_ONE
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WMATIC') {
    return quoteTokenFarm.tokenPriceVsQuote ? maticPriceUsdc.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'USDC') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchVaultPrices = async (vaults) => {
  // pid=89 is WMATIC USDC vault on polycat's vaultChef // && !vault.useMvaultChef
  const maticUsdcVault = vaults.find((vault: Vault) => vault.pid === 2.5) // TODO: change this when using our vaultchef
  const maticPriceUsdc = maticUsdcVault.tokenPriceVsQuote ? BIG_ONE.times(maticUsdcVault.tokenPriceVsQuote) : BIG_ZERO

  const farmsWithPrices = vaults.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(vaults, farm.quoteToken.symbol)
    const baseTokenPrice = getVaultBaseTokenPrice(farm, quoteTokenFarm, maticPriceUsdc)
    const quoteTokenPrice = getVaultQuoteTokenPrice(farm, quoteTokenFarm, maticPriceUsdc)
    const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...farm.quoteToken, busdPrice: quoteTokenPrice.toJSON() }
    return { ...farm, token, quoteToken }
  })

  return farmsWithPrices
}

export default fetchVaultPrices
