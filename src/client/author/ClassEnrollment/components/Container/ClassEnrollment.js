import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import {
  MainWrapper,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'

import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'

import ClassEnrollmentTable from '../ClassEnrollmentTable/ClassEnrollmentTable'

import {
  fetchClassDetailsUsingCodeAction,
  getValidatedClassDetails,
  resetFetchedClassDetailsAction,
} from '../../../Student/ducks'
import { receiveClassEnrollmentListAction } from '../../ducks'

const menuActive = { mainMenu: 'Administration', subMenu: 'class-enrollment' }
class ClassEnrollment extends Component {
  render() {
    const {
      loading,
      updating,
      deleting,
      creating,
      history,
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      resetClassDetails,
      receiveClassEnrollmentList,
      location,
      totalSchoolsCount,
    } = this.props
    const showSpin = loading || updating || deleting || creating
    const { state: dataPassedWithRoute } = location
    return (
      <MainWrapper>
        <AdminHeader active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? 'true' : 'false'}>
            {showSpin && (
              <SpinContainer loading={showSpin}>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <ClassEnrollmentTable
              fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
              validatedClassDetails={validatedClassDetails}
              resetClassDetails={resetClassDetails}
              receiveClassEnrollmentList={receiveClassEnrollmentList}
              dataPassedWithRoute={dataPassedWithRoute}
              menuActive={menuActive}
              count={totalSchoolsCount}
              history={history}
            />
          </StyledLayout>
        </StyledContent>
      </MainWrapper>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      loading: get(state, ['classEnrollmentReducer', 'loading'], false),
      updating: get(state, ['classEnrollmentReducer', 'updating'], false),
      creating: get(state, ['classEnrollmentReducer', 'creating'], false),
      deleting: get(state, ['classEnrollmentReducer', 'deleting'], false),
      validatedClassDetails: getValidatedClassDetails(state),
      totalSchoolsCount: get(state, ['schoolsReducer', 'totalSchoolCount'], 0),
    }),
    {
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      resetClassDetails: resetFetchedClassDetailsAction,
      receiveClassEnrollmentList: receiveClassEnrollmentListAction,
    }
  )
)

export default enhance(ClassEnrollment)

ClassEnrollment.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
}
