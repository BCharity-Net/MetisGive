import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton } from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import UnlockButton from 'components/UnlockButton'
import { useWeb3React } from '@web3-react/core'
import { useVaultUser } from 'state/hooks'
import { fetchFarmUserDataAsync } from 'state/farms'
import { VaultWithStakedValue } from 'views/Vaults/components/types'
import { useTranslation } from 'contexts/Localization'
import { useVaultApprove } from 'hooks/useApprove'
import { getBep20Contract } from 'utils/contractHelpers'
import { BASE_ADD_LIQUIDITY_URL, BASE_SWAP_LIQUIDITY_URL, DEFAULT_TOKEN_DECIMAL } from 'config'
import { useAppDispatch } from 'state'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useVaultUnstake, useVaultUnstakeAll } from 'hooks/useUnstake'
import useWeb3 from 'hooks/useWeb3'
import { useVaultStake } from 'hooks/useStake'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import WithdrawAllModal from '../../WithdrawAllModal'
import { ActionContainer, ActionTitles, ActionContent, Earned, Title, Subtle } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends VaultWithStakedValue {
  userDataReady: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  userDataReady,
  isSingleToken,
  useMvaultChef,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useVaultUser(pid)
  const { onStake } = useVaultStake(pid, DEFAULT_TOKEN_DECIMAL, useMvaultChef)
  const { onUnstake } = useVaultUnstake(pid, DEFAULT_TOKEN_DECIMAL, useMvaultChef)
  const { onUnstakeAll } = useVaultUnstakeAll(pid, DEFAULT_TOKEN_DECIMAL, useMvaultChef)
  const web3 = useWeb3()
  const location = useLocation()

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = isSingleToken
    ? `${BASE_SWAP_LIQUIDITY_URL}/${liquidityUrlPathParts}`
    : `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }
  const handleUnstakeAll = async (amount: string) => {
    await onUnstakeAll(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceNumber = getBalanceNumber(stakedBalance)
    if (stakedBalanceNumber > 0 && stakedBalanceNumber < 0.0001) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceNumber.toLocaleString()
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={handleStake} tokenName={lpSymbol} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )
  const [onPresentWithdrawAll] = useModal(
    <WithdrawAllModal max={stakedBalance} onConfirm={handleUnstakeAll} tokenName={lpSymbol} />,
  )
  const lpContract = getBep20Contract(lpAddress, web3)
  const dispatch = useAppDispatch()
  const { onApprove } = useVaultApprove(lpContract, useMvaultChef)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))

      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Connect to Deposit in Vault').toUpperCase()}</Subtle>
        </ActionTitles>
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Title>{lpSymbol} </Title>
            <Subtle>{t('Deposited').toUpperCase()}</Subtle>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance()}</Earned>
            </div>

            <IconButtonWrapper>
              <IconButton variant="primary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="tertiary" width="14px" />
              </IconButton>
              <IconButton
                variant="primary"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
                mr="6px"
              >
                <AddIcon color="tertiary" width="14px" />
              </IconButton>
              <IconButton variant="secondary" onClick={onPresentWithdrawAll}>
                {t('- All')}
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Stake').toUpperCase()} </Subtle>
          <Title>{lpSymbol}</Title>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          >
            {t('Deposit tokens')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Start Staking in Vault').toUpperCase()}</Subtle>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{t('Enable Vault').toUpperCase()}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
