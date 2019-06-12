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
      selectedAdminsForDeactivate: []
    };
    this.columns = [
      {
        title: "First Name",
        dataIndex: "_source.firstName",
        sorter: (a, b) => compareByAlph(a.firstName, b.secondName)
      },
      {
        title: "Last Name",
        dataIndex: "_source.lastName",
        sorter: (a, b) => compareByAlph(a.lastName, b.lastName)
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
  }

  componentDidMount() {
    const { loadAdminData, loadSchoolsData, userOrgId, setRole } = this.props;
    loadSchoolsData({
      districtId: userOrgId
    });
    setRole("school-admin");
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

  onEditSchoolAdmin = id => {
    this.setState({
      editSchoolAdminModaVisible: true,
      editSchoolAdminKey: id
    });
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedAdminsForDeactivate } = this.state;
    deleteAdminUser({ userIds: selectedAdminsForDeactivate, role: "school-admin" });
    this.setState({
      deactivateAdminModalVisible: false
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

  createSchoolAdmin = newSchoolAdminData => {
    const { userOrgId, createAdminUser } = this.props;
    newSchoolAdminData.role = "school-admin";
    newSchoolAdminData.districtId = userOrgId;
    createAdminUser(newSchoolAdminData);
    this.setState({ createSchoolAdminModalVisible: false });
  };

  closeCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: false
    });
  };

  closeEditSchoolAdminModal = () => {
    this.setState({
      editSchoolAdminModaVisible: false
    });
  };

  searchByName = e => {
    const { setSearchName } = this.props;
    setSearchName(e);
  };

  render() {
    const {
      selectedRowKeys,
      createSchoolAdminModalVisible,
      editSchoolAdminModaVisible,
      editSchoolAdminKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const {
      userOrgId,
      adminUsersData: { result = {}, totalUsers },
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
    // const selectedSchoolAdmin = dataSource.filter(item => item.key == editSchoolAdminKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    // const isFilterTextDisable = filters.column === "" || filters.value === "";
    // const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";
    const filterKeysArray = Object.keys(filters);

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateSchoolAdminModal}>
            + Add School Admin
          </Button>
          {createSchoolAdminModalVisible && (
            <CreateSchoolAdminModal
              modalVisible={createSchoolAdminModalVisible}
              createSchoolAdmin={this.createSchoolAdmin}
              closeModal={this.closeCreateSchoolAdminModal}
              userOrgId={userOrgId}
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
        <OnHoverTable
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
