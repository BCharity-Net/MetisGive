import React, {useState, useCallback, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@pancakeswap/uikit'
import BigNumber from "bignumber.js";
import { useTranslation } from 'contexts/Localization'
import max from "lodash/max";
import {useBurnedBalance, useTotalSupply} from "../../hooks/useTokenBalance";
import {getBalanceNumber} from "../../utils/formatBalance";
import {getGiveAddress} from "../../utils/addressHelpers";
import {useFarmFromPid, useFarms, usePriceCakeBusd} from "../../state/hooks";
import {CAKE_PER_BLOCK} from "../../config";
import {useAppDispatch} from "../../state";
import {fetchFarmsPublicDataAsync, nonArchivedFarms} from "../../state/farms";
import {getFarmApr} from "../../utils/apr";
import useTheme from "../../hooks/useTheme";

const Bold = styled.text`
  font-weight: bold;
  font-family: 'Tw Cen MT'; 
`

const TextColor = styled.div<{isDark: boolean}>`
  font-family: 'Tw Cen MT'; 
  color: ${({isDark}) => isDark ? "white": "black"};;

`


const InfoCard = styled.div`
  margin: auto;
  margin-top: 25px;
  line-height: 1.1;
  border-style: solid;
  border-width: 5px;
  border-radius: 10px;
  width: 55%;
  // height: 150px;
  text-align: center;
  font-size: 18px;
  padding: 10px 0;
  border-color: orange;
  this.state = {
      show: false
  };
`

const Burned=styled.text`
  color: red;
  font-family: 'Tw Cen MT'; 
`

const Dropdown = () => {
    const { t } = useTranslation()
    const { isDark } = useTheme()

    return(
    <InfoCard>
        
        <TextColor isDark={isDark}>
            100% of the Burning Vault(s) earnings are used to buyback GIVE.<br/>
            4.5% of the earnings of all other vaults are used to buyback GIVE. <br/>
            <Burned>🔥 GIVE is then burned on every compound.</Burned><br/><br/>
            Our vaults auto-compound <Bold>once every 5 minutes.</Bold><br/>
            They do not reward GIVE, they reward the same thing you deposited.<br/>
        </TextColor>
    </InfoCard>
    )
}

export default Dropdown