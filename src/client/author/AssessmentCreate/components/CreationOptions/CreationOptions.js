import { segmentApi } from '@edulastic/api'
import { Col } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  clearCreatedItemsAction,
  clearTestDataAction,
} from '../../../TestPage/ducks'
import { navigationState } from '../../../src/constants/navigation'
import {
  allowedToCreateVideoQuizSelector,
  getUserFeatures,
  isGcpsDistrictSelector,
  isQTIDistrictSelector,
} from '../../../src/selectors/user'
import EduAIQuiz from '../CreateAITest'
import GoogleFormQuiz from '../CreateGoogleFormQuiz'
import TestCard from './Components/TestCard'
import { HeadingWrapper, SectionWrapper } from './Components/styled'
import { TestKeys, TestSections, TestsNotAllowedForGcps } from './constants'
import { isAccessAllowed, validateAndUpdateAccessFeatures } from './utils'

const CreationOptions = ({
  isQTIDistrict,
  isGcpsDistrict,
  userFeatures,
  history,
  clearTestData,
  clearCreatedItems,
  allowedToCreateVideoQuiz,
}) => {
  const isTestCardVisible = ({ key }) => {
    if (
      (TestsNotAllowedForGcps.includes(key) && isGcpsDistrict) || // don't allow any test coming under TestsNotAllowedForGcps for GCPS
      (key === TestKeys.QTI_IMPORT_TEST && !isQTIDistrict) || // allow QTI import for enabled district
      (key === TestKeys.DYNAMIC_TEST && !userFeatures?.enableDynamicTests) // allow dynamic test for enabled users only
    ) {
      return false
    }

    return true
  }

  const onTestCardClick = ({ key, navigation, segmentEvent, access }) => {
    if (isAccessAllowed(access, userFeatures)) {
      if (segmentEvent) {
        segmentApi.genericEventTrack(segmentEvent.name, {
          ...segmentEvent.data,
        })
      }
      if (navigation) {
        if ([TestKeys.DEFAULT_TEST, TestKeys.DYNAMIC_TEST].includes(key)) {
          clearTestData()
          clearCreatedItems()
        }
        if (key === TestKeys.VIDEO_QUIZ_TEST) {
          if (!allowedToCreateVideoQuiz) {
            return history.push({
              pathname: '/author/subscription',
              state: { view: navigationState.SUBSCRIPTION.view.ADDON },
            })
          }
        }
        return history.push(navigation)
      }
    } else {
      const firstFeature = access?.features?.[0]
      if (firstFeature?.navigation) {
        return history.push(firstFeature.navigation)
      }
    }
  }

  return TestSections.map(({ key, title, tests }, index) => {
    const cardItems = tests
      .map((test) => {
        const testKey = test.key

        const cardVisible = isTestCardVisible(test)
        if (test.access?.features) {
          test.access.features = validateAndUpdateAccessFeatures(
            test.access,
            userFeatures
          )
        }

        if (cardVisible) {
          if (testKey === TestKeys.AI_TEST) {
            return (
              <EduAIQuiz>
                <TestCard testKey={testKey} {...test} />
              </EduAIQuiz>
            )
          }
          if (testKey === TestKeys.GOOGLE_FORM_TEST) {
            return (
              <GoogleFormQuiz>
                <TestCard testKey={testKey} {...test} />
              </GoogleFormQuiz>
            )
          }
          return (
            <TestCard
              testKey={testKey}
              onClick={() => onTestCardClick(test)}
              {...test}
            />
          )
        }
        return false
      })
      .filter((item) => !!item) // removing hidden cards

    if (cardItems.length) {
      return (
        <div key={key || index}>
          <HeadingWrapper strong>{title}</HeadingWrapper>
          <SectionWrapper gutter={32}>
            {cardItems.map((cardItem, cardItemIndex) => (
              <Col key={cardItemIndex} xxl={6} xl={6} md={3} sm={1}>
                {cardItem}
              </Col>
            ))}
          </SectionWrapper>
          <br />
        </div>
      )
    }
    return false
  }).filter((item) => !!item)
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isQTIDistrict: isQTIDistrictSelector(state),
      isGcpsDistrict: isGcpsDistrictSelector(state),
      userFeatures: getUserFeatures(state),
      allowedToCreateVideoQuiz: allowedToCreateVideoQuizSelector(state),
    }),
    {
      clearTestData: clearTestDataAction,
      clearCreatedItems: clearCreatedItemsAction,
    }
  )
)

export default enhance(CreationOptions)
