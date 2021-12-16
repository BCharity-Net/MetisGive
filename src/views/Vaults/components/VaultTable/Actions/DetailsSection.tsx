import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton } from '@pancakeswap/uikit'
import { useVaults } from 'state/hooks'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  tokenValueFormatted?: string
  quoteTokenValue?: string
  tokenName?: string
  quoteTokenName?: string
  isSingleToken?: boolean
  poolAPR?: string
  userTokenBalance?: string
  userQuoteTokenBalance?: string
  userTotalBalance?: string
  lpFees?: number
  lpLabel?: string
  addLiquidityUrl?: string
}
// container for deposits
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

const Wrapper = styled.div`
  margin-top: 24px;
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

const RoiBreakdownContainer = styled.div`
  margin-top: 5px;
  .title {
    color: ${({ theme }) => theme.colors.secondary};
  }
`
const TextSmallerMargins = styled(Text)`
  margin-bottom: -5px;
`
const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  tokenValueFormatted,
  quoteTokenValue,
  tokenName,
  quoteTokenName,
  isSingleToken,
  poolAPR,
  userTokenBalance,
  userQuoteTokenBalance,
  userTotalBalance,
  lpFees,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()
  const { data: vaultsLP, userDataLoaded } = useVaults()
  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        {tokenValueFormatted ? (
          <Text>
            {t(`${tokenName}`)}: ${tokenValueFormatted}
          </Text>
        ) : (
          <Skeleton width={75} height={25} />
        )}
      </Flex>
      <Flex justifyContent="space-between">
        {isSingleToken ? (
          ' '
        ) : (
          <Text>
            {t(`${quoteTokenName}`)}: ${quoteTokenValue}
          </Text>
        )}
      </Flex>

      {/* <RoiBreakdownContainer>
        <TextSmallerMargins className="title">{t('Daily ROI BreakDown')}</TextSmallerMargins>
        <TextSmallerMargins>
          {poolAPR}%{t(' From Pool')}
        </TextSmallerMargins>
        <TextSmallerMargins>
          {lpFees}%{t(' From Lp Fees')}
        </TextSmallerMargins>
      </RoiBreakdownContainer> */}

      <YourDepositContainer isSingleToken={isSingleToken}>
        <div className="title">{t('Your Deposit')}</div>
        <TextSmallerMargins>
          {tokenName.toUpperCase()} {t('Balance:')} {userTokenBalance}
        </TextSmallerMargins>
        <TextSmallerMargins className="token2">
          {quoteTokenName.toUpperCase()} {t('Balance:')} {userQuoteTokenBalance}
        </TextSmallerMargins>
        <TextSmallerMargins>
          {t('Total Value:')} ${userTotalBalance}
        </TextSmallerMargins>
      </YourDepositContainer>
      {/* <Flex justifyContent="space-between">
        <Text>{t('Daily Rate')}:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex> */}
      {!removed && (
        // <StyledLinkExternal href={addLiquidityUrl}>{t('Get %symbol%', { symbol: lpLabel })}</StyledLinkExternal>
        <Text />
      )}
      {/* <StyledLinkExternal href={bscScanAddress}>{t('View Contract')}</StyledLinkExternal> */}
      {/* <StyledLinkExternal href={infoAddress}>{t('See Pair Info')}</StyledLinkExternal> */}
    </Wrapper>
  )
}

export default DetailsSection
