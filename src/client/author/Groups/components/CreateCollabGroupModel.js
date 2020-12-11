import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Input from "antd/es/Input";
import Modal from "antd/es/Modal";
import {
  Label,
  EduButton,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { createCollaborationGroupAction } from '../ducks'

const Footer = ({ handleCancel, handleAction, isEditMode }) => (
  <FlexContainer justifyContent="flex-end">
    <EduButton isGhost onClick={handleCancel}>
      Cancel
    </EduButton>
    <EduButton key="submit" type="primary" onClick={handleAction}>
      {isEditMode ? 'Update Group Name' : 'Create Group'}
    </EduButton>
  </FlexContainer>
)

const CreateCollabGroupModel = ({
  visible,
  handleCancel,
  createGroup,
  districtId,
  isEditMode,
  name = '',
  updateGroupNameRequest,
  groupId,
}) => {
  const [groupName, setGroupName] = useState(name)

  const handleAction = () => {
    if (!groupName) {
      notification({
        type: 'warning',
        msg: 'Group Name is required.',
      })
      return
    }

    if (isEditMode) {
      updateGroupNameRequest({ groupId, data: { name: groupName } })
      handleCancel()
    } else createGroup({ name: groupName, districtId })
  }

  return (
    <Modal
      title={<h3>{isEditMode ? 'Update Group' : 'Group Creation'}</h3>}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <Footer
          handleAction={handleAction}
          handleCancel={handleCancel}
          isEditMode={isEditMode}
        />
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
