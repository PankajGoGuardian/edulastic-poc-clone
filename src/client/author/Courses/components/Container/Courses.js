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

import CoursesTable from '../CoursesTable/CoursesTable'

const menuActive = { mainMenu: 'Administration', subMenu: 'courses' }

class Courses extends Component {
  render() {
    const {
      loading,
      updating,
      deleting,
      creating,
      uploadingCSV,
      history,
      totalSchoolsCount,
    } = this.props
    const showSpin = loading || updating || deleting || creating || uploadingCSV

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
            <CoursesTable
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
  connect((state) => ({
    loading: get(state, ['coursesReducer', 'loading'], false),
    updating: get(state, ['coursesReducer', 'updating'], false),
    creating: get(state, ['coursesReducer', 'creating'], false),
    deleting: get(state, ['coursesReducer', 'deleting'], false),
    uploadingCSV: get(state, ['coursesReducer', 'uploadingCSV'], false),
    totalSchoolsCount: get(state, ['schoolsReducer', 'totalSchoolCount'], 0),
  }))
)

export default enhance(Courses)

Courses.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
}
