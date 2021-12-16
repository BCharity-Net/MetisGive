import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@pancakeswap/uikit'

export interface DepoFeeProps {
  fee: number
}

const Amount = styled.span`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  margin-right: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 0;
  }
`

const Fee: React.FunctionComponent<DepoFeeProps> = ({ fee }) => {
  if (fee || fee === 0) {
    return <Amount>{(fee / 100).toLocaleString().concat('%')}</Amount>
  }
  return (
    <Amount>
      <Skeleton width={60} />
    </Amount>
  )
}

export default Fee
