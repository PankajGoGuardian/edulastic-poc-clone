import { MainContentWrapper } from '@edulastic/common'
import { IconBarChart } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import {
  getEnrollClassAction,
  getFilteredClassesSelector,
  resetEnrolledClassAction,
} from '../ManageClass/ducks'
import Header from '../sharedComponents/Header'
import MainContainer from '../styled/mainContainer'
import WholeChildReport from '../../author/Reports/subPages/dataWarehouseReports/wholeChildReport'

const WholeChildReportContainer = ({
  flag,
  activeClasses,
  loadAllClasses,
  resetEnrolledClass,
  currentChild,
  t,
}) => {
  const activeEnrolledClasses = (activeClasses || []).filter(
    (c) => c.status == '1'
  )
  useEffect(() => {
    resetEnrolledClass()
    loadAllClasses()
  }, [currentChild])
  return (
    <MainContainer flag={flag}>
      <Header
        flag={flag}
        titleText={t('common.wholeChildReportTitle')}
        titleIcon={IconBarChart}
        classSelect
        showActiveClass={false}
        classList={activeEnrolledClasses}
        showAllClassesOption={false}
      />
      <MainContentWrapper padding="30px">
        <WholeChildReport />
      </MainContentWrapper>
    </MainContainer>
  )
}

export default withNamespaces('header')(
  connect(
    (state) => ({
      flag: state.ui.flag,
      activeClasses: getFilteredClassesSelector(state),
      currentChild: state?.user?.currentChild,
    }),
    {
      loadAllClasses: getEnrollClassAction,
      resetEnrolledClass: resetEnrolledClassAction,
    }
  )(WholeChildReportContainer)
)

WholeChildReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
}
