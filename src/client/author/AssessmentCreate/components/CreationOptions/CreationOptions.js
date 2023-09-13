import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { get } from 'lodash'
import { EduIf } from '@edulastic/common'
import OptionPDF from '../OptionPDF/OptionPDF'
import OptionVideo from '../OptionVideo/OptionVideo'
import OptionScratch from '../OptionScratch/OptionScratch'
import OptionDynamicTest from '../OptionDynamicTest/OptionDynamicTest'
import BodyWrapper from '../../../AssignmentCreate/common/BodyWrapper'
import FlexWrapper from '../../../AssignmentCreate/common/FlexWrapper'
import OptionQti from '../OptionQTI/OptionQTI'
import { QTI_DISTRICTS } from '../../../../config'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import EduAiQuiz from '../CreateAITest'

const CreationOptions = ({ onUploadPDF, isShowQTI, history }) => (
  <BodyWrapper>
    <FlexWrapper marginBottom="0px">
      <OptionScratch />
      <OptionPDF onClick={onUploadPDF} />
      <FeaturesSwitch
        inputFeatures={['isVideoQuizAndAIEnabled']}
        actionOnInaccessible="hidden"
      >
        <OptionVideo />
      </FeaturesSwitch>

      <FeaturesSwitch
        inputFeatures="enableDynamicTests"
        actionOnInaccessible="hidden"
      >
        <OptionDynamicTest />
      </FeaturesSwitch>
      <EduIf condition={isShowQTI}>
        <OptionQti />
      </EduIf>
    </FlexWrapper>
    <FeaturesSwitch
      inputFeatures={['isVideoQuizAndAIEnabled']}
      actionOnInaccessible="hidden"
    >
      <EduAiQuiz history={history} />
    </FeaturesSwitch>
  </BodyWrapper>
)

CreationOptions.propTypes = {
  onUploadPDF: PropTypes.func.isRequired,
}

const enhance = compose(
  withRouter,
  connect((state) => ({
    isShowQTI: QTI_DISTRICTS.some((qtiDistrict) =>
      (state?.user?.user?.districtIds || []).includes(qtiDistrict)
    ),
    aiTestStatus: get(state, 'aiTestDetails.status'),
  }))
)

export default enhance(CreationOptions)
