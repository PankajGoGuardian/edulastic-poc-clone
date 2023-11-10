import React from 'react'
import styled from 'styled-components'
import { mobileWidthMax, themeColor } from '@edulastic/colors'
import NoDataIcon from './nodata.svg'
import NoDataPearAssessIcon from '../../../../common/components/NoDataNotification/noDataPearAssess.svg'
import { isPearDomain } from '../../../../../utils/pear'

const NoDataNotification = ({ heading, description, data }) => (
  <Wrapper>
    <NoDataBox>
      <img
        src={isPearDomain ? NoDataPearAssessIcon : NoDataIcon}
        alt="noClass"
      />
      <h4>{heading}</h4>
      <p>
        {description} <ThemeColorText>{data}</ThemeColorText>
      </p>
    </NoDataBox>
  </Wrapper>
)

export default NoDataNotification

const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
`
const NoDataBox = styled.div`
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  img {
    width: 50px;
    margin-bottom: 15px;
  }
  h4 {
    color: ${(props) =>
      (props.theme.assignment && props.theme.assignment.helpHeadingTextColor) ||
      '#304050'};
    font-size: 18px;
    font-weight: 600;
  }
  p {
    color: ${(props) =>
      (props.theme.assignment && props.theme.assignment.helpTextColor) ||
      '#848993'};
    font-size: 14px;
    line-height: 22px;
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 10px;
  }
`

export const ThemeColorText = styled.span`
  color: ${themeColor};
`
