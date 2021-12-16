import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

// these icons are defined in ui-kit,
// menu icons defined inline under menu widgit in icons folder using thier Svg component(also in ui-kit)
// other icons (used elsewhere)  use svg files are under pancake-uikit\src\components\Svg\Icons
const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/s',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    items: [
      // {
      //   label: t('Swap (Uniswap)'),
      //   href: 'https://app.uniswap.org/#/swap',
      // },
      // {
      //   label: t('Swap (Moonswap)'),
      //   href: 'https://swap.moonswap.in/#/swap?outputCurrency=0x1078a9280BDcF616D9eFb687D5A44Af4264fb923',
      // },
      {
        label: t('Swap (Giveswap)'),
        href: 'https://bcharity-net.github.io/GiveSwap/#/swap?outputCurrency=0x1078a9280BDcF616D9eFb687D5A44Af4264fb923',
      },
      // {
      //   label: t('Exchange (Uniswap)'),
      //   href: 'https://app.uniswap.org/#/add/v2/ETH',
      // },
      
      {
        label: t('Liquidity (Giveswap)'),
        href: 'https://bcharity-net.github.io/GiveSwap/#/add/0x1078a9280BDcF616D9eFb687D5A44Af4264fb923',
      },
      {
        label: t('Bridge (Metis)'),
        href: 'https://bridge.metis.io/home',
      },
      // {
      //   label: t('Exchange'),
      //   href: 'https://exchange.GiveSwap.finance/#/swap',
      // },
      // {
      //   label: t('Liquidity'),
      //   href: 'https://exchange.GiveSwap.finance/#/pool',
      // },
      // {
      //   label: t('LP Migration'),
      //   href: 'https://v1exchange.GiveSwap.finance/#/migrate',
      // },
      // {
      //   label: t('V1 Liquidity (Old)'),
      //   href: 'https://v1exchange.GiveSwap.finance/#/pool',
      // },
    ],
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Solos'),
    icon: 'PoolIcon',
    href: '/solos',
  },
  // {
  //   label: t('Vaults'),
  //   icon: 'TeamBattleIcon',
  //   href: '/vaults',
  // },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  // {
  //   label: t('Lottery'),
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  {
    label: t('NFTs'),
    icon: 'NftIcon',
    href: '/nfts',
  },
  {
    label: t('Referral'),
    icon: 'TicketIcon',
    href: '/referrals',
  },
  // {
  //   label: t('Team Battle'),
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: t('Teams & Profile'),
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       label: t('Task Center'),
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: t('Your Profile'),
  //       href: '/profile',
  //     },
  //   ],
  // },
  {
    label: t('Charts'),
    icon: 'InfoIcon',
    items: [
      // change these links if token changes
      // {
      //   label: t('KEKTools'),
      //   href: 'https://kek.tools/t/0x9bbcda2606e616659b118399a2823e8a392f55da',
      // },
      // {
      //   label: t('MoonswapChart'),
      //   href: 'https://info.moonswap.in/pair/0xc64092FB2028b4340BfcdA1D6bAa1332Da32c898',
      // },
      // {
      //   label: t('FreeriverChart'),
      //   href: 'https://charts.freeriver.exchange/?token=0x1078a9280BDcF616D9eFb687D5A44Af4264fb923',
      // },

      // {
      //   label: t('Tokens'),
      //   href: 'https://GiveSwap.info/tokens',
      // },
      // {
      //   label: t('Pairs'),
      //   href: 'https://GiveSwap.info/pairs',
      // },
      // {
      //   label: t('Accounts'),
      //   href: 'https://GiveSwap.info/accounts',
      // },
    ],
  },
  // {
  //   label: t('IFO'),
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      // {
      //   label: t('Contact'),
      //   href: 'https://metisgive.gitbook.io/metisgive/',
      // },
      // {
      //   label: t('Voting'),
      //   href: 'https://voting.BCharity.net',
      // },
      {
        label: t('Github'),
        href: 'https://github.com/BCharity-Net',
      },
      {
        label: t('Docs'),
        href: 'https://metisgive.gitbook.io/metisgive/',        
      },      
    ],
  },
]

export default config
