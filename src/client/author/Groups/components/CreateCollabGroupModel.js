import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Input, Modal } from 'antd'
import {
  Label,
  EduButton,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { createCollaborationGroupAction } from '../ducks'

const btnStyle = {
  borderRadius: 100,
}

const Footer = ({ handleCancel, handleCreate }) => (
  <FlexContainer justifyContent="flex-end">
    <EduButton isGhost style={btnStyle} onClick={handleCancel}>
      Cancel
    </EduButton>
    <EduButton
      key="submit"
      type="primary"
      onClick={handleCreate}
      style={btnStyle}
    >
      Create Group
    </EduButton>
  </FlexContainer>
)

const CreateCollabGroupModel = ({
  visible,
  handleCancel,
  createGroup,
  districtId,
}) => {
  const [groupName, setGroupName] = useState('')

  const handleCreate = () => {
    if (!groupName) {
      notification({
        type: 'warning',
        msg: 'Group Name is required.',
      })
      return
    }

    createGroup({ name: groupName, districtId })
  }

  return (
    <Modal
      title={<h3>Group Creation</h3>}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <Footer handleCreate={handleCreate} handleCancel={handleCancel} />
      }
    >
      <Label>Group Name</Label>
      <Input
        style={{ marginTop: 10 }}
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
    </Modal>
  )
}

export default connect(
  (state) => ({
    districtId: state.user?.user?.districtIds?.[0] || '',
  }),
  {
    createGroup: createCollaborationGroupAction,
  }
)(CreateCollabGroupModel)

CreateCollabGroupModel.propTypes = {
  districtId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  createGroup: PropTypes.func.isRequired,
}
