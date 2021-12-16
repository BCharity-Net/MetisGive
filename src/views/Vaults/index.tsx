import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePollFarmsData, usePollVaultsData, usePriceCakeBusd, useVaults, useVaultUser } from 'state/hooks'
import { Farm, Vault } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { orderBy } from 'lodash'
import isArchivedPid from 'utils/farmHelpers' // TODO: change
import { latinise } from 'utils/latinise'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { getFarmApr, getSpadeVaultApr, getVaultApr } from 'utils/apr'
import Table from './components/VaultTable/VaultTable'
import Dropdown from './infocard'
import { RowProps } from './components/VaultTable/Row'
import { DesktopColumnSchema, VaultWithStakedValue, ViewMode } from './components/types'
import TotalValueLockedCard from './components/TotalValueLockedVaultCard'

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`
const RightHeader = styled.div`
  display: none;
  vertical-align: top;
  margin-bottom: -25px;
  margin-top: -5px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-block;
  }
`
const LeftHeader = styled.div`
  display: inline-block;
`
// function to calculate BChairity Vault Daily APR
const getBCharityVaultApr = (farm: Farm, cakePrice: BigNumber): number => {
  const totalLiquidity = farm.isSingleToken
    ? new BigNumber(farm.lpTotalInQuoteToken).times(farm.token.busdPrice)
    : new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
  const apr = getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity)
  return apr / 365
}

const Bold = styled.text`
  font-weight: bold;
`

const TextColor = styled.div<{ isDark: boolean }>`
  font-family: 'Tw Cen MT';
  color: ${({ isDark }) => (isDark ? 'white' : 'black')}; ;
`

const InfoCard = styled.div`
  margin: auto;
  margin-top: 25px;
  line-height: 1.1;
  border-style: solid;
  border-width: 5px;
  border-radius: 10px;
  width: 50%;
  height: 150px;
  text-align: center;
  font-size: 18px;
  padding: 10px 0;
  border-color: orange;
`

const Burned = styled.text`
  color: red;
`

const NUMBER_OF_VAULTS_VISIBLE = 12

const InfoButton = styled.button`
  border: none;
