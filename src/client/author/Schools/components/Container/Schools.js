import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import SchoolsTable from '../SchoolsTable/SchoolsTable'
import {
  MainWrapper,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'

const title = 'Manage District'
const menuActive = { mainMenu: 'Schools', subMenu: '' }

class Schools extends Component {
  render() {
    const {
      loading,
      updating,
      creating,
      deleting,
      totalSchoolsCount,
      history,
    } = this.props
    const showSpin = loading || updating || creating || deleting

    return (
      <MainWrapper>
        <AdminHeader
          title={title}
          active={menuActive}
          history={history}
          count={totalSchoolsCount}
        />
        <StyledContent>
          <StyledLayout loading={showSpin ? 'true' : 'false'}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}

            <SchoolsTable />
          </StyledLayout>
        </StyledContent>
      </MainWrapper>
    )
  }
}
const enhance = compose(
  connect((state) => ({
    loading: get(state, ['schoolsReducer', 'loading'], false),
    updating: get(state, ['schoolsReducer', 'updating'], false),
    creating: get(state, ['schoolsReducer', 'creating'], false),
    deleting: get(state, ['schoolsReducer', 'deleting'], false),
    totalSchoolsCount: get(state, ['schoolsReducer', 'totalSchoolCount'], 0),
  }))
)

export default enhance(Schools)

Schools.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
}
