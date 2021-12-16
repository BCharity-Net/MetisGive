import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { unstake, sousUnstake, sousEmergencyUnstake, vaultUnstake, vaultUnstakeAll } from 'utils/callHelpers'
import BigNumber from 'bignumber.js'
import { useMasterchef, useMVaultchef, useSousChef, useVaultchef } from './useContract'
import { DEFAULT_TOKEN_DECIMAL } from '../config'

const useUnstake = (pid: number, tokenDecimals: BigNumber) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account, tokenDecimals)
      console.info(txHash)
    },
    [account, masterChefContract, pid, tokenDecimals],
  )

  return { onUnstake: handleUnstake }
}

export const useVaultUnstake = (pid: number, tokenDecimals: BigNumber, willUseMVaultChef: boolean) => {
  const { account } = useWeb3React()
  const vaultChefContract = useVaultchef()
  const mVaultChefContract = useMVaultchef()
  const contractToUse = willUseMVaultChef ? mVaultChefContract : vaultChefContract

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await vaultUnstake(contractToUse, Math.floor(pid), amount, account, tokenDecimals)
      console.info(txHash)
    },
    [account, contractToUse, pid, tokenDecimals],
  )

  return { onUnstake: handleUnstake }
}

export const useVaultUnstakeAll = (pid: number, tokenDecimals: BigNumber, willUseMVaultChef: boolean) => {
  const { account } = useWeb3React()
  const vaultChefContract = useVaultchef()
  const mVaultChefContract = useMVaultchef()
  const contractToUse = willUseMVaultChef ? mVaultChefContract : vaultChefContract

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await vaultUnstakeAll(contractToUse, Math.floor(pid), amount, account, tokenDecimals)
      console.info(txHash)
    },
    [account, contractToUse, pid, tokenDecimals],
  )

  return { onUnstakeAll: handleUnstake }
}

export const useSousUnstake = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account, DEFAULT_TOKEN_DECIMAL)
        console.info(txHash)
      } else if (enableEmergencyWithdraw) {
        const txHash = await sousEmergencyUnstake(sousChefContract, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, decimals, account)
        console.info(txHash)
      }
      // dispatch(updateUserStakedBalance(sousId, account))
      // dispatch(updateUserBalance(sousId, account))
      // dispatch(updateUserPendingReward(sousId, account))
    },
    [account, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
    // [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
