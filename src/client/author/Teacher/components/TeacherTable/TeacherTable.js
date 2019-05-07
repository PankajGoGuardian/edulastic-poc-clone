import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { Popconfirm, Icon, Select, message, Button, Menu } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTable,
  StyledTableButton,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown
} from "./styled";

import AddTeacherModal from "./AddTeacherModal/AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal/EditTeacherModal";
import InviteMultipleTeacherModal from "./InviteMultipleTeacherModal/InviteMultipleTeacherModal";

import {
  receiveTeachersListAction,
  createTeacherAction,
  updateTeacherAction,
  deleteTeacherAction,
  setSearchNameAction,
  setFiltersAction
} from "../../ducks";

import { getTeachersListSelector } from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

class TeacherTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      addTeacherModalVisible: false,
      editTeacherModaVisible: false,
      inviteTeacherModalVisible: false,
      editTeacherKey: -1,
      filters: {
        column: "",
        value: "",
        text: ""
      },
      filterAdded: false
    };
    this.columns = [
      {
        title: "First Name",
        dataIndex: "firstName",
        editable: true,
        sorter: (a, b) => compareByAlph(a.firstName, b.secondName)
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        editable: true,
        sorter: (a, b) => compareByAlph(a.lastName, b.lastName)
      },
      {
        title: "Email",
        dataIndex: "email",
        editable: true,
        sorter: (a, b) => compareByAlph(a.email, b.email)
      },
      {
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditTeacher(record.key)}>
                <Icon type="edit" theme="twoTone" />
              </StyledTableButton>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <StyledTableButton>
                  <Icon type="delete" theme="twoTone" />
                </StyledTableButton>
              </Popconfirm>
            </React.Fragment>
          );
        }
      }
    ];
  }

  componentDidMount() {
    const { loadTeachersListData } = this.props;
    loadTeachersListData({
      type: "DISTRICT",
      search: {
        role: "teacher"
      }
    });

    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({ body: { districtId: userOrgId } });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.teachersList.length === undefined) return { dataSource: [] };
    else return { dataSource: nextProps.teachersList };
  }

  onEditTeacher = key => {
    this.setState({
      editTeacherModaVisible: true,
      editTeacherKey: key
    });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    const { userOrgId } = this.props;

    const selectedTeachers = data.filter(item => item.key == key);

    const { deleteTeachers } = this.props;
    deleteTeachers([{ userId: selectedTeachers[0]._id, districtId: userOrgId }]);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showAddTeacherModal = () => {
    this.setState({
      addTeacherModalVisible: true
    });
  };

  changeFilterColumn = value => {
    const filtersData = this.state.filters;
    filtersData.column = value;
    this.setState({ filters: filtersData });
  };

  changeFilterValue = value => {
    const filtersData = this.state.filters;
    filtersData.value = value;
    this.setState({ filters: filtersData });
  };

  changeFilterText = e => {
    const filtersData = this.state.filters;
    filtersData.text = e.target.value;
    this.setState({ filters: filtersData });
  };

  addFilter = e => {
    const { filters } = this.state;
    const { setFilters } = this.props;
    this.setState({ filterAdded: true });
    setFilters(filters);
  };

  removeFilter = e => {
    const filtersData = {
      column: "",
      value: "",
      text: ""
    };

    this.setState({
      filters: filtersData,
      filterAdded: false
    });
    const { setFilters } = this.props;
    setFilters(filtersData);
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    if (e.key === "add teacher") {
      this.setState({ addTeacherModalVisible: true });
    }
    if (e.key === "edit user") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditTeacher(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        const data = [...this.state.dataSource];
        const { userOrgId } = this.props;

        const selectedTeachers = [];
        selectedRowKeys.map(value => {
          selectedTeachers.push({ userId: data[value]._id, districtId: userOrgId });
        });
        const { deleteTeachers } = this.props;
        deleteTeachers(selectedTeachers);
      } else {
        message.error("Please select users to delete.");
      }
    }
  };

  addTeacher = addTeacherData => {
    const { userOrgId, createTeacher } = this.props;
    addTeacherData.role = "teacher";
    addTeacherData.districtId = userOrgId;
    createTeacher(addTeacherData);
    this.setState({ addTeacherModalVisible: false });
  };

  closeAddTeacherModal = () => {
    this.setState({
      addTeacherModalVisible: false
    });
  };

  updateTeacher = updatedTeacherData => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => updatedTeacherData.key === item.key);
    delete updatedTeacherData.key;
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...updatedTeacherData
      });
      this.setState({ dataSource: newData });
    } else {
      newData.push(updatedTeacherData);
      this.setState({ dataSource: newData });
    }
    this.setState({
      isChangeState: true,
      editTeacherModaVisible: false
    });

    const { updateTeacher } = this.props;
    updateTeacher({ userId: newData[index]._id, data: updatedTeacherData });
  };

  closeEditTeacherModal = () => {
    this.setState({
      editTeacherModaVisible: false
    });
  };

  showInviteTeacherModal = () => {
    this.setState({
      inviteTeacherModalVisible: true
    });
  };

  sendInviteTeacher = inviteTeacherList => {
    this.setState({
      inviteTeacherModalVisible: false
    });
  };

  closeInviteTeacherModal = () => {
    this.setState({
      inviteTeacherModalVisible: false
    });
  };

  searchByName = e => {
    const { setSearchName } = this.props;
    setSearchName(e);
  };

  render() {
    const columns = this.columns.map(col => {
      return {
        ...col
      };
    });

    const {
      dataSource,
      selectedRowKeys,
      addTeacherModalVisible,
      editTeacherModaVisible,
      inviteTeacherModalVisible,
      editTeacherKey,
      filters,
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { schoolsData } = this.props;

    const selectedTeachers = dataSource.filter(item => item.key == editTeacherKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add teacher">Add Teacher</Menu.Item>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    const isFilterTextDisable = filters.column === "" || filters.value === "";
    const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showInviteTeacherModal}>
            + Invite Multiple Teachers
          </Button>
          {inviteTeacherModalVisible && (
            <InviteMultipleTeacherModal
              modalVisible={inviteTeacherModalVisible}
              inviteTeachers={this.sendInviteTeacher}
              closeModal={this.closeInviteTeacherModal}
            />
          )}
          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />

          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        <StyledControlDiv>
          <StyledFilterSelect placeholder="Select a column" onChange={this.changeFilterColumn} value={filters.column}>
            <Option value="">Select a column</Option>
            <Option value="firstName">Frist Name</Option>
            <Option value="lastName">Last Name</Option>
            <Option value="email">Email</Option>
          </StyledFilterSelect>
          <StyledFilterSelect placeholder="Select a value" onChange={this.changeFilterValue} value={filters.value}>
            <Option value="">Select a value</Option>
            <Option value="equals">Equals</Option>
            <Option value="contains">Contains</Option>
          </StyledFilterSelect>
          <StyledFilterInput
            placeholder="Enter text"
            onChange={this.changeFilterText}
            value={filters.text}
            disabled={isFilterTextDisable}
          />
          <StyledAddFilterButton type="primary" onClick={this.addFilter} disabled={isAddFilterDisable}>
            + Add Filter
          </StyledAddFilterButton>
          {filterAdded && (
            <StyledAddFilterButton type="primary" onClick={this.removeFilter}>
              - Remove Filter
            </StyledAddFilterButton>
          )}
        </StyledControlDiv>
        <StyledTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
        {editTeacherModaVisible && editTeacherKey >= 0 && (
          <EditTeacherModal
            teacherData={selectedTeachers[0]}
            modalVisible={editTeacherModaVisible}
            saveTeacher={this.updateTeacher}
            closeModal={this.closeEditTeacherModal}
          />
        )}
        {addTeacherModalVisible && (
          <AddTeacherModal
            modalVisible={addTeacherModalVisible}
            addTeacher={this.addTeacher}
            closeModal={this.closeAddTeacherModal}
            schoolsData={schoolsData}
          />
        )}
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      teachersList: getTeachersListSelector(state),
      schoolsData: getSchoolsSelector(state)
    }),
    {
      createTeacher: createTeacherAction,
      updateTeacher: updateTeacherAction,
      deleteTeacher: deleteTeacherAction,
      loadTeachersListData: receiveTeachersListAction,
      setSearchName: setSearchNameAction,
      setFilters: setFiltersAction,
      loadSchoolsData: receiveSchoolsAction
    }
  )
);

export default enhance(TeacherTable);

TeacherTable.propTypes = {
  teachersList: PropTypes.array.isRequired,
  loadTeachersListData: PropTypes.func.isRequired,
  createTeacher: PropTypes.func.isRequired,
  updateTeacher: PropTypes.func.isRequired,
  deleteTeacher: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  schoolsData: PropTypes.array.isRequired
};
