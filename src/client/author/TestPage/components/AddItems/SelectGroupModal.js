import React, { useState, useMemo } from 'react'
import styled from 'styled-components'

import PerfectScrollbar from 'react-perfect-scrollbar'
import { borderGrey } from '@edulastic/colors'
import { test as testContants } from '@edulastic/constants'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const { ITEM_GROUP_TYPES } = testContants
const SelectGroupModal = ({ visible, test, handleResponse }) => {
  return (
    <StyledModal
      title={[<h3>Add Items</h3>]}
      centered
      textAlign="left"
      visible={visible}
      footer={null}
      onCancel={() => handleResponse(undefined)}
      width="400px"
    >
      <PerfectScrollbar style={{ maxHeight: '500px', marginRight: '-14px' }}>
        <ModalBody>
          {test.itemGroups.map(({ groupName, type }, index) => {
            if (type === ITEM_GROUP_TYPES.STATIC)
              return (
                <GroupWrapper key={index} onClick={() => handleResponse(index)}>
                  {groupName}
                </GroupWrapper>
              )
            return null
          })}
        </ModalBody>
      </PerfectScrollbar>
    </StyledModal>
  )
}

const StyledModal = styled(ConfirmationModal)`
  min-width: 550px;
  .ant-modal-content {
    .ant-modal-header {
      padding-bottom: 0px;
    }
    .ant-modal-body {
      background: transparent;
      box-shadow: unset;
    }
  }
`

const ModalBody = styled.div`
  display: block;
  width: 100%;
  padding-right: 14px;
`

const GroupWrapper = styled.div`
  height: 50px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0px 20px;
  cursor: pointer;
  border: 1px solid ${borderGrey};
`

export default SelectGroupModal
