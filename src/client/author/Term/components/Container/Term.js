import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import TermTable from '../TermTable/TermTable'

import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import {
  SettingsWrapper,
  StyledContent,
  StyledLayout,
} from '../../../../admin/Common/StyledComponents/settingsContent'

const title = 'Manage District'
const menuActive = { mainMenu: 'Settings', subMenu: 'Term' }

class Term extends Component {
  deleteTerm = (deletedTermId) => {
    const { deleteTermSetting, userOrgId } = this.props
    deleteTermSetting({ body: { termId: deletedTermId, orgId: userOrgId } })
  }

  render() {
    const {
      termSetting,
      loading,
      creating,
      updating,
      deleting,
      history,
    } = this.props
    const showSpin = loading || creating || updating || deleting
    return (
      <SettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? 'true' : 'false'}>
            {showSpin && (
              <SpinContainer loading={showSpin}>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <TermTable
              menuActive={menuActive}
              history={history}
              termSetting={termSetting}
            />
          </StyledLayout>
        </StyledContent>
      </SettingsWrapper>
    )
  }
}

const enhance = compose(
  connect((state) => ({
    loading: get(state, ['termReducer', 'loading'], false),
    updating: get(state, ['termReducer', 'updating'], false),
    creating: get(state, ['termReducer', 'creating'], false),
    deleting: get(state, ['termReducer', 'deleting'], false),
  }))
)

export default enhance(Term)

Term.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
}
