import React, { useEffect, useState, useMemo } from 'react'
import { Modal, Checkbox, Tooltip, Spin } from 'antd'
import { keyBy, difference, isEqual, omitBy, isEmpty, debounce } from 'lodash'
import { EduButton } from '@edulastic/common'
import {
  ModalHeader,
  StyledSelect,
  FiltersContainer,
  Search,
  UsersContainer,
  ModalFooter,
} from './styles'
import selectsData from '../../TestPage/components/common/selectsData'

const { allGrades, allSubjects } = selectsData

const AddMembersModal = ({
  visible,
  handleCancel,
  receiveSchools,
  schoolList,
  districtId,
  userList = [],
  fetchUsers,
  groupId,
  membersList,
  addMembersRequest,
  isFetchingUsers,
  isAddingMembers,
}) => {
  const [gradesSelected, setGrades] = useState([])
  const [subjectsSelected, setSubjects] = useState([])
  const [schoolsSelected, setSchools] = useState([])
  const [searchString, setSearchString] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const alreadyAddedUsers = useMemo(() => membersList.map(({ _id }) => _id), [
    membersList,
  ])

  const usersKeyedById = useMemo(() => keyBy(userList, '_id'), [userList])

  const usersCanBeAdded = useMemo(
    () => difference(Object.keys(usersKeyedById), alreadyAddedUsers),
    [usersKeyedById, alreadyAddedUsers]
  )

  const shouldDisableSelectAll = useMemo(() => !usersCanBeAdded.length, [
    usersCanBeAdded,
  ])

  const handleFetchUsers = debounce(() => {
    let data = {
      groupId,
      districtId,
      username: searchString,
      grades: gradesSelected,
      subjects: subjectsSelected,
      schools: schoolsSelected,
    }
    data = omitBy(data, isEmpty)
    fetchUsers(data)
  }, 400)

  useEffect(() => {
    receiveSchools({
      search: {},
      districtId,
      includeStats: false,
      sortField: 'name',
      order: 'asc',
    })
  }, [])

  useEffect(() => {
    handleFetchUsers()
  }, [searchString, gradesSelected, subjectsSelected, schoolsSelected])

  useEffect(() => {
    const selectedUsersInCurrentSearch = selectedUsers.filter((x) =>
      Object.keys(usersKeyedById).includes(x._id)
    )
    setSelectAll(selectedUsersInCurrentSearch.length === userList.length)
  }, [userList, alreadyAddedUsers])

  const handleAddMembers = () => {
    const payload = {
      groupId,
      data: {
        groupMembers: [],
      },
    }
    selectedUsers.forEach((user) => {
      if (!alreadyAddedUsers.includes(user._id)) {
        payload.data.groupMembers.push({
          name: user.name,
          username: user.username,
          userId: user._id,
          isAdmin: false,
        })
      }
    })
    addMembersRequest(payload)
  }

  const header = (
    <ModalHeader>
      <span>All Users</span>
      <span>
        Selected <span>{selectedUsers.length}</span>
      </span>
    </ModalHeader>
  )

  const footer = (
    <ModalFooter>
      <EduButton isGhost onClick={handleCancel}>
        Cancel
      </EduButton>
      <EduButton onClick={handleAddMembers} loading={isAddingMembers}>
        Add Members
      </EduButton>
    </ModalFooter>
  )

  const onSearch = (e) => {
    setSearchString(e.target.value)
  }

  const onUserSelect = (value) => {
    const users = difference(value, alreadyAddedUsers)
    const currentUserListById = Object.keys(usersKeyedById)
    const selectedUsersNotInCurrentSearch = selectedUsers.filter(
      (x) => !currentUserListById.includes(x._id)
    )
    const selectedUsersInCurrentSearch = users.map((x) => usersKeyedById[x])
    const newSelectedUsers = [
      ...selectedUsersNotInCurrentSearch,
      ...selectedUsersInCurrentSearch,
    ]

    setSelectedUsers(newSelectedUsers)
    if (isEqual(users, usersCanBeAdded)) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    const users = difference(Object.keys(usersKeyedById), alreadyAddedUsers)
    const currentUserListById = Object.keys(usersKeyedById)
    const selectedUsersNotInCurrentSearch = selectedUsers.filter(
      (x) => !currentUserListById.includes(x._id)
    )
    if (!selectAll) {
      const selectedUsersInCurrentSearch = users.map((x) => usersKeyedById[x])
      const newSelectedUsers = [
        ...selectedUsersNotInCurrentSearch,
        ...selectedUsersInCurrentSearch,
      ]
      setSelectedUsers(newSelectedUsers)
    } else {
      setSelectedUsers(selectedUsersNotInCurrentSearch)
    }
  }

  const handleClearAll = () => {
    setGrades([])
    setSubjects([])
    setSchools([])
    setSearchString('')
  }

  return (
    <Modal
      title={header}
      visible={visible}
      onCancel={handleCancel}
      width="680px"
      footer={footer}
    >
      <div>
        <FiltersContainer>
          <div>
            <label>Grades</label>
            <StyledSelect
              placeholder="Grades"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              width="170px"
              mode="multiple"
              value={gradesSelected}
              onChange={(data) => setGrades(data)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
            >
              {allGrades.map(({ value, text }) => (
                <StyledSelect.Option value={value}>{text}</StyledSelect.Option>
              ))}
            </StyledSelect>
          </div>
          <div>
            <label>Subjects</label>
            <StyledSelect
              placeholder="Subjects"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              width="170px"
              mode="multiple"
              value={subjectsSelected}
              onChange={(data) => setSubjects(data)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
            >
              {allSubjects.map(({ value, text }) => (
                <StyledSelect.Option value={value}>{text}</StyledSelect.Option>
              ))}
            </StyledSelect>
          </div>
          <div>
            <label>Schools</label>
            <StyledSelect
              placeholder="Schools"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              width="170px"
              mode="multiple"
              value={schoolsSelected}
              onChange={(data) => setSchools(data)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
            >
              {schoolList.map(({ name, _id }) => (
                <StyledSelect.Option value={_id}>{name}</StyledSelect.Option>
              ))}
            </StyledSelect>
          </div>
          <EduButton
            style={{ padding: '10px', marginLeft: '0px', marginTop: '18px' }}
            onClick={handleClearAll}
          >
            Clear All
          </EduButton>
        </FiltersContainer>
        <div style={{ marginTop: '15px' }}>
          <Search
            placeholder="Search by user name"
            style={{ height: '35px' }}
            onChange={onSearch}
            value={searchString}
          />
        </div>
        <UsersContainer>
          <div>
            <Tooltip
              title={
                shouldDisableSelectAll
                  ? 'All the users being displayed are already part of the Group'
                  : ''
              }
            >
              <Checkbox
                onChange={handleSelectAll}
                checked={selectAll || shouldDisableSelectAll}
                disabled={shouldDisableSelectAll}
                key="selectAll"
              >
                Select All
              </Checkbox>
            </Tooltip>
          </div>
          <div>
            {isFetchingUsers ? (
              <Spin />
            ) : (
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={onUserSelect}
                value={[
                  ...selectedUsers.map((x) => x._id),
                  ...alreadyAddedUsers,
                ]}
              >
                {userList.map(({ _id, name }) => (
                  <Checkbox
                    value={_id}
                    key={_id}
                    disabled={alreadyAddedUsers.includes(_id)}
                  >
                    {name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </div>
        </UsersContainer>
      </div>
    </Modal>
  )
}

export default AddMembersModal
