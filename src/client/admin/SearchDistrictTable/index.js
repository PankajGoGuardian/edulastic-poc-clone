import React, { useState, useEffect } from 'react'
import { Input, Popconfirm, Spin } from 'antd'
import { notification } from '@edulastic/common'
import { IconPencilEdit, IconTrash, IconCaretDown } from '@edulastic/icons'
import { Table, Button, FlexColumn } from '../Common/StyledComponents'
import {
  DISTRICT_STATUS,
  DISTRICT_SYNC_STATUS,
  mapCountAsType,
  CLEVER_DISTRICT_ID_REGEX,
} from '../Data'

const { Column } = Table

export const DISABLED_DISTRICT_SYNC_STATUS = [9, 10]

const EditableAction = ({
  onEditClick,
  districtName,
  onDeleteClick,
  disabled,
  isClasslink,
}) => {
  const editTitle = `Edit ${disabled ? 'disabled for' : ''} ${districtName}'s ${
    isClasslink ? 'Edlink' : 'clever'
  } ID`
  return (
    <>
      <Button
        aria-label="Edit"
        noStyle
        onClick={onEditClick}
        disabled={disabled}
        title={editTitle}
      >
        <IconPencilEdit />
      </Button>
      <Popconfirm
        title={`Are you sure you want to delete ${districtName}?`}
        okText="Delete"
        onConfirm={onDeleteClick}
      >
        <Button
          aria-label={`Delete ${districtName}`}
          disabled={disabled}
          noStyle
        >
          <IconTrash />
        </Button>
      </Popconfirm>
    </>
  )
}

const NonEditableAction = ({ onSaveConfirm, onCancelSave }) => (
  <>
    <Popconfirm
      title="Are you sure?"
      onConfirm={onSaveConfirm}
      onCancel={onCancelSave}
    >
      <Button aria-label="Update Clever ID" noStyle>
        Update
      </Button>
    </Popconfirm>
    <Button aria-label="Cancel Save operation" noStyle onClick={onCancelSave}>
      Cancel
    </Button>
  </>
)

function UserCount({
  users,
  getUsersDataAction,
  districtId,
  index,
  isClasslink,
}) {
  return users.loading ? (
    <Spin />
  ) : users.data ? (
    <FlexColumn>
      {Object.keys(users.data).map((key) => (
        <span key={key}>
          {`${
            !key.includes('total') ? (isClasslink ? 'Atlas ' : 'Clever ') : ''
          }${mapCountAsType[key].name}`}{' '}
          : {users.data[key]}
        </span>
      ))}
    </FlexColumn>
  ) : (
    <Button
      aria-label="View users"
      onClick={() => getUsersDataAction({ districtId, index, isClasslink })}
      noStyle
    >
      <IconCaretDown />
    </Button>
  )
}

const EditableCell = ({
  edit,
  thirdPartyId = '',
  onInputPressEnter,
  onCancel,
  editValue,
  setEditValue,
}) => {
  // here ref is used for the editable text input, to focus, for better a11y
  const textInput = React.createRef()
  useEffect(() => {
    if (textInput.current) {
      // as soon as edit button is clicked, the input element is focused
      textInput.current.input.focus()
    }
  }, [edit])
  return edit ? (
    <Input
      value={editValue}
      onPressEnter={onInputPressEnter}
      ref={textInput}
      onChange={(evt) => setEditValue(evt.target.value)}
      onKeyUp={(evt) => {
        if (evt.key === 'Escape') onCancel()
      }}
    />
  ) : (
    thirdPartyId
  )
}

