import React, { useState } from 'react'
import { title } from '@edulastic/colors'
import { EduButton, FlexContainer } from '@edulastic/common'
import { Row } from 'antd'
import { TextWrapper } from '../../../../../styledComponents'
import {
  TestRecommendationsWrapper,
  ViewMoreButton,
  CardContainer,
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
      ? 6
      : windowWidth >= 1500
      ? 5
      : windowWidth >= 1200
      ? 4
      : 3
  const numberOfRows = isExpanded ? 4 : 1
  const totalNumberOfItemsToShow = gridCountInARow * numberOfRows

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
          data-cy="customizeRecommendations"
        >
          Customize
        </EduButton>
        {recommendations?.length > gridCountInARow && (
          <ViewMoreButton
            data-cy={isExpanded ? 'viewLess' : 'viewMore'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'View Less' : 'View More'}
          </ViewMoreButton>
        )}
      </FlexContainer>
      <CardContainer type="tile">
        <Row type="flex" justify="flex-start">
          {recommendations.map((item, index) => {
            if (index >= totalNumberOfItemsToShow) return
            return (
              <TestCardContainer
                key={index}
                data-cy={`recommendationCard${index}`}
              >
                <CardWrapper
                  owner={
                    item.authors && item.authors.some((x) => x._id === userId)
                  }
                  item={item}
                  blockStyle="tile"
                  windowWidth={windowWidth}
                  history={history}
                />
              </TestCardContainer>
            )
          })}
        </Row>
      </CardContainer>
    </TestRecommendationsWrapper>
  )
}

export default TestRecommendationsContainer
