import React from 'react'
import styled from 'styled-components'
import { greenDark } from '@edulastic/colors'
import { IconAnnoncement } from '@edulastic/icons'

const FreeVideoQuizAnnouncement = ({ title, style, history }) => {
  const handelClick = () => {
    history.push('/author/subscription')
  }
  return (
    <BannerContainer style={style}>
      <IconAnnoncement />
      <Title>{title}</Title>
      <StyledLink onClick={handelClick}>MORE INFO</StyledLink>
    </BannerContainer>
  )
}

export default FreeVideoQuizAnnouncement

const BannerContainer = styled.div`
  display: flex;
  gap: 7px;
  justify-content: center;
`
const Title = styled.h2`
  font-size: 17px;
`
const StyledLink = styled(Title)`
  color: ${greenDark};
  font-weight: bold;
  cursor: pointer;
`
