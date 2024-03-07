import { EduButton } from '@edulastic/common'
import { IconNewFile } from '@edulastic/icons'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import IconWrapper from '../../../AssignmentCreate/common/IconWrapper'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import {
  clearCreatedItemsAction,
  clearTestDataAction,
} from '../../../TestPage/ducks'

const descriptionBottom = <>Survey Test using Likert questions.</>

const OptionScratch = ({ history, clearTestData, clearCreatedItems }) => {
  const handleCreate = () => {
    clearTestData()
    clearCreatedItems()
    history.push({
      pathname: '/author/tests/create',
      state: { isSurveyTest: true },
    })
  }

  return (
    <CardComponent>
      <IconWrapper marginBottom="0px" height="39px" width="39px">
        <IconNewFile height="22" width="18" />
      </IconWrapper>
      <TitleWrapper>Create Survey Test</TitleWrapper>
      <TextWrapper style={{ padding: '0 40px' }}>
        {descriptionBottom}
      </TextWrapper>
      <EduButton width="180px" isGhost onClick={handleCreate}>
        CREATE TEST
      </EduButton>
    </CardComponent>
  )
}

export default withRouter(
  connect(null, {
    clearTestData: clearTestDataAction,
    clearCreatedItems: clearCreatedItemsAction,
  })(OptionScratch)
)
