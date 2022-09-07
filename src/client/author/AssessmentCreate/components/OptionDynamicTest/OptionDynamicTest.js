import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { segmentApi } from '@edulastic/api'
import { EduButton, CustomModalStyled } from '@edulastic/common'
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
  const [modalState, setModalState] = useState(false)
  const handleCreate = () => {
    clearTestData()
    clearCreatedItems()
    segmentApi.genericEventTrack('DynamicTestCreateTestClick', {})
    history.push({
      pathname: '/author/tests/create',
      state: { isDynamicTest: true },
    })
  }

  const openModal = () => {
    setModalState(true)
  }

  const closeModal = () => {
    setModalState(false)
  }
  return (
    <CardComponent data-cy="smartBuild">
      <Tag style={{ backgroundColor: darkOrange1 }}>New</Tag>
      <DynamicTestTitle data-testid="title">
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
        <div
          style={{ position: 'relative', width: '100%', cursor: 'pointer' }}
          onClick={openModal}
        >
          WATCH QUICK TOUR
        </div>
        <CustomModalStyled
          visible={modalState}
          onCancel={closeModal}
          title="Get Started with SmartBuild"
          footer={null}
          destroyOnClose
          width="768px"
        >
          <iframe
            title="SmartBuild"
            width="100%"
            height="400px"
            src="//fast.wistia.net/embed/iframe/na92pypvxo"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            allowFullScreen
            scrolling="no"
          />
        </CustomModalStyled>
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
