import BigNumber from 'bignumber.js'
import polygonFarmMasterChefABI from 'config/abi/polygonFarmMasterChef.json'
import singleSpadeStrategyABI from 'config/abi/strategySingleSpade.json'
import erc20 from 'config/abi/erc20.json'
import {getAddress, getMasterChefAddress, getSpadeMasterChefAddress} from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import tokens from 'config/constants/tokens'
import addresses from 'config/constants/contracts'
import { Vault, SerializedBigNumber } from '../types'

type SpadeVaultData = {
    spadeData: {
        spadePriceUsd: SerializedBigNumber
        spadePerBlock: SerializedBigNumber
        spadePoolWeight: SerializedBigNumber
        spadeLpTotalInQuoteToken: SerializedBigNumber
    }
}

// const fetchSpadeVault = async (vault: Vault): Promise<SpadeVaultData> => {
//     const { lpAddresses, strategyAddress, quoteToken, token, isSingleToken } = vault
//     const lpAddress = getAddress(lpAddresses)
//     const spadeMasterChefAddress = getSpadeMasterChefAddress()

//     // get numbers to calculate the total liquidity in the spadeSwap farm
//     // "lpAddress" is address of single token for single token vaults
//     const calls = [
//         // Balance of quote token on LP contract
//         {
//             address: getAddress(quoteToken.address),
//             name: 'balanceOf',
//             params: [lpAddress],
//         },
//         // Total supply of LP/single tokens
//         {
//             address: lpAddress,
//             name: 'totalSupply',
//         },
//         // Quote token decimals / Token decimals if single token
//         {
//             address: isSingleToken ? getAddress(token.address): getAddress(quoteToken.address),
//             name: 'decimals',
//         },
//         // Balance of LP/single tokens in the masterChef contract
//         {
//             address: lpAddress,
//             name: 'balanceOf',
//             params: [spadeMasterChefAddress],
//         },
//     ]
//     //
//     const [quoteTokenBalanceLP, lpTotalSupply, quoteTokenDecimals, lpTokenBalanceMC] = await multicall(erc20, calls)

//     // Ratio in % of LP tokens that are staked in the MC(masterChef), vs the total number in circulation
//     const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

//     // Raw amount of token in the LP, including those not staked
//     const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

//     // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
//     const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

//     // For single tokens only: the amount of tokens staked in MC
//     const tokenAmountMc = new BigNumber(lpTokenBalanceMC).div(BIG_TEN.pow(quoteTokenDecimals))

//     // Total staked in LP, in quote token value
//     const lpTotalInQuoteToken = isSingleToken ? tokenAmountMc : quoteTokenAmountMc.times(new BigNumber(2))

//     // get the price of the spade token in usd
//     // token price = (total amount of usdc in lp contract)/ (total amount of token in lp contract)
//     const priceCalls = [
//         // Balance of spade on spade-usdc LP contract
//         {
//             address: getAddress(tokens.spade.address),
//             name: 'balanceOf',
//             params: [getAddress(addresses.spadeUsdLp)],
//         },
//         // Balance of usdc on spade-usdc LP contract
//         {
//             address: getAddress(tokens.usdc.address),
//             name: 'balanceOf',
//             params: [getAddress(addresses.spadeUsdLp)],
//         },
//         // spade decimals
//         {
//             address: getAddress(tokens.spade.address),
//             name: 'decimals',
//         },
//         // usdc token decimals
//         {
//             address: getAddress(tokens.usdc.address),
//             name: 'decimals',
//         },
//     ]
//     const [
//         spadeLpBalance,
//         spadeLpUsdcBalance,
//         spadeDecimals,
//         usdcDecimals,
//     ] = await multicall(erc20, priceCalls)

//     const spadeAmountTotal = new BigNumber(spadeLpBalance).div(BIG_TEN.pow(spadeDecimals))
//     const spadeUsdcAmountTotal = new BigNumber(spadeLpUsdcBalance).div(BIG_TEN.pow(usdcDecimals))
//     const spadePriceUsd = spadeUsdcAmountTotal.div(spadeAmountTotal)


//     // First get pid of the pool to look at in masterChef
//     const rawSpadePid = await multicall(singleSpadeStrategyABI, [
//         {
//             address: getAddress(strategyAddress),
//             name: 'pid',
//         },
//     ])
//     const parsedSpadePid = Math.floor(Number(rawSpadePid))
//     const [info, totalAllocPoint, spadePerBlock] =
//         parsedSpadePid || parsedSpadePid === 0
//             ? await multicall(polygonFarmMasterChefABI, [
//                 {
//                     address: spadeMasterChefAddress,
//                     name: 'poolInfo',
//                     params: [parsedSpadePid],
//                 },
//                 {
//                     address: spadeMasterChefAddress,
//                     name: 'totalAllocPoint',
//                 },
//                 {
//                     address: spadeMasterChefAddress,
//                     name: 'SpadePerBlock',
//                 },
//             ])
//             : [null, null, null]

//     const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
//     const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

//     const parsedSpadePerBlock = new BigNumber(spadePerBlock).div(BIG_TEN.pow(spadeDecimals))
//     console.log("pid: ".concat(vault.pid.toString())
//         .concat("\n poolWeight : ").concat(poolWeight.toJSON())
//         .concat("\n spadePriceUsd : ").concat(spadePriceUsd.toJSON())
//         .concat("\n spadePerBlock : ").concat(new BigNumber(spadePerBlock).toJSON())
//         .concat("\n apeLpTotalInQuoteToken : ").concat(lpTotalInQuoteToken.toString()).concat(typeof lpTotalInQuoteToken)
//     )

//     return {
//         spadeData: {
//             spadePriceUsd: spadePriceUsd.toJSON(),
//             spadePerBlock: parsedSpadePerBlock.toJSON(),
//             spadePoolWeight: poolWeight.toJSON(),
//             spadeLpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(), // need to multiply by quote token price in usd to get total liquitity in usd
//         },
//     }
// }

// export default fetchSpadeVault
