import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Icon, Select, message, Button, Menu, Checkbox } from "antd";
import { StyledComponents, TypeToConfirmModal } from "@edulastic/common";
import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledClassName,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown
} from "./styled";

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

import { getUserOrgId } from "../../../src/selectors/user";

import { getFullNameFromAsString } from "../../../../common/utils/helpers";

const { Option } = Select;
const { OnHoverTable, OnHoverButton } = StyledComponents;

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

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
    this.columns = [
      {
        title: "Name",
        dataIndex: "_source.firstName",
        sorter: (a, b) => compareByAlph(a.firstName, b.secondName),
        render: (text, record, index) => {
          let name = getFullNameFromAsString(record._source);
          return name ? name : "";
        }
      },
      {
        title: "Email",
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
        dataIndex: "_id",
        render: id => (
          <React.Fragment>
            <OnHoverButton onClick={() => this.onEditSchoolAdmin(id)}>
              <Icon type="edit" theme="twoTone" />
            </OnHoverButton>
            <OnHoverButton onClick={() => this.handleDeactivateAdmin(id)}>
              <Icon type="delete" theme="twoTone" />
            </OnHoverButton>
          </React.Fragment>
        )
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

  createSchoolAdmin = newSchoolAdminData => {
    const { userOrgId, createAdminUser } = this.props;
    newSchoolAdminData.role = "school-admin";
    newSchoolAdminData.districtId = userOrgId;
    createAdminUser(newSchoolAdminData);
    this.setState({ createSchoolAdminModalVisible: false });
  };

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
      role: "school-admin",
      limit: 25,
      page: currentPage,
      // uncomment after elastic search is fixed
      // status: this.state.showActive ? 1 : 0,
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

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateSchoolAdminModal}>
            + Add School Admin
          </Button>
          {createSchoolAdminModalVisible && (
            <CreateSchoolAdminModal
              modalVisible={createSchoolAdminModalVisible}
              createSchoolAdmin={this.createUser}
              closeModal={this.closeCreateUserModal}
              userOrgId={userOrgId}
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
                style={{}}
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
        <OnHoverTable
          rowKey={record => record._id}
          rowSelection={rowSelection}
          dataSource={Object.values(result)}
          columns={this.columns}
          pagination={{
            current: currentPage,
            total: totalUsers,
            pageSize: 25,
            onChange: page => this.setPageNo(page)
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
