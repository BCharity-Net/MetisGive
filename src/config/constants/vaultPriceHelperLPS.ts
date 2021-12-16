import tokens from './tokens'
import { VaultConfig } from './types'

const priceHelperLps: VaultConfig[] = [
    /**
     * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
     * This list is added to the MasterChefLps and passed to fetchVault. The calls to get contract information about the token/quoteToken in the LP are still made.
     * The absense of a PID means the masterchef contract calls are skipped for this farm.
     * Prices are then fetched for all farms (masterchef + priceHelperLps).
     * Before storing to redux, farms without a PID are filtered out.
     */
    // temp placeholder TODO: double check this
    // {
    //     pid: null,
    //     lpSymbol: 'FISH?',
    //     tags: [],
    //     // lp address is address of the token being staked
    //     lpAddresses: {
    //         4: '',
    //         137: '0x3a3Df212b7AA91Aa0402B9035b098891d276572B',
    //     },
    //     strategyAddress: {
    //         4: '',
    //         137: '0x917FB15E8aAA12264DCBdC15AFef7cD3cE76BA39',
    //     },
    //     token: tokens.fish,
    //     quoteToken: tokens.usdc,
    // },
]

export default priceHelperLps
