import React, { useState, useEffect } from "react";
import { Input, Popconfirm, Spin, message } from "antd";
import { IconPencilEdit, IconTrash, IconCaretDown } from "@edulastic/icons";
import { Table, Button, FlexColumn } from "../Common/StyledComponents";
import { DISTRICT_STATUS, DISTRICT_SYNC_STATUS, mapCountAsType, CLEVER_DISTRICT_ID_REGEX } from "../Data";

const { Column } = Table;

export const DISABLED_DISTRICT_SYNC_STATUS = [9, 10];

const EditableAction = ({ onEditClick, districtName, onDeleteClick, disabled }) => {
  const editTitle = `Edit ${disabled ? "disabled for" : ""} ${districtName}'s clever ID`;
  return (
    <>
      <Button aria-label="Edit" noStyle onClick={onEditClick} disabled={disabled} title={editTitle}>
        <IconPencilEdit />
      </Button>
      <Popconfirm title={`Are you sure you want to delete ${districtName}?`} okText="Delete" onConfirm={onDeleteClick}>
        <Button aria-label={`Delete ${districtName}`} disabled={disabled} noStyle>
          <IconTrash />
        </Button>
      </Popconfirm>
    </>
  );
};

const NonEditableAction = ({ onSaveConfirm, onCancelSave }) => (
  <>
    <Popconfirm title="Are you sure?" onConfirm={onSaveConfirm} onCancel={onCancelSave}>
      <Button aria-label="Update Clever ID" noStyle>
        Update
      </Button>
    </Popconfirm>
    <Button aria-label="Cancel Save operation" noStyle onClick={onCancelSave}>
      Cancel
    </Button>
  </>
);

function UserCount({ users, getUsersDataAction, districtId, index }) {
  return users.loading ? (
    <Spin />
  ) : users.data ? (
    <FlexColumn>
      {Object.keys(users.data).map(key => (
        <span key={key}>
          {mapCountAsType[key].name} : {users.data[key]}
        </span>
      ))}
    </FlexColumn>
  ) : (
    <Button aria-label="View users" onClick={() => getUsersDataAction({ districtId, index })} noStyle>
      <IconCaretDown />
    </Button>
  );
}

const EditableCell = ({ edit, cleverId = "", onInputPressEnter, onCancel, editValue, setEditValue }) => {
  // here ref is used for the editable text input, to focus, for better a11y
  const textInput = React.createRef();
  useEffect(() => {
    if (textInput.current) {
      // as soon as edit button is clicked, the input element is focused
      textInput.current.input.focus();
    }
  }, [edit]);
  return edit ? (
    <Input
      value={editValue}
      onPressEnter={onInputPressEnter}
      ref={textInput}
      onChange={evt => setEditValue(evt.target.value)}
      onKeyUp={evt => {
        if (evt.key === "Escape") onCancel();
      }}
    />
  ) : (
    cleverId
  );
};

export default function SearchDistrictTable({ data, updateClever, deleteDistrictId, getUsersDataAction }) {
  const [editCell, setEditCell] = useState();
  const [editValue, setEditValue] = useState("");

  function renderActions(text, record, index) {
    return editCell !== record._id ? (
      <EditableAction
        onEditClick={() => {
          setEditCell(record._id);
          setEditValue(record._source.cleverId);
        }}
        districtName={record._source.name}
        onDeleteClick={() => deleteDistrictId(record._id)}
        disabled={DISABLED_DISTRICT_SYNC_STATUS.indexOf(record._source.cleverSyncStatus) !== -1}
      />
    ) : (
      <NonEditableAction onSaveConfirm={() => updateCleverId(record._id)} onCancelSave={setEditCell} />
    );
  }

  function updateCleverId(districtId) {
    const idRegex = RegExp(CLEVER_DISTRICT_ID_REGEX);

    if (idRegex.test(editValue)) {
      // here editCell is set so that all fields become uneditable
      setEditCell();
      updateClever({
        districtId,
        cleverId: editValue
      });
    } else {
      message.error("Please enter valid Clever ID");
    }
  }

  function renderCleverCell(text, record, index) {
    const edit = editCell === record._id;
    const { cleverId } = record._source;
    return (
      <EditableCell
        edit={edit}
        cleverId={cleverId}
        editValue={editValue}
        setEditValue={setEditValue}
        onInputPressEnter={() => updateCleverId(record._id)}
        onCancel={setEditCell}
      />
    );
  }

  return (
    <Table rowKey={record => record._id} dataSource={data} pagination={false} bordered>
      <Column title="District Id" dataIndex="_id" key="districtId" />
      <Column title="District Name" dataIndex="_source.name" key="districtName" />
      <Column render={renderCleverCell} title="Clever Id" dataIndex="_source.cleverId" key="cleverId" />
      <Column
        title="Created Date"
        dataIndex="_source.createdAt"
        key="createdDate"
        render={timeStamp => new Date(timeStamp).toLocaleDateString()}
      />
      <Column title="Status" dataIndex="_source.status" key="status" render={status => DISTRICT_STATUS[status]} />
      <Column
        title="Sync Status"
        dataIndex="_source.cleverSyncStatus"
        key="syncStatus"
        render={syncStatus => DISTRICT_SYNC_STATUS[syncStatus]}
      />
      <Column
        title="Users"
        dataIndex="users"
        key="users"
        render={(users = {}, record, index) => (
          <UserCount users={users} getUsersDataAction={getUsersDataAction} districtId={record._id} index={index} />
        )}
      />
      <Column title="Actions" dataIndex="actions" key="actions" render={renderActions} />
    </Table>
  );
}
