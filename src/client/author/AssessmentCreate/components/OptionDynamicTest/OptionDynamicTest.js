import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { segmentApi } from '@edulastic/api'
import { EduButton } from '@edulastic/common'

import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { DynamicTestTitle, Footer, Tag } from './styled'

import {
  clearCreatedItemsAction,
  clearTestDataAction,
} from '../../../TestPage/ducks'

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
      <Tag>New</Tag>
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
      <Footer>
        <Link
          to={{
            pathname: 'https://swvideo.wistia.com/medias/na92pypvxo',
          }}
          target="_blank"
        >
          WATCH QUICK TOUR
        </Link>
      </Footer>
    </CardComponent>
  )
}

export default withRouter(
  connect(null, {
    clearTestData: clearTestDataAction,
    clearCreatedItems: clearCreatedItemsAction,
  })(OptionDynamicTest)
)
