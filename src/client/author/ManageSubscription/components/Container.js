import { withNamespaces } from '@edulastic/localization'
import { get } from 'lodash'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getUserOrgId } from '../../src/selectors/user'
import {
  getSubscriptionSelector,
  getSuccessSelector,
} from '../../Subscription/ducks'
import {
  addBulkTeacherAdminAction,
  getSubsLicenses,
  setTeachersDetailsModalVisibleAction,
} from '../ducks'
import Header from './Header'
import InviteTeachersModal from './InviteTeachersModal'
import InviteTeachersSection from './InviteTeachersSection'
import LicenseCountSection from './LicenseCountSection'
import ManageLicensesModal from './ManageLicensesModal'
import AddTeacherStatusModal from './AddTeacherStatusModal'
import { ContentWrapper } from './styled'

const ManageSubscriptionContainer = ({
  subscription: { subEndDate, subType } = {},
  isSuccess,
  subsLicenses,
  userOrgId,
  addTeachers,
  setTeachersDetailsModalVisible,
  teacherDetailsModalVisible,
  teacherDataSource,
  t,
}) => {
  const [showManageLicenseModal, setShowManageLicenseModal] = useState(false)
  const [showInviteTeachersModal, setShowInviteTeachersModal] = useState(false)
  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const closeManageLicenseModal = () => setShowManageLicenseModal(false)
  const closeInviteTeachersModal = () => setShowInviteTeachersModal(false)
  const closeTeachersDetailModal = () => setTeachersDetailsModalVisible(false)

  const sendInvite = (obj) => {
    const o = {
      addReq: obj,
      // listReq: this.getSearchQuery(),
    }
    addTeachers(o)
  }

  return (
    <>
      <Header
        isSubscribed={isSubscribed}
        subType={subType}
        subEndDate={subEndDate}
        isPaidPremium={isPaidPremium}
      />
      <ContentWrapper>
        <LicenseCountSection
          subsLicenses={subsLicenses}
          setShowManageLicenseModal={setShowManageLicenseModal}
        />
        <InviteTeachersSection
          setShowInviteTeachersModal={setShowInviteTeachersModal}
        />
      </ContentWrapper>
      {showManageLicenseModal && (
        <ManageLicensesModal
          isVisible={showManageLicenseModal}
          onCancel={closeManageLicenseModal}
        />
      )}
      {showInviteTeachersModal && (
        <InviteTeachersModal
          isVisible={showInviteTeachersModal}
          onCancel={closeInviteTeachersModal}
          districtId={userOrgId}
          addTeachers={sendInvite}
        />
      )}
      {teacherDetailsModalVisible && (
        <AddTeacherStatusModal
          isVisible={teacherDetailsModalVisible}
          onCancel={closeTeachersDetailModal}
          teacherDataSource={teacherDataSource}
          userRole="teacher"
          t={t}
        />
      )}
    </>
  )
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      subscription: getSubscriptionSelector(state),
      isSuccess: getSuccessSelector(state),
      subsLicenses: getSubsLicenses(state),
      userOrgId: getUserOrgId(state),
      teacherDetailsModalVisible: get(
        state,
        ['manageSubscription', 'teacherDetailsModalVisible'],
        false
      ),
      teacherDataSource: get(
        state,
        ['manageSubscription', 'bulkTeacherData'],
        []
      ),
    }),
    {
      addTeachers: addBulkTeacherAdminAction,
      setTeachersDetailsModalVisible: setTeachersDetailsModalVisibleAction,
    }
  )
)

export default enhance(ManageSubscriptionContainer)
