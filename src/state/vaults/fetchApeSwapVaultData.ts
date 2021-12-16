import BigNumber from 'bignumber.js'
import miniApeV2ABI from 'config/abi/miniApeV2.json'
import apeSwapStrategyABI from 'config/abi/strategyLPApeSwap.json'
import complexRewarderTimeABI from 'config/abi/apeMiniComplexRewarderTime.json'
import erc20 from 'config/abi/erc20.json'
import {getAddress, getApeComplexRewarderTimeAddress, getApeSwapMiniChefAddress} from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import tokens from 'config/constants/tokens'
import addresses from 'config/constants/contracts'
import { Vault, SerializedBigNumber } from '../types'

type ApeSwapVaultData = {
    apeData: {
        poolDailyRewardUsd: SerializedBigNumber
        apeLpTotalInQuoteToken: SerializedBigNumber
    }
}

// const fetchApeVault = async (vault: Vault): Promise<ApeSwapVaultData> => {
//     const { lpAddresses, strategyAddress, quoteToken } = vault
//     const lpAddress = getAddress(lpAddresses)
//     const miniChefAddress = getApeSwapMiniChefAddress()

//     // get numbers to calculate the total liquidity in the apeSwap farm
//     const calls = [
//         // Balance of quote token on LP contract
//         {
//             address: getAddress(quoteToken.address),
//             name: 'balanceOf',
//             params: [lpAddress],
//         },
//         // Total supply of LP tokens
//         {
//             address: lpAddress,
//             name: 'totalSupply',
//         },
//         // Quote token decimals
//         {
//             address: getAddress(quoteToken.address),
//             name: 'decimals',
//         },
//         // Balance of LP tokens in the mini chef contract
//         {
//             address: lpAddress,
//             name: 'balanceOf',
//             params: [miniChefAddress],
//         },
//     ]
//     //
//     const [quoteTokenBalanceLP, lpTotalSupply, quoteTokenDecimals, lpTokenBalanceMC] = await multicall(erc20, calls)

//     // Ratio in % of LP tokens that are staked in the MC(miniChef), vs the total number in circulation
//     const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

//     // Raw amount of token in the LP, including those not staked
//     const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

//     // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
//     const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

//     // Total staked in LP, in quote token value
//     const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

//     // get the price of the banana and matic token in usd
//     // matic price = (total amount of usdc in lp contract)/ (total amount of matic in lp contract)
//     // for banana: (matic price in usdc) (total amount of matic in lp contract)/ (total amount of banana in lp contract)
//     const priceCalls = [
//         // Balance of banana on banana-wmatic LP contract
//         {
//             address: getAddress(tokens.banana.address),
//             name: 'balanceOf',
//             params: [getAddress(addresses.bananaWmaticLp)],
//         },
//         // Balance of usdc on banana-wmatic LP contract
//         {
//             address: getAddress(tokens.wmatic.address),
//             name: 'balanceOf',
//             params: [getAddress(addresses.bananaWmaticLp)],
//         },
//         // Balance of wmatic on wmatic-usdc LP contract
//         {
//             address: getAddress(tokens.wmatic.address),
//             name: 'balanceOf',
//             params: [getAddress(addresses.maticUsdLp)],
//         },
//         // Balance of usdc on wmatic-usdc LP contract
//         {
//             address: getAddress(tokens.usdc.address),
//             name: 'balanceOf',
//             params: [getAddress(addresses.maticUsdLp)],
//         },
//         // banana decimals
//         {
//             address: getAddress(tokens.banana.address),
//             name: 'decimals',
//         },
//         // wmatic token decimals
//         {
//             address: getAddress(tokens.wmatic.address),
//             name: 'decimals',
//         },
//         // usdc token decimals
//         {
//             address: getAddress(tokens.usdc.address),
//             name: 'decimals',
//         },
//     ]
//     const [
//         bananaLpBalance,
//         bananaLpWmaticBalance,
//         maticLpBalance,
//         maticLpUsdcBalance,
//         bananaDecimals,
//         maticDecimals,
//         usdcDecimals,
//     ] = await multicall(erc20, priceCalls)

//     const maticAmountTotal = new BigNumber(maticLpBalance).div(BIG_TEN.pow(maticDecimals))
//     const maticUsdcAmountTotal = new BigNumber(maticLpUsdcBalance).div(BIG_TEN.pow(usdcDecimals))
//     const maticPriceUsd = maticUsdcAmountTotal.div(maticAmountTotal)

//     const bananaAmountTotal = new BigNumber(bananaLpBalance).div(BIG_TEN.pow(bananaDecimals))
//     const bananaWmaticAmountTotal = new BigNumber(bananaLpWmaticBalance).div(BIG_TEN.pow(maticDecimals))
//     const bananaPriceUsd = maticPriceUsd.times(bananaWmaticAmountTotal).div(bananaAmountTotal)


//     // First get pid of the pool to look at in miniChef
//     const rawApePid = await multicall(apeSwapStrategyABI, [
//         {
//             address: getAddress(strategyAddress),
//             name: 'pid',
//         },
//     ])
//     const parsedApePid = Math.floor(Number(rawApePid))

//     const [info, totalAllocPoint, bananaPerSecond] =
//         parsedApePid || parsedApePid === 0
//             ? await multicall(miniApeV2ABI, [
//                 {
//                     address: miniChefAddress,
//                     name: 'poolInfo',
//                     params: [parsedApePid],
//                 },
//                 {
//                     address: miniChefAddress,
//                     name: 'totalAllocPoint',
//                 },
//                 {
//                     address: miniChefAddress,
//                     name: 'bananaPerSecond',
//                 },
//             ])
//             : [null, null, null]

//     const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
//     const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

//     // get matic per second from complexRewarderTime contract
//     const maticPerSecond = await multicall(complexRewarderTimeABI, [
//         {
//             address: getApeComplexRewarderTimeAddress(),
//             name: 'rewardPerSecond',
//         },
//     ])

//     const bananaPerDay = new BigNumber(bananaPerSecond)
//         .div(10 ** 18)
//         .times(new BigNumber(86400))
//         .times(poolWeight) // 86400 seconds in a day
//     const maticPerDay = new BigNumber(maticPerSecond)
//         .div(10 ** 18)
//         .times(new BigNumber(86400))
//         .times(poolWeight) // 86400 seconds in a day
//     const bananaPerDayUsd = bananaPerDay.times(bananaPriceUsd)
//     const maticPerDayUsd = maticPerDay.times(maticPriceUsd)
//     const poolDailyRewardUsd = bananaPerDayUsd.plus(maticPerDayUsd)

//     return {
//         apeData: {
//             poolDailyRewardUsd: poolDailyRewardUsd.toJSON(), // total rewards for the pool per day, in USD
//             apeLpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(), // need to multiply by quote token price in usd to get total liquitity in usd
//         },
//     }
// }

// export default fetchApeVault
