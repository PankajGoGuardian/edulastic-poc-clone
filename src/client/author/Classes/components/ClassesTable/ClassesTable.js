import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Popconfirm, Icon, Select, message, Button, Menu } from "antd";
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
  StyledActionDropDown,
  StyledSelectedSchoolSelect
} from "./styled";

import AddClassModal from "./AddClassModal/AddClassModal";
import EditClassModal from "./EditClassModal/EditClassModal";

import {
  receiveClassListAction,
  createClassAction,
  updateClassAction,
  deleteClassAction,
  receiveTeacherListAction,
  setSearchNameAction,
  setFiltersAction
} from "../../ducks";

import { getClassListSelector } from "../../ducks";
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

class ClassesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      addClassModalVisible: false,
      editClassModalVisible: false,
      editClassKey: -1,
      filters: {
        column: "",
        value: "",
        text: ""
      },
      filterAdded: false
    };
    this.columns = [
      {
        title: "Class Name",
        dataIndex: "name",
        editable: true,
        sorter: (a, b) => compareByAlph(a.name, b.name)
      },
      {
        title: "Class Code",
        dataIndex: "code",
        editable: true,
        sorter: (a, b) => compareByAlph(a.code, b.code)
      },
      {
        title: "Teacher",
        dataIndex: "teacherName",
        editable: true,
        sorter: (a, b) => compareByAlph(a.code, b.code)
      },
      {
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditClass(record.key)}>
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
    const { userOrgId, loadClassListData, loadSchoolsData, loadTeacherList } = this.props;

    loadClassListData({
      districtId: userOrgId,
      search: {
        institutionIds: [],
        codes: [],
        subjects: [],
        grades: [],
        active: 1
      }
    });

    loadSchoolsData({ body: { districtId: userOrgId } });
    loadTeacherList({
      type: "DISTRICT",
      search: {
        role: "teacher"
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.classList.length === undefined) {
      return {
        dataSource: []
      };
    } else {
      return {
        dataSource: nextProps.classList
      };
    }
  }

  onEditClass = key => {
    this.setState({
      editClassModalVisible: true,
      editClassKey: key
    });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    const { userOrgId } = this.props;

    const selectedClass = data.filter(item => item.key == key);

    const { deleteClass } = this.props;
    deleteClass([{ groupId: selectedClass[0]._id, districtId: userOrgId }]);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showAddClassModal = () => {
    this.setState({
      addClassModalVisible: true
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
    if (e.key === "edit class") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select class to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditClass(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single class to edit.");
      }
    } else if (e.key === "archive selected class") {
      console.log("archive selected class clicked");
    } else if (e.key === "bulk edit") {
      console.log("bulk edit clicked");
    }
  };

  addClass = addClassData => {
    const { userOrgId, createClass } = this.props;
    addClassData.districtId = userOrgId;
    createClass(addClassData);
    this.setState({ addClassModalVisible: false });
  };

  closeAddClassModal = () => {
    this.setState({
      addClassModalVisible: false
    });
  };

  updateClass = updatedClassData => {
    const { updateClass } = this.props;
    const { dataSource, editClassKey } = this.state;
    updateClass({ groupId: dataSource[editClassKey]._id, body: updatedClassData });

    this.setState({
      editClassModalVisible: false
    });
  };

  closeEditClassModal = () => {
    this.setState({
      editClassModalVisible: false
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
      addClassModalVisible,
      editClassModalVisible,
      editClassKey,
      filters,
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { schoolsData, teacherList } = this.props;
    const selectedClass = dataSource.filter(item => item.key == editClassKey);

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit class">Edit Class</Menu.Item>
        <Menu.Item key="archive selected class">Archive selected Class(es)</Menu.Item>
        <Menu.Item key="bulk edit">Bulk Edit</Menu.Item>
      </Menu>
    );

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <StyledSelectedSchoolSelect />
        </StyledControlDiv>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showAddClassModal}>
            + Create Class
          </Button>

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
            <Option value="name">Class Name</Option>
            <Option value="code">Class Code</Option>
            <Option value="teacherName">Teacher</Option>
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
        <StyledTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
        {editClassModalVisible && editClassKey >= 0 && (
          <EditClassModal
            selClassData={selectedClass[0]}
            modalVisible={editClassModalVisible}
            saveClass={this.updateClass}
            closeModal={this.closeEditClassModal}
            schoolsData={schoolsData}
            teacherList={teacherList}
          />
        )}

        <AddClassModal
          modalVisible={addClassModalVisible}
          addClass={this.addClass}
          closeModal={this.closeAddClassModal}
          schoolsData={schoolsData}
          teacherList={teacherList}
        />
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      classList: getClassListSelector(state),
      schoolsData: getSchoolsSelector(state),
      teacherList: get(state, ["classesReducer", "teacherList"], [])
    }),
    {
      createClass: createClassAction,
      updateClass: updateClassAction,
      deleteClass: deleteClassAction,
      loadClassListData: receiveClassListAction,
      setSearchName: setSearchNameAction,
      setFilters: setFiltersAction,
      loadSchoolsData: receiveSchoolsAction,
      loadTeacherList: receiveTeacherListAction
    }
  )
);

export default enhance(ClassesTable);

ClassesTable.propTypes = {
  classList: PropTypes.object.isRequired,
  loadClassListData: PropTypes.func.isRequired,
  createClass: PropTypes.func.isRequired,
  updateClass: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired
};
