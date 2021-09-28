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

import ClassesTable from '../ClassesTable/ClassesTable'

const menuActive = { mainMenu: 'Administration', subMenu: 'classes' }

class Classes extends Component {
  render() {
    const {
      loading,
      updating,
      deleting,
      creating,
      history,
      location,
      totalSchoolsCount,
    } = this.props
    const { state: dataPassedWithRoute } = location
    const showSpin = loading || updating || deleting || creating

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
            <ClassesTable
              menuActive={menuActive}
              history={history}
              dataPassedWithRoute={dataPassedWithRoute}
              count={totalSchoolsCount}
            />
          </StyledLayout>
        </StyledContent>
      </MainWrapper>
    )
  }
}

const enhance = compose(
  connect((state) => ({
    loading: get(state, ['classesReducer', 'loading'], false),
    updating: get(state, ['classesReducer', 'updating'], false),
    creating: get(state, ['classesReducer', 'creating'], false),
    deleting: get(state, ['classesReducer', 'deleting'], false),
    totalSchoolsCount: get(state, ['schoolsReducer', 'totalSchoolCount'], 0),
  }))
)

export default enhance(Classes)

Classes.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
}
