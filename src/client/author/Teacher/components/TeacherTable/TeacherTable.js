import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { get, isEmpty } from "lodash";

import { Icon, Select, message, Button, Menu, Checkbox } from "antd";
import { TypeToConfirmModal } from "@edulastic/common";
import {
  StyledControlDiv,
  StyledFilterDiv,
  StyledFilterSelect,
  StyledAddFilterButton,
  StyledFilterInput,
  StyledActionDropDown,
  StyledClassName
} from "../../../../admin/Common/StyledComponents";
import {
  MainContainer,
  TableContainer,
  SubHeaderWrapper,
  FilterWrapper,
  StyledButton,
  StyledPagination,
  StyledSchoolSearch,
  LeftFilterDiv,
  RightFilterDiv,
  StyledTableButton
} from "../../../../common/styled";
import { StyledTeacherTable } from "./styled";
import AddTeacherModal from "./AddTeacherModal/AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal/EditTeacherModal";
import InviteMultipleTeacherModal from "./InviteMultipleTeacherModal/InviteMultipleTeacherModal";
import StudentsDetailsModal from "../../../Student/components/StudentTable/StudentsDetailsModal/StudentsDetailsModal";

import { getTeachersListSelector } from "../../ducks";

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
  setRoleAction,
  addBulkTeacherAdminAction,
  setTeachersDetailsModalVisibleAction
} from "../../../SchoolAdmin/ducks";

import { getUserOrgId } from "../../../src/selectors/user";

import Breadcrumb from "../../../src/components/Breadcrumb";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/UserSubHeader";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { withRouter } from "react-router-dom";
const menuActive = { mainMenu: "Users", subMenu: "Teacher" };

