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
      deactivateAdminModalVisible: false,

      showActive: 1,
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

    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    this.loadFilteredList();
  }

  static getDerivedStateFromProps(nextProps, state) {
    const {
      adminUsersData: { result }
    } = nextProps;
    return {
      selectedRowKeys: state.selectedRowKeys.filter(rowKey => !!result[rowKey])
    };
  }

  componentDidUpdate(prevProps) {}

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

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //
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

  onChangeShowActive = e => {
    this.setState({ showActive: e.target.checked ? 1 : 0 }, this.loadFilteredList);
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

    let search = {};
    for (let [index, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item;
      if (filterStr) {
        search[filtersColumn] = { type: filtersValue, value: filterStr };
      }
    }

    if (searchByName) {
      search["firstName"] = { type: "cont", value: searchByName };
    }

    return {
      districtId: userOrgId,
      role: "teacher",
      limit: 25,
      page: 1,
      // uncomment after elastic search is fixed
      // status: this.state.showActive,
      search
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
      addTeacherModalVisible,
      editTeacherModaVisible,
      inviteTeacherModalVisible,
      editTeacherKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,

      filtersData
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
          <StyledSchoolSearch placeholder="Search by name" onSearch={this.handleSearchName} />
          <Checkbox checked={this.state.showActive} onChange={this.onChangeShowActive}>
            Show current users only
          </Checkbox>
          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
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
                <Option value="cont">Contains</Option>
              </StyledFilterSelect>
              <StyledFilterInput
                placeholder="Enter text"
                onChange={e => this.changeFilterText(e, i)}
                onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                onBlur={e => this.onBlurFilterText(e, i)}
                value={filterStr ? filterStr : undefined}
                disabled={isFilterTextDisable}
                innerRef={this.filterTextInputRef[i]}
              />
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
