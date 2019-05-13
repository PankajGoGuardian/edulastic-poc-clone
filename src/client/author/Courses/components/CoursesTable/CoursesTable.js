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
  StyledFilterButton,
  StyledNameSearch,
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
      editCourseKey: -1
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
    loadCourseListData({ districtId: userOrgId, page: 1, limit: 100 });
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
    setSearchName(e.target.value);
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
      editCourseKey
    } = this.state;

    const { filtersData } = this.props;

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
            <Option value="number">Course Number</Option>
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

          <StyledFilterInput
            placeholder="Enter text"
            onChange={e => this.changeFilterText(e, i)}
            disabled={isFilterTextDisable}
            value={filtersData[i].filterStr}
          />
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
          <Button type="primary" onClick={this.showAddCourseModal}>
            + Create Course
          </Button>

          <StyledNameSearch placeholder="Search by name" onChange={this.searchByName} />
          <StyledActiveCheckbox defaultChecked={showActiveCourse} onChange={this.changeShowActiveCourse}>
            Show active courses only
          </StyledActiveCheckbox>
          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 20 }}
        />
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
      selectedRowKeys: get(state, ["coursesReducer", "selectedRowKeys"], []),
      filtersData: get(state, ["coursesReducer", "filtersData"], [])
    }),
    {
      createCourse: createCourseAction,
      updateCourse: updateCourseAction,
      deactivateCourse: deactivateCourseAction,
      loadCourseListData: receiveCourseListAction,
      setSearchName: setSearchNameAction,
      setFiltersData: setFiltersAction,
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
  setFiltersData: PropTypes.func.isRequired,
  uploadCSVCourse: PropTypes.func.isRequired,
  setShowActiveCourse: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  setSelectedRowKeys: PropTypes.func.isRequired
};
