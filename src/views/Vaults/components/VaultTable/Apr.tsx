import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import {HelpIcon, Skeleton, Text, useTooltip} from '@pancakeswap/uikit'
import {useTranslation} from "../../../../contexts/Localization";

export interface AprProps {
  value: string
  multiplier: string
  lpLabel: string
  tokenAddress?: Address
  quoteTokenAddress?: Address
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
  apy: string
}
export interface ExtendedAprProps {
  value: string
  multiplier: string
  lpLabel: string
  tokenAddress?: Address
  quoteTokenAddress?: Address
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
  apy: string
  dailyPool: string
  dailyLpFee: number
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  margin-right: 10px;
`

const ReferenceElement = styled.div`
  display: inline-block;
  margin-left: -18px;
`

const Apr: React.FC<ExtendedAprProps> = ({
  value,
  lpLabel,
  tokenAddress,
  quoteTokenAddress,
  cakePrice,
  originalValue,
  hideButton = false,
  apy,
  dailyPool,
  dailyLpFee,
}) => {
  const { t } = useTranslation()

  const toolTipText = dailyPool.concat("% from Pools, ").concat(dailyLpFee.toString()).concat("% from LP Fees ")

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
      toolTipText,
      { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <>
           <AprWrapper>{value}%</AprWrapper>
        </>
      ) : (
        <AprWrapper>
          <Skeleton width={50} margin-right="50px" />
        </AprWrapper>
      )}
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  ) : (
    <Container>
      <AprWrapper>{originalValue}%</AprWrapper>
    </Container>
  )
}

export default Apr
