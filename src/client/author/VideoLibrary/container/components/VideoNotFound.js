import React from 'react'
import styled from 'styled-components'
import { mobileWidth } from '@edulastic/colors'
import NoDataIcon from '../../../../common/components/NoDataNotification/nodata.svg'
import NoDataPearAssessIcon from '../../../../common/components/NoDataNotification/noDataPearAssess.svg'
import { isPearDomain } from '../../../../../utils/pear'

const VideoNotFound = ({
  heading,
  description,
  style,
  wrapperStyle = {},
  setCurrentTab,
}) => {
  const handleOnClick = () => {
    setCurrentTab('3')
  }
  return (
    <Wrapper style={wrapperStyle}>
      <NoDataBox style={style}>
        <img
          src={isPearDomain ? NoDataPearAssessIcon : NoDataIcon}
          alt="noData"
        />
        <Header>{heading}</Header>
        <Description onClick={handleOnClick}>{description}</Description>
      </NoDataBox>
    </Wrapper>
  )
}

export default VideoNotFound

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
  width: 400px;
  height: 300px;
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 66px;
    margin-bottom: 15px;
  }
`
const Header = styled.div`
  color: var(--System-Dark-Blue, #2f4151);
  text-align: center;
  font-family: 'Open Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
`
const Description = styled.div`
  color: #3f85e5;
  text-align: center;
  font-family: 'Open Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
`
