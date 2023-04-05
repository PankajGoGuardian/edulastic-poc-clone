import { EduIf } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { get } from 'lodash'
import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  SettingsWrapper,
  StyledContent,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import { getUserRole } from '../../../src/selectors/user'
import { getSchoolAdminSettingsAccess } from '../../ducks'

const title = 'Manage District'

const DistrictPolicy = ({ history, role, schoolLevelAdminSettings }) => {
  const menuActive = {
    mainMenu: 'Settings',
    subMenu:
      role === roleuser.DISTRICT_ADMIN
        ? 'District Policies'
        : 'School Policies',
  }

  const showSettings =
    (role === roleuser.SCHOOL_ADMIN && schoolLevelAdminSettings) ||
    role === roleuser.DISTRICT_ADMIN

  const frameRef = useRef()

  return (
    <SettingsWrapper>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <EduIf condition={showSettings}>
          <iframe
            width="1366"
            height="768"
            ref={frameRef}
            id=""
            frameBorder="0"
            allowtransparency="true"
            allowFullScreen="true"
            marginHeight="0"
            marginWidth="0"
            src="https://xd.adobe.com/embed/20d55e1d-76ec-4bb1-b3e8-fb10928ee59c-7586/"
            title={title}
          />
        </EduIf>
      </StyledContent>
    </SettingsWrapper>
  )
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
