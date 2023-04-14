import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import OptionPDF from '../OptionPDF/OptionPDF'
import OptionVideo from '../OptionVideo/OptionVideo'
import OptionScratch from '../OptionScratch/OptionScratch'
import OptionDynamicTest from '../OptionDynamicTest/OptionDynamicTest'
import BodyWrapper from '../../../AssignmentCreate/common/BodyWrapper'
import FlexWrapper from '../../../AssignmentCreate/common/FlexWrapper'
import OptionQti from '../OptionQTI/OptionQTI'
import { QTI_DISTRICTS } from '../../../../config'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

const CreationOptions = ({ onUploadPDF, isShowQTI }) => (
  <BodyWrapper>
    <FlexWrapper marginBottom="0px">
      <OptionScratch />
      <OptionPDF onClick={onUploadPDF} />
      <FeaturesSwitch
        inputFeatures="videoQuizEnabled"
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
      {isShowQTI && <OptionQti />}
    </FlexWrapper>
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
  }))
)

export default enhance(CreationOptions)
