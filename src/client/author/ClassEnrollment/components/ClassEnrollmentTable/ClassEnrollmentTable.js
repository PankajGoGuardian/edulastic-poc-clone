import React from "react";
import { Icon, message, Button, Menu, Select } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, unset, pickBy, identity, uniqBy, isEmpty } from "lodash";
import moment from "moment";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";
import { AddNewUserModal } from "../Common/AddNewUser";
import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTable,
  StyledFilterInput,
  StyledSearch,
  StyledActionDropDown,
  StyledPagination,
  StyledFilterButton,
  UserNameContainer,
  UserName,
  StyledTableButton
} from "./styled";

import { createAdminUserAction, deleteAdminUserAction } from "../../../SchoolAdmin/ducks";
import { getUserOrgId, getUser } from "../../../src/selectors/user";
import { getFullNameFromString } from "../../../../common/utils/helpers";
import { getClassEnrollmentUsersSelector, getClassEnrollmentUsersCountSelector } from "../../ducks";

import { AddStudentsToOtherClassModal } from "../../../Student/components/StudentTable/AddStudentToOtherClass";
import { AddStudentsToOtherClassModal as MoveUsersToOtherClassModal } from "../../../Student/components/StudentTable/AddStudentToOtherClass";
import {
  getAddStudentsToOtherClassSelector,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction,
  moveUsersToOtherClassAction
} from "../../../Student/ducks";

const { Option } = Select;

class ClassEnrollmentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      filtersData: [
        {
          filtersColumn: "",
          filtersValue: "",
          filterStr: "",
          filterAdded: false
        }
      ],
      currentPage: 1,
      confirmText: "",
      defaultText: "REMOVE",
      addUserFormModalVisible: false,
      removeStudentsModalVisible: false,
      selectedUserIds: [],
      selectedUsersInfo: [],
      addStudentsModalVisible: false,
      moveUsersModalVisible: false
    };
  }

  componentDidMount() {
    const { dataPassedWithRoute } = this.props;
    if (!isEmpty(dataPassedWithRoute)) {
      this.setState({ filtersData: [{ ...dataPassedWithRoute }] }, this.loadClassEnrollmentList);
    } else {
      this.loadClassEnrollmentList();
    }
  }

  renderUserNames() {
    const { selectedUsersInfo } = this.state;
    return (
      <UserNameContainer>
        {selectedUsersInfo.map(item => {
          const username = get(item, "user.username");
          return <UserName key={username}>{username}</UserName>;
        })}
      </UserNameContainer>
    );
  }
  onInputChangeHandler = ({ target }) => this.setState({ confirmText: target.value });

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { classEnrollmentData } = this.props;
    const selectedUserIds = selectedRows.map(item => item.id);
    const selectedUsersInfo = classEnrollmentData.filter(data => {
      const code = get(data, "group.code");
      const userId = get(data, "user._id");
      const recordMatch = selectedRows.find(r => r.code === code && r.id === userId);
      if (recordMatch) return true;
    });
    this.setState({ selectedRowKeys, selectedUserIds, selectedUsersInfo });
  };

  changeActionMode = e => {
    const { selectedRowKeys, selectedUsersInfo } = this.state;
    const isInstructor = selectedUsersInfo.some(user => user.role === "teacher");
    const areUsersOfDifferentClasses = uniqBy(selectedUsersInfo, "group.code").length > 1;
    if (e.key === "remove students") {
      if (selectedRowKeys.length == 0) {
        message.error("Select 1 or more Student to remove");
      } else if (selectedRowKeys.length > 0) {
        if (isInstructor) {
          message.error("Only student can be removed");
        } else {
          this.setState({
            removeStudentsModalVisible: true
          });
        }
      }
    } else if (e.key === "move users") {
      if (selectedRowKeys.length == 0) {
        message.error("You have not selected any users to move");
      } else if (areUsersOfDifferentClasses) {
        message.error("You can only move users of same class");
      } else if (selectedRowKeys.length >= 1) {
        this.setState({ moveUsersModalVisible: true });
      }
    } else if (e.key === "add students to other class") {
      if (selectedRowKeys.length == 0) {
        message.error("Select 1 or more student to add");
      } else if (selectedRowKeys.length > 0) {
        if (isInstructor) {
          message.error("Only students can be added to another class");
        } else {
          this.setState({ addStudentsModalVisible: true });
        }
      }
    }
  };

  saveFormRef = node => {
    this.formRef = node;
  };

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //
  addNewUser = () => {
    if (this.formRef) {
      const { userOrgId: districtId, createAdminUser } = this.props;
      const { form } = this.formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName, role } = values;
          let name = getFullNameFromString(fullName);
          values.firstName = name.firstName;
          values.middleName = name.middleName;
          values.lastName = name.lastName;

          const contactEmails = get(values, "contactEmails");

          if (role === "teacher") {
            let institutionIds = [];
            for (let i = 0; i < values.institutionIds.length; i++) {
              institutionIds.push(values.institutionIds[i].key);
            }
          }

          if (contactEmails) {
            values.contactEmails = [contactEmails];
          }
          if (values.dob) {
            values.dob = moment(values.dob).format("x");
          }
          unset(values, ["confirmPassword"]);
          unset(values, ["fullName"]);
          let o = {
            createReq: pickBy(values, identity),
            listReq: {
              districtId,
              limit: 25,
              page: 1
            },
            classEnrollmentPage: true
          };
          createAdminUser(o);
          this.onCloseAddNewUserModal();
        }
      });
    }
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedUserIds: userIds } = this.state;
    const o = {
      deleteReq: { userIds, role: "student" },
      listReq: this.getSearchQuery(),
      classEnrollmentPage: true
    };
    deleteAdminUser(o);
    this.setState({
      removeStudentsModalVisible: false,
      selectedRowKeys: [],
      selectedUserIds: [],
      selectedUsersInfo: []
    });
  };

  onCancelRemoveStudentsModal = () => {
    this.setState({
      removeStudentsModalVisible: false,
      selectedRowKeys: [],
      selectedUserIds: [],
      selectedUsersInfo: []
    });
  };

  onCloseAddNewUserModal = () => {
    const { resetClassDetails } = this.props;
    resetClassDetails();
    this.setState({
      addUserFormModalVisible: false
    });
  };
  onOpenaddNewUserModal = () => {
    this.setState({
      addUserFormModalVisible: true
    });
  };

  onCloseAddStudentsToOtherClassModal = () => {
    const { resetClassDetails } = this.props;
    this.setState({ addStudentsModalVisible: false });
    resetClassDetails();
  };
  onCloseMoveUsersToOtherClassModal = () => {
    const { resetClassDetails } = this.props;
    this.setState({ moveUsersModalVisible: false });
    resetClassDetails();
  };

  handleDeactivateUser = record => {
    const { id, role, code } = record;
    const { classEnrollmentData } = this.props;
    const selectedUsersInfo = classEnrollmentData.filter(data => {
      const _classCode = get(data, "group.code");
      const userId = get(data, "user._id");
      return _classCode === code && userId === id;
    });
    if (role === "teacher") {
      message.error("Please select only student to remove");
    } else {
      this.setState({
        selectedUserIds: [id],
        selectedUsersInfo,
        removeStudentsModalVisible: true
      });
    }
  };
  setPageNo = page => {
    this.setState({ currentPage: page }, this.loadClassEnrollmentList);
  };

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //
  changeFilterColumn = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (key === index) {
        let _item = {
          ...item,
          filtersColumn: value
        };
        if (value === "role") _item.filtersValue = "eq";
        return _item;
      }
      return item;
    });
    this.setState({ filtersData: _filtersData });
  };
  changeFilterValue = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filtersValue: value
        };
      }
      return item;
    });

    this.setState({ filtersData: _filtersData });
  };
  changeRoleValue = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: value,
          filterAdded: value !== "" ? true : false
        };
      }
      return item;
    });

    this.setState({ filtersData: _filtersData }, this.loadClassEnrollmentList);
  };
  changeFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: e.target.value
        };
      }
      return item;
    });
    this.setState({ filtersData: _filtersData });
  };

  addFilter = (e, key) => {
    const { filtersData } = this.state;
    if (filtersData.length < 3) {
      this.setState(state => ({
        filtersData: [
          ...state.filtersData,
          {
            filtersColumn: "",
            filtersValue: "",
            filterStr: "",
            filterAdded: false
          }
        ]
      }));
    }
  };
  removeFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    let newFiltersData;
    if (filtersData.length === 1) {
      newFiltersData = [
        {
          filterAdded: false,
          filtersColumn: "",
          filtersValue: "",
          filterStr: ""
        }
      ];
    } else {
      newFiltersData = filtersData.filter((item, index) => index !== key);
    }
    this.setState({ filtersData: newFiltersData }, this.loadClassEnrollmentList);
  };
  loadClassEnrollmentList = () => {
    const { receiveClassEnrollmentList } = this.props;
    receiveClassEnrollmentList(this.getSearchQuery());
  };

  getSearchQuery = () => {
    const { userOrgId: districtId, userDetails } = this.props;
    const { filtersData, searchByName, currentPage } = this.state;

    let search = {};
    for (let [index, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item;
      if (filtersColumn !== "" && filtersValue !== "" && filterStr !== "") {
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }];
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr });
        }
      }
    }
    if (searchByName) {
      search["name"] = [{ type: "cont", value: searchByName }];
    }
    const data = {
      search,
      districtId,
      limit: 25,
      page: currentPage
      // uncomment after elastic search is fixed
      // sortField,
      // order
    };
    if (userDetails) {
      Object.assign(data, { institutionIds: userDetails.institutionIds });
    }
    return data;
  };
  onBlurFilterText = (event, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterAdded: event.target.value ? true : false
        };
      }
      return item;
    });
    this.setState(state => ({ filtersData: _filtersData }), this.loadClassEnrollmentList);
  };

  onChangeSearch = event => {
    this.setState({ searchByName: event.currentTarget.value });
  };

  handleSearchName = value => {
    this.setState({ searchByName: value }, this.loadClassEnrollmentList);
  };

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      filtersData,
      selectedRowKeys,
      defaultText,
      confirmText,
      removeStudentsModalVisible,
      addUserFormModalVisible,
      selectedUserIds,
      selectedUsersInfo,
      addStudentsModalVisible,
      moveUsersModalVisible,
      currentPage,
      pageNo
    } = this.state;
    const {
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      classEnrollmentData,
      addStudentsToOtherClassData,
      putStudentsToOtherClass,
      userOrgId,
      moveUsersToOtherClass,
      resetClassDetails,
      totalUsers
    } = this.props;

    const tableDataSource = classEnrollmentData.map(item => {
      const key = `${get(item, "user._id")} ${get(item, "group.code", "")}`;
      const id = get(item, "user._id");
      const role = get(item, "role", "");
      const code = get(item, "group.code", "");
      const name = get(item, "group.name", "");
      const firstName = get(item, "user.firstName", "");
      const middleName = get(item, "user.middleName", "");
      const lastName = get(item, "user.lastName", "");
      const username = get(item, "user.username", "");
      const obj = {
        key,
        id,
        role,
        code,
        name,
        fullName: [firstName, middleName, lastName].join(" "),
        username
      };
      return obj;
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="remove students">Remove Selected Student(s)</Menu.Item>
        <Menu.Item key="move users">Move User(s)</Menu.Item>
        <Menu.Item key="add students to other class">Add Student(s) to another Class</Menu.Item>
      </Menu>
    );
    const columnsData = [
      {
        title: "Class Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 200
      },
      {
        title: "Class Code",
        dataIndex: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        width: 200
      },
      {
        title: "Full Name",
        dataIndex: "fullName",
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        width: 200
      },
      {
        title: "Username",
        dataIndex: "username",
        sorter: (a, b) => a.username.localeCompare(b.username),
        width: 200
      },
      {
        title: "Role",
        dataIndex: "role",
        sorter: (a, b) => a.role.localeCompare(b.role),
        width: 200
      },
      {
        dataIndex: "id",
        render: (_, record) => {
          return (
            <StyledTableButton key={record.key} onClick={() => this.handleDeactivateUser(record)} title="Deactivate">
              <Icon type="delete" theme="twoTone" />
            </StyledTableButton>
          );
        },
        textWrap: "word-break",
        width: 100
      }
    ];
    const roleFilterOptions = ["Teacher", "Student"];
    const SearchRows = [];
    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr, filterAdded } = filtersData[i];
      const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
      const isAddFilterDisable = filtersColumn === "" || filtersValue === "" || filterStr === "" || !filterAdded;

      const optValues = [];
      if (filtersColumn === "role") {
        optValues.push(<Option value="eq">Equals</Option>);
      } else {
        optValues.push(
          <Option value="" disabled={true}>
            Select a value
          </Option>
        );
        optValues.push(<Option value="eq">Equals</Option>);
        optValues.push(<Option value="cont">Contains</Option>);
      }

      SearchRows.push(
        <StyledControlDiv>
          <StyledFilterSelect
            placeholder="Select a column"
            onChange={e => this.changeFilterColumn(e, i)}
            value={filtersColumn}
          >
            <Option value="" disabled={true}>
              Select a column
            </Option>
            <Option value="code">Class Code</Option>
            <Option value="fullName">Full Name</Option>
            <Option value="username">Username</Option>
            <Option value="role">Role</Option>
          </StyledFilterSelect>
          <StyledFilterSelect
            placeholder="Select a value"
            onChange={e => this.changeFilterValue(e, i)}
            value={filtersValue}
          >
            {optValues}
          </StyledFilterSelect>
          {filtersColumn === "role" ? (
            <StyledFilterSelect
              placeholder="Select a value"
              onChange={v => this.changeRoleValue(v, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            >
              {roleFilterOptions.map(item => (
                <Option key={item} value={item.toLowerCase()}>
                  {item}
                </Option>
              ))}
            </StyledFilterSelect>
          ) : (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
              onBlur={e => this.onBlurFilterText(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            />
          )}
          {i < 2 && (
            <StyledFilterButton
              type="primary"
              onClick={e => this.addFilter(e, i)}
              disabled={isAddFilterDisable || i < filtersData.length - 1}
            >
              + Add Filter
            </StyledFilterButton>
          )}
          {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
            <StyledFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
              - Remove Filter
            </StyledFilterButton>
          )}
        </StyledControlDiv>
      );
    }

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.onOpenaddNewUserModal}>
            + Add New User
          </Button>

          <StyledSearch
            placeholder="Search by class name"
            onSearch={this.handleSearchName}
            onChange={this.onChangeSearch}
          />
          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable
          rowSelection={rowSelection}
          dataSource={tableDataSource}
          columns={columnsData}
          pagination={false}
          scroll={{ y: 500 }}
        />
        <StyledPagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={25}
          total={totalUsers}
          hideOnSinglePage={true}
          onChange={page => this.setPageNo(page)}
        />
        <ConfirmationModal
          title="Remove Student(s)"
          show={removeStudentsModalVisible}
          onOk={this.confirmDeactivate}
          onCancel={this.onCancelRemoveStudentsModal}
          inputVal={confirmText}
          onInputChange={this.onInputChangeHandler}
          expectedVal={defaultText}
          canUndone
          bodyText={
            <>
              {this.renderUserNames()}
              <div> Are you sure you want to remove the selected student(s) from the class? </div>
            </>
          }
          okText="Yes, Remove"
        />

        <AddNewUserModal
          showModal={addUserFormModalVisible}
          formTitle="Add User to Class"
          closeModal={this.onCloseAddNewUserModal}
          buttonText="Add Student(s)"
          addNewUser={this.addNewUser}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          validatedClassDetails={validatedClassDetails}
          wrappedComponentRef={this.saveFormRef}
          userOrgId={userOrgId}
          resetClassDetails={resetClassDetails}
        />

        <AddStudentsToOtherClassModal
          {...addStudentsToOtherClassData}
          showModal={addStudentsModalVisible}
          titleText="Add Student(s) to another class"
          buttonText="Add Student(s)"
          handleSubmit={classCode => putStudentsToOtherClass({ classCode, userDetails: selectedUserIds })}
          onCloseModal={this.onCloseAddStudentsToOtherClassModal}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
        />
        <MoveUsersToOtherClassModal
          {...addStudentsToOtherClassData}
          showModal={moveUsersModalVisible}
          titleText="Move User(s) to another class"
          buttonText="Move User(s)"
          handleSubmit={destinationClassCode =>
            moveUsersToOtherClass({
              districtId: userOrgId,
              destinationClassCode,
              sourceClassCode: selectedUsersInfo[0].group.code,
              userDetails: selectedUserIds
            })
          }
          onCloseModal={this.onCloseMoveUsersToOtherClassModal}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          selectedUsersInfo={selectedUsersInfo}
          askUserConfirmation
        />
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      userDetails: getUser(state),
      classEnrollmentData: getClassEnrollmentUsersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state),
      totalUsers: getClassEnrollmentUsersCountSelector(state)
    }),
    {
      createAdminUser: createAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      moveUsersToOtherClass: moveUsersToOtherClassAction
    }
  )
);

export default enhance(ClassEnrollmentTable);
