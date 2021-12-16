import BigNumber from 'bignumber.js'
import miniChefABI from 'config/abi/sushiMiniChef.json'
import sushiSwapStrategyABI from 'config/abi/sushiSwapStrategy.json'
import complexRewarderTimeABI from 'config/abi/sushiComplexRewarderTime.json'
import erc20 from 'config/abi/erc20.json'
import { getAddress, getSushiComplexRewarderTimeAddress, getSushiMiniChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import tokens from 'config/constants/tokens'
import addresses from 'config/constants/contracts'
import { Vault, SerializedBigNumber } from '../types'

type SushiSwapVaultData = {
  sushiData: {
    poolDailyRewardUsd: SerializedBigNumber
    SushiLpTotalInQuoteToken: SerializedBigNumber
  }
}

// const fetchSushiVault = async (vault: Vault): Promise<SushiSwapVaultData> => {
//   const { lpAddresses, strategyAddress, quoteToken } = vault
//   const lpAddress = getAddress(lpAddresses)
//   const miniChefAddress = getSushiMiniChefAddress()

//   // get numbers to calculate the total liquidity in the sushiSwap farm
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
//     // Balance of LP tokens in the mini chef contract
//     {
//       address: lpAddress,
//       name: 'balanceOf',
//       params: [miniChefAddress],
//     },
//   ]
//   //
//   const [quoteTokenBalanceLP, lpTotalSupply, quoteTokenDecimals, lpTokenBalanceMC] = await multicall(erc20, calls)

//   // Ratio in % of LP tokens that are staked in the MC(miniChef), vs the total number in circulation
//   const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

//   // Raw amount of token in the LP, including those not staked
//   const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

//   // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
//   const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

//   // Total staked in LP, in quote token value
//   const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

//   // get the price of the sushi and matic token in usd
//   // token price = (total amount of usdc in lp contract)/ (total amount of token in lp contract)
//   const priceCalls = [
//     // Balance of sushi on sushi-usdc LP contract
//     {
//       address: getAddress(tokens.sushi.address),
//       name: 'balanceOf',
//       params: [getAddress(addresses.sushiUsdLp)],
//     },
//     // Balance of usdc on sushi-usdc LP contract
//     {
//       address: getAddress(tokens.usdc.address),
//       name: 'balanceOf',
//       params: [getAddress(addresses.sushiUsdLp)],
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
//     // sushi decimals
//     {
//       address: getAddress(tokens.sushi.address),
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
//     sushiLpBalance,
//     sushiLpUsdcBalance,
//     maticLpBalance,
//     maticLpUsdcBalance,
//     sushiDecimals,
//     maticDecimals,
//     usdcDecimals,
//   ] = await multicall(erc20, priceCalls)

//   const sushiAmountTotal = new BigNumber(sushiLpBalance).div(BIG_TEN.pow(sushiDecimals))
//   const sushiUsdcAmountTotal = new BigNumber(sushiLpUsdcBalance).div(BIG_TEN.pow(usdcDecimals))
//   const sushiPriceUsd = sushiUsdcAmountTotal.div(sushiAmountTotal)

//   const maticAmountTotal = new BigNumber(maticLpBalance).div(BIG_TEN.pow(maticDecimals))
//   const maticUsdcAmountTotal = new BigNumber(maticLpUsdcBalance).div(BIG_TEN.pow(usdcDecimals))
//   const maticPriceUsd = maticUsdcAmountTotal.div(maticAmountTotal)

//   // used to use coin gecko api to get sushi and matic prices
//   // let sushiPriceUsd
//   // let maticPriceUsd
//   // await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sushi%2Cmatic-network&vs_currencies=usd')
//   //   .then((response) => response.json())
//   //   .then((response) => {
//   //     sushiPriceUsd = response.sushi.usd
//   //     maticPriceUsd = response['matic-network'].usd
//   //   })

//   // alert("sushiPriceUsd: ".concat(sushiPriceUsd).concat("\n maticPriceUsd: ").concat(maticPriceUsd))

//   // First get pid of the pool to look at in miniChef
//   const rawSushiPid = await multicall(sushiSwapStrategyABI, [
//     {
//       address: getAddress(strategyAddress),
//       name: 'pid',
//     },
//   ])
//   const parsedSushiPid = Math.floor(Number(rawSushiPid))

//   const [info, totalAllocPoint, sushiPerSecond] =
//     parsedSushiPid || parsedSushiPid === 0
//       ? await multicall(miniChefABI, [
//           {
//             address: miniChefAddress,
//             name: 'poolInfo',
//             params: [parsedSushiPid],
//           },
//           {
//             address: miniChefAddress,
//             name: 'totalAllocPoint',
//           },
//           {
//             address: miniChefAddress,
//             name: 'sushiPerSecond',
//           },
//         ])
//       : [null, null, null]

//   const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
//   const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

//   // get matic per second from complexRewarderTime contract
//   const maticPerSecond = await multicall(complexRewarderTimeABI, [
//     {
//       address: getSushiComplexRewarderTimeAddress(),
//       name: 'rewardPerSecond',
//     },
//   ])
//   // console.log(new BigNumber(sushiPerSecond).toNumber())

//   const sushiPerDay = new BigNumber(sushiPerSecond)
//     .div(10 ** 18)
//     .times(new BigNumber(86400))
//     .times(poolWeight) // 86400 seconds in a day
//   const maticPerDay = new BigNumber(maticPerSecond)
//     .div(10 ** 18)
//     .times(new BigNumber(86400))
//     .times(poolWeight) // 86400 seconds in a day
//   const sushiPerDayUsd = sushiPerDay.times(sushiPriceUsd)
//   const maticPerDayUsd = maticPerDay.times(maticPriceUsd)
//   const poolDailyRewardUsd = sushiPerDayUsd.plus(maticPerDayUsd)

//   return {
//     sushiData: {
//       poolDailyRewardUsd: poolDailyRewardUsd.toJSON(), // total rewards for the pool per day, in USD
//       SushiLpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(), // need to multiply by quote token price in usd to get total liquitity in usd
//     },
//   }
// }

// export default fetchSushiVault
