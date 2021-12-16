import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import vaultchefABI from 'config/abi/vaultChef.json'
import multicall from 'utils/multicall'
import { getAddress, getMVaultChefAddress, getVaultChefAddress } from 'utils/addressHelpers'
import { VaultConfig } from 'config/constants/types'
import { BIG_TEN } from '../../utils/bigNumber'

export const fetchVaultUserAllowances = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const vaultChefAddress = getVaultChefAddress()
  const mVaultChefAddress = getMVaultChefAddress()

  const calls = vaultsToFetch.map((vault) => {
    const lpContractAddress = getAddress(vault.lpAddresses)
    const contractToUse = vault.useMvaultChef ? mVaultChefAddress : vaultChefAddress
    return { address: lpContractAddress, name: 'allowance', params: [account, contractToUse] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchVaultUserTokenBalances = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    const lpContractAddress = getAddress(vault.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  // const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
  //   return new BigNumber(tokenBalance).toJSON()
  // },)

  // to account for different token decimal amounts
  const parsedTokenBalances = new Array(rawTokenBalances.length)
  let newBalance
  for (let i = 0; i < rawTokenBalances.length; i++) {
    if (vaultsToFetch[i].token.decimals) {
      newBalance = new BigNumber(rawTokenBalances[i]).times(BIG_TEN.pow(18 - vaultsToFetch[i].token.decimals)).toJSON()
    } else {
      newBalance = new BigNumber(rawTokenBalances[i]).toJSON()
    }
    parsedTokenBalances[i] = newBalance
  }

  return parsedTokenBalances
}

export const fetchVaultUserStakedBalances = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const vaultChefAddress = getVaultChefAddress()
  const mVaultChefAddress = getMVaultChefAddress()

  // the method to call to get user staked balances in the vault contract is "stakedWantTokens"
  const calls = vaultsToFetch.map((vault) => {
    const contractToUse = vault.useMvaultChef ? mVaultChefAddress : vaultChefAddress
    return {
      address: contractToUse,
      name: 'stakedWantTokens',
      params: [Math.floor(vault.pid), account],
    }
  })

  const rawStakedBalances = await multicall(vaultchefABI, calls)
  // const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
  //   return new BigNumber(stakedBalance[0]._hex).toJSON()
  // })

  // to account for different token decimal amounts
  const parsedStakedBalances = new Array(rawStakedBalances.length)
  let newBalance
  for (let i = 0; i < rawStakedBalances.length; i++) {
    if (vaultsToFetch[i].token.decimals) {
      newBalance = new BigNumber(rawStakedBalances[i][0]._hex)
        .times(BIG_TEN.pow(18 - vaultsToFetch[i].token.decimals))
        .toJSON()
    } else {
      newBalance = new BigNumber(rawStakedBalances[i][0]._hex).toJSON()
    }
    parsedStakedBalances[i] = newBalance
  }

  return parsedStakedBalances
}

// export const fetchVaultUserEarnings = async (account: string, vaultsToFetch: VaultConfig[]) => {
//   const vaultChefAddress = getVaultChefAddress()
//   const mVaultChefAddress = getMVaultChefAddress()
//   const calls = vaultsToFetch.map((vault) => {
//     const contractToUse = vault.useMvaultChef ? mVaultChefAddress : vaultChefAddress
//     return {
//       address: contractToUse,
//       name: 'pendingGive', // TODO: change
//       params: [vault.pid, account],
//     }
//   })
//   const rawEarnings = await multicall(vaultchefABI, calls)
//   const parsedEarnings = rawEarnings.map((earnings) => {
//     return new BigNumber(earnings).toJSON()
//   })
//   return parsedEarnings
// }
