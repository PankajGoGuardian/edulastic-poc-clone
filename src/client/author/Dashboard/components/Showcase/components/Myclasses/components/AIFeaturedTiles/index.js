import React, { useState } from 'react'
import { CustomModalStyled, FlexContainer } from '@edulastic/common'
import { Link, withRouter } from 'react-router-dom'
import { TextWrapper } from '../../../../../styledComponents'
import { AIFeatureContentWrapper, Image, TextLink } from './styled'
import { navigationState } from '../../../../../../../src/constants/navigation'
import { cdnURI } from '../../../../../../../../../app-config'

const AIFeaturedTiles = ({
  onVideoQuizClick,
  videoQuizPath,
  isVideoQuizAndAIEnabled,
  history,
}) => {
  const [isModelOpen, setIsModelOpen] = useState(false)
  const handelClick = () => {
    history.push({
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.ADDON },
    })
  }
  const title = 'Get Started with VideoQuiz'
  const quickTourLink = `//fast.wistia.net/embed/iframe/jd8y6sdt1m`
  return (
    <>
      <CustomModalStyled
        visible={isModelOpen}
        onCancel={() => setIsModelOpen(false)}
        title={title}
        footer={null}
        destroyOnClose
        width="768px"
      >
        <iframe
          title={title}
          width="100%"
          height="400px"
          src={quickTourLink}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
        />
      </CustomModalStyled>
      <AIFeatureContentWrapper>
        <TextWrapper
          size="16px"
          fw="700"
          lh="22px"
          color="#000000"
          mt=".5rem"
          mb="1rem"
        >
          AI powered new features{' '}
        </TextWrapper>
        <FlexContainer justifyContent="flex-start" flexWrap="wrap">
          <FlexContainer flexDirection="column" alignItems="flex-end">
            {isVideoQuizAndAIEnabled ? (
              <Link onClick={onVideoQuizClick} to={videoQuizPath}>
                <Image
                  alt="videoquiz"
                  src={`${cdnURI}/webresources/dashboard/video-quiz.svg`}
                  width="240px"
                />
              </Link>
            ) : (
              <Image
                alt="videoquiz"
                src={`${cdnURI}/webresources/dashboard/video-quiz.svg`}
                width="240px"
                onClick={handelClick}
                style={{ cursor: 'pointer' }}
              />
            )}
            <TextLink onClick={() => setIsModelOpen(true)}>
              WATCH QUICK TOUR
            </TextLink>
          </FlexContainer>
          {isVideoQuizAndAIEnabled ? (
            <Link to="/author/tests/select?open=aiquiz">
              <Image
                alt="aiquiz"
                src={`${cdnURI}/webresources/dashboard/ai_quiz.svg`}
                width="240px"
              />
            </Link>
          ) : (
            <Image
              alt="aiquiz"
              src={`${cdnURI}/webresources/dashboard/ai_quiz.svg`}
              width="240px"
              onClick={handelClick}
              style={{ cursor: 'pointer' }}
            />
          )}
        </FlexContainer>
      </AIFeatureContentWrapper>
    </>
  )
}

export default withRouter(AIFeaturedTiles)
