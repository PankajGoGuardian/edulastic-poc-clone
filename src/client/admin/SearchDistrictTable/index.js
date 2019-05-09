import React, { useState, useEffect } from "react";
import { Table, Input, Popconfirm } from "antd";
import { IconPencilEdit, IconTrash, IconCaretDown } from "@edulastic/icons";
import { Button } from "../Common/StyledComponents";
import ErrorBoundary from "../Common/ErrorBoundary";
import { DISTRICT_STATUS, DISTRICT_SYNC_STATUS } from "../Data";

const { Column } = Table;

const EditableAction = ({ onEditClick, districtName, onDeleteClick }) => (
  <>
    <Button aria-label="Edit" noStyle onClick={onEditClick}>
      <IconPencilEdit />
    </Button>
    <Popconfirm title={`Are you sure you want to delete ${districtName}?`} okText="Delete" onConfirm={onDeleteClick}>
      <Button aria-label={`Delete ${districtName}`} noStyle>
        <IconTrash />
      </Button>
    </Popconfirm>
  </>
);

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

function UserCount({ record: { _id } }) {
  const [state, setState] = useState(false);

  return (
    <>
      {!state ? (
        <Button aria-label="View users" onClick={() => setState(val => !val)} noStyle>
          <IconCaretDown />
        </Button>
      ) : (
        "Loading Users..."
      )}
    </>
  );
}

const EditableCell = React.forwardRef(({ edit, cleverId, onInputPressEnter }, ref) => {
  useEffect(() => {
    if (ref.current) {
      // as soon as edit button is clicked, the input element is focused for better accessibility
      ref.current.input.focus();
    }
  }, [edit]);
  return edit ? <Input defaultValue={cleverId} onPressEnter={onInputPressEnter} ref={ref} /> : cleverId;
});

export default function SearchDistrictTable({ data, updateClever, deleteDistrictId }) {
  const [editCell, setEditCell] = useState();
  // here ref is used for the editable text input, since we keep it as an uncontrolled component
  const textInput = React.createRef();

  function renderActions(text, record, index) {
    return editCell !== record._id ? (
      <EditableAction
        onEditClick={() => setEditCell(record._id)}
        districtName={record._source.name}
        onDeleteClick={() => deleteDistrictId(record._id)}
      />
    ) : (
      <NonEditableAction onSaveConfirm={() => updateCleverId(record._id)} onCancelSave={setEditCell} />
    );
  }

  function updateCleverId(districtId) {
    // here a ref is used to access value of the input field
    // here editCell is set so that all fields become uneditable
    setEditCell();
    updateClever({
      districtId,
      cleverId: textInput.current.state.value
    });
  }

  function renderCleverCell(text, record, index) {
    const edit = editCell === record._id;
    const cleverId = record._source.cleverId;
    return (
      <ErrorBoundary>
        <EditableCell
          edit={edit}
          cleverId={cleverId}
          onInputPressEnter={() => updateCleverId(record._id)}
          ref={textInput}
        />
      </ErrorBoundary>
    );
  }

  return (
    <Table rowKey={record => record._id} dataSource={data} pagination={false}>
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
        render={(text, record, index) => <UserCount record={record} />}
      />
      <Column title="Actions" dataIndex="actions" key="actions" render={renderActions} />
    </Table>
  );
}
