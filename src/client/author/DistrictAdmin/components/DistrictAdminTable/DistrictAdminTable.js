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

import CreateDistrictAdminModal from "./CreateDistrictAdminModal/CreateDistrictAdminModal";
import EditDistrictAdminModal from "./EditDistrictAdminModal/EditDistrictAdminModal";

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

class DistrictAdminTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      createDistrictAdminModalVisible: false,
      editDistrictAdminModaVisible: false,
      editDistrictAdminKey: "",
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
        dataIndex: "_id",
        render: id => [
          <StyledTableButton key={`${id}0`} onClick={() => this.onEditDistrictAdmin(id)}>
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
    setRole("district-admin");
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

  onEditDistrictAdmin = key => {
    this.setState({
      editDistrictAdminModaVisible: true,
      editDistrictAdminKey: key
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
    deleteAdminUser({ userIds: selectedAdminsForDeactivate, role: "district-admin" });
    this.setState({
      deactivateAdminModalVisible: false
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showCreateDistrictAdminModal = () => {
    this.setState({
      createDistrictAdminModalVisible: true
    });
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    if (e.key === "edit user") {
      if (selectedRowKeys.length === 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length === 1) {
        this.onEditDistrictAdmin(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true
        });
        // deleteDistrictAdmin(selectedDistrictAdminData);
      } else {
        message.error("Please select users to delete.");
      }
    }
  };

  createDistrictAdmin = newDistrictAdminData => {
    const { userOrgId, createAdminUser } = this.props;
    newDistrictAdminData.role = "district-admin";
    newDistrictAdminData.districtId = userOrgId;
    createAdminUser(newDistrictAdminData);
    this.setState({ createDistrictAdminModalVisible: false });
  };

  closeCreateDistrictAdminModal = () => {
    this.setState({
      createDistrictAdminModalVisible: false
    });
  };

  closeEditDistrictAdminModal = () => {
    this.setState({
      editDistrictAdminModaVisible: false
    });
  };

  searchByName = e => {
    const { setSearchName } = this.props;
    setSearchName(e);
  };

  render() {
    const {
      selectedRowKeys,
      createDistrictAdminModalVisible,
      editDistrictAdminModaVisible,
      editDistrictAdminKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

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

    // const selectedDistrictAdmin = dataSource.filter(item => item._id === editDistrictAdminKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    const filterKeysArray = Object.keys(filters);

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateDistrictAdminModal}>
            + Create District Admin
          </Button>
          {createDistrictAdminModalVisible && (
            <CreateDistrictAdminModal
              modalVisible={createDistrictAdminModalVisible}
              createDistrictAdmin={this.createDistrictAdmin}
              closeModal={this.closeCreateDistrictAdminModal}
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
        {editDistrictAdminModaVisible && (
          <EditDistrictAdminModal
            districtAdminData={result[editDistrictAdminKey]}
            modalVisible={editDistrictAdminModaVisible}
            updateDistrictAdmin={updateAdminUser}
            closeModal={this.closeEditDistrictAdminModal}
            userOrgId={userOrgId}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following district admin(s)?"
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

export default enhance(DistrictAdminTable);

// DistrictAdminTable.propTypes = {
//   districtAdminData: PropTypes.array.isRequired,
//   loadDistrictAdminData: PropTypes.func.isRequired,
//   createDistrictAdmin: PropTypes.func.isRequired,
//   updateDistrictAdmin: PropTypes.func.isRequired,
//   deleteDistrictAdmin: PropTypes.func.isRequired,
//   setSearchName: PropTypes.func.isRequired,
//   setFilters: PropTypes.func.isRequired,
//   userOrgId: PropTypes.string.isRequired
// };
