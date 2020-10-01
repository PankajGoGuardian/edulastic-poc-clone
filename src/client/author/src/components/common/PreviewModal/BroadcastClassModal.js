import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Select } from 'antd'
import { EduButton, FlexContainer } from '@edulastic/common'
import { SelectWrapper } from './styled'

const BroadcastClassModal = ({
  visible,
  onClose,
  onSubmit,
  classList = [],
}) => {
  const [classId, setClassId] = useState(classList[0]?._id)

  const handleOk = () => {
    onSubmit(classId)
    onClose()
  }

  return (
    <Modal
      title={<h3 style={{ fontWeight: '600' }}>Broadcast to Live Class</h3>}
      visible={visible}
      onCancel={onClose}
      footer={<Footer handleOk={handleOk} onClose={onClose} />}
      bodyStyle={{
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SelectWrapper>
        <label>Select Class</label>
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          dropdownMatchSelectWidth={false}
          value={classId}
          style={{ width: '100%' }}
          onChange={(prop) => setClassId(prop)}
        >
          {classList.map(({ _id, name }) => (
            <Select.Option value={_id}>{name}</Select.Option>
          ))}
        </Select>
      </SelectWrapper>
    </Modal>
  )
}

const Footer = ({ onClose, handleOk }) => (
  <FlexContainer height="60px" alignItems="center">
    <EduButton width="160px" isGhost key="cancel" onClick={onClose}>
      No, Cancel
    </EduButton>
    <EduButton width="160px" key="submit" type="primary" onClick={handleOk}>
      Submit
    </EduButton>
  </FlexContainer>
)

export default connect((state) => ({
  classList: state.user?.user?.orgData?.classList,
}))(BroadcastClassModal)
