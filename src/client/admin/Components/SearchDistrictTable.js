import React, { useState } from "react";
import { Table, Input, Popconfirm } from "antd";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { Button } from "../Common/Styled-Components";
import { IconCaretDown } from "@edulastic/icons";
import ErrorBoundary from "../Common/ErrorBoundary";

const { Column } = Table;

const EditableAction = ({ onEditClick, districtName }) => (
  <>
    <Button aria-label="Edit" noStyle onClick={onEditClick}>
      <IconPencilEdit />
    </Button>
    <Popconfirm title={`Are you sure you want to delete ${districtName}?`} okText="Delete">
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

const EditableCell = React.forwardRef(({ edit, cleverId, onInputPressEnter }, ref) =>
  edit ? <Input defaultValue={cleverId} onPressEnter={onInputPressEnter} ref={ref} /> : cleverId
);

export default function SearchDistrictTable({ data, updateClever }) {
  const [editCell, setEditCell] = useState();
  // here ref is used for the editable text input, since we keep it as an uncontrolled component
  const textInput = React.createRef();

  function renderActions(text, record, index) {
    return editCell !== record._id ? (
      <EditableAction onEditClick={() => setEditCell(record._id)} districtName={record._source.name} />
    ) : (
      <NonEditableAction onSaveConfirm={() => updateCleverId(record._id)} onCancelSave={setEditCell} />
    );
  }

  function updateCleverId(id) {
    // here a ref is used to access value of the input field
    // here editCell is set so that all fields become uneditable
    setEditCell();
    updateClever({
      districtId: id,
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
      <Column title="Created Date" dataIndex="_source.createdAt" key="createdDate" />
      <Column title="Sync Status" dataIndex="_source.lastSync" key="syncStatus" />
      <Column
        title="Users"
        dataIndex="users"
        key="users"
        render={(text, record, index) => (
          <>
            <Button aria-label="See users" noStyle>
              <IconCaretDown />
            </Button>
          </>
        )}
      />
      <Column title="Actions" dataIndex="actions" key="actions" render={renderActions} />
    </Table>
  );
}
