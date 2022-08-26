import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { segmentApi } from '@edulastic/api'
import { EduButton } from '@edulastic/common'
import { darkOrange1, themeColorBlue } from '@edulastic/colors'

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
      <Tag style={{ backgroundColor: darkOrange1 }}>New</Tag>
      <DynamicTestTitle>
        <span>Smart</span>Build
        <Tag
          style={{
            position: 'relative',
            left: 5,
            top: 0,
            backgroundColor: 'inherit',
            border: `1.5px solid ${themeColorBlue}`,
            color: themeColorBlue,
          }}
        >
          BETA
        </Tag>
      </DynamicTestTitle>
      <TitleWrapper>Create Section Test</TitleWrapper>
      <TextWrapper>
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
