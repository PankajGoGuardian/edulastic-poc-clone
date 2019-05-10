import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Popconfirm, Form, Icon, Select, message, Button } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTableButton,
  StyledFilterInput,
  StyledFilterButton,
  StyledSchoolSearch,
  StyledSelectStatus,
  StyledTable,
  StyledPagination
} from "./styled";

import CreateSchoolModal from "./CreateSchoolModal/CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal/EditSchoolModal";

// actions
import {
  receiveSchoolsAction,
  createSchoolsAction,
  updateSchoolsAction,
  deleteSchoolsAction,
  setSearchByNameValueAction
} from "../../ducks";

import { getSchoolsSelector } from "../../ducks";
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

class SchoolsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingKey: "",
      isAdding: false,
      selectedRowKeys: [],
      createSchoolModalVisible: false,
      editSchoolModaVisible: false,
      editSchoolKey: "",
      filtersColumn: "",
      filtersValue: "",
      filterStr: "",
      filterAdded: false,
      currentPage: 1
    };

    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        editable: true,
        sorter: (a, b) => compareByAlph(a.name, b.name)
      },
      {
        title: "City",
        dataIndex: "city",
        editable: true,
        sorter: (a, b) => compareByAlph(a.city, b.city)
      },
      {
        title: "State",
        dataIndex: "state",
        editable: true,
        sorter: (a, b) => compareByAlph(a.state, b.state)
      },
      {
        title: "Zip",
        dataIndex: "zip",
        editable: true,
        sorter: (a, b) => compareByAlph(a.zip, b.zip)
      },
      {
        title: "Status",
        dataIndex: "status",
        editable: true,
        sorter: (a, b) => compareByAlph(a.status, b.status),
        render: (text, record) => {
          return (
            <React.Fragment>{record.status == 0 ? <span>Approved</span> : <span>Not Approved</span>}</React.Fragment>
          );
        }
      },
      {
        title: "Teacher",
        dataIndex: "teachersCount",
        editable: true,
        sorter: (a, b) => a.teacher - b.teacher
      },
      {
        title: "Student",
        dataIndex: "studentsCount",
        editable: true,
        sorter: (a, b) => a.student - b.student
      },
      {
        title: "Section",
        dataIndex: "sectionsCount",
        editable: true,
        sorter: (a, b) => a.section - b.section
      },
      {
        dataIndex: "operation",
        width: "94px",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditSchool(record.key)}>
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
    loadSchoolsData({ districtId: userOrgId, limit: 10, page: 1 });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.schoolList.length === undefined) return { dataSource: [] };
    else return { dataSource: nextProps.schoolList };
  }

  onEditSchool = key => {
    this.setState({
      editSchoolModaVisible: true,
      editSchoolKey: key
    });
  };

  cancel = key => {
    const data = [...this.state.dataSource];
    this.setState({ dataSource: data.filter(item => item.key !== key) });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    this.setState({ dataSource: data.filter(item => item.key !== key) });
    const selectedSchool = data.filter(item => item.key == key);

    const { deleteSchool } = this.props;
    deleteSchool([{ schoolId: selectedSchool[0]._id, orgId: selectedSchool[0].districtId }]);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showCreateSchoolModal = () => {
    this.setState({
      createSchoolModalVisible: true
    });
  };

  changeFilterColumn = value => {
    this.setState({ filtersColumn: value });
  };

  changeFilterValue = value => {
    this.setState({ filtersValue: value });
  };

  changeFilterText = e => {
    this.setState({ filterStr: e.target.value });
  };

  addFilter = e => {
    const { loadSchoolsData, userOrgId } = this.props;
    const { filtersColumn, filtersValue, filterStr } = this.state;
    let searchValue = {};
    searchValue[filtersColumn] = { type: filtersValue, value: filterStr };

    loadSchoolsData({
      districtId: userOrgId,
      limit: 10,
      page: 1,
      search: searchValue
    });

    this.setState({
      filterAdded: true,
      currentPage: 1
    });
  };

  removeFilter = e => {
    this.setState({
      filtersColumn: "",
      filtersValue: "",
      filterStr: "",
      filterAdded: false,
      currentPage: 1
    });

    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({
      districtId: userOrgId,
      limit: 10,
      page: 1
    });
  };

  changeActionMode = value => {
    const { selectedRowKeys } = this.state;
    if (value === "edit school") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select school to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditSchool(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single school to edit.");
      }
    } else if (value === "deactivate school") {
      if (selectedRowKeys.length > 0) {
        const data = [...this.state.dataSource];
        this.setState({
          dataSource: data.filter(item => {
            if (selectedRowKeys.indexOf(item.key) == -1) return item;
          })
        });

        const selectedSchoolsData = [];
        selectedRowKeys.map(value => {
          selectedSchoolsData.push({ schoolId: data[value]._id, orgId: data[value].districtId });
        });
        const { deleteSchool } = this.props;
        deleteSchool(selectedSchoolsData);
      } else {
        message.error("Please select schools to delete.");
      }
    }
  };

  createSchool = newSchoolData => {
    const newData = {
      name: newSchoolData.name,
      districtId: this.props.districtId,
      location: {
        address: newSchoolData.address,
        city: newSchoolData.city,
        state: newSchoolData.state,
        zip: newSchoolData.zip,
        country: newSchoolData.country
      }
    };

    const { createSchool } = this.props;
    createSchool({ body: newData });

    this.setState({ createSchoolModalVisible: false });
  };

  closeCreateSchoolModal = () => {
    this.setState({
      createSchoolModalVisible: false
    });
  };

  updateSchool = updatedSchoolData => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => updatedSchoolData.key === item.key);
    delete updateSchoolsAction.key;
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...updatedSchoolData
      });
      this.setState({ dataSource: newData, editingKey: "" });
    } else {
      newData.push(updatedSchoolData);
      this.setState({ dataSource: newData, editingKey: "" });
    }

    this.setState({
      isAdding: false,
      isChangeState: true,
      editSchoolModaVisible: false
    });

    const updateData = {
      _id: newData[index]._id,
      name: newData[index].name,
      districtId: newData[index].districtId,
      location: {
        address: updatedSchoolData.address,
        city: updatedSchoolData.city,
        state: updatedSchoolData.state,
        country: newData[index].country,
        zip: updatedSchoolData.zip
      }
    };
    const { updateSchool } = this.props;
    updateSchool({ id: newData[index]._id, body: updateData });
  };

  closeEditSchoolModal = () => {
    this.setState({
      editSchoolModaVisible: false
    });
  };

  searchByName = value => {
    const { setSearchByName } = this.props;
    setSearchByName(value);
  };

  changePagination = pageNumber => {
    this.setState({ currentPage: pageNumber });
    const { loadSchoolsData, userOrgId } = this.props;
    const { filterAdded, filtersColumn, filtersValue, filterStr } = this.state;
    if (filterAdded) {
      let searchValue = {};
      searchValue[filtersColumn] = { type: filtersValue, value: filterStr };

      loadSchoolsData({
        districtId: userOrgId,
        limit: 10,
        page: pageNumber,
        search: searchValue
      });
    } else {
      loadSchoolsData({ districtId: userOrgId, limit: 10, page: pageNumber });
    }
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
      createSchoolModalVisible,
      editSchoolModaVisible,
      editSchoolKey,
      filtersColumn,
      filtersValue,
      filterStr,
      filterAdded,
      currentPage
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const editSchoolData = dataSource.filter(item => item.key === editSchoolKey);

    const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
    const isAddFilterDisable = filtersColumn === "" || filtersValue === "" || filterStr === "";

    const totalSchoolsCount = Math.ceil(this.props.totalSchoolsCount);

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateSchoolModal}>
            + Create School
          </Button>
          {createSchoolModalVisible && (
            <CreateSchoolModal
              modalVisible={createSchoolModalVisible}
              createSchool={this.createSchool}
              closeModal={this.closeCreateSchoolModal}
              dataSource={dataSource}
            />
          )}

          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />
          <StyledSelectStatus defaultValue="" onChange={this.changeActionMode}>
            <Option value="">Actions</Option>
            <Option value="edit school">Edit School</Option>
            <Option value="deactivate school">Deactivate School</Option>
          </StyledSelectStatus>
        </StyledControlDiv>
        <StyledControlDiv>
          <StyledFilterSelect
            placeholder="Select a column"
            onChange={this.changeFilterColumn}
            value={filtersColumn}
            disabled={filterAdded}
          >
            <Option value="">Select a column</Option>
            <Option value="name">Name</Option>
            <Option value="city">City</Option>
            <Option value="state">State</Option>
            <Option value="zip">Zip</Option>
            <Option value="status">Status</Option>
          </StyledFilterSelect>
          <StyledFilterSelect
            placeholder="Select a value"
            onChange={this.changeFilterValue}
            value={filtersValue}
            disabled={filterAdded}
          >
            <Option value="">Select a value</Option>
            <Option value="eq">Equals</Option>
            <Option value="cont">Contains</Option>
          </StyledFilterSelect>
          <StyledFilterInput
            placeholder="Enter text"
            onChange={this.changeFilterText}
            value={filterStr}
            disabled={isFilterTextDisable || filterAdded}
          />
          <StyledFilterButton type="primary" onClick={this.addFilter} disabled={isAddFilterDisable || filterAdded}>
            + Add Filter
          </StyledFilterButton>
          {filterAdded && (
            <StyledFilterButton type="primary" onClick={this.removeFilter}>
              - Remove Filter
            </StyledFilterButton>
          )}
        </StyledControlDiv>
        <StyledTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} pagination={false} />
        <StyledPagination
          defaultCurrent={1}
          current={currentPage}
          total={totalSchoolsCount}
          onChange={this.changePagination}
        />

        {editSchoolModaVisible && editSchoolKey !== "" && (
          <EditSchoolModal
            schoolData={editSchoolData[0]}
            modalVisible={editSchoolModaVisible}
            updateSchool={this.updateSchool}
            closeModal={this.closeEditSchoolModal}
          />
        )}
      </StyledTableContainer>
    );
  }
}

const EditableSchoolsTable = Form.create()(SchoolsTable);
const enhance = compose(
  connect(
    state => ({
      schoolList: getSchoolsSelector(state),
      userOrgId: getUserOrgId(state),
      totalSchoolsCount: get(state, ["schoolsReducer", "totalSchools"], 0)
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      createSchool: createSchoolsAction,
      updateSchool: updateSchoolsAction,
      deleteSchool: deleteSchoolsAction,
      setSearchByName: setSearchByNameValueAction
    }
  )
);

export default enhance(EditableSchoolsTable);

SchoolsTable.propTypes = {
  loadSchoolsData: PropTypes.func.isRequired,
  updateSchool: PropTypes.func.isRequired,
  createSchool: PropTypes.func.isRequired,
  deleteSchool: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired
};
