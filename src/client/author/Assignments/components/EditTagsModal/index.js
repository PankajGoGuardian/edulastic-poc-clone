import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { uniqBy } from 'lodash'
import styled from 'styled-components'
import { roleuser } from '@edulastic/constants'
import TagFilter from '../../../src/components/common/TagFilter'

const EditTagsModal = ({
  visible,
  toggleModal,
  testId,
  assignments,
  assignmentsSummary,
  userRole,
  editTagsRequest,
  tagsUpdatingState,
  loadAssignments,
  loadAssignmentsSummary,
  districtId,
  filters,
  setTagsUpdatingState,
}) => {
  const [selectedTags, setTags] = useState([])
  const [assignmentIds, setAssignmentIds] = useState([])
  const [disableUpdate, setDisableUpdate] = useState(true)

  useEffect(() => {
    const initialTags = []
    const _assignmentIds = []
    if (userRole === roleuser.TEACHER) {
      assignments.forEach(({ _id, tags = [] }) => {
        _assignmentIds.push(_id)
        initialTags.push(...tags)
      })
    } else if (roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) {
      const test = assignmentsSummary.find(({ testId: _id }) => _id === testId)
      _assignmentIds.push(...test.assignmentIds)
      initialTags.push(...test.tags)
    }

    const tagsSelected = uniqBy(
      initialTags.filter((t) => !!t),
      '_id'
    )
    setTags(tagsSelected)
    setAssignmentIds(_assignmentIds)
  }, [assignments, assignmentsSummary, userRole])

  useEffect(() => {
    if (tagsUpdatingState === 'SUCCESS') {
      if (userRole === roleuser.TEACHER) {
        loadAssignments({ filters, folderId: filters.folderId })
      } else {
        loadAssignmentsSummary({
          districtId,
          filters: { ...filters, pageNo: 1 },
          filtering: true,
          folderId: filters.folderId,
        })
      }
      setTagsUpdatingState(false)
      toggleModal()
    }
  }, [tagsUpdatingState])

  const handleChange = (_, value) => {
    setDisableUpdate(false)
    setTags(value)
  }

  const handleUpdate = () => {
    editTagsRequest({
      tags: selectedTags,
      assignmentIds,
    })
  }

  return (
    <StyledModal
      title={<h2>Edit Tags</h2>}
      centered
      visible={visible}
      onOk={handleUpdate}
      onCancel={() => toggleModal(testId)}
      width={600}
      okText={tagsUpdatingState === 'UPDATING' ? 'Updating...' : 'Update'}
      okButtonProps={{
        disabled: disableUpdate,
        loading: tagsUpdatingState === 'UPDATING',
      }}
    >
      <TagFilter
        onChangeField={handleChange}
        selectedTags={selectedTags}
        canCreate
      />
    </StyledModal>
  )
}

export default EditTagsModal

const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: none;
    h2 {
      margin-bottom: 0px;
    }
  }
  .ant-modal-footer {
    border-top: none;
    > div {
      display: flex;
      justify-content: center;
    }
  }
`
