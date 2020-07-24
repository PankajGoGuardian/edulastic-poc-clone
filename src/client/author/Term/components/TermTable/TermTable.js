import { CustomModalStyled, EduButton } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { DatePicker, Form, Icon, Input, Table } from "antd";
import { get } from "lodash";
import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
// selectors
import { createTermAction, deleteTermAction, receiveTermAction, updateTermAction } from "../../ducks";
import CreateTermModal from "./CreateTermModal/CreateTermModal";
import EditTermModal from "./EditTermModal/EditTermModal";
import {
  DeleteTermModalFooterDiv,
  StyledAddButton,
  StyledButton,
  StyledDeleteButton,
  StyledPagination,
  StyledTableContainer
} from "./styled";

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
                          message: `Please Input ${  title  }!`
                        }
                      ],
                      initialValue: record[dataIndex]
                    })(<Input />)
                    : getFieldDecorator(dataIndex, {
                      rules: [{ required: true, message: `Please Input ${  title  }!` }],
                      initialValue: moment(record[dataIndex], "DD MMM YYYY")
                    })(<DatePicker format="DD MMM YYYY" />)}
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
      editTermModalVisible: false,
      deleteTermModalVisible: false,
      currentPage: 1
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
              <StyledDeleteButton disabled={deleteDisabled}>
                <Icon
                  type="delete"
                  onClick={() => {
                    this.setState({
                      selectedKey: record.key,
                      deleteTermModalVisible: true
                    });
                  }}
                />
              </StyledDeleteButton>
            </React.Fragment>
          );
        }
      }
    ];
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.termSetting.length === undefined) {
      return {
        data: []
      };
    }
    if (nextProps.loading || nextProps.creating || nextProps.deleting || nextProps.updating) {
      return null;
    }
    return {
      data: nextProps.termSetting
    };


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
    this.setState({
      deleteTermModalVisible: false
    });
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

  changePagination = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const readOnly = this.props.role === roleuser.SCHOOL_ADMIN;

    const colLength = this.columns.length;
    /**
     * excluding the last Column if readOnly
     */
    const columns = this.columns.slice(0, readOnly ? colLength - 1 : colLength).map(col => {
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
    const {
      data,
      createTermModalVisible,
      editTermModalVisible,
      selectedKey,
      deleteTermModalVisible,
      currentPage
    } = this.state;
    const selectedTerm = data.find(item => item.key === selectedKey);
    const { termSetting: termsData } = this.props;
    return (
      <StyledTableContainer>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={termsData ? termsData.length : 0}
            onChange={this.changePagination}
            hideOnSinglePage
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
            termData={selectedTerm}
            dataSource={data}
          />
        )}
        {deleteTermModalVisible && selectedKey >= 0 && (
          <div>
            <CustomModalStyled
              title="Delete School Year"
              visible={deleteTermModalVisible}
              destroyOnClose
              centered
              onCancel={() =>
                this.setState({
                  deleteTermModalVisible: false
                })
              }
              footer={[
                <DeleteTermModalFooterDiv>
                  <EduButton
                    isGhost
                    key="back"
                    onClick={() =>
                      this.setState({
                        deleteTermModalVisible: false
                      })
                    }
                  >
                    No, Cancel
                  </EduButton>
                  <EduButton key="submit" type="primary" onClick={() => this.handleDelete(selectedKey)}>
                    Yes, Delete
                  </EduButton>
                </DeleteTermModalFooterDiv>
              ]}
            >
              <p style={{ textAlign: "center" }}>
                {`Are you sure you want to delete ${selectedTerm && selectedTerm.name} - school year?`}
              </p>
            </CustomModalStyled>
          </div>
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
      role: getUserRole(state),
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
