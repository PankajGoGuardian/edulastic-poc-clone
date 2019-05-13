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
  StyledTable
} from "./styled";

import CreateSchoolModal from "./CreateSchoolModal/CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal/EditSchoolModal";

// actions
import {
  receiveSchoolsAction,
  createSchoolsAction,
  updateSchoolsAction,
  deleteSchoolsAction,
  setSearchByNameValueAction,
  setSchoolFiltersDataAction
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
      editSchoolKey: ""
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
    loadSchoolsData({ districtId: userOrgId, limit: 100, page: 1 });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.schoolList.length === undefined) return { dataSource: [], filtersData: nextProps.filtersData };
    else return { dataSource: nextProps.schoolList, filtersData: nextProps.filtersData };
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

  changeFilterColumn = (value, key) => {
    const { filtersData } = this.props;
    filtersData[key].filtersColumn = value;
    this.updateFilter(filtersData);
  };

  changeFilterValue = (value, key) => {
    const { filtersData } = this.props;
    filtersData[key].filtersValue = value;
    this.updateFilter(filtersData);
  };

  changeFilterText = (e, key) => {
    const { filtersData } = this.props;
    filtersData[key].filterStr = e.target.value;
    this.updateFilter(filtersData);
  };

  changeStatusValue = (value, key) => {
    const { filtersData } = this.props;
    filtersData[key].filterStr = value;
    this.updateFilter(filtersData);
  };

  addFilter = (e, key) => {
    const { filtersData } = this.props;
    if (filtersData.length >= 3) return;
    filtersData[key].filterAdded = true;
    filtersData.push({
      filtersColumn: "",
      filtersValue: "",
      filterStr: "",
      filterAdded: false
    });
    this.updateFilter(filtersData);
  };

  removeFilter = (e, key) => {
    const { filtersData } = this.props;
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
    this.updateFilter(newFiltersData);
  };

  updateFilter(newFilterData) {
    this.props.setFiltersData(newFilterData);
  }

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
      districtId: this.props.userOrgId,
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

  searchByName = e => {
    const { setSearchByName } = this.props;
    setSearchByName(e.target.value);
  };

  render() {
    const columns = this.columns.map(col => {
      return {
        ...col
      };
    });

    const { dataSource, selectedRowKeys, createSchoolModalVisible, editSchoolModaVisible, editSchoolKey } = this.state;

    const { filtersData } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const editSchoolData = dataSource.filter(item => item.key === editSchoolKey);

    const SearchRows = [];
    for (let i = 0; i < filtersData.length; i++) {
      const isFilterTextDisable = filtersData[i].filtersColumn === "" || filtersData[i].filtersValue === "";
      const isAddFilterDisable =
        filtersData[i].filtersColumn === "" ||
        filtersData[i].filtersValue === "" ||
        filtersData[i].filterStr === "" ||
        i < filtersData.length - 1 ||
        filtersData.length == 3;

      SearchRows.push(
        <StyledControlDiv>
          <StyledFilterSelect
            placeholder="Select a column"
            onChange={e => this.changeFilterColumn(e, i)}
            defaultValue={filtersData[i].filtersColumn}
            value={filtersData[i].filtersColumn}
          >
            <Option value="">Select a column</Option>
            <Option value="city">City</Option>
            <Option value="state">State</Option>
            <Option value="zip">Zip</Option>
            <Option value="status">Status</Option>
          </StyledFilterSelect>

          <StyledFilterSelect
            placeholder="Select a value"
            onChange={e => this.changeFilterValue(e, i)}
            value={filtersData[i].filtersValue}
          >
            <Option value="">Select a value</Option>
            <Option value="eq">Equals</Option>
            <Option value="cont">Contains</Option>
          </StyledFilterSelect>
          {filtersData[i].filtersColumn !== "status" ? (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
              disabled={isFilterTextDisable}
              value={filtersData[i].filterStr}
            />
          ) : (
            <StyledFilterSelect
              placeholder="Select a value"
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filtersData[i].filterStr}
            >
              <Option value="0">Approved</Option>
              <Option value="1">All</Option>
            </StyledFilterSelect>
          )}
          {i < 2 && (
            <StyledFilterButton type="primary" onClick={e => this.addFilter(e, i)} disabled={isAddFilterDisable}>
              + Add Filter
            </StyledFilterButton>
          )}

          <StyledFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
            - Remove Filter
          </StyledFilterButton>
        </StyledControlDiv>
      );
    }

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

          <StyledSchoolSearch placeholder="Search by name" onChange={this.searchByName} />
          <StyledSelectStatus defaultValue="" onChange={this.changeActionMode}>
            <Option value="">Actions</Option>
            <Option value="edit school">Edit School</Option>
            <Option value="deactivate school">Deactivate School</Option>
          </StyledSelectStatus>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 20 }}
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
      filtersData: get(state, ["schoolsReducer", "filtersData"], [])
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      createSchool: createSchoolsAction,
      updateSchool: updateSchoolsAction,
      deleteSchool: deleteSchoolsAction,
      setSearchByName: setSearchByNameValueAction,
      setFiltersData: setSchoolFiltersDataAction
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
