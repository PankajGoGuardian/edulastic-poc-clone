import { themeColor } from "@edulastic/colors";
import { CheckboxLabel, notification, TypeToConfirmModal } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { GiDominoMask } from "react-icons/gi";
import { withNamespaces } from "@edulastic/localization";
import { Button, Icon, Menu, Select } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  StyledActionDropDown,
  StyledAddFilterButton,
  StyledClassName,
  StyledControlDiv,
  StyledFilterDiv,
  StyledFilterInput,
  StyledFilterSelect
} from "../../../../admin/Common/StyledComponents";
import {
  FilterWrapper,
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledButton,
  StyledPagination,
  StyledSchoolSearch,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer
} from "../../../../common/styled";
import { getFullNameFromAsString } from "../../../../common/utils/helpers";
import { getSchoolsSelector, receiveSchoolsAction } from "../../../Schools/ducks";
import { isProxyUser as isProxyUserSelector, updatePowerTeacherAction } from "../../../../student/Login/ducks";
import Breadcrumb from "../../../src/components/Breadcrumb";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/UserSubHeader";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { proxyUser } from "../../../authUtils";
import {
  addFilterAction,
  changeFilterColumnAction,
  changeFilterTypeAction,
  changeFilterValueAction,
  createAdminUserAction,
  deleteAdminUserAction,
  getAdminUsersDataCountSelector,
  getAdminUsersDataSelector,
  getFiltersSelector,
  getPageNoSelector,
  getShowActiveUsersSelector,
  receiveAdminDataAction,
  removeFilterAction,
  setPageNoAction,
  setRoleAction,
  setSearchNameAction,
  setShowActiveUsersAction,
  updateAdminUserAction
} from "../../ducks";
import CreateSchoolAdminModal from "./CreateSchoolAdminModal/CreateSchoolAdminModal";
import EditSchoolAdminModal from "./EditSchoolAdminModal/EditSchoolAdminModal";
import { StyledSchoolAdminTable, StyledMaskButton } from "./styled";

const menuActive = { mainMenu: "Users", subMenu: "School Admin" };

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

class SchoolAdminTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      createSchoolAdminModalVisible: false,
      editSchoolAdminModaVisible: false,
      editSchoolAdminKey: "",
      deactivateAdminModalVisible: false,
      selectedAdminsForDeactivate: [],

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
    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    const { loadSchoolsData, userOrgId } = this.props;
    this.loadFilteredList();
    loadSchoolsData({ districtId: userOrgId });
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result } = nextProps;
    return {
      selectedRowKeys: state.selectedRowKeys.filter(rowKey => !!result[rowKey])
    };
  }

  componentDidUpdate(prevProps) {}

  onEditSchoolAdmin = id => {
    this.setState({
      editSchoolAdminModaVisible: true,
      editSchoolAdminKey: id
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

  showCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: true
    });
  };

  onProxySchoolAdmin = id => {
    proxyUser({ userId: id });
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    if (e.key === "edit user") {
      if (selectedRowKeys.length === 0) {
       notification({ messageKey:"pleaseSelectUser" });
      } else if (selectedRowKeys.length === 1) {
        this.onEditSchoolAdmin(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        notification({ messageKey:"pleaseSelectSingleUserToEdit" });
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true
        });
      } else {
        notification({ messageKey:"pleaseSelectSchoolsToDelete" });
      }
    } else if (e.key === "enable power tools" || e.key === "disable power tools") {
      const enableMode = e.key === "enable power tools";
      if (selectedRowKeys.length > 0) {
        const { updatePowerTeacher, adminUsersData } = this.props;
        const selectedUsersEmailOrUsernames = selectedRowKeys.map(id => {
          const user = adminUsersData[id]?._source;
          if (user) {
            return user.email || user.username;
          }
        }).filter(u => !!u);
        updatePowerTeacher({
          usernames: selectedUsersEmailOrUsernames,
          enable: enableMode
        });
      } else {
        notification({messageKey: `pleaseSelectUserTo${enableMode ? "Enable" : "Disable"}PowerTools`});
      }
    }
  };

  closeEditSchoolAdminModal = () => {
    this.setState({
      editSchoolAdminModaVisible: false
    });
  };

  setPageNo = page => {
    this.setState({ currentPage: page }, this.loadFilteredList);
  };

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  createUser = createReq => {
    const { userOrgId, createAdminUser } = this.props;
    createReq.role = "school-admin";
    createReq.districtId = userOrgId;

    const o = {
      createReq,
      listReq: this.getSearchQuery()
    };

    createAdminUser(o);
    this.setState({ createSchoolAdminModalVisible: false });
  };

  closeCreateUserModal = () => {
    this.setState({
      createSchoolAdminModalVisible: false
    });
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedAdminsForDeactivate } = this.state;

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: "school-admin" },
      listReq: this.getSearchQuery()
    };

    deleteAdminUser(o);
    this.setState({
      deactivateAdminModalVisible: false
    });
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
          filterAdded: !!value
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
          filterAdded: !!event.target.value
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
          filterAdded: value !== ""
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
        const _item = {
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
    let { showActive } = this.state;

    const search = {};
    for (const [index, item] of filtersData.entries()) {
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
      search.name = searchByName;
    }

    const queryObj = {
      search,
      districtId: userOrgId,
      role: "school-admin",
      limit: 25,
      page: currentPage
      // uncomment after elastic search is fixed
      // sortField,
      // order
    };

    queryObj.status = 0;

    if (showActive) {
      queryObj.status = 1;
    }
    return queryObj;
  };

  loadFilteredList = () => {
    const { loadAdminData } = this.props;
    loadAdminData(this.getSearchQuery());
  };

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      createSchoolAdminModalVisible,
      editSchoolAdminModaVisible,
      editSchoolAdminKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,
      filtersData,
      currentPage,
      refineButtonActive
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const {
      userOrgId,
      role,
      adminUsersData: result,
      totalUsers,
      schoolsData,
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
      history,
      isProxyUser,
      t
    } = this.props;

    const columns = [
      {
        title: t("users.schooladmin.name"),
        dataIndex: "_source.firstName",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.firstName", "");
          const next = get(b, "_source.firstName", "");
          return next.localeCompare(prev);
        },
        render: (text, record, index) => {
          const name = getFullNameFromAsString(record._source);
          return name.split(" ").includes("Anonymous") || name.length === 0 ? "-" : name;
        },
        width: 200
      },
      {
        title: t("users.schooladmin.username"),
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
        title: t("users.schooladmin.sso"),
        dataIndex: "_source.lastSigninSSO",
        render: (sso = "N/A") => sso,
        width: 100
      },
      {
        title: t("users.schooladmin.school"),
        dataIndex: "_source.institutionDetails",
        render: (schools = []) => schools.map(school => school.name).join(", "),
        width: 200
      },
      {
        dataIndex: "_id",
        render: (id, { _source }) => {
          const name = getFullNameFromAsString(_source);
          const status = get(_source, "status", "");
          const fullName = name.split(" ").includes("Anonymous") || name.length === 0 ? "-" : name;
          return (
            <div style={{ whiteSpace: "nowrap" }}>
              {role === roleuser.DISTRICT_ADMIN && (
                <>
                  {status === 1 && !isProxyUser ? (
                    <StyledMaskButton onClick={() => this.onProxySchoolAdmin(id)} title={`Act as ${fullName}`}>
                      <GiDominoMask />
                    </StyledMaskButton>
                  ) : null}
                  <StyledTableButton onClick={() => this.onEditSchoolAdmin(id)} title="Edit">
                    <IconPencilEdit color={themeColor} />
                  </StyledTableButton>
                  <StyledTableButton onClick={() => this.handleDeactivateAdmin(id)} title="Deactivate">
                    <IconTrash color={themeColor} />
                  </StyledTableButton>
                </>
              )}
            </div>
          );
        },
        width: 100
      }
    ];

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">{t("users.schooladmin.updateuser")}</Menu.Item>
        <Menu.Item key="deactivate user">{t("users.schooladmin.deactivateuser")}</Menu.Item>
        <Menu.Item key="enable power tools">{t("users.schooladmin.enablePowerTools")}</Menu.Item>
        <Menu.Item key="disable power tools">{t("users.schooladmin.disablePowerTools")}</Menu.Item>
      </Menu>
    );
    const breadcrumbData = [
      {
        title: "MANAGE SCHOOL",
        to: "/author/users/school-admin"
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
          <StyledButton type="default" shape="round" icon="filter" onClick={this._onRefineResultsCB}>
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
                    value={filtersColumn || undefined}
                    style={{}}
                  >
                    <Option value="other" disabled>
                      {t("common.selectcolumn")}
                    </Option>
                    <Option value="username">{t("users.schooladmin.username")}</Option>
                    <Option value="email">{t("users.schooladmin.email")}</Option>
                    <Option value="status">{t("users.schooladmin.status")}</Option>
                    {/* TO DO: Uncomment after backend is done */}
                    {/* <Option value="institutionNames">School</Option> */}
                  </StyledFilterSelect>
                  <StyledFilterSelect
                    placeholder={t("common.selectvalue")}
                    onChange={e => this.changeFilterValue(e, i)}
                    value={filtersValue || undefined}
                  >
                    <Option value="" disabled>
                      {t("common.selectvalue")}
                    </Option>
                    <Option value="eq">Equals</Option>
                    {!filterStrDD[filtersColumn] ? <Option value="cont">Contains</Option> : null}
                  </StyledFilterSelect>
                  {!filterStrDD[filtersColumn] ? (
                    <StyledFilterInput
                      placeholder={t("common.entertext")}
                      onChange={e => this.changeFilterText(e, i)}
                      onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                      onBlur={e => this.onBlurFilterText(e, i)}
                      value={filterStr || undefined}
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
            <Button type="primary" onClick={this.showCreateSchoolAdminModal}>
              {t("users.schooladmin.createschooladmin")}
            </Button>
          </LeftFilterDiv>

          <RightFilterDiv width={40}>
            <CheckboxLabel
              checked={this.state.showActive}
              onChange={this.onChangeShowActive}
              disabled={!!filtersData.find(item => item.filtersColumn === "status")}
            >
              {t("common.showcurrent")}
            </CheckboxLabel>
            {role === roleuser.DISTRICT_ADMIN ? (
              <StyledActionDropDown overlay={actionMenu}>
                <Button>
                  {t("common.actions")} <Icon type="down" />
                </Button>
              </StyledActionDropDown>
            ) : null}
          </RightFilterDiv>
        </StyledFilterDiv>
        <TableContainer>
          <StyledSchoolAdminTable
            rowKey={record => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(result)}
            columns={columns}
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalUsers}
            onChange={page => this.setPageNo(page)}
            hideOnSinglePage
            pagination={{
              current: pageNo,
              total: totalUsers,
              pageSize: 25,
              onChange: page => setPageNo(page)
            }}
          />
        </TableContainer>
        {createSchoolAdminModalVisible && (
          <CreateSchoolAdminModal
            modalVisible={createSchoolAdminModalVisible}
            createSchoolAdmin={this.createUser}
            closeModal={this.closeCreateUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {editSchoolAdminModaVisible && (
          <EditSchoolAdminModal
            schoolAdminData={result[editSchoolAdminKey]}
            modalVisible={editSchoolAdminModaVisible}
            updateSchoolAdmin={updateAdminUser}
            closeModal={this.closeEditSchoolAdminModal}
            userOrgId={userOrgId}
            schoolsList={schoolsData}
            t={t}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t("users.schooladmin.deactivatesa.title")}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={t("common.modalConfirmationText1") + t("users.schooladmin.deactivatesa.schooladmins")}
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
      </MainContainer>
    );
  }
}

const enhance = compose(
  withNamespaces("manageDistrict"),
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      role: getUserRole(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      schoolsData: getSchoolsSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      isProxyUser: isProxyUserSelector(state)
    }),
    {
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
      loadSchoolsData: receiveSchoolsAction,
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
      updatePowerTeacher: updatePowerTeacherAction
    }
  )
);

export default enhance(SchoolAdminTable);

SchoolAdminTable.propTypes = {
  loadAdminData: PropTypes.func.isRequired,
  createAdminUser: PropTypes.func.isRequired,
  updateAdminUser: PropTypes.func.isRequired,
  deleteAdminUser: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  adminUsersData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  showActiveUsers: PropTypes.bool.isRequired,
  pageNo: PropTypes.number.isRequired,
  changeFilterColumn: PropTypes.func.isRequired,
  setPageNo: PropTypes.func.isRequired,
  setShowActiveUsers: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  changeFilterType: PropTypes.func.isRequired,
  changeFilterValue: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired
};
