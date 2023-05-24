import { notification } from '@edulastic/common'
import { useState } from 'react'

const useRowSelection = (data, showRowSelection) => {
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])
  const _rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ dimension }) => {
      return setCheckedStudents(
        checkedStudents.includes(dimension._id)
          ? checkedStudents.filter((i) => i !== dimension._id)
          : [...checkedStudents, dimension._id]
      )
    },
    onSelectAll: (flag) =>
      setCheckedStudents(
        flag ? data.map(({ dimension }) => dimension._id) : []
      ),
  }

  const checkedStudentsForModal = data.filter(({ dimension }) =>
    checkedStudents.includes(dimension._id)
  )

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  const rowSelection = showRowSelection ? _rowSelection : null
  return {
    rowSelection,
    showAddToGroupModal,
    setShowAddToGroupModal,
    checkedStudentsForModal,
    handleAddToGroupClick,
  }
}

export default useRowSelection