const { Option } = Select;

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
      currentPage: 1,
      refineButtonActive: false
    };
    const { t } = this.props;
    this.columns = [
      {
        title: t("users.teacher.name"),
        render: (_, { _source }) => {
          const firstName = get(_source, "firstName", "");
          const lastName = get(_source, "lastName", "");
          return (
            <span>
              {firstName === "Anonymous" || isEmpty(firstName) ? "-" : firstName} {lastName}
            </span>
          );
        },
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.firstName", "");
          const next = get(b, "_source.firstName", "");
          return next.localeCompare(prev);
        }
      },
      {
        title: t("users.teacher.username"),
        dataIndex: "_source.email",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.email", "");
          const next = get(b, "_source.email", "");
          return next.localeCompare(prev);
        },
        width: 200
      },
      {
        title: t("users.teacher.sso"),
        dataIndex: "_source.lastSigninSSO",
        render: (sso = "N/A") => sso
      },
      {
        title: t("users.teacher.school"),
        dataIndex: "_source.institutionDetails",
        render: (schools = []) => schools.map(school => school.name),
        width: 200
      },
      {
        title: t("users.teacher.classes"),
        dataIndex: "classCount",
        align: "center",
        render: (classCount, record) => {
          const username = get(record, "_source.username", "");
          return (
            <Link
              to={{
                pathname: "/author/Class-Enrollment",
                state: {
                  filtersColumn: "username",
                  filtersValue: "eq",
                  filterStr: username,
                  filterAdded: true
                }
              }}
            >
              {classCount}
            </Link>
          );
        }
      },
      {
        dataIndex: "_id",
        render: id => (
          <div style={{ whiteSpace: "nowrap" }}>
            <>
              <StyledTableButton onClick={() => this.onEditTeacher(id)} title="Edit">
                <IconPencilEdit color={themeColor} />
              </StyledTableButton>
              <StyledTableButton onClick={() => this.handleDeactivateAdmin(id)} title="Deactivate">
                <IconTrash color={themeColor} />
              </StyledTableButton>
            </>
          </div>
        )
      }
    ];

    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    const { dataPassedWithRoute } = this.props;
    if (!isEmpty(dataPassedWithRoute)) {
      this.setState({ filtersData: [{ ...dataPassedWithRoute }] }, this.loadFilteredList);
    } else {
      this.loadFilteredList();
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result } = nextProps;
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

  closeInviteTeacherModal = () => {
    this.setState({
      inviteTeacherModalVisible: false
    });
  };

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  sendInvite = obj => {
    const { addTeachers } = this.props;
    let o = {
      addReq: obj,
      listReq: this.getSearchQuery()
    };
    addTeachers(o);
  };

  createUser = createReq => {
    const { userOrgId, createAdminUser } = this.props;
    createReq.role = "teacher";
    createReq.districtId = userOrgId;

    let o = {
      createReq: createReq,
      listReq: this.getSearchQuery()
    };

    createAdminUser(o);
    this.setState({ addTeacherModalVisible: false });
  };

  closeAddUserModal = () => {
    this.setState({
      addTeacherModalVisible: false
    });
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedAdminsForDeactivate } = this.state;

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: "teacher" },
      listReq: this.getSearchQuery()
    };

    deleteAdminUser(o);
    this.setState({
      deactivateAdminModalVisible: false
    });
  };

  setPageNo = page => {
    this.setState({ currentPage: page }, this.loadFilteredList);
  };

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive });
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
    const { userOrgId, location = {} } = this.props;
    const { filtersData, searchByName, currentPage } = this.state;
    let { showActive } = this.state;
    let search = {};
    for (let [index, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item;
      if (filtersColumn !== "" && filtersValue !== "" && filterStr !== "") {
        if (filtersColumn === "status") {
          showActive = filterStr;
          continue;
        }
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }];
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr });
        }
      }
    }

    if (searchByName) {
      search["name"] = searchByName;
    }

    const queryObj = {
      search,
      districtId: userOrgId,
      role: "teacher",
      limit: 25,
      page: currentPage,
      institutionId: location.institutionId || ""
      // uncomment after elastic search is fixed
      // sortField,
      // order
    };
    if (showActive) {
      queryObj["status"] = 1;
    }
    return queryObj;
  };

  loadFilteredList = () => {
    const { loadAdminData } = this.props;
    loadAdminData(this.getSearchQuery());
  };
  closeTeachersDetailModal = () => {
    this.props.setTeachersDetailsModalVisible(false);
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

      filtersData,
      currentPage,
      refineButtonActive
    } = this.state;

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
      addTeachers,
      teacherDetailsModalVisible,
      history,
      t
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add teacher">{t("users.teacher.addteacher")}</Menu.Item>
        <Menu.Item key="edit user">{t("users.teacher.updateuser")}</Menu.Item>
        <Menu.Item key="deactivate user">{t("users.teacher.deactivateuser")}</Menu.Item>
      </Menu>
    );
    const breadcrumbData = [
      {
        title: "MANAGE DISTRICT",
        to: "/author/districtprofile"
      },
      {
        title: "USERS",
        to: ""
      }
    ];

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
          <StyledButton type={"default"} shape="round" icon="filter" onClick={this._onRefineResultsCB}>
            {t("common.refineresults")}
            <Icon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        </SubHeaderWrapper>
        <AdminSubHeader active={menuActive} history={history} />

        {refineButtonActive && (
          <FilterWrapper>
            {filtersData.map((item, i) => {
              const { filtersColumn, filtersValue, filterStr, filterAdded } = item;
              const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
              const isAddFilterDisable =
                filtersColumn === "" || filtersValue === "" || filterStr === "" || !filterAdded;

              return (
                <StyledControlDiv key={i}>
                  <StyledFilterSelect
                    placeholder={t("common.selectcolumn")}
                    onChange={e => this.changeFilterColumn(e, i)}
                    value={filtersColumn ? filtersColumn : undefined}
                  >
                    <Option value="other" disabled={true}>
                      {t("common.selectcolumn")}
                    </Option>
                    <Option value="username">Username</Option>
                    <Option value="email">Email</Option>
                    <Option value="status">Status</Option>
                    {/* TO DO: Uncomment after backend is done */}
                    {/* <Option value="institutionNames">School</Option> */}
                  </StyledFilterSelect>
                  <StyledFilterSelect
                    placeholder={t("common.selectvalue")}
                    onChange={e => this.changeFilterValue(e, i)}
                    value={filtersValue ? filtersValue : undefined}
                  >
                    <Option value="" disabled={true}>
                      {t("common.selectvalue")}
                    </Option>
                    <Option value="eq">{t("common.equals")}</Option>
                    {!filterStrDD[filtersColumn] ? <Option value="cont">{t("common.contains")}</Option> : null}
                  </StyledFilterSelect>
                  {!filterStrDD[filtersColumn] ? (
                    <StyledFilterInput
                      placeholder={t("common.entertext")}
                      onChange={e => this.changeFilterText(e, i)}
                      onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                      onBlur={e => this.onBlurFilterText(e, i)}
                      value={filterStr ? filterStr : undefined}
                      disabled={isFilterTextDisable}
                      ref={this.filterTextInputRef[i]}
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
            })}
          </FilterWrapper>
        )}
        <StyledFilterDiv>
          <LeftFilterDiv width={50}>
            <StyledSchoolSearch
              placeholder={t("common.searchbyname")}
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
            />
            <Button type="primary" onClick={this.showInviteTeacherModal}>
              {t("users.teacher.inviteteachers")}
            </Button>
          </LeftFilterDiv>

          <RightFilterDiv width={40}>
            <Checkbox
              checked={this.state.showActive}
              onChange={this.onChangeShowActive}
              disabled={!!filtersData.find(item => item.filtersColumn === "status")}
            >
              {t("common.showcurrent")}
            </Checkbox>
            <StyledActionDropDown overlay={actionMenu}>
              <Button>
                {t("common.actions")} <Icon type="down" />
              </Button>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>
        <TableContainer>
          <StyledTeacherTable
            rowKey={record => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(result)}
            columns={this.columns}
            pagination={false}
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
          />
        </TableContainer>
        {inviteTeacherModalVisible && (
          <InviteMultipleTeacherModal
            modalVisible={inviteTeacherModalVisible}
            closeModal={this.closeInviteTeacherModal}
            addTeachers={this.sendInvite}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {editTeacherModaVisible && (
          <EditTeacherModal
            modalVisible={editTeacherModaVisible}
            userOrgId={userOrgId}
            data={result[editTeacherKey]}
            editTeacher={updateAdminUser}
            closeModal={this.closeEditTeacherModal}
            t={t}
          />
        )}
        {addTeacherModalVisible && (
          <AddTeacherModal
            modalVisible={addTeacherModalVisible}
            addTeacher={this.createUser}
            closeModal={this.closeAddUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t("users.teacher.deactivateTeacher.title")}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={t("common.modalConfirmationText1") + t("users.teacher.deactivateTeacher.teachers")}
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
        {teacherDetailsModalVisible && (
          <StudentsDetailsModal
            modalVisible={teacherDetailsModalVisible}
            closeModal={this.closeTeachersDetailModal}
            role="teacher"
            title="Teacher Details"
          />
        )}
      </MainContainer>
    );
  }
}

const enhance = compose(
  withNamespaces("manageDistrict"),
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      teachersList: getTeachersListSelector(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      teacherDetailsModalVisible: get(state, ["schoolAdminReducer", "teacherDetailsModalVisible"], false)
    }),
    {
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
      setShowActiveUsers: setShowActiveUsersAction,
      setPageNo: setPageNoAction,
      addTeachers: addBulkTeacherAdminAction,
      setTeachersDetailsModalVisible: setTeachersDetailsModalVisibleAction,
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

export default enhance(withRouter(TeacherTable));

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
