import React from 'react'
import { Modal, Table } from 'antd'
import { ThemeButton } from '../../../src/components/common/ThemeButton'

const AddMultipleStudentsInfoModal = ({
  infoModelVisible,
  setinfoModelVisible,
  infoModalData,
  setInfoModalData,
  isCreateAssignmentModalVisible,
  toggleCreateAssignmentModal,
}) => {
  const handleCancel = () => {
    setinfoModelVisible(false)
    setInfoModalData([])
    if (isCreateAssignmentModalVisible === 1) {
      toggleCreateAssignmentModal(2)
    }
  }

  const newInfoModalData = infoModalData.map((user) => ({
    ...user,
    msg:
      user.status == 'FAILED_DOMAIN_RESTRICTED'
        ? ' -'
        : user.firstName === ''
        ? 'Student name will be auto-updated after first sign-in'
        : `${user.firstName} ${user.lastName || ''}`,
  }))
  const columns = [
    {
      title: 'Name',
      dataIndex: 'msg',
      key: 'msg',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]
  return (
    <Modal
      title="Student details"
      visible={infoModelVisible}
      onCancel={handleCancel}
      width={700}
      footer={
        <ThemeButton data-cy="done" type="primary" onClick={handleCancel}>
          Done
        </ThemeButton>
      }
    >
      <Table
        dataSource={newInfoModalData}
        columns={columns}
        pagination={false}
      />
    </Modal>
  )
}
export default AddMultipleStudentsInfoModal
