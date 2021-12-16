import tokens from './tokens'
import { FarmConfig } from './types'

const priceHelperLps: FarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchVault. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absense of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: null,
    lpSymbol: 'GIVE-USDC GLP',
    lpAddresses: {
      588: '0x393b99BB8efE0C1CEBa23448Cfe48F1d1A9d347C',
      1285: '0x8916CfA81A4951DC00cc4F4b830c10932c9Df717',
    },
    token: tokens.give,
    quoteToken: tokens.usdc,
  },
]

export default priceHelperLps
