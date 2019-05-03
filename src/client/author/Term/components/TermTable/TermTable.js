import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as moment from "moment";
import { get } from "lodash";

import { Table, Input, Popconfirm, Form, Icon, DatePicker } from "antd";
import { StyledTableContainer, StyledButton, StyledDeleteButton, StyledAddButton } from "./styled";
import CreateTermModal from "./CreateTermModal/CreateTermModal";
import EditTermModal from "./EditTermModal/EditTermModal";
// selectors
import { receiveTermAction, updateTermAction, createTermAction, deleteTermAction } from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {inputType === "text"
                    ? getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: "Please Input " + title + "!"
                          }
                        ],
                        initialValue: record[dataIndex]
                      })(<Input />)
                    : getFieldDecorator(dataIndex, {
                        rules: [{ required: true, message: "Please Input " + title + "!" }],
                        initialValue: moment(record[dataIndex], "DD MMM YYYY")
                      })(<DatePicker format={"DD MMM YYYY"} />)}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class TermTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedKey: -1,
      createTermModalVisible: false,
      editTermModalVisible: false
    };

    this.columns = [
      {
        title: "School Year Name",
        dataIndex: "name",
        width: "25%",
        editable: true
      },
      {
        title: "Start Date",
        dataIndex: "startDateVisible",
        width: "25%",
        editable: true
      },
      {
        title: "End Date",
        dataIndex: "endDateVisible",
        width: "25%",
        editable: true
      },
      {
        title: <StyledAddButton onClick={this.handleAdd}>+ Add School Year</StyledAddButton>,
        dataIndex: "operation",
        render: (text, record) => {
          const toDayDate = moment(new Date(), "DD MMM YYYY");
          toDayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          const deleteDisabled = toDayDate.valueOf() > record.startDate;
          return (
            <React.Fragment>
              <StyledButton onClick={() => this.showEditTermModal(record.key)}>
                <Icon type="edit" theme="twoTone" />
              </StyledButton>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <StyledDeleteButton disabled={deleteDisabled}>
                  <Icon type="delete" />
                </StyledDeleteButton>
              </Popconfirm>
            </React.Fragment>
          );
        }
      }
    ];
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.termSetting.length === undefined) {
      return {
        data: []
      };
    } else {
      if (nextProps.loading || nextProps.creating || nextProps.deleting || nextProps.updating) {
        return null;
      } else {
        return {
          data: nextProps.termSetting
        };
      }
    }
  }

  componentDidMount() {
    const { loadTermSetting, userOrgId } = this.props;
    loadTermSetting({ orgId: userOrgId });
  }

  handleAdd = () => {
    this.showCreateTermModal();
  };

  handleDelete = key => {
    const data = [...this.state.data];
    const selectedTerm = data.filter(item => item.key == key);
    const { deleteTermSetting, userOrgId } = this.props;
    deleteTermSetting({ body: { termId: selectedTerm[0]._id, orgId: userOrgId } });
  };

  createTerm = termData => {
    const { userOrgId, createTermSetting } = this.props;
    const createdTermData = {
      body: {
        name: termData.name,
        startDate: termData.startDate.valueOf(),
        endDate: termData.endDate.valueOf(),
        districtId: userOrgId
      },
      key: this.state.data.length
    };
    createTermSetting(createdTermData);
    this.setState({ createTermModalVisible: false });
  };

  showCreateTermModal = () => {
    this.setState({ createTermModalVisible: true });
  };

  closeCreateTermModal = () => {
    this.setState({ createTermModalVisible: false });
  };

  updateTerm = termData => {
    const { updateTermSetting, userOrgId } = this.props;
    termData.districtId = userOrgId;
    updateTermSetting({ body: termData });
    this.setState({ selectedKey: -1 });
  };

  showEditTermModal = key => {
    this.setState({
      editTermModalVisible: true,
      selectedKey: key
    });
  };

  closeEditTermModal = () => {
    this.setState({
      editTermModalVisible: false,
      selectedKey: -1
    });
  };

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "name" ? "text" : "date",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: false
        })
      };
    });
    const { data, createTermModalVisible, editTermModalVisible, selectedKey } = this.state;
    const selectedRow = data.filter(item => item.key === selectedKey);
    return (
      <StyledTableContainer>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel
            }}
          />
        </EditableContext.Provider>
        {createTermModalVisible && (
          <CreateTermModal
            modalVisible={createTermModalVisible}
            createTerm={this.createTerm}
            closeModal={this.closeCreateTermModal}
            dataSource={data}
          />
        )}

        {editTermModalVisible && selectedKey >= 0 && (
          <EditTermModal
            modalVisible={editTermModalVisible}
            updateTerm={this.updateTerm}
            closeModal={this.closeEditTermModal}
            termData={selectedRow[0]}
            dataSource={data}
          />
        )}
      </StyledTableContainer>
    );
  }
}

const EditableTermTable = Form.create()(TermTable);

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      termSetting: get(state, ["termReducer", "data"], []),
      loading: get(state, ["termReducer", "loading"], false),
      updating: get(state, ["termReducer", "updating"], false),
      creating: get(state, ["termReducer", "creating"], false),
      deleting: get(state, ["termReducer", "deleting"], false)
    }),
    {
      loadTermSetting: receiveTermAction,
      updateTermSetting: updateTermAction,
      createTermSetting: createTermAction,
      deleteTermSetting: deleteTermAction
    }
  )
);

export default enhance(EditableTermTable);
