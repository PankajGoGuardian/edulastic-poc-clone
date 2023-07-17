import { IconArrowRight, IconUpload } from '@edulastic/icons'
import React, { useEffect, useState } from 'react'

import { EduButton, TextInputStyled } from '@edulastic/common'

import { Form, Spin } from 'antd'
import ReactPlayer from 'react-player'
import { ButtonsContainer, Container } from '../CreateBlank/styled'

import IconWrapper from '../../../AssignmentCreate/common/IconWrapper'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'

const isValidHttpUrl = (string) => {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

const CreateLink = ({ next }) => {
  next('https://www.youtube.com/watch?v=')
  const [linkValue, setLinkValue] = useState()

  const isValidUrl = isValidHttpUrl(linkValue)
  const isPlayable = ReactPlayer.canPlay(linkValue)
  const hasError = !isValidUrl || linkValue?.length === 0 || !isPlayable

  const onNext = () => {
    if (linkValue && !hasError && isPlayable) {
      next && next(linkValue)
    }
  }

  const errorMessage = () => {
    if (linkValue && hasError) {
      if (isValidUrl && !isPlayable) {
        return `This link can't be played.`
      }
      return `Please enter a valid url.`
    }

    return undefined
  }

  return (
    <Spin />
    // <Container childMarginRight="0">
    //   <IconWrapper>
    //     <IconUpload width="22" height="22" />
    //   </IconWrapper>
    //   <TitleWrapper>Provide video link to Get Started</TitleWrapper>
    //   <TextWrapper>
    //     Select questions from the library or <br /> author your own.
    //   </TextWrapper>
    //   <ButtonsContainer width="260px">
    //     <Form>
    //       <Form.Item
    //         validateStatus={hasError ? 'error' : 'success'}
    //         help={errorMessage()}
    //       >
    //         <TextInputStyled
    //           showArrow
    //           data-cy="videolink"
    //           onChange={(e) => {
    //             setLinkValue(e.target.value)
    //           }}
    //           size="large"
    //           placeholder="Enter the video link"
    //           margin="0px 0px 15px"
    //         />
    //       </Form.Item>
    //     </Form>
    //     <EduButton size="small" data-cy="next" onClick={onNext}>
    //       <IconArrowRight />
    //     </EduButton>
    //   </ButtonsContainer>
    // </Container>
  )
}

export default CreateLink
