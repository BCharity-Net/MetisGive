import strategySingleBCharityABI from 'config/abi/strategySingleBCharity.json'
import { getAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import {Vault} from '../types'

type BCharityVaultData = {
    bcharityData : {
        pid: number
    }
}

// const fetchBCharityVault = async (vault: Vault): Promise<BCharityVaultData> => {

//     // get pid of pool in masterchef to use with Farms state to get apr
//     const rawSushiPid = await multicall(strategySingleBCharityABI, [
//         {
//             address: getAddress(vault.strategyAddress),
//             name: 'pid',
//         },
//     ])

//     return {
//         bcharityData :  {
//             pid:  Number(rawSushiPid)
//         }
//     }
// }

// export default fetchBCharityVault
