import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { segmentApi } from '@edulastic/api'
import { EduButton } from '@edulastic/common'

import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { DynamicTestTitle } from './styled'

import {
  clearCreatedItemsAction,
  clearTestDataAction,
} from '../../../TestPage/ducks'
import QuickTour from '../QuickTour/QuickTour'

const QUICK_TOUR_LINK = `//fast.wistia.net/embed/iframe/mcobek8kl5`

const OptionDynamicTest = ({ history, clearTestData, clearCreatedItems }) => {
  const handleCreate = () => {
    clearTestData()
    clearCreatedItems()
    segmentApi.genericEventTrack('DynamicTestCreateTestClick', {})
    history.push({
      pathname: '/author/tests/create',
      state: { isDynamicTest: true },
    })
  }

  return (
    <CardComponent data-cy="smartBuild">
      <DynamicTestTitle data-testid="title">
        <span>Smart</span>Build
      </DynamicTestTitle>
      <TitleWrapper>Create Section Test</TitleWrapper>
      <TextWrapper data-testid="description">
        Set your preferences and let the assessment assemble itself from the
        item bank.
      </TextWrapper>
      <EduButton
        width="180px"
        isGhost
        onClick={handleCreate}
        data-cy="smartBuildCreateTest"
      >
        CREATE TEST
      </EduButton>
      <QuickTour
        title="Get Started with SmartBuild"
        quickTourLink={QUICK_TOUR_LINK}
      />
    </CardComponent>
  )
}

export default withRouter(
  connect(null, {
    clearTestData: clearTestDataAction,
    clearCreatedItems: clearCreatedItemsAction,
  })(OptionDynamicTest)
)
