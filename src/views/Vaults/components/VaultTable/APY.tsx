import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@pancakeswap/uikit'

export interface APYProps {
  apy: number
  pid: number
}

const Amount = styled.span`
  color: ${({  theme }) => (theme.colors.text)};
  display: flex;
  align-items: center;
`

const APY: React.FunctionComponent<APYProps> = ({ apy }) => {
  if (apy) {
    return <Amount >{apy.toLocaleString().concat('%')}</Amount>
  }
  return (
    <Amount >
      <Skeleton width={60} />
    </Amount>
  )
}

export default APY
