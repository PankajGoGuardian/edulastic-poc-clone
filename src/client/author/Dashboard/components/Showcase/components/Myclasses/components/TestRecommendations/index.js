import React, { useState } from 'react'
import { FlexContainer } from '@edulastic/common'
import { TextWrapper } from '../../../../../styledComponents'
import {
  TestRecommendationsWrapper,
  ViewMoreButton,
  TestCardContainer,
  CustomButton,
} from './styled'
import CardWrapper from '../../../../../../../TestList/components/CardWrapper/CardWrapper'

const TestRecommendationsContainer = ({
  recommendations,
  setShowTestCustomizerModal,
  userId,
  windowWidth,
  history,
  isDemoPlaygroundUser = false,
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
        justifyContent="flex-start"
        alignItems="flex-start"
        mt="35px"
      >
        <TextWrapper size="16px" fw="700" lh="22px" color="#000000">
          Here are some curated Tests you might like
        </TextWrapper>
        <CustomButton
          isGhost
          height="28px"
          onClick={() => setShowTestCustomizerModal(true)}
          data-cy="customizeRecommendations"
          title={
            isDemoPlaygroundUser
              ? 'This feature is not available in demo account.'
              : ''
          }
          disabled={isDemoPlaygroundUser}
        >
          Customize
        </CustomButton>
        {recommendations?.length > gridCountInARow && (
          <ViewMoreButton
            data-cy={isExpanded ? 'viewLess' : 'viewMore'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'VIEW LESS' : 'VIEW MORE'}
          </ViewMoreButton>
        )}
      </FlexContainer>
      <FlexContainer
        data-cy="testRecommendationsContainer"
        justifyContent="flex-start"
        flexWrap="wrap"
        mt="15px"
      >
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
