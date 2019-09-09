import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { Icon, Select, message, Button, Menu, Checkbox } from "antd";
import { StyledComponents, TypeToConfirmModal } from "@edulastic/common";

import { roleuser } from "@edulastic/constants";

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
import { StyledTable, StyledTableContainer } from "./styled";

import CreateSchoolAdminModal from "./CreateSchoolAdminModal/CreateSchoolAdminModal";
import EditSchoolAdminModal from "./EditSchoolAdminModal/EditSchoolAdminModal";

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
} from "../../ducks";

import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";

import { getUserOrgId, getUserRole } from "../../../src/selectors/user";

import { getFullNameFromAsString } from "../../../../common/utils/helpers";

const { Option } = Select;
const { OnHoverTable, OnHoverButton } = StyledComponents;

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
      currentPage: 1
    };
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

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    if (e.key === "edit user") {
      if (selectedRowKeys.length === 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length === 1) {
        this.onEditSchoolAdmin(selectedRowKeys[0]);
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
        message.error("Please select schools to delete.");
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

    let o = {
      createReq: createReq,
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
      role: "school-admin",
      limit: 25,
      page: currentPage
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
      currentPage
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
      removeFilter
    } = this.props;

    const columns = [
      {
        title: "Name",
        dataIndex: "_source.firstName",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.firstName", "");
          const next = get(b, "_source.firstName", "");
          return next.localeCompare(prev);
        },
        render: (text, record, index) => {
          let name = getFullNameFromAsString(record._source);
          return name.split(" ").includes("Anonymous") || name.length === 0 ? "-" : name;
        },
        width: 200
      },
      {
        title: "Username",
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
        title: "SSO",
        dataIndex: "_source.lastSigninSSO",
        render: (sso = "N/A") => sso,
        width: 100
      },
      {
        title: "School",
        dataIndex: "_source.institutionDetails",
        render: (schools = []) => schools.map(school => school.name).join(", "),
        width: 200
      },
      {
        dataIndex: "_id",
        render: id => (
          <React.Fragment>
            {role === roleuser.DISTRICT_ADMIN && (
              <>
                <OnHoverButton onClick={() => this.onEditSchoolAdmin(id)} title="Edit">
                  <Icon type="edit" theme="twoTone" />
                </OnHoverButton>
                <OnHoverButton onClick={() => this.handleDeactivateAdmin(id)} title="Deactivate">
                  <Icon type="delete" theme="twoTone" />
                </OnHoverButton>
              </>
            )}
          </React.Fragment>
        ),
        width: 100
      }
    ];

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );
    return (
      <StyledTableContainer>
        <StyledFilterDiv>
          <div>
            <Button type="primary" onClick={this.showCreateSchoolAdminModal}>
              + Add School Admin
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
            {role === roleuser.DISTRICT_ADMIN ? (
              <StyledActionDropDown overlay={actionMenu}>
                <Button>
                  Actions <Icon type="down" />
                </Button>
              </StyledActionDropDown>
            ) : null}
          </RightFilterDiv>
        </StyledFilterDiv>
        {createSchoolAdminModalVisible && (
          <CreateSchoolAdminModal
            modalVisible={createSchoolAdminModalVisible}
            createSchoolAdmin={this.createUser}
            closeModal={this.closeCreateUserModal}
            userOrgId={userOrgId}
          />
        )}
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
                style={{}}
              >
                <Option value="other" disabled={true}>
                  Select a column
                </Option>
                <Option value="username">Username</Option>
                <Option value="email">Email</Option>
                <Option value="status">Status</Option>
                {/* TO DO: Uncomment after backend is done */}
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
          columns={columns}
          pagination={false}
          scroll={{ y: 500 }}
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
        {editSchoolAdminModaVisible && (
          <EditSchoolAdminModal
            schoolAdminData={result[editSchoolAdminKey]}
            modalVisible={editSchoolAdminModaVisible}
            updateSchoolAdmin={updateAdminUser}
            closeModal={this.closeEditSchoolAdminModal}
            userOrgId={userOrgId}
            schoolsList={schoolsData}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following school admin(s)?"
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
      role: getUserRole(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      schoolsData: getSchoolsSelector(state),
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
      setRole: setRoleAction
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
  changeFilterColumn: PropTypes.func.isRequired,
  changeFilterType: PropTypes.func.isRequired,
  changeFilterValue: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired
};
