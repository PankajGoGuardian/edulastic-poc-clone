import React from 'react'
import styled from 'styled-components'
import {
  NoDataIcon,
  NoDataWrapper,
  NoDataBox,
} from '../../src/components/common/NoDataNotification'

const NoDataNotification = ({
  heading,
  description,
  height,
  clickHandler = () => {},
  hideEditableInstances,
}) => {
  return (
    <Wrapper height={height}>
      <NoDataBox
        onClick={clickHandler}
        cursor={!hideEditableInstances && 'pointer'}
      >
        <img src={NoDataIcon} alt="No Members" />
        <h4>{heading}</h4>
        <p>{description}</p>
      </NoDataBox>
    </Wrapper>
  )
}

export default NoDataNotification

const Wrapper = styled(NoDataWrapper)`
  box-shadow: none;
  border-radius: 0px;
  height: ${({ height }) => height || '100%'};
`
