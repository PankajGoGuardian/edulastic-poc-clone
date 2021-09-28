import { roleuser } from '@edulastic/constants'
import { get } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import {
  ContentWrapper,
  SettingsWrapper,
  StyledContent,
  StyledLayout,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import SaSchoolSelect from '../../../src/components/common/SaSchoolSelect'
import { getUserRole } from '../../../src/selectors/user'
import { getSchoolAdminSettingsAccess } from '../../ducks'
import DistrictPolicyForm from '../DistrictPolicyForm/DistrictPolicyForm'

const title = 'Manage District'

class DistrictPolicy extends Component {
  render() {
    const {
      loading,
      updating,
      creating,
      history,
      schoolLevelAdminSettings,
      role,
    } = this.props
    const showSpin = loading || updating || creating
    const showSettings =
      (role === roleuser.SCHOOL_ADMIN && schoolLevelAdminSettings) ||
      role === roleuser.DISTRICT_ADMIN
    const menuActive = {
      mainMenu: 'Settings',
      subMenu:
        role === roleuser.DISTRICT_ADMIN
          ? 'District Policies'
          : 'School Policies',
    }

    return (
      <SettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          {showSettings && (
            <StyledLayout showSpin={loading ? 'true' : 'false'}>
              <AdminSubHeader active={menuActive} history={history} />
              {showSpin && (
                <SpinContainer loading={showSpin}>
                  <StyledSpin size="large" />
                </SpinContainer>
              )}
              <ContentWrapper>
                <SaSchoolSelect />
                <DistrictPolicyForm />
              </ContentWrapper>
            </StyledLayout>
          )}
        </StyledContent>
      </SettingsWrapper>
    )
  }
}

const enhance = compose(
  connect((state) => ({
    loading: get(state, ['districtPolicyReducer', 'loading'], []),
    updating: get(state, ['districtPolicyReducer', 'updating'], []),
    creating: get(state, ['districtPolicyReducer', 'creating'], []),
    schoolLevelAdminSettings: getSchoolAdminSettingsAccess(state),
    role: getUserRole(state),
  }))
)

export default enhance(DistrictPolicy)
