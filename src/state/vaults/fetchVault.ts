import { Vault } from 'state/types'
import fetchPublicVaultData from './fetchPublicVaultData'
// import { fetchQuickSwapVaultData } from './fetchQuickSwapVaultData'
// import fetchSushiSwapVaultData from './fetchSushiSwapVaultData'
// import fetchBCharityVault from './fetchBcharityVaultData'
// import fetchApeSwapVaultData from "./fetchApeSwapVaultData";
// import fetchSpadeVaultData from "./fetchSpadeVaultData";

const fetchVault = async (vault: Vault): Promise<Vault> => {
  const vaultPublicData = await fetchPublicVaultData(vault)
  // if (vault.tags.includes('SushiSwap') || vault.tags.includes('LPSushiSwap')) {
  //   const sushiVaultData = await fetchSushiSwapVaultData(vault)
  //   return { ...vault, ...vaultPublicData, ...sushiVaultData }
  // }
  // if (vault.tags.includes('QuickSwap')) {
  //   const quickVaultData = await fetchQuickSwapVaultData(vault)
  //   return { ...vault, ...vaultPublicData, ...quickVaultData }
  // }
  // if (vault.tags.includes('BCharity')) {
  //   const bcharityVaultData = await fetchBCharityVault(vault)
  //   return { ...vault, ...vaultPublicData, ...bcharityVaultData }
  // }
  // if (vault.tags.includes('ApeSwap')) {
  //   const apeSwapVaultData = await fetchApeSwapVaultData(vault)
  //   return { ...vault, ...vaultPublicData, ...apeSwapVaultData }
  // }
  // if (vault.tags.includes('Spade')) {
  //   const spadeVaultData = await fetchSpadeVaultData(vault)
  //   return { ...vault, ...vaultPublicData, ...spadeVaultData }
  // }

  return { ...vault, ...vaultPublicData }
}

export default fetchVault
