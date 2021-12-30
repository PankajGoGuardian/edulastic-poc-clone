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

const descriptionBottom = (
  <>
    Select questions from the library or <br /> author your own.
  </>
)

const OptionScratch = ({ history, clearTestData, clearCreatedItems }) => {
  const handleCreate = () => {
    clearTestData()
    clearCreatedItems()
    history.push('/author/tests/create')
  }

  return (
    <CardComponent>
      <IconWrapper>
        <IconNewFile height="22" width="18" />
      </IconWrapper>
      <TitleWrapper>Create from Scratch</TitleWrapper>
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
