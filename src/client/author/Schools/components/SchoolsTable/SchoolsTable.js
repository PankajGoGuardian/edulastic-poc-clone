import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { Popconfirm, Form, Icon, Select, message, Button, Table } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTableButton,
  StyledFilterInput,
  StyledFilterButton,
  StyledSchoolSearch,
  StyledSelectStatus
} from "./styled";

import CreateSchoolModal from "./CreateSchoolModal/CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal/EditSchoolModal";

// actions
import { createSchoolsAction, updateSchoolsAction, deleteSchoolsAction } from "../../ducks";

// selectors
import { getCreatedSchoolSelector } from "../../ducks";

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

    const schoolsData = this.initialDataSrouce(this.props.schoolsData);

    this.state = {
      dataSource: schoolsData,
      editingKey: "",
      isAdding: false,
      selectedRowKeys: [],
      createSchoolModalVisible: false,
      editSchoolModaVisible: false,
      editSchoolKey: -1,
      filtersColumn: "",
      filtersValue: "",
      filterStr: "",
      filterAdded: false,
      created: props.created
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.created._id !== prevState.created._id) {
      debugger;
      const { dataSource } = prevState;
      const newSchool = {
        key: dataSource.length,
        ...nextProps.created
      };
      return {
        dataSource: [newSchool, ...dataSource],
        created: nextProps.created
      };
    } else return null;
  }

  initialDataSrouce = data => {
    const dataSource = [];
    data.map((row, index) => {
      row.key = index;
      row.name = row.name;
      row.city = row.hasOwnProperty("city") && row.city != null ? row.city : "";
      row.state = row.hasOwnProperty("state") && row.state != null ? row.state : "";
      row.zip = row.hasOwnProperty("zip") && row.zip != null ? row.zip : "";
      row.country = row.hasOwnProperty("country") && row.country != null ? row.country : "";
      row.state = row.hasOwnProperty("state") && row.state != null ? row.state : "";
      row.teachersCount = row.hasOwnProperty("teachersCount") && row.teachersCount != null ? row.teachersCount : 0;
      row.studentsCount = row.hasOwnProperty("studentsCount") && row.studentsCount != null ? row.studentsCount : 0;
      row.sectionsCount = row.hasOwnProperty("sectionsCount") && row.sectionsCount != null ? row.sectionsCount : 0;
      dataSource.push(row);
    });
    return dataSource;
  };

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
    this.setState({ changeFilterValue: value });
  };

  changeFilterText = e => {
    this.setState({ filterStr: e.target.value });
  };

  addFilter = e => {
    const { filtersColumn, filtersValue, filterStr } = this.state;
    const dataSource = this.initialDataSrouce(this.props.schoolsData);

    let possibleFilterKey = [];

    if (filtersColumn !== "") {
      possibleFilterKey.push(filtersColumn);
    } else {
      possibleFilterKey = ["name", "city", "sectionsCount", "state", "studentsCount", "teachersCount", "zip"];
    }

    const filterSource = dataSource.filter(row => {
      if (filterStr === "") {
        return row;
      } else {
        if (filtersValue === "equals") {
          const equalKeys = possibleFilterKey.filter(key => row[key] === filterStr);
          if (equalKeys.length > 0) return row;
        } else if (filtersValue === "contains" || filtersValue === "") {
          const equalKeys = possibleFilterKey.filter(key => row[key].toString().indexOf(filterStr) !== -1);
          if (equalKeys.length > 0) return row;
        }
      }
    });

    this.setState({
      dataSource: filterSource,
      filterAdded: true
    });
  };

  removeFilter = e => {
    const dataSource = this.initialDataSrouce(this.props.schoolsData);
    this.setState({
      filtersColumn: "",
      filtersValue: "",
      filterStr: "",
      filterAdded: false,
      dataSource: dataSource
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
    updateSchool({ body: updateData });
  };

  closeEditSchoolModal = () => {
    this.setState({
      editSchoolModaVisible: false
    });
  };

  searchByName = e => {
    const dataSource = this.initialDataSrouce(this.props.schoolsData);
    const filterSource = dataSource.filter(row => row.name.indexOf(e) != -1);
    this.setState({
      dataSource: filterSource
    });
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
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const editSchoolData = dataSource.filter(item => item.key === editSchoolKey);

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateSchoolModal}>
            + Create School
          </Button>
          <CreateSchoolModal
            modalVisible={createSchoolModalVisible}
            createSchool={this.createSchool}
            closeModal={this.closeCreateSchoolModal}
          />
          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />
          <StyledSelectStatus defaultValue="" onChange={this.changeActionMode}>
            <Option value="">Actions</Option>
            <Option value="edit school">Edit School</Option>
            <Option value="deactivate school">Deactivate School</Option>
          </StyledSelectStatus>
        </StyledControlDiv>
        <StyledControlDiv>
          <StyledFilterSelect placeholder="Select a column" onChange={this.changeFilterColumn} value={filtersColumn}>
            <Option value="">Select a column</Option>
            <Option value="name">Name</Option>
            <Option value="city">City</Option>
            <Option value="state">State</Option>
            <Option value="zip">Zip</Option>
            <Option value="status">Status</Option>
            <Option value="teacher">Teacher</Option>
            <Option value="student">Student</Option>
            <Option value="section">Section</Option>
          </StyledFilterSelect>
          <StyledFilterSelect placeholder="Select a value" onChange={this.changeFilterValue} value={filtersValue}>
            <Option value="">Select a value</Option>
            <Option value="equals">Equals</Option>
            <Option value="contains">Contains</Option>
          </StyledFilterSelect>
          <StyledFilterInput placeholder="Enter text" onChange={this.changeFilterText} value={filterStr} />
          <StyledFilterButton type="primary" onClick={this.addFilter}>
            + Add Filter
          </StyledFilterButton>
          {filterAdded && (
            <StyledFilterButton type="primary" onClick={this.removeFilter}>
              - Remove Filter
            </StyledFilterButton>
          )}
        </StyledControlDiv>
        <Table
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            onChange: this.cancel
          }}
        />
        {editSchoolModaVisible && editSchoolKey >= 0 && (
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
      created: getCreatedSchoolSelector(state)
    }),
    {
      createSchool: createSchoolsAction,
      updateSchool: updateSchoolsAction,
      deleteSchool: deleteSchoolsAction
    }
  )
);

export default enhance(EditableSchoolsTable);

SchoolsTable.propTypes = {
  updateSchool: PropTypes.func.isRequired,
  createSchool: PropTypes.func.isRequired,
  deleteSchool: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired
};
