import React from "react";
import { Icon, message, Button, Menu } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, unset, pickBy, identity, isEmpty } from "lodash";
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
  UserName
} from "./styled";

import { createAdminUserAction, deleteAdminUserAction } from "../../../SchoolAdmin/ducks";
import { getUserOrgId, getUser } from "../../../src/selectors/user";
import { getFullNameFromString } from "../../../../common/utils/helpers";
import { getClassEnrollmentUsersSelector } from "../../ducks";

import AddStudentsToOtherClass from "../../../Student/components/StudentTable/AddStudentToOtherClass";
import {
  getAddStudentsToOtherClassSelector,
  setAddStudentsToOtherClassVisiblityAction,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction
} from "../../../Student/ducks";

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
      removeStudentsModalVisible: false
    };
  }

  componentDidMount() {
    this.loadClassEnrollmentList();
  }

  renderUserNames() {
    const { selectedRowKeys } = this.state;
    return (
      <UserNameContainer>
        {selectedRowKeys.map(username => (
          <UserName key={username}>{username}</UserName>
        ))}
      </UserNameContainer>
    );
  }
  onInputChangeHandler = ({ target }) => this.setState({ confirmText: target.value });

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  changeActionMode = e => {
    const { classEnrollmentData, setAddStudentsToOtherClassVisiblity } = this.props;
    const { selectedRowKeys } = this.state;
    const selectedUsers = classEnrollmentData.filter(data => selectedRowKeys.includes(data.user.username));
    const isInstructor = selectedUsers.some(user => user.role === "teacher");
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
      } else if (selectedRowKeys.length > 0) {
        this.setState({
          moveUsersModalVisible: true
        });
      }
    } else if (e.key === "add students to other class") {
      if (selectedRowKeys.length == 0) {
        message.error("Select 1 or more student to add");
      } else if (selectedRowKeys.length > 0) {
        if (isInstructor) {
          message.error("Only students can be added to another class");
        } else {
          setAddStudentsToOtherClassVisiblity(true);
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
    const { deleteAdminUser, classEnrollmentData } = this.props;
    const { selectedRowKeys } = this.state;
    const userIds = classEnrollmentData
      .filter(data => selectedRowKeys.includes(data.user.username))
      .map(item => item.user._id);
    const o = {
      deleteReq: { userIds, role: "student" },
      listReq: this.getSearchQuery(),
      classEnrollmentPage: true
    };
    deleteAdminUser(o);
    this.setState({
      removeStudentsModalVisible: false
    });
  };

  onCancelRemoveStudentsModal = () => {
    this.setState({
      removeStudentsModalVisible: false
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

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //
  changeFilterColumn = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (key === index) {
        let _item = {
          ...item,
          filtersColumn: value
        };
        if (value === "role") _item.filtersValue = "Equals";
        return _item;
      }
      return item;
    });
    this.setState({ filtersData: _filtersData }, this.loadClassEnrollmentList);
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
      addUserFormModalVisible
    } = this.state;
    const {
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      resetClassDetails,
      classEnrollmentData,
      addStudentsToOtherClassData,
      setAddStudentsToOtherClassVisiblity,
      putStudentsToOtherClass,
      userOrgId
    } = this.props;
    const tableDataSource = classEnrollmentData.map(item => {
      const role = get(item, "role", "");
      const code = get(item, "group.code", "");
      const name = get(item, "group.name", "");
      const firstName = get(item, "user.firstName", "");
      const middleName = get(item, "user.middleName", "");
      const lastName = get(item, "user.lastName", "");
      const username = get(item, "user.username", "");
      const obj = {
        role,
        code,
        name,
        fullName: [firstName, middleName, lastName].join(" "),
        username
      };
      return obj;
    });
    const userDetails = !isEmpty(classEnrollmentData)
      ? classEnrollmentData.filter(data => selectedRowKeys.includes(data.user.username)).map(item => item.user._id)
      : [];

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
        title: "Class Code",
        dataIndex: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        width: 200
      },
      {
        title: "Class Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
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
      }
    ];

    const SearchRows = [];
    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr, filterAdded } = filtersData[i];
      const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
      const isAddFilterDisable = filtersColumn === "" || filtersValue === "" || filterStr === "" || !filterAdded;

      const optValues = [];
      if (filtersColumn === "Role") {
        optValues.push(<Option value="eq">Equals</Option>);
      } else {
        optValues.push(
          <Option value="" disabled={true}>
            Select a value
          </Option>
        );
        optValues.push(<Option value="equals">Equals</Option>);
        optValues.push(<Option value="contains">Contains</Option>);
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

          <StyledFilterInput
            placeholder="Enter text"
            onChange={e => this.changeFilterText(e, i)}
            onBlur={e => this.onBlurFilterText(e, i)}
            disabled={isFilterTextDisable}
            value={filterStr}
          />
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

          <StyledSearch placeholder="Search by name" onSearch={this.handleSearchName} onChange={this.onChangeSearch} />
          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable
          rowKey={record => record.username}
          rowSelection={rowSelection}
          dataSource={tableDataSource}
          columns={columnsData}
          pagination={false}
          scroll={{ y: 500 }}
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
              <div> Are you sure you want to remove the selected students from the class? </div>
            </>
          }
          okText="Yes,Remove"
        />
        {addUserFormModalVisible && (
          <AddNewUserModal
            showModal={addUserFormModalVisible}
            formTitle="Add Student(s) to Class"
            closeModal={this.onCloseAddNewUserModal}
            buttonText="Add Student(s)"
            addNewUser={this.addNewUser}
            fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
            validatedClassDetails={validatedClassDetails}
            wrappedComponentRef={this.saveFormRef}
            userOrgId={userOrgId}
          />
        )}

        <AddStudentsToOtherClass
          {...addStudentsToOtherClassData}
          handleSubmit={classCode => putStudentsToOtherClass({ classCode, userDetails })}
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
      userDetails: getUser(state),
      classEnrollmentData: getClassEnrollmentUsersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state)
    }),
    {
      createAdminUser: createAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      setAddStudentsToOtherClassVisiblity: setAddStudentsToOtherClassVisiblityAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction
    }
  )
);

export default enhance(ClassEnrollmentTable);
