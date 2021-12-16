import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 2) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'GIVE',
    isSingleToken: true,
    isCommunity: true,
    swapPlatform: 'GiveSwap',
    lpAddresses: {
      588: '0x5C6a0B211a3dd809050A26F224F0e2AAba3d22f5',
      1285: '',
    },
    qlpAddresses: {
      588: '0x393b99BB8efE0C1CEBa23448Cfe48F1d1A9d347C',
      1285: '',
    },
    token: tokens.give,
    quoteToken: tokens.usdc,
  },
  {
    pid: 1,
    lpSymbol: 'GIVE-USDC GLP',
    swapPlatform: 'GiveSwap',
    lpAddresses: {
      588: '0x393b99BB8efE0C1CEBa23448Cfe48F1d1A9d347C',
      1285: '',
    },
    token: tokens.give,
    quoteToken: tokens.usdc,
  },
  {
    pid: 2,
    lpSymbol: 'GIVE-WMETIS GLP',
    swapPlatform: 'GiveSwap',
    lpAddresses: {
      588: '0x5188806d731D0D8E7619F63d62bB70a2B21FEfC7',
      1285: '',
    },
    token: tokens.give,
    quoteToken: tokens.wmetis,
  },
  {
    pid: 3,
    lpSymbol: 'WMETIS-USDC GLP',
    swapPlatform: 'GiveSwap',
    isHiddenFarm: false,
    hasFee: true,
    lpAddresses: {
      588: '0xFa6Bf8B07A8363EbFFBcB5DF85328496e84C2D9a',
      1285: '',
    },
    token: tokens.usdc,
    quoteToken: tokens.wmetis,
  },
  {
    pid: 4,
    lpSymbol: 'WMETIS',
    isSingleToken: true,
    swapPlatform: 'GiveSwap',
    lpAddresses: {
      588: '0xd52a793Ebb4A895B9Ba7f77D8a3FeEEc565b324e',
      1285: '',
    },
    qlpAddresses: {
      588: '0xFa6Bf8B07A8363EbFFBcB5DF85328496e84C2D9a',
      1285: '',
    },
    token: tokens.wmetis,
    quoteToken: tokens.usdc,
  }, 
  {
    pid: 5,
    lpSymbol: 'USDC',
    isSingleToken: true,
    swapPlatform: 'GiveSwap',
    lpAddresses: {
      588: '0xB8E92EA431cbE1d69bC9bD99E084237a0A2704FE',
      1285: '',
    },
    qlpAddresses: {
      588: '0xFa6Bf8B07A8363EbFFBcB5DF85328496e84C2D9a',
      1285: '',
    },
    token: tokens.usdc,
    quoteToken: tokens.wmetis,
  },
  // {
  //   pid: 6,
  //   lpSymbol: 'mSWAP',
  //   isSingleToken: true,
  //   swapPlatform: 'MoonSwap',
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0xB3FB48bF090bEDFF4f6F93FFb40221742E107db7',
  //   },
  //   qlpAddresses: {
  //     1287: '',
  //     1285: '0x02158E0c90F1CD780c56b68F6904c8EE2f72eFB7',
  //   },
  //   token: tokens.mswap,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 7,
  //   lpSymbol: 'ETH-USDC MLP',
  //   swapPlatform: 'MoonSwap',
  //   isHiddenFarm: false,
  //   hasFee: true,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0xDb6DD7EdaD4C5ADe2C1CD7E53DfCEbc0f50c7377',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 8,
  //   lpSymbol: 'BUSD-USDC MLP',
  //   swapPlatform: 'MoonSwap',
  //   isHiddenFarm: false,
  //   hasFee: true,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x7Fae055c7836D135f0E755395b0179D4d5Af3E4D',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 9,
  //   lpSymbol: 'BNB-BUSD MLP',
  //   swapPlatform: 'MoonSwap',
  //   isHiddenFarm: false,
  //   hasFee: true,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0xe2293bA6fc806eB0903c4954218A436bec591Bb5',
  //   },
  //   token: tokens.bnb,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 10,
  //   lpSymbol: 'USDT-USDC MLP',
  //   swapPlatform: 'MoonSwap',
  //   isHiddenFarm: false,
  //   hasFee: true,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x9EC8b8818fd07A24481f5635D5283B2aB85dbB5a',
  //   },
  //   token: tokens.usdt,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 11,
  //   lpSymbol: 'ETH',
  //   isSingleToken: true,
  //   swapPlatform: 'MoonSwap',
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
  //   },
  //   qlpAddresses: {
  //     1287: '',
  //     1285: '0xDb6DD7EdaD4C5ADe2C1CD7E53DfCEbc0f50c7377',
  //   },
  //   token: tokens.weth,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 12,
  //   lpSymbol: 'BNB',
  //   isSingleToken: true,
  //   swapPlatform: 'MoonSwap',
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c',
  //   },
  //   qlpAddresses: {
  //     1287: '',
  //     1285: '0xe2293bA6fc806eB0903c4954218A436bec591Bb5',
  //   },
  //   token: tokens.bnb,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 13,
  //   lpSymbol: 'USDT',
  //   isSingleToken: true,
  //   swapPlatform: 'MoonSwap',
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
  //   },
  //   qlpAddresses: {
  //     1287: '',
  //     1285: '0x9EC8b8818fd07A24481f5635D5283B2aB85dbB5a',
  //   },
  //   token: tokens.usdt,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 14,
  //   lpSymbol: 'BUSD',
  //   isSingleToken: true,
  //   swapPlatform: 'MoonSwap',
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818',
  //   },
  //   qlpAddresses: {
  //     1287: '',
  //     1285: '0x7Fae055c7836D135f0E755395b0179D4d5Af3E4D',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 15,
  //   lpSymbol: 'GIVE-USDC GLP',
  //   swapPlatform: 'GiveSwap',
  //   isHiddenFarm: false,
  //   hasFee: false,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x4a6d7f168209D7D78f51Ed0BEF3ed82C37b53dC3',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 16,
  //   lpSymbol: 'GIVE-USDC GLP',
  //   swapPlatform: 'GiveSwap',
  //   isHiddenFarm: false,
  //   hasFee: false,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x66776FA15896aE316B8D6B77f24ee963fC89464f',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.usdc,
  // },
  // {
  //   pid: 17,
  //   lpSymbol: 'GIVE-WMOVR GLP',
  //   swapPlatform: 'GiveSwap',
  //   isHiddenFarm: false,
  //   hasFee: false,
  //   lpAddresses: {
  //     1287: '',
  //     1285: '0x1362164d4Fc5e69D4E0Ed335DAdd99676cE49501',
  //   },
  //   token: tokens.give,
  //   quoteToken: tokens.wmovr,
  // },
]

export default farms
