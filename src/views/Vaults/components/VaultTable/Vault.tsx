import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useVaultUser } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text, Image, Tag } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'

export interface FarmProps {
  label: string
  tags: string[]
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
const StyledTag = styled(Tag)`
  margin-left: 3px;
  margin-top: 2px;
`
const Vault: React.FunctionComponent<FarmProps> = ({ image, label, tags, pid }) => {
  const { stakedBalance } = useVaultUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    // this shows the text about token to show that user has staked in this vault
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Staked')}
        </Text>
      )
    }

    return null
  }
  const getTagColour = (tag: string) => {
    if (tag === 'Burning') {
      return 'failure' // red
    }
    if (tag === 'BCharity') {
      return 'primary' // blue
    }
    if (tag === 'SushiSwap') {
      return 'secondary' // purple
    }
    if (tag === 'QuickSwap') {
      return 'textSubtle' // blue
    }
    if (tag === 'ApeSwap') {
      return 'binance' // yellow
    }
    if (tag === 'Spade') {
      return 'textSubtle' // yellow
    }
    return 'textDisabled' // grey
  }

  const getSubHeading = () => {
    const tagElements = tags.map((tag) => (
      <StyledTag variant={getTagColour(tag)} outline>
        {tag}
      </StyledTag>
    ))
    return <div>{tagElements}</div>
  }

  return (
    <Container>
      <IconImage src={`/images/BCharity-Images/version2/${image}.png`} alt="icon" width={80} height={80} mr="8px" />
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
        <Text>{getSubHeading()}</Text>
      </div>
    </Container>
  )
}

export default Vault
