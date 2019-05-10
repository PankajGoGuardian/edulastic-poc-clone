import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Popconfirm, Icon, Select, message, Button, Menu } from "antd";
const Option = Select.Option;

import AddCourseModal from "./AddCourseModal/AddCourseModal";
import EditCourseModal from "./EditCourseModal/EditCourseModal";
import UploadCourseModal from "./UploadCourseModal";

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
  StyledActiveCheckbox
} from "./styled";

import {
  receiveCourseListAction,
  createCourseAction,
  updateCourseAction,
  deactivateCourseAction,
  setSearchNameAction,
  setFiltersAction,
  setShowActiveCourseAction
} from "../../ducks";

import { getCourseListSelector, setSelectedRowKeysAction } from "../../ducks";
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

class CoursesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      addCourseModalVisible: false,
      editCourseModalVisible: false,
      uploadCourseModalVisible: false,
      editCourseKey: -1,
      filters: {
        column: "",
        value: "",
        text: ""
      },
      filterAdded: false
    };
    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        editable: true,
        sorter: (a, b) => compareByAlph(a.name, b.name)
      },
      {
        title: "Number",
        dataIndex: "number",
        editable: true,
        sorter: (a, b) => compareByAlph(a.code, b.code)
      },
      {
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditCourse(record.key)}>
                <Icon type="edit" theme="twoTone" />
              </StyledTableButton>
              <Popconfirm title="Sure to deactivate?" onConfirm={() => this.handleDelete(record.key)}>
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
    const { userOrgId, loadCourseListData } = this.props;
    loadCourseListData({ districtId: userOrgId });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.courseList.length === undefined) {
      return {
        dataSource: [],
        selectedRowKeys: []
      };
    } else {
      return {
        dataSource: nextProps.courseList,
        selectedRowKeys: nextProps.selectedRowKeys
      };
    }
  }

  onEditCourse = key => {
    this.setState({
      editCourseModalVisible: true,
      editCourseKey: key
    });
  };

  handleDelete = key => {
    const data = [...this.state.dataSource];
    const { userOrgId } = this.props;

    const selectedCourse = data.filter(item => item.key == key);

    const { deactivateCourse } = this.props;
    deactivateCourse([{ id: selectedCourse[0]._id }]);
  };

  onSelectChange = selectedRowKeys => {
    this.props.setSelectedRowKeys(selectedRowKeys);
  };

  showAddCourseModal = () => {
    this.setState({
      addCourseModalVisible: true
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
    if (e.key === "upload csv") {
      this.setState({ uploadCourseModalVisible: true });
    } else if (e.key === "edit course") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select course to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditCourse(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single course to edit.");
      }
    } else if (e.key === "deactivate course") {
      if (selectedRowKeys.length > 0) {
        const data = [...this.state.dataSource];

        const selectedCourse = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
          const checkedRow = data.filter(item => item.key === selectedRowKeys[i]);
          if (checkedRow.length > 0) selectedCourse.push({ id: checkedRow[0]._id });
        }
        const { deactivateCourse } = this.props;
        deactivateCourse(selectedCourse);
      } else {
        message.error("Please select course to delete.");
      }
    } else if (e.key === "bulk edit") {
    }
  };

  addCourse = addCourseData => {
    const { userOrgId, createCourse } = this.props;
    addCourseData.districtId = userOrgId;
    createCourse(addCourseData);
    this.setState({ addCourseModalVisible: false });
  };

  closeAddCourseModal = () => {
    this.setState({
      addCourseModalVisible: false
    });
  };

  updateCourse = updatedCourseData => {
    const { updateCourse } = this.props;
    const { dataSource, editCourseKey } = this.state;
    const selectedSourceKey = dataSource.filter(item => item.key == editCourseKey);
    updateCourse({ courseId: selectedSourceKey[0]._id, data: updatedCourseData });

    this.setState({
      editCourseModalVisible: false
    });
  };

  closeEditCourseModal = () => {
    this.setState({
      editCourseModalVisible: false
    });
  };

  searchByName = e => {
    const { setSearchName } = this.props;
    setSearchName(e);
  };

  changeShowActiveCourse = e => {
    const { setShowActiveCourse } = this.props;
    setShowActiveCourse(e.target.checked);
  };

  closeUploadCourseModal = () => {
    this.setState({ uploadCourseModalVisible: false });
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
      addCourseModalVisible,
      editCourseModalVisible,
      uploadCourseModalVisible,
      editCourseKey,
      filters,
      filterAdded
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { showActiveCourse } = this.props;
    const selectedCourse = dataSource.filter(item => item.key == editCourseKey);

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="upload csv">Upload Course</Menu.Item>
        <Menu.Item key="edit course">Edit Course</Menu.Item>
        <Menu.Item key="deactivate course">Deactivate Course</Menu.Item>
        <Menu.Item key="bulk edit courses">Bulk Edit Courses</Menu.Item>
      </Menu>
    );

    const isFilterTextDisable = filters.column === "" || filters.value === "";
    const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showAddCourseModal}>
            + Create Course
          </Button>

          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />
          <StyledActiveCheckbox defaultChecked={showActiveCourse} onChange={this.changeShowActiveCourse}>
            Show active courses only
          </StyledActiveCheckbox>
          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        <StyledControlDiv>
          <StyledFilterSelect placeholder="Select a column" onChange={this.changeFilterColumn} value={filters.column}>
            <Option value="">Select a column</Option>
            <Option value="name">Course Name</Option>
            <Option value="code">Course Number</Option>
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
        <StyledTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
        {editCourseModalVisible && editCourseKey >= 0 && (
          <EditCourseModal
            courseData={selectedCourse[0]}
            modalVisible={editCourseModalVisible}
            saveCourse={this.updateCourse}
            closeModal={this.closeEditCourseModal}
            dataSource={dataSource}
          />
        )}
        {addCourseModalVisible && (
          <AddCourseModal
            modalVisible={addCourseModalVisible}
            addCourse={this.addCourse}
            closeModal={this.closeAddCourseModal}
          />
        )}
        {uploadCourseModalVisible && (
          <UploadCourseModal modalVisible={uploadCourseModalVisible} closeModal={this.closeUploadCourseModal} />
        )}
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      courseList: getCourseListSelector(state),
      showActiveCourse: get(state, ["coursesReducer", "showActiveCourse"], false),
      selectedRowKeys: get(state, ["coursesReducer", "selectedRowKeys"], [])
    }),
    {
      createCourse: createCourseAction,
      updateCourse: updateCourseAction,
      deactivateCourse: deactivateCourseAction,
      loadCourseListData: receiveCourseListAction,
      setSearchName: setSearchNameAction,
      setFilters: setFiltersAction,
      setShowActiveCourse: setShowActiveCourseAction,
      setSelectedRowKeys: setSelectedRowKeysAction
    }
  )
);

export default enhance(CoursesTable);

CoursesTable.propTypes = {
  courseList: PropTypes.object.isRequired,
  showActiveCourse: PropTypes.bool.isRequired,
  loadCourseListData: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
  updateCourse: PropTypes.func.isRequired,
  deactivateCourse: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  uploadCSVCourse: PropTypes.func.isRequired,
  setShowActiveCourse: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  setSelectedRowKeys: PropTypes.func.isRequired
};
