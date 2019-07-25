import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, split, unset, pickBy, identity } from "lodash";
import * as moment from "moment";
import { Checkbox, Icon, Select, message, Button, Menu, Table } from "antd";
import { TypeToConfirmModal } from "@edulastic/common";
import { getUserFeatures } from "../../../../student/Login/ducks";

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTableButton,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown,
  StyledClassName
} from "./styled";

import AddStudentModal from "../../../ManageClass/components/ClassDetails/AddStudent/AddStudentModal";
import EditStudentModal from "./EditStudentModal/EditStudentModal";
import InviteMultipleStudentModal from "./InviteMultipleStudentModal/InviteMultipleStudentModal";
import StudentsDetailsModal from "./StudentsDetailsModal/StudentsDetailsModal";
import AddStudentsToOtherClass from "./AddStudentToOtherClass";

import {
  addMultiStudentsRequestAction,
  setStudentsDetailsModalVisibleAction,
  getAddStudentsToOtherClassSelector,
  setAddStudentsToOtherClassVisiblityAction,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction
} from "../../ducks";

import { receiveClassListAction } from "../../../Classes/ducks";

import {
  receiveAdminDataAction,
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction,
  setSearchNameAction,
  getAdminUsersDataSelector,
  getShowActiveUsersSelector,
  setShowActiveUsersAction,
  getPageNoSelector,
  setPageNoAction,
  getFiltersSelector,
  changeFilterColumnAction,
  changeFilterTypeAction,
  changeFilterValueAction,
  addFilterAction,
  removeFilterAction,
  setRoleAction
} from "../../../SchoolAdmin/ducks";

import { receiveSchoolsAction } from "../../../Schools/ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const { Option } = Select;

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

class StudentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      addStudentModalVisible: false,
      editStudentModaVisible: false,
      inviteStudentModalVisible: false,
      editStudentKey: "",
      selectedAdminsForDeactivate: [],
      deactivateAdminModalVisible: false
    };
    this.columns = [
      {
        title: "Name",
        render: (_, { _source: { firstName, lastName } = {} }) => (
          <span>
            {firstName} {lastName}
          </span>
        ),
        sorter: (a, b) => compareByAlph(a.firstName, b.secondName)
      },
      {
        title: "Username",
        dataIndex: "_source.email",
        sorter: (a, b) => compareByAlph(a.email, b.email)
      },
      {
        title: "SSO",
        dataIndex: "_source.sso",
        render: (sso = "N/A") => sso
      },
      {
        title: "School",
        dataIndex: "_source.institutionDetails",
        render: (schools = []) => schools.map(school => school.name)
      },
      {
        title: "Classes",
        dataIndex: "classCount"
      },
      {
        dataIndex: "_id",
        render: id => [
          <StyledTableButton key={`${id}0`} onClick={() => this.onEditStudent(id)}>
            <Icon type="edit" theme="twoTone" />
          </StyledTableButton>,
          <StyledTableButton key={`${id}1`} onClick={() => this.handleDeactivateAdmin(id)}>
            <Icon type="delete" theme="twoTone" />
          </StyledTableButton>
        ]
      }
    ];
  }

  componentDidMount() {
    const { loadClassList, loadSchoolsData, loadAdminData, setRole, userOrgId } = this.props;
    setRole("student");
    loadAdminData();
    loadSchoolsData({
      districtId: userOrgId
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

  static getDerivedStateFromProps(nextProps, state) {
    const {
      adminUsersData: { result }
    } = nextProps;
    return {
      selectedRowKeys: state.selectedRowKeys.filter(rowKey => !!result[rowKey])
    };
  }

  componentDidUpdate(prevProps) {
    const { loadAdminData, showActiveUsers, pageNo } = this.props;
    // here when the showActiveUsers checkbox is toggled, or the page number changes,
    // an api call is fired to get the data
    if (showActiveUsers !== prevProps.showActiveUsers || pageNo !== prevProps.pageNo) {
      loadAdminData();
    }
  }

  onEditStudent = key => {
    this.setState({
      editStudentModaVisible: true,
      editStudentKey: key
    });
  };

  handleDeactivateAdmin = id => {
    this.setState({
      selectedAdminsForDeactivate: [id],
      deactivateAdminModalVisible: true
    });
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedAdminsForDeactivate } = this.state;
    deleteAdminUser({ userIds: selectedAdminsForDeactivate, role: "student" });
    this.setState({
      deactivateAdminModalVisible: false
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showAddStudentModal = () => {
    this.setState({
      addStudentModalVisible: true
    });
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    const { setAddStudentsToOtherClassVisiblity } = this.props;
    if (e.key === "add student") {
      this.setState({ addStudentModalVisible: true });
    }
    if (e.key === "edit user") {
      if (selectedRowKeys.length === 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length === 1) {
        this.onEditStudent(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true
        });
      } else {
        message.error("Please select users to delete.");
      }
    } else if (e.key === "addStudentsToAnotherClass") {
      if (selectedRowKeys.length) {
        setAddStudentsToOtherClassVisiblity(true);
      } else {
        message.error("Please select atleast 1 user");
      }
    }
  };

  addStudent = () => {
    if (this.formRef) {
      const { userOrgId: districtId, createAdminUser } = this.props;
      const { form } = this.formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName, email, password } = values;
          const tempName = split(fullName, " ");
          const firstName = tempName[0];
          const lastName = tempName[1];
          values.districtId = districtId;
          values.firstName = firstName;
          values.lastName = lastName;

          const contactEmails = get(values, "contactEmails");
          if (contactEmails) {
            values.contactEmails = [contactEmails];
          }

          if (values.dob) {
            values.dob = moment(values.dob).format("x");
          }
          unset(values, ["confirmPassword"]);
          unset(values, ["fullName"]);
          createAdminUser(pickBy(values, identity));
          this.setState({ addStudentModalVisible: false });
        }
      });
    }
  };

  closeAddStudentModal = () => {
    this.setState({
      addStudentModalVisible: false
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
  saveFormRef = node => {
    this.formRef = node;
  };
  render() {
    const {
      selectedRowKeys,
      addStudentModalVisible,
      editStudentModaVisible,
      inviteStudentModalVisible,
      editStudentKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const {
      adminUsersData: { result = {}, totalUsers },
      userOrgId,
      setShowActiveUsers,
      showActiveUsers,
      updateAdminUser,
      pageNo,
      setPageNo,
      filters,
      changeFilterColumn,
      changeFilterType,
      changeFilterValue,
      loadAdminData,
      addFilter,
      removeFilter,
      // schoolsData,
      // classList,
      studentDetailsModalVisible,
      addStudentsToOtherClassData,
      setAddStudentsToOtherClassVisiblity,
      putStudentsToOtherClass,
      fetchClassDetailsUsingCode,
      features
    } = this.props;

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add student">Add Student</Menu.Item>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
        <Menu.Item key="addStudentsToAnotherClass">Add student(s) to another class</Menu.Item>
      </Menu>
    );

    const filterKeysArray = Object.keys(filters);

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
              features={features}
            />
          )}
          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />
          <Checkbox checked={showActiveUsers} onChange={evt => setShowActiveUsers(evt.target.checked)}>
            Show current users only
          </Checkbox>
          <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {filterKeysArray.map(filterKey => {
          const { type, value } = filters[filterKey];
          return (
            <StyledControlDiv key={filterKey}>
              <StyledFilterSelect
                placeholder="Select a column"
                onChange={filterColumn => changeFilterColumn({ prevKey: filterKey, newKey: filterColumn })}
                value={filterKey}
              >
                <Option value="other">Select a column</Option>
                <Option value="username">Username</Option>
                <Option value="email">Email</Option>
              </StyledFilterSelect>
              <StyledFilterSelect
                placeholder="Select a value"
                onChange={filterType => changeFilterType({ key: filterKey, value: filterType })}
                value={type}
              >
                <Option value="">Select a value</Option>
                <Option value="eq">Equals</Option>
                <Option value="cont">Contains</Option>
              </StyledFilterSelect>
              <StyledFilterInput
                placeholder="Enter text"
                onChange={({ target }) => changeFilterValue({ key: filterKey, value: target.value })}
                value={value}
                disabled={!type}
                onSearch={loadAdminData}
              />
              <StyledAddFilterButton type="primary" onClick={addFilter} disabled={!!filters.other}>
                + Add Filter
              </StyledAddFilterButton>
              <StyledAddFilterButton
                type="primary"
                disabled={filterKey === "other" || filterKeysArray.length === 1}
                onClick={() => {
                  removeFilter(filterKey);
                  loadAdminData();
                }}
              >
                - Remove Filter
              </StyledAddFilterButton>
            </StyledControlDiv>
          );
        })}
        <Table
          rowKey={record => record._id}
          rowSelection={rowSelection}
          dataSource={Object.values(result)}
          columns={this.columns}
          pagination={{
            current: pageNo,
            total: totalUsers,
            pageSize: 25,
            onChange: page => setPageNo(page)
          }}
        />
        {editStudentModaVisible && (
          <EditStudentModal
            userOrgId={userOrgId}
            studentData={result[editStudentKey]}
            modalVisible={editStudentModaVisible}
            saveStudent={updateAdminUser}
            closeModal={this.closeEditStudentModal}
          />
        )}
        {addStudentModalVisible && (
          <AddStudentModal
            handleAdd={this.addStudent}
            handleCancel={this.closeAddStudentModal}
            isOpen={addStudentModalVisible}
            submitted={false}
            wrappedComponentRef={this.saveFormRef}
            showClassCodeField={true}
            fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          />
        )}
        {studentDetailsModalVisible && (
          <StudentsDetailsModal modalVisible={studentDetailsModalVisible} closeModal={this.closeStudentsDetailModal} />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following student(s)?"
            secondaryLabel={selectedAdminsForDeactivate.map(id => {
              const { _source: { firstName, lastName } = {} } = result[id];
              return (
                <StyledClassName key={id}>
                  {firstName} {lastName}
                </StyledClassName>
              );
            })}
            closeModal={() =>
              this.setState({
                deactivateAdminModalVisible: false
              })
            }
          />
        )}
        <AddStudentsToOtherClass
          {...addStudentsToOtherClassData}
          handleSubmit={classCode => putStudentsToOtherClass({ classCode, userDetails: selectedRowKeys })}
          onCloseModal={() => setAddStudentsToOtherClassVisiblity(false)}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
        />
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      // schoolsData: getSchoolsSelector(state),
      // classList: get(state, ["classesReducer", "data"], []),
      studentDetailsModalVisible: get(state, ["studentReducer", "studentDetailsModalVisible"], false),
      adminUsersData: getAdminUsersDataSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state),
      features: getUserFeatures(state)
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      loadClassList: receiveClassListAction,
      addMultiStudents: addMultiStudentsRequestAction,
      setStudentsDetailsModalVisible: setStudentsDetailsModalVisibleAction,
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
      setShowActiveUsers: setShowActiveUsersAction,
      setPageNo: setPageNoAction,
      /**
       * Action to set the filter Column.
       * @param {string} str1 The previous value held by the select.
       * @param {string} str2 The new value that is to be set in the select
       */
      changeFilterColumn: changeFilterColumnAction,
      changeFilterType: changeFilterTypeAction,
      changeFilterValue: changeFilterValueAction,
      addFilter: addFilterAction,
      removeFilter: removeFilterAction,
      setRole: setRoleAction,
      setAddStudentsToOtherClassVisiblity: setAddStudentsToOtherClassVisiblityAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction
    }
  )
);

export default enhance(StudentTable);
