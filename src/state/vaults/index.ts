/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import vaultsConfig from 'config/constants/vaults'
import isArchivedPid from 'utils/farmHelpers' // TODO: change this
import priceHelperLpsConfig from 'config/constants/vaultPriceHelperLPS'
import fetchVaults from './fetchVaults'
import fetchVaultsPrices from './fetchVaultPrices'
import {
  // fetchVaultUserEarnings,
  fetchVaultUserAllowances,
  fetchVaultUserTokenBalances,
  fetchVaultUserStakedBalances,
  //   fetchVaultUserEarnings,
} from './fetchVaultUser'
import { VaultState, Vault, QuickVault } from '../types'
// import { fetchQuickSwapVaultData } from './fetchQuickSwapVaultData'
// import {useFarmFromPid} from "../hooks";

const noAccountVaultConfig = vaultsConfig.map((vault) => ({
  ...vault,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: VaultState = {
  data: noAccountVaultConfig,
  loadArchivedVaultsData: false,
  userDataLoaded: false,
  quickVault: {
    dailyRate: null,
  },
}

/* 
export const fetchQuickRewardVaultPublicData = createAsyncThunk<QuickVault>(
    'quickVault/fetchRewardsRate', async () => {
    const publicVaultInfo = await fetchQuickSwapVaultData()
    return publicVaultInfo
  }) */

export const nonArchivedVaults = vaultsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchVaultsPublicDataAsync = createAsyncThunk<Vault[], number[]>(
  'vaults/fetchVaultsPublicDataAsync',
  async (pids) => {
    const vaultsToFetch = vaultsConfig.filter((vaultConfig) => pids.includes(vaultConfig.pid))

    // Add price helper vaults
    const vaultsWithPriceHelpers = vaultsToFetch.concat(priceHelperLpsConfig)

    const vaults = await fetchVaults(vaultsWithPriceHelpers)

    const vaultsWithPrices = await fetchVaultsPrices(vaults)

    // Filter out price helper LP config vaults
    const vaultsWithoutHelperLps = vaultsWithPrices.filter((vault: Vault) => {
      return vault.pid || vault.pid === 0
    })

    return vaultsWithoutHelperLps
  },
)

interface VaultUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export const fetchVaultUserDataAsync = createAsyncThunk<VaultUserDataResponse[], { account: string; pids: number[] }>(
  'vaults/fetchVaultUserDataAsync',
  async ({ account, pids }) => {
    const vaultsToFetch = vaultsConfig.filter((vaultConfig) => pids.includes(vaultConfig.pid))
    const userVaultAllowances = await fetchVaultUserAllowances(account, vaultsToFetch)
    const userVaultTokenBalances = await fetchVaultUserTokenBalances(account, vaultsToFetch)
    const userStakedBalances = await fetchVaultUserStakedBalances(account, vaultsToFetch)
    // const userVaultEarnings = await fetchVaultUserEarnings(account, vaultsToFetch)

    return userVaultAllowances.map((vaultAllowance, index) => {
      return {
        pid: vaultsToFetch[index].pid,
        allowance: userVaultAllowances[index],
        tokenBalance: userVaultTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        // earnings: userVaultEarnings[index],
      }
    })
  },
)

export const vaultsSlice = createSlice({
  name: 'Vaults',
  initialState,
  reducers: {
    setLoadArchivedVaultsData: (state, action) => {
      const loadArchivedVaultsData = action.payload
      state.loadArchivedVaultsData = loadArchivedVaultsData
    },
  },
  extraReducers: (builder) => {
    // Update vaults with live data
    builder.addCase(fetchVaultsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((vault) => {
        const liveVaultData = action.payload.find((vaultData) => vaultData.pid === vault.pid)
        return { ...vault, ...liveVaultData }
      })
    })

    // Update vaults with user data
    builder.addCase(fetchVaultUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((vault) => vault.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
    // Quickswap vault data
    /* builder.addCase(fetchQuickRewardVaultPublicData.fulfilled, (state, action: PayloadAction<QuickVault>) => {
            state.quickVault = { ...state.quickVault, ...action.payload }
          }) */
  },
})

// Actions
export const { setLoadArchivedVaultsData } = vaultsSlice.actions

export default vaultsSlice.reducer
