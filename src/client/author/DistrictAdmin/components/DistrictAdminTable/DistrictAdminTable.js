import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { Popconfirm, Icon, Select, message, Button, Menu, Table } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTable,
  StyledTableButton,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown
} from "./styled";

import CreateDistrictAdminModal from "./CreateDistrictAdminModal/CreateDistrictAdminModal";
import EditDistrictAdminModal from "./EditDistrictAdminModal/EditDistrictAdminModal";

import {
  receiveDistrictAdminAction,
  createDistrictAdminAction,
  updateDistrictAdminAction,
  deleteDistrictAdminAction,
  setSearchNameAction,
  setFiltersAction
} from "../../ducks";

import { getDistrictAdminSelector } from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

class DistrictAdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      createDistrictAdminModalVisible: false,
      editDistrictAdminModaVisible: false,
      editDistrictAdminKey: -1,
      filters: {
        column: "",
        value: "",
        text: ""
      },
      filterAdded: false
    };
    this.columns = [
      {
        title: "First Name",
        dataIndex: "firstName",
        editable: true,
        sorter: (a, b) => compareByAlph(a.firstName, b.secondName)
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        editable: true,
        sorter: (a, b) => compareByAlph(a.lastName, b.lastName)
      },
      {
        title: "Email",
        dataIndex: "email",
        editable: true,
        sorter: (a, b) => compareByAlph(a.email, b.email)
      },
      {
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditDistrictAdmin(record.key)}>
                <Icon type="edit" theme="twoTone" />
              </StyledTableButton>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <StyledTableButton>
                  <Icon type="delete" theme="twoTone" />
                </StyledTableButton>
              </Popconfirm>
            </React.Fragment>
          );
        }
      }
    ];
  }

  componentDidMount() {
    const { loadDistrictAdminData } = this.props;
    loadDistrictAdminData({
      type: "DISTRICT",
      search: {
        role: "district-admin"
      }
    });

    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({ body: { districtId: userOrgId } });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.districtAdminData.length === undefined) return { dataSource: [] };
    else return { dataSource: nextProps.districtAdminData };
  }

  onEditDistrictAdmin = key => {
    this.setState({
      editDistrictAdminModaVisible: true,
      editDistrictAdminKey: key
    });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    const { userOrgId } = this.props;

    const selectedDistrictAdmin = data.filter(item => item.key == key);

    const { deleteDistrictAdmin } = this.props;
    deleteDistrictAdmin([{ userId: selectedDistrictAdmin[0]._id, districtId: userOrgId }]);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showCreateDistrictAdminModal = () => {
    this.setState({
      createDistrictAdminModalVisible: true
    });
  };

  changeFilterColumn = value => {
    const filtersData = this.state.filters;
    filtersData.column = value;
    this.setState({ filters: filtersData });
  };

  changeFilterValue = value => {
    const filtersData = this.state.filters;
    filtersData.value = value;
    this.setState({ filters: filtersData });
  };

  changeFilterText = e => {
    const filtersData = this.state.filters;
    filtersData.text = e.target.value;
    this.setState({ filters: filtersData });
  };

  addFilter = e => {
    const { filters } = this.state;
    const { setFilters } = this.props;
    this.setState({ filterAdded: true });
    setFilters(filters);
  };

  removeFilter = e => {
    const filtersData = {
      column: "",
      value: "",
      text: ""
    };

    this.setState({
      filters: filtersData,
      filterAdded: false
    });
    const { setFilters } = this.props;
    setFilters(filtersData);
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    if (e.key === "edit user") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditDistrictAdmin(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        const data = [...this.state.dataSource];
        const { userOrgId } = this.props;

        const selectedDistrictAdminData = [];
        selectedRowKeys.map(value => {
          selectedDistrictAdminData.push({ userId: data[value]._id, districtId: userOrgId });
        });
        const { deleteDistrictAdmin } = this.props;
        deleteDistrictAdmin(selectedDistrictAdminData);
      } else {
        message.error("Please select users to delete.");
      }
    }
  };

  createDistrictAdmin = newDistrictAdminData => {
    const { userOrgId, createDistrictAdmin } = this.props;
    newDistrictAdminData.role = "district-admin";
    newDistrictAdminData.districtId = userOrgId;
    createDistrictAdmin(newDistrictAdminData);
    this.setState({ createDistrictAdminModalVisible: false });
  };

  closeCreateDistrictAdminModal = () => {
    this.setState({
      createDistrictAdminModalVisible: false
    });
  };

  updateDistrictAdmin = updatedDistrictAdminData => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => updatedDistrictAdminData.key === item.key);
    delete updatedDistrictAdminData.key;
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...updatedDistrictAdminData
      });
      this.setState({ dataSource: newData });
    } else {
      newData.push(updatedDistrictData);
      this.setState({ dataSource: newData });
    }
    this.setState({
      isChangeState: true,
      editDistrictAdminModaVisible: false
    });

    const { updateDistrictAdmin } = this.props;
    updateDistrictAdmin({ userId: newData[index]._id, data: updatedDistrictAdminData });
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
    const columns = this.columns.map(col => {
      return {
        ...col
      };
    });

    const {
      dataSource,
      selectedRowKeys,
      createDistrictAdminModalVisible,
      editDistrictAdminModaVisible,
      editDistrictAdminKey,
      filters,
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { schoolsData } = this.props;

    const selectedDistrictAdmin = dataSource.filter(item => item.key == editDistrictAdminKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateDistrictAdminModal}>
            + Create District Admin
          </Button>
          <CreateDistrictAdminModal
            modalVisible={createDistrictAdminModalVisible}
            createDistrictAdmin={this.createDistrictAdmin}
            closeModal={this.closeCreateDistrictAdminModal}
            schoolsData={schoolsData}
          />
          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />

          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        <StyledControlDiv>
          <StyledFilterSelect placeholder="Select a column" onChange={this.changeFilterColumn} value={filters.column}>
            <Option value="">Select a column</Option>
            <Option value="firstName">Frist Name</Option>
            <Option value="lastName">Last Name</Option>
            <Option value="email">Email</Option>
          </StyledFilterSelect>
          <StyledFilterSelect placeholder="Select a value" onChange={this.changeFilterValue} value={filters.value}>
            <Option value="">Select a value</Option>
            <Option value="equals">Equals</Option>
            <Option value="contains">Contains</Option>
          </StyledFilterSelect>
          <StyledFilterInput placeholder="Enter text" onChange={this.changeFilterText} value={filters.text} />
          <StyledAddFilterButton type="primary" onClick={this.addFilter}>
            + Add Filter
          </StyledAddFilterButton>
          {filterAdded && (
            <StyledAddFilterButton type="primary" onClick={this.removeFilter}>
              - Remove Filter
            </StyledAddFilterButton>
          )}
        </StyledControlDiv>
        <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
        {editDistrictAdminModaVisible && editDistrictAdminKey >= 0 && (
          <EditDistrictAdminModal
            districtAdminData={selectedDistrictAdmin[0]}
            modalVisible={editDistrictAdminModaVisible}
            saveDistrictAdmin={this.updateDistrictAdmin}
            closeModal={this.closeEditDistrictAdminModal}
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
      districtAdminData: getDistrictAdminSelector(state),
      schoolsData: getSchoolsSelector(state)
    }),
    {
      createDistrictAdmin: createDistrictAdminAction,
      updateDistrictAdmin: updateDistrictAdminAction,
      deleteDistrictAdmin: deleteDistrictAdminAction,
      loadDistrictAdminData: receiveDistrictAdminAction,
      setSearchName: setSearchNameAction,
      setFilters: setFiltersAction,
      loadSchoolsData: receiveSchoolsAction
    }
  )
);

export default enhance(DistrictAdminTable);

DistrictAdminTable.propTypes = {
  districtAdminData: PropTypes.array.isRequired,
  loadDistrictAdminData: PropTypes.func.isRequired,
  createDistrictAdmin: PropTypes.func.isRequired,
  updateDistrictAdmin: PropTypes.func.isRequired,
  deleteDistrictAdmin: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  districtAdminData: PropTypes.array.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired
};