export default function SearchDistrictTable({
  data,
  updateClever,
  deleteDistrictId,
  getUsersDataAction,
  updateClasslink,
  isClasslink,
}) {
  const [editCell, setEditCell] = useState()
  const [editValue, setEditValue] = useState('')

  function updateThirdPartyId(districtId) {
    const cleverIdRegex = RegExp(CLEVER_DISTRICT_ID_REGEX)

    if (isClasslink || cleverIdRegex.test(editValue)) {
      // here editCell is set so that all fields become uneditable
      setEditCell()
      if (isClasslink) {
        updateClasslink({
          districtId,
          atlasId: editValue,
        })
      } else {
        updateClever({
          districtId,
          cleverId: editValue,
        })
      }
    } else {
      notification({
        messageKey: isClasslink ? 'invalidClasslinkId' : 'inValiedCleverId',
      })
    }
  }

  function renderActions(text, record) {
    const onEditClick = () => {
      setEditCell(record._id)
      if (isClasslink) {
        setEditValue(record._source.atlasId)
      } else {
        setEditValue(record._source.cleverId)
      }
    }
    return editCell !== record._id ? (
      <EditableAction
        onEditClick={onEditClick}
        districtName={record._source.name}
        onDeleteClick={() =>
          deleteDistrictId({ districtId: record._id, isClasslink })
        }
        disabled={
          isClasslink
            ? DISABLED_DISTRICT_SYNC_STATUS.indexOf(
                record._source.syncStatus
              ) !== -1
            : DISABLED_DISTRICT_SYNC_STATUS.indexOf(
                record._source.cleverSyncStatus
              ) !== -1
        }
        isClasslink={isClasslink}
      />
    ) : (
      <NonEditableAction
        onSaveConfirm={() => updateThirdPartyId(record._id)}
        onCancelSave={setEditCell}
      />
    )
  }

  function renderCleverCell(text, record) {
    const edit = editCell === record._id
    const { cleverId } = record._source
    return (
      <EditableCell
        edit={edit}
        thirdPartyId={cleverId}
        editValue={editValue}
        setEditValue={setEditValue}
        onInputPressEnter={() => updateThirdPartyId(record._id)}
        onCancel={setEditCell}
      />
    )
  }

  function renderClasslinkCell(text, record) {
    const edit = editCell === record._id
    const { atlasId } = record._source
    return (
      <EditableCell
        edit={edit}
        thirdPartyId={atlasId}
        editValue={editValue}
        setEditValue={setEditValue}
        onInputPressEnter={() => updateThirdPartyId(record._id)}
        onCancel={setEditCell}
      />
    )
  }

  return (
    <Table
      rowKey={(record) => record._id}
      dataSource={data}
      pagination={false}
      bordered
    >
      <Column title="District Id" dataIndex="_id" key="districtId" />
      <Column
        title="District Name"
        dataIndex="_source.name"
        key="districtName"
      />
      {isClasslink ? (
        <Column
          render={renderClasslinkCell}
          title="Edlink ID"
          dataIndex="_source.atlasId"
          key="atlasId"
        />
      ) : (
        <Column
          render={renderCleverCell}
          title="Clever ID"
          dataIndex="_source.cleverId"
          key="cleverId"
        />
      )}
      <Column
        title="Created Date"
        dataIndex="_source.createdAt"
        key="createdDate"
        render={(timeStamp) =>
          timeStamp ? new Date(timeStamp).toLocaleDateString() : '-'
        }
      />
      <Column
        title="Status"
        dataIndex="_source.status"
        key="status"
        render={(status) => DISTRICT_STATUS[status]}
      />
      <Column
        title="Sync Status"
        dataIndex={
          isClasslink ? '_source.syncStatus' : '_source.cleverSyncStatus'
        }
        key="syncStatus"
        render={(syncStatus) => DISTRICT_SYNC_STATUS[syncStatus]}
      />
      <Column
        title="Users"
        dataIndex="users"
        key="users"
        render={(users = {}, record, index) => (
          <UserCount
            users={users}
            getUsersDataAction={getUsersDataAction}
            districtId={record._id}
            index={index}
            isClasslink={isClasslink}
          />
        )}
      />
      <Column
        title="Actions"
        dataIndex="actions"
        key="actions"
        render={renderActions}
      />
    </Table>
  )
}
