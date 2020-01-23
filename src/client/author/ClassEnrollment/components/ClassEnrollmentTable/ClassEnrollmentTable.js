import React from "react";
import { Icon, message, Button, Menu, Select } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, unset, pickBy, identity, uniqBy, isEmpty } from "lodash";
import moment from "moment";
import { AddNewUserModal } from "../Common/AddNewUser";
import { StyledTable } from "./styled";

import { createAdminUserAction, deleteAdminUserAction } from "../../../SchoolAdmin/ducks";
import { getUserOrgId, getUser, getUserRole } from "../../../src/selectors/user";
import { getFullNameFromString } from "../../../../common/utils/helpers";
import {
  getClassEnrollmentUsersSelector,
  getClassEnrollmentUsersCountSelector,
  requestEnrolExistingUserToClassAction
} from "../../ducks";

import { AddStudentsToOtherClassModal } from "../../../Student/components/StudentTable/AddStudentToOtherClass";
import { AddStudentsToOtherClassModal as MoveUsersToOtherClassModal } from "../../../Student/components/StudentTable/AddStudentToOtherClass";
import {
  getAddStudentsToOtherClassSelector,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction,
  moveUsersToOtherClassAction,
  getValidatedClassDetails
} from "../../../Student/ducks";

import {
  MainContainer,
  TableContainer,
  SubHeaderWrapper,
  FilterWrapper,
  StyledButton,
  StyledSchoolSearch,
  StyledTableButton,
  RightFilterDiv,
  LeftFilterDiv,
  StyledPagination
} from "../../../../common/styled";
import {
  StyledFilterDiv,
  StyledControlDiv,
  StyledFilterInput,
  StyledFilterSelect,
  StyledActionDropDown,
  StyledAddFilterButton,
  StyledClassName
} from "../../../../admin/Common/StyledComponents";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { IconTrash } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { TypeToConfirmModal } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { roleuser } from "@edulastic/constants";
import { enrollmentApi } from "@edulastic/api";
import withRouter from "react-router/withRouter";

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
      moveUsersModalVisible: false,
      refineButtonActive: false
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
    return selectedUsersInfo.map(item => {
      const username = get(item, "user.username");
      const id = get(item, "user._id");
      return <StyledClassName key={id}>{username}</StyledClassName>;
    });
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
          message.error("Please select only students to remove");
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
  addNewUser = (userInfo = {}) => {
    // user info will be empty if user does not exists
    const { requestEnrolExistingUserToClass } = this.props;
    if (userInfo._id) {
      const {
        getValidatedClass: { groupInfo }
      } = this.props;
      const student = {
        classCode: groupInfo?.code,
        studentIds: [userInfo._id],
        districtId: groupInfo?.districtId
      };
      requestEnrolExistingUserToClass(student);
      this.onCloseAddNewUserModal();
      return null;
    }

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

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive });
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
      pageNo,
      refineButtonActive
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
      totalUsers,
      userRole,
      t,
      location
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
        title: t("classenrollment.classname"),
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 200
      },
      {
        title: t("classenrollment.classcode"),
        dataIndex: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        width: 200
      },
      {
        title: t("classenrollment.fullname"),
        dataIndex: "fullName",
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        width: 200
      },
      {
        title: t("classenrollment.username"),
        dataIndex: "username",
        sorter: (a, b) => a.username.localeCompare(b.username),
        width: 200
      },
      {
        title: t("classenrollment.role"),
        dataIndex: "role",
        sorter: (a, b) => a.role.localeCompare(b.role),
        width: 200
      },
      {
        dataIndex: "id",
        render: (_, record) => {
          return (
            <StyledTableButton key={record.key} onClick={() => this.handleDeactivateUser(record)} title="Deactivate">
              <IconTrash color={themeColor} />
            </StyledTableButton>
          );
        },
        textWrap: "word-break",
        width: 100
      }
    ];

    const breadcrumbData = [
      {
        title: userRole === roleuser.SCHOOL_ADMIN ? "MANAGE SCHOOL" : "MANAGE DISTRICT",
        to: userRole === roleuser.SCHOOL_ADMIN ? "/author/Class-Enrollment" : "/author/districtprofile"
      },
      {
        title: "CLASSES",
        to: ""
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
        optValues.push(<Option value="eq">{t("common.equals")}</Option>);
      } else {
        optValues.push(
          <Option value="" disabled={true}>
            {t("common.selectvalue")}
          </Option>
        );
        optValues.push(<Option value="eq">{t("common.equals")}</Option>);
        optValues.push(<Option value="cont">{t("common.contains")}</Option>);
      }

      SearchRows.push(
        <StyledControlDiv>
          <StyledFilterSelect
            placeholder={t("common.selectcolumn")}
            onChange={e => this.changeFilterColumn(e, i)}
            value={filtersColumn}
          >
            <Option value="" disabled={true}>
              {t("common.selectcolumn")}
            </Option>
            <Option value="code">{t("classenrollment.classcode")}</Option>
            <Option value="fullName">{t("classenrollment.fullname")}</Option>
            <Option value="username">{t("classenrollment.username")}</Option>
            <Option value="role">{t("classenrollment.role")}</Option>
          </StyledFilterSelect>
          <StyledFilterSelect
            placeholder={t("common.selectvalue")}
            onChange={e => this.changeFilterValue(e, i)}
            value={filtersValue}
          >
            {optValues}
          </StyledFilterSelect>
          {filtersColumn === "role" ? (
            <StyledFilterSelect
              placeholder={t("common.selectvalue")}
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
              placeholder={t("common.entertext")}
              onChange={e => this.changeFilterText(e, i)}
              onBlur={e => this.onBlurFilterText(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            />
          )}
          {i < 2 && (
            <StyledAddFilterButton
              type="primary"
              onClick={e => this.addFilter(e, i)}
              disabled={isAddFilterDisable || i < filtersData.length - 1}
            >
              {t("common.addfilter")}
            </StyledAddFilterButton>
          )}
          {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
            <StyledAddFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
              {t("common.removefilter")}
            </StyledAddFilterButton>
          )}
        </StyledControlDiv>
      );
    }

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
          <StyledButton type={"default"} shape="round" icon="filter" onClick={this._onRefineResultsCB}>
            {t("common.refineresults")}
            <Icon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        </SubHeaderWrapper>

        {refineButtonActive && <FilterWrapper>{SearchRows}</FilterWrapper>}

        <StyledFilterDiv>
          <LeftFilterDiv width={60}>
            <StyledSchoolSearch
              placeholder={t("common.searchbyname")}
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
            />
            <Button type="primary" onClick={this.onOpenaddNewUserModal}>
              {t("classenrollment.addnewuser")}
            </Button>
          </LeftFilterDiv>

          <RightFilterDiv width={35}>
            <StyledActionDropDown overlay={actionMenu}>
              <Button>
                {t("common.actions")} <Icon type="down" />
              </Button>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>

        <TableContainer>
          <StyledTable
            rowSelection={rowSelection}
            dataSource={tableDataSource}
            columns={columnsData}
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalUsers}
            hideOnSinglePage={true}
            onChange={page => this.setPageNo(page)}
          />
        </TableContainer>

        <TypeToConfirmModal
          modalVisible={removeStudentsModalVisible}
          title={t("classenrollment.removestudents")}
          handleOnOkClick={this.confirmDeactivate}
          wordToBeTyped="DEACTIVATE"
          primaryLabel={t("classenrollment.confirmtext")}
          secondaryLabel={this.renderUserNames()}
          closeModal={() =>
            this.setState({
              removeStudentsModalVisible: false
            })
          }
        />

        <AddNewUserModal
          showModal={addUserFormModalVisible}
          formTitle={t("classenrollment.addnewuser")}
          closeModal={this.onCloseAddNewUserModal}
          addNewUser={this.addNewUser}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          validatedClassDetails={validatedClassDetails}
          wrappedComponentRef={this.saveFormRef}
          userOrgId={userOrgId}
          resetClassDetails={resetClassDetails}
          location={location}
        />

        <AddStudentsToOtherClassModal
          {...addStudentsToOtherClassData}
          showModal={addStudentsModalVisible}
          titleText={t("classenrollment.addstdstoanotherclass")}
          buttonText={t("classenrollment.addstds")}
          handleSubmit={classCode => putStudentsToOtherClass({ classCode, userDetails: selectedUserIds })}
          onCloseModal={this.onCloseAddStudentsToOtherClassModal}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          t={t}
        />
        <MoveUsersToOtherClassModal
          {...addStudentsToOtherClassData}
          showModal={moveUsersModalVisible}
          titleText={t("classenrollment.movetoanotherclass")}
          buttonText={t("classenrollment.moveusers")}
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
          t={t}
        />
      </MainContainer>
    );
  }
}

const enhance = compose(
  withNamespaces("manageDistrict"),
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      userDetails: getUser(state),
      classEnrollmentData: getClassEnrollmentUsersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state),
      totalUsers: getClassEnrollmentUsersCountSelector(state),
      userRole: getUserRole(state),
      getValidatedClass: getValidatedClassDetails(state)
    }),
    {
      createAdminUser: createAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      moveUsersToOtherClass: moveUsersToOtherClassAction,
      requestEnrolExistingUserToClass: requestEnrolExistingUserToClassAction
    }
  )
);

export default enhance(withRouter(ClassEnrollmentTable));
