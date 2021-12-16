import BigNumber from 'bignumber.js'
import strategyQuickSwapABI from 'config/abi/quickStrategy.json'
import strategySingleBCharityABI from 'config/abi/strategySingleBCharity.json'
import erc20 from 'config/abi/erc20.json'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { Vault, SerializedBigNumber } from '../types'

type PublicVaultData = {
  // tokenAmountMc: SerializedBigNumber
  // quoteTokenAmountMc: SerializedBigNumber
  tokenAmountTotal: SerializedBigNumber
  quoteTokenAmountTotal: SerializedBigNumber
  lpTotalInQuoteToken: SerializedBigNumber
  lpTotalSupply: SerializedBigNumber
  tokenPriceVsQuote: SerializedBigNumber
  withdrawFee: number
}

const fetchVault = async (vault: Vault): Promise<PublicVaultData> => {
  const { lpAddresses, qlpAddresses, strategyAddress, token, quoteToken } = vault
  const lpAddress = getAddress(lpAddresses)
  const calls = [
    // Balance of token in the LP contract
    // for pools we use the qlpAddress for the token prices
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: vault.isSingleToken ? [getAddress(qlpAddresses)] : [lpAddress],
    },
    // Balance of quote token on LP contract
    // for pools we use the qlpAddress for the token prices
    {
      address: getAddress(quoteToken.address),
      name: 'balanceOf',
      params: vault.isSingleToken ? [getAddress(qlpAddresses)] : [lpAddress],
    },
    // Total supply of LP tokens
    {
      address: vault.isSingleToken ? getAddress(qlpAddresses) : lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(quoteToken.address),
      name: 'decimals',
    },
  ]
  const [tokenBalanceLP, quoteTokenBalanceLP, lpTotalSupply, tokenDecimals, quoteTokenDecimals] = await multicall(
    erc20,
    calls,
  )

  // used for withdraw fee calculations
  const feeCalls = [
    {
      address: getAddress(strategyAddress),
      name:  vault.useMvaultChef ? 'withdrawalFee': 'withdrawFeeFactor',
    },
    {
      address: getAddress(strategyAddress),
      name: vault.useMvaultChef ? 'withdrawalFee': 'withdrawFeeFactorMax',
    },
  ]
  const [withdrawFeeFactor, withdrawFeeFactorMax] =
      (vault.pid || vault.pid === 0) && !vault.isHidden && !vault.useMvaultChef && (vault.tags.includes('SushiSwap')  || vault.tags.includes('QuickSwap') )?
        await multicall(strategyQuickSwapABI, feeCalls)
          : [null, null, null]

  // make sure contracts and the ABI you pass onto the multicall have this the function you are calling and the parameters are right
  const withdrawalFee  = (vault.pid || vault.pid === 0) && !vault.isHidden && (vault.useMvaultChef ) ?
                            await multicall(strategySingleBCharityABI,
                                [
                                    {address: getAddress(strategyAddress),
                                      name:'withdrawalFee'}])
                            : null


  const withdrawFeeVault = vault.isHidden ? 0
                                        : vault.useMvaultChef ?  withdrawalFee / 100
                                            : (withdrawFeeFactorMax - withdrawFeeFactor) / 100

  // number of LP tokens in the strategy for this vault
  const lpTokenBalanceStrat = await multicall(strategyQuickSwapABI, [
    {
      address: getAddress(strategyAddress),
      name: 'wantLockedTotal', // this is not in erc20 abi so need a different multicall with different abi
    },
  ])

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = vault.isSingleToken ? 1 : new BigNumber(lpTokenBalanceStrat).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  // For pools, we use the qlp address to get token amounts to use for price calculation
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = vault.isSingleToken
    ? new BigNumber(lpTokenBalanceStrat).div(BIG_TEN.pow(tokenDecimals))
    : tokenAmountTotal.times(lpTokenRatio)
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = vault.isSingleToken ? tokenAmountMc : quoteTokenAmountMc.times(new BigNumber(2))


  return {
    // tokenAmountMc: tokenAmountMc.toJSON(),
    // quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    withdrawFee: withdrawFeeVault,
  }
}

export default fetchVault
