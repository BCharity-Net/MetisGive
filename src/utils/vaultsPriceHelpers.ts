import { Vault } from 'state/types'

/**
 * Returns the first vault with a quote token that matches from an array of preferred quote tokens
 * @param vaults Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterVaultsByQuoteToken = (vaults: Vault[], preferredQuoteTokens: string[] = ['USDC','WMATIC']): Vault => {
  const preferredVault = vaults.find((vault) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return vault.quoteToken.symbol === quoteToken
    })
  })
  return preferredVault || vaults[0]
}

export default filterVaultsByQuoteToken