`

const Vaults: React.FC = () => {
  const buttonText = 'Show Info'
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data: vaultsLP, userDataLoaded } = useVaults()
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const { account } = useWeb3React()

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  usePollVaultsData(isArchived)

  // this is used for bcharity vault apr calculations
  const { data: farms } = useFarms()
  usePollFarmsData(isArchived)

  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)
  // alert(userDataLoaded.toString()) //  user data is not loaded - always false TODO:fix

  const [stakedOnly, setStakedOnly] = useState(!isActive)
  useEffect(() => {
    setStakedOnly(!isActive)
  }, [isActive])

  const activeVaults = vaultsLP.filter((vault) => !vault.isHidden && !isArchivedPid(vault.pid))
  const inactiveVaults = vaultsLP.filter((farm) => !farm.isHidden && !isArchivedPid(farm.pid))
  const archivedVaults = vaultsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyVaults = activeVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveVaults = inactiveVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedVaults = archivedVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const vaultsList = useCallback(
    (vaultsToDisplay: Vault[]): VaultWithStakedValue[] => {
      let vaultsToDisplayWithAPR: VaultWithStakedValue[] = vaultsToDisplay.map((vault) => {
        // TODO: add apr, liquidity calculations here
        // alert("pid:".concat(vault.pid.toString())
        //     .concat("\n lpTotalInQuoteToken").concat(vault.lpTotalInQuoteToken))
        if (!vault.lpTotalInQuoteToken || !vault.quoteToken.busdPrice) {
          return vault
        }

        const totalLiquidity = vault.isSingleToken
          ? new BigNumber(vault.lpTotalInQuoteToken).times(vault.token.busdPrice)
          : new BigNumber(vault.lpTotalInQuoteToken).times(vault.quoteToken.busdPrice)
        // const apr = isActive ? getFarmApr(new BigNumber(vault.poolWeight), cakePrice, totalLiquidity) : 0
        let apr = vault.tags.includes('SushiSwap')
          ? getVaultApr(
              new BigNumber(vault.sushiData.poolDailyRewardUsd),
              new BigNumber(vault.sushiData.SushiLpTotalInQuoteToken),
              new BigNumber(vault.quoteToken.busdPrice),
            )
          : vault.tags.includes('QuickSwap')
          ? getVaultApr(
              new BigNumber(vault.quickData.dailyReward),
              new BigNumber(vault.quickData.QuickLpTotalInQuoteToken),
              new BigNumber(vault.quoteToken.busdPrice),
            )
          : vault.tags.includes('ApeSwap')
          ? getVaultApr(
              new BigNumber(vault.apeData.poolDailyRewardUsd),
              new BigNumber(vault.apeData.apeLpTotalInQuoteToken),
              new BigNumber(vault.quoteToken.busdPrice),
            )
          : vault.tags.includes('Spade')
          ? getSpadeVaultApr(
              new BigNumber(vault.spadeData.spadePoolWeight),
              new BigNumber(vault.spadeData.spadePriceUsd),
              vault.isSingleToken
                ? new BigNumber(vault.spadeData.spadeLpTotalInQuoteToken).times(vault.token.busdPrice)
                : new BigNumber(vault.spadeData.spadeLpTotalInQuoteToken).times(vault.quoteToken.busdPrice),
              new BigNumber(vault.spadeData.spadePerBlock),
            )
          : vault.tags.includes('BCharity') && (vault.bcharityData.pid || vault.bcharityData.pid === 0)
          ? getBCharityVaultApr(
              farms.find((farm: Farm) => farm.pid === vault.bcharityData.pid),
              cakePrice,
            )
          : 0

        if (vault.lpFeeDaily > 0) {
          apr += vault.lpFeeDaily
        }

        apr = ((1 + apr / 100 / 288) ** 288 - 1) * 100

        // console.log(vault.quoteToken.busdPrice)

        // calculating APY
        // assumes the vault auto compounds every 5 minutes - 288 minutes in a day

        const apy = ((1 + apr / 100 / 288) ** (365 * 288) - 1) * 100

        // console.log(apy)
        return { ...vault, liquidity: totalLiquidity, apr, apy }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        vaultsToDisplayWithAPR = vaultsToDisplayWithAPR.filter((vault: VaultWithStakedValue) => {
          return latinise(vault.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return vaultsToDisplayWithAPR
      return vaultsToDisplay
    },
    [cakePrice, farms, query],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfVaultsVisible, setNumberOfVaultsVisible] = useState(NUMBER_OF_VAULTS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const vaultsStakedMemoized = useMemo(() => {
    let vaultsStaked = []

    if (isActive) {
      vaultsStaked = stakedOnly ? vaultsList(stakedOnlyVaults) : vaultsList(activeVaults)
    }
    if (isInactive) {
      vaultsStaked = stakedOnly ? vaultsList(stakedInactiveVaults) : vaultsList(inactiveVaults)
    }
    if (isArchived) {
      vaultsStaked = stakedOnly ? vaultsList(stakedArchivedVaults) : vaultsList(archivedVaults)
    }

    // return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible) // comment this back in if using sort function
    return vaultsStaked.slice(0, numberOfVaultsVisible)
  }, [
    activeVaults,
    vaultsList,
    inactiveVaults,
    archivedVaults,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedVaults,
    stakedInactiveVaults,
    stakedOnly,
    stakedOnlyVaults,
    numberOfVaultsVisible,
  ])

  useEffect(() => {
    const showMoreVaults = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfVaultsVisible((vaultsCurrentlyVisible) => vaultsCurrentlyVisible + NUMBER_OF_VAULTS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreVaults, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [vaultsStakedMemoized, observerIsSet])

  const rowData = vaultsStakedMemoized.map((vault) => {
    const { token, quoteToken } = vault
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    let lpLabel = vault.lpSymbol && vault.lpSymbol.split(' ')[0].toUpperCase()
    if (vault.pid === 1 && vault.useMvaultChef) {
      lpLabel = 'AUTO '.concat(lpLabel)
    }

    // props defined in Row.tsx under VaultTable
    const row: RowProps = {
      apr: {
        value: vault.apr && vault.apr.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        multiplier: vault.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: vault.apr,
        apy: vault.apy && vault.apy.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      },
      farm: {
        image: vault.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: lpLabel,
        tags: vault.tags,
        pid: vault.pid,
      },
      apy: {
        apy: vault.apy ? vault.apy : 0,
        pid: vault.pid,
      },
      liquidity: {
        liquidity: vault.liquidity,
      },
      multiplier: {
        multiplier: vault.multiplier,
      },
      details: vault,
      // earned: {
      //   earnings: getBalanceNumber(new BigNumber(vault.userData.earnings)),
      //   pid: vault.pid,
      // },
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    // if (rowData.length) {
    const columnSchema = DesktopColumnSchema

    const columns = columnSchema.map((column) => ({
      id: column.id,
      name: column.name,

      label: column.label,
      // for sorting function - not implemented
      sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
        switch (column.name) {
          case 'farm':
            return b.id - a.id
          case 'apr':
            if (a.original.apr.value && b.original.apr.value) {
              return Number(a.original.apr.value) - Number(b.original.apr.value)
            }
            return 0
          case 'earned':
            return new BigNumber(a.original.apr.apy).toNumber()
          // return a.original.earned.earnings - b.original.earned.earnings
          default:
            return 1
        }
      },
      sortable: column.sortable,
    }))

    return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    // }
  }

  return (
    <>
      <PageHeader>
        <LeftHeader>
          <Heading as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Vaults')}
          </Heading>
          <Heading scale="lg" color="text">
            {t('Auto-Compounding yield')}
          </Heading>
        </LeftHeader>
        <RightHeader>
          <img
            src="images/BCharity-Images/Frame1-compressed.png"
            alt="A frame with plants and a cartoon cat"
            width="330px"
          />
        </RightHeader>
      </PageHeader>
      {/* <InfoButton>{buttonText}</InfoButton> */}
      <Dropdown />
      <TotalValueLockedCard />
      <Page>
        {renderContent() /* this is the actual vault table element */}
        <div ref={loadMoreRef} />
        <StyledImage src="/images/BCharity-Images/cat2.png" alt="cat illustration" width={180} height={150} />
      </Page>
    </>
  )
}

export default Vaults
