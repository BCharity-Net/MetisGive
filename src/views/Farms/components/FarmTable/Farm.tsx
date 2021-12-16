import React from 'react'
import styled from 'styled-components'
import { useFarmUser } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text, Image, Tag } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'

export interface FarmProps {
  label: string
  tags: string
  pid: number
  image: string
}

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ image, label, tags, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Farming')}
        </Text>
      )
    }

    return null
  }

  const getSubHeading = () => {
    return(<Tag>{tags}</Tag>)
  //   return( <Tag variant={`${ tags[1] === '1' ? 'primary' : 'secondary' || 
  // tags[1] === '2' ? 'success' : 'secondary' || tags[1] === '3' ? 'binance' : 'secondary'}`} outline>{tags[0]}</Tag>)
  }

  return (
    <Container>
      <IconImage src={`/images/BCharity-Images/version2/${image}.png`} alt="icon" width={40} height={38} mr="8px" />
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
        <Text>{getSubHeading()}</Text>
      </div>
    </Container>
  )
}

export default Farm
