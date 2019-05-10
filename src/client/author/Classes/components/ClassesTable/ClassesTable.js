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
  StyledSearch,
  StyledActionDropDown,
  TeacherSpan,
  StyledPagination
} from "./styled";

import AddClassModal from "./AddClassModal/AddClassModal";
import EditClassModal from "./EditClassModal/EditClassModal";

import {
  receiveClassListAction,
  createClassAction,
  updateClassAction,
  deleteClassAction,
  receiveTeacherListAction
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
      editClassKey: "undefined",
      filters: {
        column: "",
        value: "",
        text: ""
      },
      filterAdded: false,
      currentPage: 1
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
        sorter: (a, b) => compareByAlph(a.code, b.code),
        render: (text, record) => {
          const teachers = [];
          record.owners.map(row => {
            teachers.push(<TeacherSpan>{row.name}</TeacherSpan>);
          });
          return <React.Fragment>{teachers}</React.Fragment>;
        }
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
      page: 1,
      limit: 10,
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

    const selectedClass = data.filter(item => item.key === key);

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
    filtersData.text = "";
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

  changeSelectFilterText = value => {
    const filtersData = this.state.filters;
    filtersData.text = value;
    this.setState({ filters: filtersData });
  };

  addFilter = e => {
    const { filters } = this.state;
    const { loadClassListData, userOrgId } = this.props;
    this.setState({ filterAdded: true, currentPage: 1 });

    let search = {
      institutionIds: [],
      codes: [],
      subjects: [],
      grades: [],
      active: 1
    };
    if (filters.column === "codes") {
      search[filters.column].push({ type: filters.value, value: filters.text });
    } else {
      search[filters.column].push(filters.text);
    }

    loadClassListData({
      districtId: userOrgId,
      page: 1,
      limit: 10,
      search
    });
  };

  removeFilter = e => {
    const filtersData = {
      column: "",
      value: "",
      text: ""
    };

    this.setState({
      filters: filtersData,
      filterAdded: false,
      currentPage: 1
    });

    const { loadClassListData } = this.props;
    loadClassListData({
      districtId: userOrgId,
      page: 1,
      limit: 10,
      search: {
        institutionIds: [],
        codes: [],
        subjects: [],
        grades: [],
        active: 1
      }
    });
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
    addClassData.parent = {
      id: userOrgId
    };
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
    const sameRow = dataSource.filter(item => item.key === editClassKey);

    updateClass({ groupId: sameRow[0]._id, body: updatedClassData });

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
    // const { setSearchName } = this.props;
    // setSearchName(e);
  };

  changePagination = pageNumber => {
    this.setState({ currentPage: pageNumber });
    const { filterAdded, filters } = this.state;
    const { loadClassListData, userOrgId } = this.props;

    let search = {
      institutionIds: [],
      codes: [],
      subjects: [],
      grades: [],
      active: 1
    };

    if (filterAdded) {
      this.setState({ filterAdded: true, currentPage: 1 });
      if (filters.column === "codes") {
        search[filters.column].push({ type: filters.value, value: filters.text });
      } else {
        search[filters.column].push(filters.text);
      }
    }
    loadClassListData({ districtId: userOrgId, limit: 10, page: pageNumber, search });
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
      filterAdded,
      currentPage
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { schoolsData, teacherList } = this.props;
    const selectedClass = dataSource.filter(item => item.key === editClassKey);

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit class">Edit Class</Menu.Item>
        <Menu.Item key="archive selected class">Archive selected Class(es)</Menu.Item>
        <Menu.Item key="bulk edit">Bulk Edit</Menu.Item>
      </Menu>
    );

    const isFilterTextDisable = filters.column === "" || filters.value === "";
    const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";

    let SearchValueOptions = [];
    if (filters.column === "institutionIds") {
      for (let i = 0; i < schoolsData.length; i++) {
        SearchValueOptions.push(<Option value={schoolsData[i]._id}>{schoolsData[i].name}</Option>);
      }
    } else if (filters.column === "grades") {
      SearchValueOptions.push(<Option value={"0"}>KinderGarten</Option>);
      for (let i = 1; i < 12; i++) {
        SearchValueOptions.push(<Option value={i.toString()}>Grade {i}</Option>);
      }
      SearchValueOptions.push(<Option value="other">Other</Option>);
    } else if (filters.column === "subjects") {
      SearchValueOptions.push(<Option value="Mathematics">Mathematics</Option>);
      SearchValueOptions.push(<Option value="ELA">ELA</Option>);
      SearchValueOptions.push(<Option value="Science">Science</Option>);
      SearchValueOptions.push(<Option value="Social Studies">Social Studies</Option>);
      SearchValueOptions.push(<Option value="Other Subjects">Other Subjects</Option>);
    }

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showAddClassModal}>
            + Create Class
          </Button>

          <StyledSearch placeholder="Search by name" onSearch={this.searchByName} />

          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        <StyledControlDiv>
          <StyledFilterSelect
            placeholder="Select a column"
            onChange={this.changeFilterColumn}
            value={filters.column}
            disabled={filterAdded}
          >
            <Option value="">Select a column</Option>
            <Option value="name">Class Name</Option>
            <Option value="codes">Class Code</Option>
            <Option value="institutionIds">School</Option>
            <Option value="subjects">Subject</Option>
            <Option value="grades">Grade</Option>
          </StyledFilterSelect>
          <StyledFilterSelect
            placeholder="Select a value"
            onChange={this.changeFilterValue}
            value={filters.value}
            disabled={filterAdded}
          >
            <Option value="">Select a value</Option>
            <Option value="equals">Equals</Option>
            <Option value="contain">Contains</Option>
          </StyledFilterSelect>
          {(filters.column === "codes" || filters.column === "name" || filters.column === "") && (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={this.changeFilterText}
              value={filters.text}
              disabled={isFilterTextDisable}
            />
          )}
          {(filters.column === "institutionIds" || filters.column === "grades" || filters.column === "subjects") && (
            <StyledFilterSelect onChange={this.changeSelectFilterText} disabled={isFilterTextDisable || filterAdded}>
              {SearchValueOptions}
            </StyledFilterSelect>
          )}
          <StyledAddFilterButton type="primary" onClick={this.addFilter} disabled={isAddFilterDisable || filterAdded}>
            + Add Filter
          </StyledAddFilterButton>
          <StyledAddFilterButton type="primary" onClick={this.removeFilter} isVisible={filterAdded}>
            - Remove Filter
          </StyledAddFilterButton>
        </StyledControlDiv>
        <StyledTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} pagination={false} />
        <StyledPagination defaultCurrent={1} current={currentPage} total={100} onChange={this.changePagination} />

        {editClassModalVisible && editClassKey !== "undefined" && (
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
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired
};
