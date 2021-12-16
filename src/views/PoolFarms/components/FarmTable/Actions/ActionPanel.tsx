import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LinkExternal, Text, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBscScanAddressUrl } from 'utils/bscscan'
import { CommunityTag, CoreTag, DualTag } from 'components/Tags'
import BigNumber from 'bignumber.js'
import getTokenUrlPath from 'utils/getTokenUrlPath'
import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import Multiplier, { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'
import { BIG_TEN } from '../../../../../utils/bigNumber'
import Fee, { DepoFeeProps } from '../DepositFee'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
  fee: DepoFeeProps
}
const ReferenceElement = styled.div`
  display: inline-block;
`
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

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
  fee,
}) => {
  const farm = details

  const { t } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token, dual } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const lpAddress = farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const bsc = getBscScanAddressUrl(lpAddress)
  const info = `https://GiveSwap.info/pair/${lpAddress}`

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('INFO ON Get CAKE-BNB LP TOKEN HERE'), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  // Used to give each table card the right exchange link
  const tokenUrlPath = getTokenUrlPath({
    tokenAddress: farm.token.address,
  })
  let addLiquidityUrl = ''
  if (farm.swapPlatform === 'MoonSwap') {
    addLiquidityUrl = `https://swap.moonswap.in/#/swap?outputCurrency=${tokenUrlPath}`
  } else if (farm.swapPlatform === 'SushiSwap') {
    addLiquidityUrl = `https://app.sushi.com/swap?outputCurrency=${tokenUrlPath}`
  } else if (farm.swapPlatform === 'ApeSwap') {
    addLiquidityUrl = `https://app.apeswap.finance/swap?outputCurrency=${tokenUrlPath}`
  } else if (farm.swapPlatform === 'DFYN') {
    addLiquidityUrl = `https://exchange.dfyn.network/#/swap?outputCurrency=${tokenUrlPath}`
  } else if (farm.swapPlatform === 'Pangolin') {
    addLiquidityUrl = `https://app.pangolin.exchange/#/swap?outputCurrency=${tokenUrlPath}`
  } else if (farm.swapPlatform === 'GiveSwap') {
    addLiquidityUrl = `https://bcharity-net.github.io/GiveSwap/#/swap?outputCurrency=${tokenUrlPath}`
  }

  /* The following components have been removed from StakeContainer:
  <StyledLinkExternal href={bsc}>{t('View Contract')}</StyledLinkExternal>
  <StyledLinkExternal href={info}>{t('See Pair Info')}</StyledLinkExternal>

  The following tag component has been removed from the container
   <TagsContainer>
          {farm.isCommunity ? <CommunityTag /> : <CoreTag />}
          {dual ? <DualTag /> : null}
        </TagsContainer>
  */
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
        <TagsContainer>{tooltipVisible && tooltip}</TagsContainer>
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Text>{t('APR')}</Text>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Multiplier')}</Text>
          <Multiplier {...multiplier} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Liquidity')}</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Deposit Fee')}</Text>
          <Fee {...fee} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <HarvestAction {...farm} userDataReady={userDataReady} />
        <StakedAction {...farm} userDataReady={userDataReady} tokenDecimals={BIG_TEN.pow(farm.token.decimals)} />
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
