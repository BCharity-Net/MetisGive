import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import quickStrategyABI from '../../config/abi/quickStrategy.json'
import stakingRewardsABI from '../../config/abi/stakingRewards.json'
import multicall from '../../utils/multicall'
import { BIG_TEN, BIG_ZERO } from '../../utils/bigNumber'
import { Vault, SerializedBigNumber, QuickVault } from '../types'
import { getAddress, getStakingRewardsAddress } from '../../utils/addressHelpers'
import { getQuickRewardVaultContract } from '../../utils/contractHelpers'
import makeBatchRequest from '../../utils/makeBatchRequest'
import tokens from '../../config/constants/tokens'
import addresses from '../../config/constants/contracts'

type PublicQuickVaultData = {
  quickData: {
    dailyReward: SerializedBigNumber
    QuickLpTotalInQuoteToken: SerializedBigNumber
  }
}

// export const fetchQuickSwapVaultData = async (vault: Vault): Promise<PublicQuickVaultData> => {
//   const { lpAddresses, quoteToken, stakingRewardsAddress } = vault
//   const lpAddress = getAddress(lpAddresses)
//   const rewardAddress = getAddress(stakingRewardsAddress)

//   const calls = [
//     // Balance of quote token on LP contract
//     {
//       address: getAddress(quoteToken.address),
//       name: 'balanceOf',
//       params: [lpAddress],
//     },
//     // Total supply of LP tokens
//     {
//       address: lpAddress,
//       name: 'totalSupply',
//     },
//     // Quote token decimals
//     {
//       address: getAddress(quoteToken.address),
//       name: 'decimals',
//     },
//     // Balance of LP tokens in the staking rewards contract
//     {
//       address: lpAddress,
//       name: 'balanceOf',
//       params: [rewardAddress],
//     },
//   ]

//   const [quoteTokenBalanceLP, lpTotalSupply, quoteTokenDecimals, lpTokenBalanceMC] = await multicall(erc20, calls)

//   // Ratio in % of LP tokens that are staked in the staking rewards contracts, vs the total number in circulation
//   const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

//   // Raw amount of token in the LP, including those not staked
//   const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

//   // Amount of token in the LP that are staked in the staking rewards contracts (i.e amount of token * lp ratio)
//   const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

//   // Total staked in LP, in quote token value
//   const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))


//   const [rewardRate] = await multicall(stakingRewardsABI, [
//     {
//       address: rewardAddress,
//       name: 'rewardRate',
//     },
//   ])

//   const dailyRate = new BigNumber(rewardRate).times(new BigNumber(86400))

//   // get the price of the quick and matic token in usd
//   // token price = (total amount of usdc in lp contract)/ (total amount of token in lp contract)
//   const priceCalls = [
//     // Balance of quick on quick-usdc LP contract
//     {
//       address: getAddress(tokens.quick.address),
//       name: 'balanceOf',
//       params: [getAddress(addresses.quickUsdLp)],
//     },
//     // Balance of usdc on quick-usdc LP contract
//     {
//       address: getAddress(tokens.usdc.address),
//       name: 'balanceOf',
//       params: [getAddress(addresses.quickUsdLp)],
//     },
//     // Balance of wmatic on wmatic-usdc LP contract
//     {
//       address: getAddress(tokens.wmatic.address),
//       name: 'balanceOf',
//       params: [getAddress(addresses.maticUsdLp)],
//     },
//     // Balance of usdc on wmatic-usdc LP contract
//     {
//       address: getAddress(tokens.usdc.address),
//       name: 'balanceOf',
//       params: [getAddress(addresses.maticUsdLp)],
//     },
//     // quick decimals
//     {
//       address: getAddress(tokens.quick.address),
//       name: 'decimals',
//     },
//     // wmatic token decimals
//     {
//       address: getAddress(tokens.wmatic.address),
//       name: 'decimals',
//     },
//     // usdc token decimals
//     {
//       address: getAddress(tokens.usdc.address),
//       name: 'decimals',
//     },
//   ]
//   const [
//     quickLpBalance,
//     quickLpUsdcBalance,
//     maticLpBalance,
//     maticLpUsdcBalance,
//     quickDecimals,
//     maticDecimals,
//     usdcDecimals,
//   ] = await multicall(erc20, priceCalls)

//   const quickAmountTotal = new BigNumber(quickLpBalance).div(BIG_TEN.pow(quickDecimals))
//   const quickUsdcAmountTotal = new BigNumber(quickLpUsdcBalance).div(BIG_TEN.pow(usdcDecimals))
//   const quickPriceUsd = quickUsdcAmountTotal.div(quickAmountTotal)

//   const maticAmountTotal = new BigNumber(maticLpBalance).div(BIG_TEN.pow(maticDecimals))
//   const maticUsdcAmountTotal = new BigNumber(maticLpUsdcBalance).div(BIG_TEN.pow(usdcDecimals))
//   const maticPriceUsd = maticUsdcAmountTotal.div(maticAmountTotal)

//   // used to use coin gecko api to get sushi and matic prices
//   // let maticPriceUsd
//   // let quickPriceUsd
//   // await fetch('https://api.coingecko.com/api/v3/simple/price?ids=quick%2Cmatic-network&vs_currencies=usd')
//   //   .then((response) => response.json())
//   //   .then((response) => {
//   //     maticPriceUsd = response['matic-network'].usd
//   //     quickPriceUsd = response.quick.usd
//   //   })

//   const dailyRateUsd = dailyRate.div(10 ** 18).times(quickPriceUsd)

//   return {
//     quickData: {
//       dailyReward: dailyRateUsd.toJSON(),
//       QuickLpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
//     },
//   }
// }

// export default fetchQuickSwapVaultData
