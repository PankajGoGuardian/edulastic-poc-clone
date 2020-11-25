import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

// components
import { MainHeader } from '@edulastic/common'
import { IconUsers } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import {
  MainWrapper,
  StyledContent,
  StyledLayout,
} from '../../admin/Common/StyledComponents'
import CollaborationGroups from './components/CollaborationGroups'

// ducks
import { groupsLoadingSelector } from '../sharedDucks/groups'

const MemberCollaboration = ({ loading }) => {
  return (
    <MainWrapper>
      <MainHeader
        Icon={() => (
          <IconUsers
            height="25px"
            width="28px"
            style={{ marginBottom: '-5px' }}
          />
        )}
        headingText="Collaboration Groups"
        mobileHeaderHeight={100}
      />
      <StyledContent>
        <StyledLayout loading={loading}>
          <CollaborationGroups hideBreadcrumbs hideEditableInstances />
        </StyledLayout>
      </StyledContent>
    </MainWrapper>
  )
}

const enhance = compose(
  withRouter,
  withNamespaces('manageDistrict'),
  connect((state) => ({
    loading: groupsLoadingSelector(state),
  }))
)

export default enhance(MemberCollaboration)

MemberCollaboration.propTypes = {
  loading: PropTypes.bool.isRequired,
}
