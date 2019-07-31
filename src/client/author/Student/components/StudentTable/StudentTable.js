import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, split, unset, pickBy, identity } from "lodash";
import * as moment from "moment";
import { Checkbox, Icon, Select, message, Button, Menu, Table } from "antd";
import { TypeToConfirmModal } from "@edulastic/common";
import { getUserFeatures } from "../../../../student/Login/ducks";
import {
  StyledPagination,
  StyledControlDiv,
  StyledFilterDiv,
  RightFilterDiv,
  StyledFilterSelect,
  StyledAddFilterButton,
  StyledFilterInput,
  StyledSchoolSearch,
  StyledActionDropDown,
  StyledClassName
} from "../../../../admin/Common/StyledComponents";
import { StyledTableContainer, StyledTableButton, StyledTable } from "./styled";

import { UserFormModal as EditStudentFormModal } from "../../../../common/components/UserFormModal/UserFormModal";

import AddStudentModal from "../../../ManageClass/components/ClassDetails/AddStudent/AddStudentModal";
import InviteMultipleStudentModal from "./InviteMultipleStudentModal/InviteMultipleStudentModal";
import StudentsDetailsModal from "./StudentsDetailsModal/StudentsDetailsModal";
import AddStudentsToOtherClass from "./AddStudentToOtherClass";

import {
  addMultiStudentsRequestAction,
  setStudentsDetailsModalVisibleAction,
  getAddStudentsToOtherClassSelector,
  setAddStudentsToOtherClassVisiblityAction,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction,
  setMultiStudentsProviderAction
} from "../../ducks";

import { receiveClassListAction } from "../../../Classes/ducks";

