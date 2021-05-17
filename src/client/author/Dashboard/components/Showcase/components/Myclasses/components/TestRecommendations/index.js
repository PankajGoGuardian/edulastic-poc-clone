import React, { useState } from 'react'
import { title } from '@edulastic/colors'
import { EduButton, FlexContainer } from '@edulastic/common'
import { TextWrapper } from '../../../../../styledComponents'
import {
  TestRecommendationsWrapper,
  ViewMoreButton,
  TestCardContainer,
} from './styled'
import CardWrapper from '../../../../../../../TestList/components/CardWrapper/CardWrapper'

const TestRecommendationsContainer = ({
  recommendations,
  setShowTestCustomizerModal,
  userId,
  windowWidth,
  history,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const gridCountInARow =
    windowWidth >= 1800
      ? 7
      : windowWidth >= 1600
      ? 6
      : windowWidth >= 1300
      ? 5
      : 4
  const numberOfRows = isExpanded ? 4 : 1
  const totalNumberOfItemsToShow =
    gridCountInARow * numberOfRows > 10 ? 10 : gridCountInARow * numberOfRows

  return (
    <TestRecommendationsWrapper>
      <FlexContainer
        style={{ marginBottom: '1rem' }}
        justifyContent="left"
        flexWrap="wrap"
      >
        <TextWrapper
          fw="bold"
          size="16px"
          color={title}
          style={{ marginBottom: '1rem' }}
        >
          Recommended Content For You
        </TextWrapper>
        <EduButton
          style={{ marginLeft: '10px', marginTop: '-6px' }}
          isGhost
          onClick={() => setShowTestCustomizerModal(true)}
        >
          Customize
        </EduButton>
        {recommendations?.length > gridCountInARow && (
          <ViewMoreButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'View Less' : 'View More'}
          </ViewMoreButton>
        )}
      </FlexContainer>
      <FlexContainer justifyContent="space-between" flexWrap="wrap">
        {recommendations.map((item, index) => {
          if (index >= totalNumberOfItemsToShow) return
          return (
            <TestCardContainer key={index}>
              <CardWrapper
                owner={
                  item.authors && item.authors.some((x) => x._id === userId)
                }
                item={item}
                blockStyle="tile"
                windowWidth={windowWidth}
                history={history}
                isTestRecommendation
              />
            </TestCardContainer>
          )
        })}
      </FlexContainer>
    </TestRecommendationsWrapper>
  )
}

export default TestRecommendationsContainer
