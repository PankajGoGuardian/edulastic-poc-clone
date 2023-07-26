import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { isEmpty } from 'lodash'
import { notification } from '@edulastic/common'
import OptionPDF from '../OptionPDF/OptionPDF'
import OptionScratch from '../OptionScratch/OptionScratch'
import OptionDynamicTest from '../OptionDynamicTest/OptionDynamicTest'
import BodyWrapper from '../../../AssignmentCreate/common/BodyWrapper'
import FlexWrapper from '../../../AssignmentCreate/common/FlexWrapper'
import OptionQti from '../OptionQTI/OptionQTI'
import { QTI_DISTRICTS } from '../../../../config'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  CreateAiTestTitleWrapper,
  CreateAiTestWrapper,
  EduButtonAI,
} from './styled'

import { CreateAiTestModal } from '../CteateAITest'
import { useSaveForm } from '../CteateAITest/hooks/useSaveForm'
import { actions } from '../CteateAITest/ducks/actionReducers'

const CreationOptions = ({
  onUploadPDF,
  isShowQTI,
  getAiGeneratedTestItems,
}) => {
  const {
    isVisible,
    onCreateItems,
    onCancel,
    handleFieldDataChange,
    aiFormContent,
  } = useSaveForm()

  const handleAiFormSubmit = () => {
    const {
      testName,
      itemTypes,
      numberOfItems,
      subjects,
      grades,
    } = aiFormContent

    if (isEmpty(testName)) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseEnterName',
      })
    }

    if (isEmpty(itemTypes)) {
      return notification({
        type: 'warn',
        messageKey: 'itemTypesEmpty',
      })
    }

    if (
      numberOfItems === null ||
      (+numberOfItems < 1 && +numberOfItems > 100)
    ) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseProvideValidNumberOfItems',
      })
    }

    if (isEmpty(grades)) {
      return notification({
        type: 'warn',
        messageKey: 'gradeFieldEmpty',
      })
    }

    if (isEmpty(subjects)) {
      return notification({
        type: 'warn',
        messageKey: 'subjectFieldEmpty',
      })
    }

    getAiGeneratedTestItems(aiFormContent)
  }

  return (
    <BodyWrapper>
      <FlexWrapper marginBottom="0px">
        <OptionScratch />
        <OptionPDF onClick={onUploadPDF} />
        <FeaturesSwitch
          inputFeatures="enableDynamicTests"
          actionOnInaccessible="hidden"
        >
          <OptionDynamicTest />
        </FeaturesSwitch>
        {isShowQTI && <OptionQti />}
      </FlexWrapper>
      <CreateAiTestWrapper
        width="100%"
        padding="2rem"
        mt="1.5rem"
        justifyContent="space-between"
        align-items="center"
      >
        <CreateAiTestTitleWrapper>
          Generate AI-powered test items with a single click!
        </CreateAiTestTitleWrapper>
        <EduButtonAI btnType="primary" isGhost onClick={onCreateItems}>
          Create Quick Test Using AI
        </EduButtonAI>

        <CreateAiTestModal
          onCancel={onCancel}
          isVisible={isVisible}
          handleFieldDataChange={handleFieldDataChange}
          handleAiFormSubmit={handleAiFormSubmit}
        />
      </CreateAiTestWrapper>
    </BodyWrapper>
  )
}

CreationOptions.propTypes = {
  onUploadPDF: PropTypes.func.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isShowQTI: QTI_DISTRICTS.some((qtiDistrict) =>
        (state?.user?.user?.districtIds || []).includes(qtiDistrict)
      ),
    }),
    {
      getAiGeneratedTestItems: actions.getAiGeneratedTestItems,
    }
  )
)

export default enhance(CreationOptions)