import {
  receiveAdminDataAction,
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction,
  setSearchNameAction,
  getAdminUsersDataSelector,
  getAdminUsersDataCountSelector,
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

import { getFullNameFromString } from "../../../../common/utils/helpers";

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

const filterStrDD = {
  status: {
    list: [
      { title: "Select a value", value: undefined, disabled: true },
      { title: "Active", value: 1, disabled: false },
      { title: "Inactive", value: 0, disabled: false }
    ],
    placeholder: "Select a value"
  }
};

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
      deactivateAdminModalVisible: false,

      showActive: true,
      searchByName: "",
      filtersData: [
        {
          filtersColumn: "",
          filtersValue: "",
          filterStr: "",
          filterAdded: false
        }
      ],
      currentPage: 1
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
        dataIndex: "_source.username",
        render: (text, record, index) => record._source.username || record._source.email,
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
          <StyledTableButton key={`${id}0`} onClick={() => this.onEditStudent(id)} title="Edit">
            <Icon type="edit" theme="twoTone" />
          </StyledTableButton>,
          <StyledTableButton key={`${id}1`} onClick={() => this.handleDeactivateAdmin(id)} title="Deactivate">
            <Icon type="delete" theme="twoTone" />
          </StyledTableButton>
        ]
      }
    ];

    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    this.loadFilteredList();
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result } = nextProps;
    return {
      selectedRowKeys: state.selectedRowKeys.filter(rowKey => !!result[rowKey])
    };
  }

  componentDidUpdate(prevProps) {}

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

    let o = {
      addReq: { districtId: userOrgId, data: inviteStudentList },
      listReq: this.getSearchQuery()
    };

    addMultiStudents(o);
  };

  closeInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: false
    });
  };

  closeStudentsDetailModal = () => {
    this.props.setStudentsDetailsModalVisible(false);
  };

  saveFormRef = node => {
    this.formRef = node;
  };

  setPageNo = page => {
    this.setState({ currentPage: page }, this.loadFilteredList);
  };

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  createUser = () => {
    if (this.formRef) {
      const { userOrgId: districtId, createAdminUser } = this.props;
      const { form } = this.formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName, email, password } = values;

          let name = getFullNameFromString(fullName);
          values.firstName = name.firstName;
          values.middleName = name.middleName;
          values.lastName = name.lastName;

          const contactEmails = get(values, "contactEmails");
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
            listReq: this.getSearchQuery()
          };

          createAdminUser(o);
          this.setState({ addStudentModalVisible: false });
        }
      });
    }
  };

  closeAddUserModal = () => {
    this.setState({
      addStudentModalVisible: false
    });
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedAdminsForDeactivate } = this.state;

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: "student" },
      listReq: this.getSearchQuery()
    };

    deleteAdminUser(o);
    this.setState({
      deactivateAdminModalVisible: false
    });
  };

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = event => {
    this.setState({ searchByName: event.currentTarget.value });
  };

  handleSearchName = value => {
    this.setState({ searchByName: value }, this.loadFilteredList);
  };

  onSearchFilter = (value, event, i) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          filterAdded: value ? true : false
        };
      }
      return item;
    });

    // For some unknown reason till now calling blur() synchronously doesnt work.
    this.setState({ filtersData: _filtersData }, () => this.filterTextInputRef[i].current.blur());
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
    this.setState(state => ({ filtersData: _filtersData }), this.loadFilteredList);
  };

  changeStatusValue = (value, key) => {
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

    this.setState({ filtersData: _filtersData }, () => this.loadFilteredList(key));
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

  changeFilterColumn = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (key === index) {
        let _item = {
          ...item,
          filtersColumn: value
        };
        if (value === "status") _item.filtersValue = "eq";
        return _item;
      }
      return item;
    });
    this.setState({ filtersData: _filtersData }, this.loadFilteredList);
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
    this.setState({ filtersData: _filtersData }, this.loadFilteredList);
  };

  onChangeShowActive = e => {
    this.setState({ showActive: e.target.checked }, this.loadFilteredList);
  };

  addFilter = (e, key) => {
    const { filtersData } = this.state;
    if (filtersData.length < 3) {
      this.setState({
        filtersData: [
          ...filtersData,
          {
            filtersColumn: "",
            filtersValue: "",
            filterStr: "",
            prevFilterStr: "",
            filterAdded: false
          }
        ]
      });
    }
  };

  removeFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    let newFiltersData = [];
    if (filtersData.length === 1) {
      newFiltersData.push({
        filterAdded: false,
        filtersColumn: "",
        filtersValue: "",
        filterStr: ""
      });
    } else {
      newFiltersData = filtersData.filter((item, index) => index != key);
    }
    this.setState({ filtersData: newFiltersData }, this.loadFilteredList);
  };

  getSearchQuery = () => {
    const { userOrgId } = this.props;
    const { filtersData, searchByName, currentPage } = this.state;
    let showActive = this.state.showActive ? 1 : 0;

    let search = {};
    for (let [index, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item;
      if (filtersColumn !== "" && filtersValue !== "" && filterStr !== "") {
        if (filtersColumn === "status") {
          showActive = filterStr;
          continue;
        }
        if (!search[filtersColumn]) {
          search[filtersColumn] = { type: filtersValue, value: [filterStr] };
        } else {
          search[filtersColumn].value.push(filterStr);
        }
      }
    }

    if (searchByName) {
      search["firstName"] = { type: "cont", value: [searchByName] };
    }

    return {
      search,
      districtId: userOrgId,
      role: "student",
      limit: 25,
      page: currentPage,
      // uncomment after elastic search is fixed
      status: showActive
      // sortField,
      // order
    };
  };

  loadFilteredList = () => {
    const { loadAdminData } = this.props;
    loadAdminData(this.getSearchQuery());
  };

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      addStudentModalVisible,
      editStudentModaVisible,
      inviteStudentModalVisible,
      editStudentKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,

      filtersData,
      currentPage
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const {
      adminUsersData: result,
      totalUsers,
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
      features,
      setProvider
    } = this.props;

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add student">Add Student</Menu.Item>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
        <Menu.Item key="addStudentsToAnotherClass">Add student(s) to another class</Menu.Item>
      </Menu>
    );

    return (
      <StyledTableContainer>
        <StyledFilterDiv>
          <div>
            <Button type="primary" onClick={this.showInviteStudentModal}>
              + Add Multiple Students
            </Button>
            <StyledSchoolSearch
              placeholder="Search by name"
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
            />
          </div>

          <RightFilterDiv>
            <Checkbox
              checked={this.state.showActive}
              onChange={this.onChangeShowActive}
              disabled={!!filtersData.find(item => item.filtersColumn === "status")}
            >
              Show current users only
            </Checkbox>
            <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
              <Button>
                Actions <Icon type="down" />
              </Button>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>
        <StyledControlDiv>
          {inviteStudentModalVisible && (
            <InviteMultipleStudentModal
              modalVisible={inviteStudentModalVisible}
              inviteStudents={this.sendInviteStudent}
              closeModal={this.closeInviteStudentModal}
              features={features}
              setProvider={setProvider}
            />
          )}
        </StyledControlDiv>
        {filtersData.map((item, i) => {
          const { filtersColumn, filtersValue, filterStr, filterAdded } = item;
          const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
          const isAddFilterDisable = filtersColumn === "" || filtersValue === "" || filterStr === "" || !filterAdded;

          return (
            <StyledControlDiv key={i}>
              <StyledFilterSelect
                placeholder="Select a column"
                onChange={e => this.changeFilterColumn(e, i)}
                value={filtersColumn ? filtersColumn : undefined}
              >
                <Option value="other" disabled={true}>
                  Select a column
                </Option>
                <Option value="username">Username</Option>
                <Option value="email">Email</Option>
                <Option value="status">Status</Option>
                {/* TODO: Uncomment after backend is done */}
                {/* <Option value="institutionNames">School</Option> */}
              </StyledFilterSelect>
              <StyledFilterSelect
                placeholder="Select a value"
                onChange={e => this.changeFilterValue(e, i)}
                value={filtersValue ? filtersValue : undefined}
              >
                <Option value="" disabled={true}>
                  Select a value
                </Option>
                <Option value="eq">Equals</Option>
                {!filterStrDD[filtersColumn] ? <Option value="cont">Contains</Option> : null}
              </StyledFilterSelect>
              {!filterStrDD[filtersColumn] ? (
                <StyledFilterInput
                  placeholder="Enter text"
                  onChange={e => this.changeFilterText(e, i)}
                  onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                  onBlur={e => this.onBlurFilterText(e, i)}
                  value={filterStr ? filterStr : undefined}
                  disabled={isFilterTextDisable}
                  innerRef={this.filterTextInputRef[i]}
                />
              ) : (
                <StyledFilterSelect
                  placeholder={filterStrDD[filtersColumn].placeholder}
                  onChange={v => this.changeStatusValue(v, i)}
                  value={filterStr !== "" ? filterStr : undefined}
                >
                  {filterStrDD[filtersColumn].list.map(item => (
                    <Option key={item.title} value={item.value} disabled={item.disabled}>
                      {item.title}
                    </Option>
                  ))}
                </StyledFilterSelect>
              )}
              {i < 2 && (
                <StyledAddFilterButton
                  type="primary"
                  onClick={e => this.addFilter(e, i)}
                  disabled={isAddFilterDisable || i < filtersData.length - 1}
                >
                  + Add Filter
                </StyledAddFilterButton>
              )}
              {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
                <StyledAddFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
                  - Remove Filter
                </StyledAddFilterButton>
              )}
            </StyledControlDiv>
          );
        })}
        <StyledTable
          rowKey={record => record._id}
          rowSelection={rowSelection}
          dataSource={Object.values(result)}
          columns={this.columns}
          pagination={false}
          hideOnSinglePage={true}
        />
        <StyledPagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={25}
          total={totalUsers}
          onChange={page => this.setPageNo(page)}
          hideOnSinglePage={true}
          pagination={{
            current: pageNo,
            total: totalUsers,
            pageSize: 25,
            onChange: page => setPageNo(page)
          }}
          scroll={{ y: 400 }}
        />
        {editStudentModaVisible && (
          <EditStudentFormModal
            showModal={editStudentModaVisible}
            role="student"
            formTitle="Update User"
            showAdditionalFields={true}
            userOrgId={userOrgId}
            modalData={result[editStudentKey]}
            modalFunc={updateAdminUser}
            closeModal={this.closeEditStudentModal}
            buttonText="Yes, Update"
            isStudentEdit
          />
        )}
        {addStudentModalVisible && (
          <AddStudentModal
            handleAdd={this.createUser}
            handleCancel={this.closeAddUserModal}
            isOpen={addStudentModalVisible}
            submitted={false}
            wrappedComponentRef={this.saveFormRef}
            showClassCodeField={true}
            fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
            showTtsField
          />
        )}
        {studentDetailsModalVisible && (
          <StudentsDetailsModal
            modalVisible={studentDetailsModalVisible}
            closeModal={this.closeStudentsDetailModal}
            role="student"
            title="Student Details"
          />
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
      totalUsers: getAdminUsersDataCountSelector(state),
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
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      setProvider: setMultiStudentsProviderAction
    }
  )
);

export default enhance(StudentTable);
