import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LinkExternal, Text, useTooltip, Skeleton } from '@pancakeswap/uikit'
import { VaultWithStakedValue } from 'views/Vaults/components/types'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBscScanAddressUrl } from 'utils/bscscan'
import { BigNumber } from 'bignumber.js'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'
import DetailsSection from './DetailsSection'
import { useVaultUser } from '../../../../../state/hooks'
import { BIG_TEN } from '../../../../../utils/bigNumber'
import HarvestAction from './HarvestAction'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: VaultWithStakedValue
  userDataReady: boolean
  expanded: boolean
}
const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  display: flex;
  align-items: center;
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
  color: ${({ theme }) => theme.colors.primary};
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 16px;
  }

  > div {
    height: 24px;
    padding: 0 6px;
    font-size: 14px;
    margin-right: 4px;

    svg {
      width: 14px;
    }
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
`

const ValueContainer = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`
const YourDepositContainer = styled.div<{ isSingleToken: boolean }>`
  padding-top: 10px;
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
  .title {
    color: ${({ theme }) => theme.colors.secondary};
  }
  .token2 {
    display: ${({ isSingleToken }) => (isSingleToken ? 'none' : 'flex')};
  }
`
const RoiBreakdownContainer = styled.div`
  margin-top: 5px;
  display: none;
  .title {
    color: ${({ theme }) => theme.colors.secondary};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`
const DepositFeeContainer = styled.div`
  padding-top: 5px;
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`
const TextSmallerMargins = styled(Text)`
  margin-bottom: -6px;
`

const InfoBox = styled.div`
  margin-top: -25px;
  margin-left: 60px;
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
}) => {
  const vault = details

  const { t } = useTranslation()
  // const isActive = farm.multiplier !== '0X'
  const isActive = true
  const { quoteToken, token, isSingleToken } = vault
  // const lpLabel = vault.lpSymbol && vault.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const lpLabel = vault.lpSymbol
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })

  const lpAddress = vault.lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const bsc = getBscScanAddressUrl(lpAddress)
  const info = `https://GiveSwap.info/pair/${lpAddress}`

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t(`INFO ON Get ${lpLabel} TOKEN HERE`), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  /* The following components have been removed from StakeContainer:
  <StyledLinkExternal href={bsc}>{t('View Contract')}</StyledLinkExternal>
  <StyledLinkExternal href={info}>{t('See Pair Info')}</StyledLinkExternal>

  The following tag component has been removed from the container
   <TagsContainer>
          {farm.isCommunity ? <CommunityTag /> : <CoreTag />}
          {dual ? <DualTag /> : null}
        </TagsContainer>
  */
  // for get token url ending
  const addTokenUrlPart = vault.isSingleToken
    ? 'swap/'.concat(vault.token.address[137].toString())
    : 'add/'.concat(liquidityUrlPathParts)
  // const walletBalance = web3.eth.getBalance(lpAddress)
  // const totalValueFormatted = parseInt(vault.lpTotalInQuoteToken).toFixed(2)
  const tokenValue = parseFloat(vault.token.busdPrice).toFixed(2)
  const quoteTokenValue = parseFloat(vault.quoteToken.busdPrice).toFixed(2)
  const tokenName = isSingleToken ? vault.lpSymbol : vault.lpSymbol.split('-')[0]
  const quoteTokenName = isSingleToken ? 'single' : vault.lpSymbol.split('-')[1]
  const aprCheck = vault.lpFeeDaily ? vault.apr - vault.lpFeeDaily : vault.apr
  const poolAPR = aprCheck ? parseFloat(aprCheck.toString()).toFixed(2) : '0'
  const lpFees = vault.lpFeeDaily ? vault.lpFeeDaily : 0

  const addTokenUrl = `https://bcharity-net.github.io/GiveSwap/#`
  //
  let addLiquidityUrl = ''
  if (vault.tags.includes('MoonSwap')) {
    addLiquidityUrl = `https://swap.moonswap.in/#/add/${liquidityUrlPathParts}`
  } else if (vault.tags.includes('SushiSwap') || vault.tags.includes('LPSushiSwap')) {
    addLiquidityUrl = `https://app.sushi.com/add/${liquidityUrlPathParts}`
  } else if (vault.tags.includes('ApeSwap')) {
    addLiquidityUrl = `https://app.apeswap.finance/add/${liquidityUrlPathParts}`
  } else if (vault.tags.includes('GiveSwap') || vault.tags.includes('LPSushiSwap')) {
    addLiquidityUrl = `https://bcharity-net.github.io/GiveSwap/add/${liquidityUrlPathParts}`
  } else if (vault.tags.includes('BCharity')) {
    addLiquidityUrl = addTokenUrl.concat(addTokenUrlPart)
  }
  // calculating the numbers for "Your Deposit" numbers
  const { stakedBalance } = useVaultUser(vault.pid) // the amount of lp tokens the user has staked
  let userTokenBalance = '0.00'
  let userQuoteTokenBalance = '0.00'
  let userTotalBalance = '0.00'
  const decimalsToShow = 2
  if (
    !vault.isSingleToken &&
    stakedBalance.gt(0) &&
    vault.lpTotalSupply &&
    vault.tokenAmountTotal &&
    vault.quoteTokenAmountTotal
  ) {
    userTokenBalance = stakedBalance
      .div(new BigNumber(vault.lpTotalSupply))
      .times(new BigNumber(vault.tokenAmountTotal))
      .toFixed(decimalsToShow)
      .toString()
    userQuoteTokenBalance = stakedBalance
      .div(vault.lpTotalSupply)
      .times(vault.quoteTokenAmountTotal)
      .toFixed(decimalsToShow)
      .toString()
    userTotalBalance = stakedBalance
      .div(vault.lpTotalSupply)
      .times(vault.quoteTokenAmountTotal)
      .times(vault.quoteToken.busdPrice)
      .times(2)
      .toFixed(decimalsToShow)
      .toString()
  } else if (vault.isSingleToken) {
    const parsedStakedBalance = new BigNumber(stakedBalance).div(
      BIG_TEN.pow(vault.lpSymbol === 'USDC' ? 18 : vault.token.decimals),
    )
    userTokenBalance = parsedStakedBalance.toFixed(decimalsToShow).toString()
    userTotalBalance = parsedStakedBalance.times(vault.token.busdPrice).toFixed(decimalsToShow).toString()
  }
  // end ""Your Deposit" calculations

  const bscScanAddress = getBscScanAddressUrl(vault.lpAddresses[process.env.REACT_APP_CHAIN_ID])

  return (
    <Container expanded={expanded}>
      <InfoContainer>
        {isActive && (
          <StakeContainer>
            <StyledLinkExternal href={`${addLiquidityUrl}`}>
              {t('Get %symbol%', { symbol: lpLabel })}
            </StyledLinkExternal>
          </StakeContainer>
        )}
        {/* <ReferenceElement ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </ReferenceElement> */}
        <StyledLinkExternal href={bscScanAddress}>{t('View Contract')}</StyledLinkExternal>
        <StakeContainer>
          <TagsContainer>{tooltipVisible && tooltip}</TagsContainer>
          {/* {t('In Your Wallet: ')} */}
          {/* <WalletBalance address={lpAddress} /> */}
          {/* {t(' %symbol%', { symbol: lpLabel })} <br /> */}
          <DepositFeeContainer>
            <TextSmallerMargins>{t('Deposit Fee: 0%')}</TextSmallerMargins>
            <TextSmallerMargins>
              {t('3rd Party Deposit Fee: ')} {vault.tags.includes('Spade') ? vault.thirdPartyFee : 0}%
            </TextSmallerMargins>
            <TextSmallerMargins>
              {t('Withdraw Fee: ')} {vault.withdrawFee}%
            </TextSmallerMargins>
          </DepositFeeContainer>
        </StakeContainer>
        {/* <YourDepositContainer isSingleToken={isSingleToken}>
          <div className="title">{t('Your Deposit')}</div>
          <TextSmallerMargins>
            {vault.token.symbol.toUpperCase()} {t('Balance:')} {userTokenBalance}
          </TextSmallerMargins>
          <TextSmallerMargins className="token2">
            {vault.quoteToken.symbol.toUpperCase()} {t('Balance:')} {userQuoteTokenBalance}
          </TextSmallerMargins>
          <TextSmallerMargins>
            {t('Total Value:')} ${userTotalBalance}
          </TextSmallerMargins>
        </YourDepositContainer> */}
        <RoiBreakdownContainer>
          <TextSmallerMargins className="title">{t('Daily ROI BreakDown')}</TextSmallerMargins>
          <TextSmallerMargins>
            {poolAPR}%{t(' From Pool')}
          </TextSmallerMargins>
          <TextSmallerMargins>
            {lpFees}%{t(' From Lp Fees')}
          </TextSmallerMargins>
        </RoiBreakdownContainer>
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Text>{t('Daily')}</Text>
          <Apr {...apr} dailyPool={poolAPR} dailyLpFee={lpFees} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('TVL')}</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Deposit Fee')}</Text>
          <Text> 0% </Text>
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Withdrawal Fee')}</Text>
          {vault.withdrawFee || vault.withdrawFee === 0 ? <Text>{vault.withdrawFee}%</Text> : <Skeleton width={60} />}
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        {/* <HarvestAction {...vault} userDataReady={userDataReady} /> */}
        <StakedAction {...vault} userDataReady={userDataReady} />
      </ActionContainer>

      {/* <ActionContainer> */}
      <InfoBox>
        <DetailsSection
          bscScanAddress={bscScanAddress}
          infoAddress={`https://bcharity-net.github.io/GiveSwap/pair/${lpAddress}`}
          tokenValueFormatted={tokenValue}
          quoteTokenValue={quoteTokenValue}
          tokenName={tokenName}
          quoteTokenName={quoteTokenName}
          isSingleToken={isSingleToken}
          poolAPR={poolAPR}
          userTokenBalance={userTokenBalance}
          userQuoteTokenBalance={userQuoteTokenBalance}
          userTotalBalance={userTotalBalance}
          lpFees={lpFees}
          lpLabel={lpLabel}
          addLiquidityUrl={addLiquidityUrl}
        />
      </InfoBox>

      {/* </ActionContainer> */}
    </Container>
  )
}

export default ActionPanel
