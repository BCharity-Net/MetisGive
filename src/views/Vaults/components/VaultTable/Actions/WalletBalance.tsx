import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardValue from 'views/Home/components/CardValue'
import CardBusdValue from 'views/Home/components/CardBusdValue'

// Gets and Formats the number of CAKE tokens in user's wallet
// and shows the approximate busd value of their tokens
const CakeWalletBalance = (lpAddress) => {
  const { t } = useTranslation()
  const { balance: cakeBalance } = useTokenBalance(lpAddress)
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '54px' }}>
        {t('')}
      </Text>
    )
  }

  return (
    <>
      {getBalanceNumber(cakeBalance)}
    </>
  )
}

export default CakeWalletBalance
