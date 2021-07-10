import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import OptionPDF from '../OptionPDF/OptionPDF'
import OptionScratch from '../OptionScratch/OptionScratch'
import OptionFlash from '../OptionFlash'
import BodyWrapper from '../../../AssignmentCreate/common/BodyWrapper'
import FlexWrapper from '../../../AssignmentCreate/common/FlexWrapper'
import OptionQti from '../OptionQTI/OptionQTI'
import { QTI_DISTRICTS } from '../../../../config'
import {
  createAssessmentRequestAction,
  createFlashAssessmentRequestAction,
} from '../../../AssessmentCreate/ducks'

const CreationOptions = ({ onUploadPDF, isShowQTI, createAssessment }) => {
  return (
    <BodyWrapper>
      <FlexWrapper marginBottom="0px">
        <OptionScratch />
        <OptionPDF onClick={onUploadPDF} />
        <OptionFlash createAssessment={createAssessment} />
        {isShowQTI && <OptionQti />}
      </FlexWrapper>
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
      createAssessment: createFlashAssessmentRequestAction,
    }
  )
)

export default enhance(CreationOptions)
