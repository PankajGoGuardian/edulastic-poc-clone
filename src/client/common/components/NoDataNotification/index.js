import React from 'react'
import styled from 'styled-components'
import { mobileWidth } from '@edulastic/colors'
import NoDataIcon from './nodata.svg'
import NoDataPearAssessIcon from './noDataPearAssess.svg'
import { isPearDomain } from '../../../../utils/pear'

const NoDataNotification = ({
  heading,
  description,
  style,
  wrapperStyle = {},
}) => (
  <Wrapper style={wrapperStyle}>
    <NoDataBox style={style}>
      <img
        src={isPearDomain ? NoDataPearAssessIcon : NoDataIcon}
        alt="noData"
      />
      <h4>{heading}</h4>
      <p>{description}</p>
    </NoDataBox>
  </Wrapper>
)

export default NoDataNotification

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  min-height: 70vh;
  min-width: 400px;
  align-items: center;
  justify-content: center;
  display: flex;

  @media screen and (max-width: ${mobileWidth}) {
    min-width: 100px;
  }
`
const NoDataBox = styled.div`
  width: 328px;
  height: 300px;
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  img {
    width: 66px;
    margin-bottom: 15px;
  }
  h4 {
    color: ${(props) =>
      (props.theme.assignment && props.theme.assignment.helpHeadingTextColor) ||
      '#304050'};
    font-size: ${(props) => props.theme.noData.NoDataArchiveTextSize};
    font-weight: 600;
  }
  p {
    color: ${(props) =>
      (props.theme.assignment && props.theme.assignment.helpTextColor) ||
      '#848993'};
    font-size: ${(props) => props.theme.noData.NoDataArchiveSubTextSize};
    line-height: 22px;
  }
}
`
