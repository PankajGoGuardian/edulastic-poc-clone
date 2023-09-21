import React, { useEffect, useState } from 'react'

import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  Image,
  TextInputStyled,
} from '@edulastic/common'

import { themeColor } from '@edulastic/colors'
import { Col, Form, Row, Spin } from 'antd'
import styled from 'styled-components'
import { IconPlayButton } from '@edulastic/icons'
import DefaultThumbnail from '../../../src/assets/video-quiz/default-thumbnail.png'

import {
  extractVideoId,
  getThumbnailUrl,
  isValidVideoUrl,
} from '../../../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'

const QUICK_TOUR_LINK = `//fast.wistia.net/embed/iframe/jd8y6sdt1m`

const VideoQuickGuide = () => {
  const [showQuickTour, setShowQuickTour] = useState(false)

  return (
    <>
      <StyledHeading>
        Create Video Quiz
        <StyledEduButton
          onClick={() => setShowQuickTour(true)}
          height="20px"
          fontSize="9px"
          type="secondary"
        >
          <StyledIconPlayButton height={10} width={10} />
          How it works?
        </StyledEduButton>
      </StyledHeading>
      <CustomModalStyled
        visible={showQuickTour}
        onCancel={() => setShowQuickTour(false)}
        title="Get Started with VideoQuiz"
        footer={null}
        destroyOnClose
        width="768px"
      >
        <iframe
          title="Get Started with VideoQuiz"
          width="100%"
          height="400px"
          src={QUICK_TOUR_LINK}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
        />
      </CustomModalStyled>
    </>
  )
}

// Takes video url from user and validate same for creating video quiz
const CreateVideoQuiz = ({ onValidUrl }) => {
  const [linkValue, setLinkValue] = useState('')
  const [thumbnail, setThumbnail] = useState(DefaultThumbnail)
  const hasError = !isValidVideoUrl(linkValue)

  useEffect(() => {
    if (!hasError) {
      let newThumbnail
      const videoId = extractVideoId(linkValue || '')
      if (videoId) {
        newThumbnail = getThumbnailUrl(videoId)
        setThumbnail(newThumbnail)
      }

      onValidUrl?.(linkValue, newThumbnail)
    }
  }, [linkValue, hasError])

  const errorMessage = () => {
    if (linkValue && hasError) {
      return `This link can't be played.`
    }

    return undefined
  }

  return (
    <Row type="flex" justify="center" align="middle">
      <StyledCol>
        <Spin spinning={!hasError}>
          <VideoQuickGuide />
          <br />
          <div>
            <StyledThumbnailImage alt="video-quiz" src={thumbnail} />
          </div>
          <br />
          <Form colon={false}>
            <FieldLabel>ENTER URL</FieldLabel>
            <Form.Item
              validateStatus={hasError ? 'error' : 'success'}
              help={errorMessage()}
            >
              <TextInputStyled
                showArrow
                data-cy="videolink"
                onChange={(e) => {
                  setLinkValue(e.target.value)
                }}
                size="large"
                placeholder="Eg : www.youtube.com/videoId"
                margin="0px 0px 15px"
              />
            </Form.Item>
          </Form>
        </Spin>
      </StyledCol>
    </Row>
  )
}

const StyledCol = styled(Col)`
  width: 390px;
`

const StyledHeading = styled.div`
  font-size: 14px;
  font-weight: bold;
`

const StyledThumbnailImage = styled(Image)`
  width: 100%;
  border-radius: 8px;
  height: 240px;
`

const StyledEduButton = styled(EduButton)`
  font-weight: bold;
  top: -2px;
  display: inline;
  color: ${themeColor};
  padding: 0px;
  text-transform: capitalize;

  &:hover {
    color: ${themeColor};
  }
  &:focus {
    color: ${themeColor};
  }
`

const StyledIconPlayButton = styled(IconPlayButton)`
  position: relative;
  top: 2px;
  margin-right: 0px !important;
`

export default CreateVideoQuiz
