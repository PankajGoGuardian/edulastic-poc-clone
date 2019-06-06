import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Popconfirm, Icon, Select, message, Button, Menu, Table } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTableButton,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown
} from "./styled";

import AddStudentModal from "./AddStudentModal/AddStudentModal";
import EditStudentModal from "./EditStudentModal/EditStudentModal";
import InviteMultipleStudentModal from "./InviteMultipleStudentModal/InviteMultipleStudentModal";
import StudentsDetailsModal from "./StudentsDetailsModal/StudentsDetailsModal";

import {
  receiveStudentsListAction,
  updateStudentAction,
  deleteStudentAction,
  setSearchNameAction,
  setFiltersAction,
  addMultiStudentsRequestAction,
  setStudentsDetailsModalVisibleAction
} from "../../ducks";

import { receiveClassListAction } from "../../../Classes/ducks";

import { getStudentsListSelector, createStudentAction } from "../../ducks";
import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";

import { getUserOrgId } from "../../../src/selectors/user";

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

class StudentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      addStudentModalVisible: false,
      editStudentModaVisible: false,
      inviteStudentModalVisible: false,
      editStudentKey: -1,
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
              <StyledTableButton onClick={() => this.onEditStudent(record.key)}>
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
    const { loadSchoolsData, userOrgId, loadStudentsListData, loadClassList } = this.props;
    loadSchoolsData({
      districtId: userOrgId
    });
    loadStudentsListData({
      districtId: userOrgId,
      role: "student",
      limit: 10000 // TODO: Remove limit after pagination done properly
    });

    loadClassList({
      districtId: userOrgId,
      search: {
        institutionIds: [],
        codes: [],
        subjects: [],
        grades: [],
        active: 1
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.studentsList.length === undefined) {
      return {
        dataSource: []
      };
    } else {
      return {
        dataSource: nextProps.studentsList
      };
    }
  }

  onEditStudent = key => {
    this.setState({
      editStudentModaVisible: true,
      editStudentKey: key
    });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    const { userOrgId } = this.props;

    const selectedStudents = data.filter(item => item.key == key);

    const { deleteStudents } = this.props;
    deleteStudents([{ userId: selectedStudents[0]._id, districtId: userOrgId }]);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showAddStudentModal = () => {
    this.setState({
      addStudentModalVisible: true
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
    if (e.key === "add student") {
      this.setState({ addStudentModalVisible: true });
    }
    if (e.key === "edit user") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditStudent(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        const data = [...this.state.dataSource];
        const { userOrgId } = this.props;

        const selectedStudents = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
          const matchedRow = data.filter(row => (row.key = selectedRowKeys[i]));
          if (matchedRow.length > 0) selectedStudents.push({ userId: matchedRow[0]._id, districtId: userOrgId });
        }
        const { deleteStudents } = this.props;
        deleteStudents(selectedStudents);
      } else {
        message.error("Please select users to delete.");
      }
    } else if (e.key === "add students to another class") {
    }
  };

  addStudent = addStudentData => {
    const { userOrgId, createStudent } = this.props;
    addStudentData.role = "student";
    addStudentData.districtId = userOrgId;
    createStudent(addStudentData);
    this.setState({ addStudentModalVisible: false });
  };

  closeAddStudentModal = () => {
    this.setState({
      addStudentModalVisible: false
    });
  };

  updateStudent = updatedStudentData => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => updatedStudentData.key === item.key);
    delete updatedStudentData.key;
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...updatedStudentData
      });
      this.setState({ dataSource: newData });
    } else {
      newData.push(updatedStudentData);
      this.setState({ dataSource: newData });
    }
    this.setState({
      isChangeState: true,
      editStudentModaVisible: false
    });

    const { updateStudent, userOrgId } = this.props;
    updateStudent({
      userId: newData[index]._id,
      data: Object.assign(updatedStudentData, {
        districtId: userOrgId
      })
    });
  };

  closeEditStudentModal = () => {
    this.setState({
      editStudentModaVisible: false
    });
  };

  showInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: true
    });
  };

  sendInviteStudent = inviteStudentList => {
    this.setState({
      inviteStudentModalVisible: false
    });
    const { addMultiStudents, userOrgId } = this.props;
    addMultiStudents({ districtId: userOrgId, data: inviteStudentList });
  };

  closeInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: false
    });
  };

  closeStudentsDetailModal = () => {
    this.props.setStudentsDetailsModalVisible(false);
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
      addStudentModalVisible,
      editStudentModaVisible,
      inviteStudentModalVisible,
      editStudentKey,
      filters,
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { schoolsData, classList, studentDetailsModalVisible } = this.props;
    const selectedStudents = dataSource.filter(item => item.key == editStudentKey);

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add student">Add Student</Menu.Item>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
        <Menu.Item key="add student to another class">Add student(s) to another class</Menu.Item>
      </Menu>
    );

    const isFilterTextDisable = filters.column === "" || filters.value === "";
    const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showInviteStudentModal}>
            + Add Multiple Students
          </Button>
          {inviteStudentModalVisible && (
            <InviteMultipleStudentModal
              modalVisible={inviteStudentModalVisible}
              inviteStudents={this.sendInviteStudent}
              closeModal={this.closeInviteStudentModal}
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
        <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
        {editStudentModaVisible && editStudentKey >= 0 && (
          <EditStudentModal
            studentData={selectedStudents[0]}
            modalVisible={editStudentModaVisible}
            saveStudent={this.updateStudent}
            closeModal={this.closeEditStudentModal}
          />
        )}
        {addStudentModalVisible && (
          <AddStudentModal
            modalVisible={addStudentModalVisible}
            addStudent={this.addStudent}
            closeModal={this.closeAddStudentModal}
            schoolsData={schoolsData}
            classData={classList}
          />
        )}
        {studentDetailsModalVisible && (
          <StudentsDetailsModal modalVisible={studentDetailsModalVisible} closeModal={this.closeStudentsDetailModal} />
        )}
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      studentsList: getStudentsListSelector(state),
      schoolsData: getSchoolsSelector(state),
      classList: get(state, ["classesReducer", "data"], []),
      studentDetailsModalVisible: get(state, ["studentReducer", "studentDetailsModalVisible"], false)
    }),
    {
      createStudent: createStudentAction,
      updateStudent: updateStudentAction,
      deleteStudents: deleteStudentAction,
      loadStudentsListData: receiveStudentsListAction,
      setSearchName: setSearchNameAction,
      setFilters: setFiltersAction,
      loadSchoolsData: receiveSchoolsAction,
      loadClassList: receiveClassListAction,
      addMultiStudents: addMultiStudentsRequestAction,
      setStudentsDetailsModalVisible: setStudentsDetailsModalVisibleAction
    }
  )
);

export default enhance(StudentTable);

StudentTable.propTypes = {
  studentsList: PropTypes.array.isRequired,
  loadStudentsListData: PropTypes.func.isRequired,
  updateStudent: PropTypes.func.isRequired,
  deleteStudents: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  schoolsData: PropTypes.array.isRequired,
  loadClassList: PropTypes.func.isRequired
};
