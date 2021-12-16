import BigNumber from "bignumber.js";
import {Vault} from "../../../state/types";


export type TableProps = {
  data?: TableDataTypes[]
  selectedFilters?: string
  sortBy?: string
  sortDir?: string
  onSort?: (value: string) => void
}

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  sortable: boolean
}

export type ScrollBarProps = {
  ref: string
  width: number
}

export type TableDataTypes = {
  POOL: string
  APR: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'apy',
    sortable: true,
    label: 'APY',
  },
  // {
  //   id: 3,
  //   name: 'apr',
  //   sortable: true,
  //   label: 'APR',
  // },
  {
    id: 6,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'apy',
    sortable: true,
    label: 'APY',
  },
  {
    id: 3,
    name: 'apr',
    sortable: true,
    label: 'Daily',
  },
  {
    id: 4,
    name: 'liquidity',
    sortable: true,
    label: 'TVL',
  },
  // {
  //   id: 5,
  //   name: 'multiplier',
  //   sortable: true,
  //   label: 'Multiplier',
  // },
  {
    id: 6,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export enum ViewMode {
  'TABLE' = 'TABLE',
  'CARD' = 'CARD',
}

export interface VaultWithStakedValue extends Vault {
  apr?: number
  apy?: number
  liquidity?: BigNumber
}
