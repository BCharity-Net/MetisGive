import tokens from './tokens'
import { VaultConfig } from './types'

const vaults: VaultConfig[] = [
  // tags are case sensitive: important for apr calculations
  // IMPORTANT- fetchPublicVaultData assumes that all vaults that use mvaultChef have strategies that have a "withdrawalFee" attribute
  //  if the stratagy does not have the attribute the state will get stuck and none of the numbers will show

  // vaultchef pids have to be different compared to mvault pids
  // we have added a .5 to all pids that are not using mvaultchef and we floor the pids in all locations so it does not affect the states and calls
  // {
  //   pid: 1,
  //   // this has "AUTO" added before it in the table: don't add auto here
  //   lpSymbol: 'GIVE',
  //   isSingleToken: true,
  //   useMvaultChef: true,
  //   isHidden: true,
  //   tags: ['BCharity'],
  //   lpFeeDaily: 0,
  //   // lp address is address of the token being staked
  //   // also called "want" address in contract
  //   lpAddresses: {
  //     4: '',
  //     137: '0x9Bbcda2606e616659b118399A2823E8a392f55DA',
  //   },
  //   strategyAddress: {
  //     // StrategySingleBCharity
  //     4: '',
  //     137: '0x19AAf8b0257770C3d490DdaB9C7F31bb7a5ef5A0',
  //   },
  //   // give-usdc lp token address
  //   qlpAddresses: {
  //     4: '',
  //     137: '0xe9c29faa9ba030df89dcc4efdcbf50168bae4a58',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'GIVE-USDC',
  //   useMvaultChef: true,
  //   isHidden: true,
  //   tags: ['BCharity'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0xE9C29fAa9Ba030Df89Dcc4eFDCBF50168bAE4a58',
  //   },
  //   strategyAddress: {
  //     // StrategyLPBCharity
  //     4: '',
  //     137: '0x58c4cfB265B5f5A11b90F6D69904cA37304B507D',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 3,
  //   lpSymbol: 'GIVE-USDC',
  //   useMvaultChef: true,
  //   isHidden: true,
  //   tags: ['BCharity', 'Burning'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0xE9C29fAa9Ba030Df89Dcc4eFDCBF50168bAE4a58',
  //   },
  //   strategyAddress: {
  //     // StrategyLPBCharity Burning
  //     4: '',
  //     137: '0x41EBF6009B30623876bC1d14fB8BcbADbFfE77D2',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 4,
  //   lpSymbol: 'SNX-WETH',
  //   useMvaultChef: true,
  //   isHidden: true,
  //   tags: ['SushiSwap'],
  //   lpFeeDaily: 0.02,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x116Ff0d1Caa91a6b94276b3471f33dbeB52073E7',
  //   },
  //   strategyAddress: {
  //     // StrategyLPSushiSwap
  //     4: '',
  //     137: '0x7Ba106B04543b95E45fCC9a2e0C83e93bb33F180',
  //   },
  //   token: tokens.snx,
  //   quoteToken: tokens.weth,
  // },
  // {
  //   pid: 5,
  //   lpSymbol: 'GIVE',
  //   isSingleToken: true,
  //   useMvaultChef: true,
  //   tags: ['BCharity', 'Compounding'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x9Bbcda2606e616659b118399A2823E8a392f55DA',
  //   },
  //   strategyAddress: {
  //     // StrategySingleBCharity
  //     4: '',
  //     137: '0xD14A760875fB6d5Ea5791aB1D986eFE570dC5e20',
  //   },
  //   // give-usdc lp token address
  //   qlpAddresses: {
  //     4: '',
  //     137: '0xe9c29faa9ba030df89dcc4efdcbf50168bae4a58',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 6,
  //   lpSymbol: 'GIVE-USDC',
  //   useMvaultChef: true,
  //   tags: ['BCharity', 'Burning'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0xE9C29fAa9Ba030Df89Dcc4eFDCBF50168bAE4a58',
  //   },
  //   strategyAddress: {
  //     // StrategyLPBCharity Burning
  //     4: '',
  //     137: '0xbDEDDf171c7eA9E62de375C925ba15EC97BFeC8c',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 7,
  //   lpSymbol: 'SNX-WETH',
  //   useMvaultChef: true,
  //   tags: ['SushiSwap', 'Burning'],
  //   lpFeeDaily: 0.02,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x116Ff0d1Caa91a6b94276b3471f33dbeB52073E7',
  //   },
  //   strategyAddress: {
  //     // StrategyLPSushiSwap
  //     4: '',
  //     137: '0xCe32624011Ed13e683D32C096843dbDE7a95bC16',
  //   },
  //   token: tokens.snx,
  //   quoteToken: tokens.weth,
  // },
  // {
  //   pid: 8,
  //   lpSymbol: 'BANANA-WMATIC',
  //   useMvaultChef: true,
  //   tags: ['ApeSwap', 'Burning'],
  //   lpFeeDaily: 0.0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x034293F21F1cCE5908BC605CE5850dF2b1059aC0',
  //   },
  //   strategyAddress: {
  //     // StrategyLPApeSwap
  //     4: '',
  //     137: '0x0efff372501c0Cf2A8e1bbd9983Af2e4FD5105b9',
  //   },
  //   token: tokens.banana,
  //   quoteToken: tokens.wmatic,
  // },
  // {
  //   pid: 9,
  //   lpSymbol: 'WETH-WMATIC',
  //   useMvaultChef: true,
  //   tags: ['SushiSwap', 'Compounding'],
  //   lpFeeDaily: 0.06,
  //   lpAddresses: {
  //     4: '',
  //     137: '0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E',
  //   },
  //   strategyAddress: {
  //     // StrategyLPSushiSwap
  //     4: '',
  //     137: '0xB444Ca8aC7a34BB947B2b0e683D50e9fD73a4300',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.wmatic,
  // },
  // {
  //   pid: 10,
  //   lpSymbol: 'WETH-USDC',
  //   useMvaultChef: true,
  //   tags: ['SushiSwap', 'Compounding'],
  //   lpFeeDaily: 0.05,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x34965ba0ac2451A34a0471F04CCa3F990b8dea27',
  //   },
  //   strategyAddress: {
  //     // StrategyLPSushiSwap
  //     4: '',
  //     137: '0x5f13B4B837c0502AfD867bd410A53600fF38fa4B',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 11,
  //   lpSymbol: 'WETH-WMATIC',
  //   useMvaultChef: true,
  //   tags: ['ApeSwap', 'Compounding'],
  //   lpFeeDaily: 0.0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x6Cf8654e85AB489cA7e70189046D507ebA233613',
  //   },
  //   strategyAddress: {
  //     // StrategyLPApeSwap
  //     4: '',
  //     137: '0x806f60b8085c772c72e1fb02667Dbf6C73cb32e0',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.wmatic,
  // },
  // {
  //   pid: 12,
  //   lpSymbol: 'DAI-USDC',
  //   useMvaultChef: true,
  //   tags: ['ApeSwap', 'Compounding'],
  //   lpFeeDaily: 0.0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x5b13B583D4317aB15186Ed660A1E4C65C10da659',
  //   },
  //   strategyAddress: {
  //     // StrategyLPApeSwap
  //     4: '',
  //     137: '0xAb5cC9990e5C19eB8928e3C33cc5E7bf11EEDB8F',
  //   },
  //   token: tokens.dai,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 15,
  //   lpSymbol: 'WETH',
  //   isSingleToken: true,
  //   useMvaultChef: true,
  //   thirdPartyFee: 4,
  //   tags: ['Spade', 'Burning'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  //   },
  //   strategyAddress: {
  //     // StrategySingleSpade
  //     4: '',
  //     137: '0xc2F909F76a891c5875CAc65CcC9b0031843f87Bd',
  //   },
  //   // weth-wmatic lp token address
  //   qlpAddresses: {
  //     4: '',
  //     137: '0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.wmatic,
  // },
  // {
  //   pid: 16,
  //   lpSymbol: 'USDC',
  //   isSingleToken: true,
  //   useMvaultChef: true,
  //   thirdPartyFee: 4,
  //   tags: ['Spade'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  //   },
  //   strategyAddress: {
  //     // StrategySingleSpade
  //     4: '',
  //     137: '0x9AbD9b184177fe42de09a39DBD1142251188A15e',
  //   },
  //   // weth-wmatic lp token address
  //   qlpAddresses: {
  //     4: '',
  //     137: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
  //   },
  //   token: tokens.usdc,
  //   quoteToken: tokens.wmatic,
  // },
  // // normal vaultChef
  // {
  //   pid: 1.5,
  //   lpSymbol: 'WETH-WMATIC',
  //   isHidden: true,
  //   tags: ['Burning'],
  //   lpFeeDaily: 0,
  //   lpAddresses: {
  //     4: '',
  //     137: '0xadbF1854e5883eB8aa7BAf50705338739e558E5b',
  //   },
  //   strategyAddress: {
  //     // StrategyVaultBurn
  //     4: '',
  //     137: '0xc8d8c3C5A6F75124a21c33d2E3ad38bC1585e7e9',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.wmatic,
  // },
  // {
  //   // this is used for calculating token prices in fetchVaultPrices.ts
  //   pid: 2.5,
  //   lpSymbol: 'WMATIC-USDC',
  //   tags: ['QuickSwap'],
  //   useMvaultChef: false,
  //   isHidden: true,
  //   lpFeeDaily: 0.14,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
  //   },
  //   strategyAddress: {
  //     4: '',
  //     137: '0xCDF2F2b81081B880934d9872d4400A748CbBabc2',
  //   },
  //   stakingRewardsAddress: {
  //     4: '',
  //     137: '0x1d648E80CCd19F7ac99439C6e77d0d0662D6C921',
  //   },
  //   token: tokens.wmatic,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 3.5,
  //   lpSymbol: 'SNX-WETH',
  //   tags: ['SushiSwap'],
  //   useMvaultChef: false,
  //   isHidden: true,
  //   lpFeeDaily: 0.02,
  //   lpAddresses: {
  //     4: '',
  //     137: '0x116Ff0d1Caa91a6b94276b3471f33dbeB52073E7',
  //   },
  //   strategyAddress: {
  //     4: '',
  //     137: '0x0A3a218abe54a0392F6aAfC0E8d21eFF1960C695',
  //   },
  //   token: tokens.snx,
  //   quoteToken: tokens.weth,
  // },
]

export default vaults
