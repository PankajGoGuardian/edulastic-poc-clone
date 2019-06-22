import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { Icon, Select, message, Button, Menu, Checkbox } from "antd";
import { TypeToConfirmModal } from "@edulastic/common";

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTable,
  StyledTableButton,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown,
  StyledClassName
} from "./styled";

import AddTeacherModal from "./AddTeacherModal/AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal/EditTeacherModal";
import InviteMultipleTeacherModal from "./InviteMultipleTeacherModal/InviteMultipleTeacherModal";

import { getTeachersListSelector } from "../../ducks";

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

class TeacherTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      addTeacherModalVisible: false,
      editTeacherModaVisible: false,
      inviteTeacherModalVisible: false,
      editTeacherKey: "",
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
        title: "Class Count",
        dataIndex: "classCount"
      },
      {
        dataIndex: "_id",
        render: id => [
          <StyledTableButton key={`${id}0`} onClick={() => this.onEditTeacher(id)}>
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
    const { loadAdminData, setRole } = this.props;
    setRole("teacher");
    loadAdminData();
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

  onEditTeacher = key => {
    this.setState({
      editTeacherModaVisible: true,
      editTeacherKey: key
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
    deleteAdminUser({ userIds: selectedAdminsForDeactivate, role: "teacher" });
    this.setState({
      deactivateAdminModalVisible: false
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
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
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true
        });
      } else {
        message.error("Please select users to delete.");
      }
    }
  };

  addTeacher = addTeacherData => {
    const { userOrgId, createAdminUser } = this.props;
    addTeacherData.role = "teacher";
    addTeacherData.districtId = userOrgId;
    createAdminUser(addTeacherData);
    this.setState({ addTeacherModalVisible: false });
  };

  closeAddTeacherModal = () => {
    this.setState({
      addTeacherModalVisible: false
    });
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
    const {
      selectedRowKeys,
      addTeacherModalVisible,
      editTeacherModaVisible,
      inviteTeacherModalVisible,
      editTeacherKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate
    } = this.state;

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
      removeFilter
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add teacher">Add Teacher</Menu.Item>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    const filterKeysArray = Object.keys(filters);

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
          <Checkbox checked={showActiveUsers} onChange={evt => setShowActiveUsers(evt.target.checked)}>
            Show current users only
          </Checkbox>
          <StyledActionDropDown overlay={actionMenu}>
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
        <StyledTable
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
        {editTeacherModaVisible && (
          <EditTeacherModal
            teacherData={result[editTeacherKey]}
            modalVisible={editTeacherModaVisible}
            saveTeacher={updateAdminUser}
            closeModal={this.closeEditTeacherModal}
            userOrgId={userOrgId}
          />
        )}
        {addTeacherModalVisible && (
          <AddTeacherModal
            modalVisible={addTeacherModalVisible}
            addTeacher={this.addTeacher}
            closeModal={this.closeAddTeacherModal}
            userOrgId={userOrgId}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following teacher(s)?"
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
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      teachersList: getTeachersListSelector(state),
      adminUsersData: getAdminUsersDataSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state)
    }),
    {
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
      setRole: setRoleAction
    }
  )
);

export default enhance(TeacherTable);

// TeacherTable.propTypes = {
//   teachersList: PropTypes.array.isRequired,
//   loadTeachersListData: PropTypes.func.isRequired,
//   createTeacher: PropTypes.func.isRequired,
//   updateTeacher: PropTypes.func.isRequired,
//   deleteTeachers: PropTypes.func.isRequired,
//   setSearchName: PropTypes.func.isRequired,
//   setFilters: PropTypes.func.isRequired,
//   userOrgId: PropTypes.string.isRequired
// };
