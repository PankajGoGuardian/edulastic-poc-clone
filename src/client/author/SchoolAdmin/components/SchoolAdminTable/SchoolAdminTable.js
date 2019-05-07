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

import CreateSchoolAdminModal from "./CreateSchoolAdminModal/CreateSchoolAdminModal";
import EditSchoolAdminModal from "./EditSchoolAdminModal/EditSchoolAdminModal";

import {
  receiveSchoolAdminAction,
  createSchoolAdminAction,
  updateSchoolAdminAction,
  deleteSchoolAdminAction,
  setSearchNameAction,
  setFiltersAction
} from "../../ducks";

import { getSchoolAdminSelector } from "../../ducks";

import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";
import { getUserOrgId } from "../../../src/selectors/user";

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

class SchoolAdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      createSchoolAdminModalVisible: false,
      editSchoolAdminModaVisible: false,
      editSchoolAdminKey: -1,
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
        title: "School",
        dataIndex: "institutionIds",
        render: (text, record) => {
          const schools = [];
          if (record.hasOwnProperty("institutionIds")) {
            record.institutionIds.map(row => {
              schools.push(
                <React.Fragment>
                  <span>{row}</span>
                  <br />
                </React.Fragment>
              );
            });
          }
          return <React.Fragment>{schools}</React.Fragment>;
        }
      },
      {
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditSchoolAdmin(record.key)}>
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
    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({ body: { districtId: userOrgId } });

    const { loadSchoolAdminData } = this.props;
    loadSchoolAdminData({
      type: "SCHOOL",
      search: {
        role: "school-admin"
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.schoolAdminData.length === undefined) {
      return {
        dataSource: []
      };
    } else {
      return {
        dataSource: nextProps.schoolAdminData
      };
    }
  }

  onEditSchoolAdmin = key => {
    this.setState({
      editSchoolAdminModaVisible: true,
      editSchoolAdminKey: key
    });
  };

  cancel = key => {
    const data = [...this.state.dataSource];
    this.setState({ dataSource: data.filter(item => item.key !== key) });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    const { userOrgId } = this.props;

    const selectedSchoolAdmin = data.filter(item => item.key == key);

    const { deleteSchoolAdmin } = this.props;
    deleteSchoolAdmin([{ userId: selectedSchoolAdmin[0]._id, districtId: userOrgId }]);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: true
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
        this.onEditSchoolAdmin(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        const data = [...this.state.dataSource];
        const { userOrgId } = this.props;

        const selectedSchoolsData = [];
        selectedRowKeys.map(value => {
          selectedSchoolsData.push({ userId: data[value]._id, districtId: userOrgId });
        });
        const { deleteSchoolAdmin } = this.props;
        deleteSchoolAdmin(selectedSchoolsData);
      } else {
        message.error("Please select schools to delete.");
      }
    }
  };

  createSchoolAdmin = newSchoolAdminData => {
    const { userOrgId, createSchoolAdmin } = this.props;
    newSchoolAdminData.role = "school-admin";
    newSchoolAdminData.districtId = userOrgId;
    createSchoolAdmin(newSchoolAdminData);
    this.setState({ createSchoolAdminModalVisible: false });
  };

  closeCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: false
    });
  };

  updateSchoolAdmin = updatedSchoolAdminData => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => updatedSchoolAdminData.key === item.key);
    delete updatedSchoolAdminData.key;
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...updatedSchoolAdminData
      });
      this.setState({ dataSource: newData });
    } else {
      newData.push(updatedSchoolData);
      this.setState({ dataSource: newData });
    }
    this.setState({
      isChangeState: true,
      editSchoolAdminModaVisible: false
    });

    const { updateSchoolAdmin } = this.props;
    updateSchoolAdmin({ userId: newData[index]._id, data: updatedSchoolAdminData });
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
    const columns = this.columns.map(col => {
      return {
        ...col
      };
    });

    const {
      dataSource,
      selectedRowKeys,
      createSchoolAdminModalVisible,
      editSchoolAdminModaVisible,
      editSchoolAdminKey,
      filters,
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { schoolsData } = this.props;
    const selectedSchoolAdmin = dataSource.filter(item => item.key == editSchoolAdminKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    const isFilterTextDisable = filters.column === "" || filters.value === "";
    const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";

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
              schoolsData={schoolsData}
            />
          )}
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
            <Option value="school">School</Option>
          </StyledFilterSelect>
          <StyledFilterSelect placeholder="Select a value" onChange={this.changeFilterValue} value={filters.value}>
            <Option value="">Select a value</Option>
            <Option value="equals">Equals</Option>
            <Option value="contains">Contains</Option>
          </StyledFilterSelect>
          <StyledFilterInput
            placeholder="Enter text"
            onChange={this.changeFilterText}
            value={filters.text}
            disabled={isFilterTextDisable}
          />
          <StyledAddFilterButton type="primary" onClick={this.addFilter} disabled={isAddFilterDisable}>
            + Add Filter
          </StyledAddFilterButton>
          {filterAdded && (
            <StyledAddFilterButton type="primary" onClick={this.removeFilter}>
              - Remove Filter
            </StyledAddFilterButton>
          )}
        </StyledControlDiv>
        <StyledTable
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            onChange: this.cancel
          }}
        />
        {editSchoolAdminModaVisible && editSchoolAdminKey >= 0 && (
          <EditSchoolAdminModal
            schoolAdminData={selectedSchoolAdmin[0]}
            modalVisible={editSchoolAdminModaVisible}
            saveSchoolAdmin={this.updateSchoolAdmin}
            closeModal={this.closeEditSchoolAdminModal}
            schoolsData={schoolsData}
          />
        )}
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      schoolsData: getSchoolsSelector(state),
      userOrgId: getUserOrgId(state),
      schoolAdminData: getSchoolAdminSelector(state)
    }),
    {
      createSchoolAdmin: createSchoolAdminAction,
      updateSchoolAdmin: updateSchoolAdminAction,
      deleteSchoolAdmin: deleteSchoolAdminAction,
      loadSchoolsData: receiveSchoolsAction,
      loadSchoolAdminData: receiveSchoolAdminAction,
      setSearchName: setSearchNameAction,
      setFilters: setFiltersAction
    }
  )
);

export default enhance(SchoolAdminTable);

SchoolAdminTable.propTypes = {
  schoolAdminData: PropTypes.array.isRequired,
  loadSchoolAdminData: PropTypes.func.isRequired,
  createSchoolAdmin: PropTypes.func.isRequired,
  updateSchoolAdmin: PropTypes.func.isRequired,
  deleteSchoolAdmin: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  schoolAdminData: PropTypes.array.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired
};
