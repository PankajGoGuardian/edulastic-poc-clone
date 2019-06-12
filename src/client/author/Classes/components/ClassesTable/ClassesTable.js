import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Icon, Select, message, Button, Menu } from "antd";

import {
  StyledClassName,
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTable,
  StyledTableButton,
  StyledFilterInput,
  StyledSearch,
  StyledActionDropDown,
  TeacherSpan,
  StyledPagination,
  StyledFilterButton
} from "./styled";

import AddClassModal from "./AddClassModal/AddClassModal";
import EditClassModal from "./EditClassModal/EditClassModal";
import ArchiveClassModal from "./ArchiveClassModal/ArchiveClassModal";

import {
  receiveClassListAction,
  createClassAction,
  updateClassAction,
  deleteClassAction,
  getClassListSelector
} from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";
import { receiveSearchCourseAction, getCoursesForDistrictSelector } from "../../../Courses/ducks";
import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";
import { receiveTeachersListAction, getTeachersListSelector } from "../../../Teacher/ducks";

const { Option } = Select;

class ClassesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      selectedRowKeys: [],
      addClassModalVisible: false,
      editClassModalVisible: false,
      archiveClassModalVisible: false,
      editClassKey: "undefined",
      searchByName: "",
      filtersData: [
        {
          filtersColumn: "",
          filtersValue: "",
          filterStr: "",
          filterAdded: false
        }
      ],
      sortedInfo: {
        columnKey: "name",
        order: "asc"
      },
      currentPage: 1,
      selectedArchiveClasses: []
    };
  }

  componentDidMount() {
    const { userOrgId, loadClassListData } = this.props;

    loadClassListData({
      districtId: userOrgId,
      page: 1,
      limit: 25,
      search: {
        active: 1
      }
    });
  }

  onHeaderCell = colName => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    if (sortedInfo.columnKey === colName) {
      if (sortedInfo.order === "asc") {
        sortedInfo.order = "desc";
      } else if (sortedInfo.order === "desc") {
        sortedInfo.order = "asc";
      }
    } else {
      sortedInfo.columnKey = colName;
      sortedInfo.order = sortedInfo.columnKey === "status" ? "desc" : "asc";
    }
    this.setState({ sortedInfo });
    this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      dataSource: nextProps.classList
    };
  }

  onEditClass = key => {
    const { loadSchoolsData, userOrgId, loadTeachersListData } = this.props;
    loadSchoolsData({
      districtId: userOrgId
    });
    loadTeachersListData({
      districtId: userOrgId,
      role: "teacher",
      limit: 10000
    });
    this.setState({
      editClassModalVisible: true,
      editClassKey: key
    });
  };

  onArchiveClass = () => {
    const { selectedRowKeys } = this.state;

    this.setState({
      selectedArchiveClasses: selectedRowKeys,
      archiveClassModalVisible: true
    });
  };

  handleDelete = key => {
    // const dataSource = [...this.state.dataSource];
    this.setState({
      selectedArchiveClasses: [key],
      archiveClassModalVisible: true
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showAddClassModal = () => {
    this.setState({
      addClassModalVisible: true
    });
  };

  changeFilterColumn = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filtersColumn = value;
    if (value === "subjects" || value === "grades") filtersData[key].filtersValue = "eq";
    this.setState({ filtersData });

    if (
      (filtersData[key].filterAdded || key == 2) &&
      filtersData[key].filtersValue !== "" &&
      filtersData[key].filterStr !== ""
    ) {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  changeFilterValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filtersValue = value;
    this.setState({ filtersData });

    if (
      (filtersData[key].filterAdded || key == 2) &&
      filtersData[key].filtersColumn !== "" &&
      filtersData[key].filterStr !== ""
    ) {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  onBlurFilterText = (e, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = e.target.value;
    this.setState({ filtersData });

    if (filtersData[key].filterAdded || key == 2) {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  changeFilterText = (e, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = e.target.value;
    this.setState({ filtersData });
  };

  changeStatusValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = value;
    this.setState({ filtersData });

    if (filtersData[key].filterAdded || key == 2) {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  addFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    if (filtersData[key].filterAdded && filtersData.length == 3) return;
    filtersData[key].filterAdded = true;
    if (filtersData.length < 3) {
      filtersData[key].filterAdded = true;
      filtersData.push({
        filtersColumn: "",
        filtersValue: "",
        filterStr: "",
        filterAdded: false
      });
    }
    this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
  };

  removeFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
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
    this.setState({ filtersData: newFiltersData });
    this.loadFilteredClassList(newFiltersData, sortedInfo, searchByName, currentPage);
  };

  handleSearchName = e => {
    const { filtersData, sortedInfo, currentPage } = this.state;
    this.setState({ searchByName: e });
    this.loadFilteredClassList(filtersData, sortedInfo, e, currentPage);
  };

  changePagination = pageNumber => {
    const { filtersData, sortedInfo, searchByName } = this.state;
    this.setState({ currentPage: pageNumber });
    this.loadFilteredClassList(filtersData, sortedInfo, searchByName, pageNumber);
  };

  loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage) {
    const { loadClassListData, userOrgId } = this.props;
    let search = {};

    if (searchByName.length > 0) {
      search.name = { type: "cont", value: searchByName };
    }

    for (let i = 0; i < filtersData.length; i++) {
      if (
        filtersData[i].filtersColumn !== "" &&
        filtersData[i].filtersValue !== "" &&
        filtersData[i].filterStr !== ""
      ) {
        search[filtersData[i].filtersColumn] = { type: filtersData[i].filtersValue, value: filtersData[i].filterStr };
      }
    }

    loadClassListData({
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      search
    });
  }

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
      if (selectedRowKeys.length > 0) this.onArchiveClass();
      else message.error("Please select class to archive.");
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
    const { editClassKey } = this.state;
    // const sameRow = dataSource.filter(item => item.key === editClassKey);

    updateClass({ groupId: editClassKey, body: updatedClassData });

    this.setState({
      editClassModalVisible: false
    });
  };

  closeEditClassModal = () => {
    this.setState({
      editClassModalVisible: false
    });
  };

  archiveClass = () => {
    const { selectedArchiveClasses } = this.state;
    const { userOrgId: districtId, deleteClass } = this.props;

    this.setState({
      // here selectedRowKeys is set back to [], since all the previously selected rows would have been deleted,
      // by the api call
      selectedRowKeys: [],
      archiveClassModalVisible: false
    });
    deleteClass({ groupIds: selectedArchiveClasses, districtId });
  };

  closeArchiveModal = () => {
    this.setState({ archiveClassModalVisible: false });
  };

  render() {
    const columnsData = [
      {
        title: "Class Name",
        dataIndex: "_source.name",
        editable: true
      },
      {
        title: "Class Code",
        dataIndex: "_source.code",
        editable: true
      },
      {
        title: "Course",
        dataIndex: "_source.course",
        editable: true,
        render: course => (course ? course.name : "-")
      },
      {
        title: "Teacher",
        dataIndex: "_source.owners",
        editable: true,
        render: (owners = []) => {
          const teachers = owners.map((owner, index) => (
            <TeacherSpan key={`${owner.id}${index}`}>{owner.name}</TeacherSpan>
          ));
          return <React.Fragment>{teachers}</React.Fragment>;
        }
      },
      {
        title: "Users",
        dataIndex: "_source.studentCount",
        editable: true,
        render: (studentCount = 0) => studentCount
      },
      {
        dataIndex: "_id",
        render: id => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditClass(id)}>
                <Icon type="edit" theme="twoTone" />
              </StyledTableButton>
              <StyledTableButton onClick={() => this.handleDelete(id)}>
                <Icon type="delete" theme="twoTone" />
              </StyledTableButton>
            </React.Fragment>
          );
        }
      }
    ];

    const {
      dataSource,
      selectedRowKeys,
      addClassModalVisible,
      editClassModalVisible,
      filtersData,
      archiveClassModalVisible,
      editClassKey,
      currentPage,
      selectedArchiveClasses
    } = this.state;

    const {
      userOrgId,
      searchCourseList,
      coursesForDistrictList,
      totalClassCount,
      schoolsData,
      teacherList
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const selectedClass = dataSource[editClassKey];

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit class">Edit Class</Menu.Item>
        <Menu.Item key="archive selected class">Archive selected Class(es)</Menu.Item>
        <Menu.Item key="bulk edit">Bulk Edit</Menu.Item>
      </Menu>
    );

    const gradeOptions = [];
    gradeOptions.push(<Option value={"0"}>KinderGarten</Option>);
    for (let i = 1; i <= 12; i++) gradeOptions.push(<Option value={i.toString()}>Grade {i}</Option>);
    gradeOptions.push(<Option value="other">Other</Option>);

    const SearchRows = [];
    for (let i = 0; i < filtersData.length; i++) {
      const isFilterTextDisable = filtersData[i].filtersColumn === "" || filtersData[i].filtersValue === "";
      const isAddFilterDisable =
        filtersData[i].filtersColumn === "" || filtersData[i].filtersValue === "" || filtersData[i].filterStr === "";

      const optValues = [];
      if (filtersData[i].filtersColumn === "subjects" || filtersData[i].filtersColumn === "grades") {
        optValues.push(<Option value="eq">Equals</Option>);
      } else {
        optValues.push(<Option value="">Select a value</Option>);
        optValues.push(<Option value="eq">Equals</Option>);
        optValues.push(<Option value="cont">Contains</Option>);
      }

      SearchRows.push(
        <StyledControlDiv>
          <StyledFilterSelect
            placeholder="Select a column"
            onChange={e => this.changeFilterColumn(e, i)}
            defaultValue={filtersData[i].filtersColumn}
            value={filtersData[i].filtersColumn}
          >
            <Option value="">Select a column</Option>
            <Option value="codes">Class Code</Option>
            <Option value="institutionIds">School</Option>
            <Option value="subjects">Subject</Option>
            <Option value="grades">Grade</Option>
          </StyledFilterSelect>

          <StyledFilterSelect
            placeholder="Select a value"
            onChange={e => this.changeFilterValue(e, i)}
            value={filtersData[i].filtersValue}
          >
            {optValues}
          </StyledFilterSelect>
          {filtersData[i].filtersColumn === "subjects" ? (
            <StyledFilterSelect
              placeholder="Select a value"
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filtersData[i].filterStr}
            >
              <Option value="">Select a subject</Option>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="ELA">ELA</Option>
              <Option value="Science">Science</Option>
              <Option value="Social Studies">Social Studies</Option>
              <Option value="Other Subjects">Other Subjects</Option>
            </StyledFilterSelect>
          ) : filtersData[i].filtersColumn === "grades" ? (
            <StyledFilterSelect
              placeholder="Select a grade"
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filtersData[i].filterStr}
            >
              {gradeOptions}
            </StyledFilterSelect>
          ) : (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
              onBlur={e => this.onBlurFilterText(e, i)}
              disabled={isFilterTextDisable}
              value={filtersData[i].filterStr}
            />
          )}
          {i < 2 && (
            <StyledFilterButton
              type="primary"
              onClick={e => this.addFilter(e, i)}
              disabled={isAddFilterDisable || !filtersData[i].filterAdded || i < filtersData.length - 1}
            >
              + Add Filter
            </StyledFilterButton>
          )}
          {filtersData[i].filterAdded && (
            <StyledFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
              - Remove Filter
            </StyledFilterButton>
          )}
        </StyledControlDiv>
      );
    }

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showAddClassModal}>
            + Create Class
          </Button>

          <StyledSearch placeholder="Search by name" onBlur={this.handleSearchName} />

          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable
          rowKey={record => record._id}
          rowSelection={rowSelection}
          dataSource={Object.values(dataSource)}
          columns={columnsData}
          pagination={false}
        />
        <StyledPagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={25}
          total={totalClassCount}
          onChange={this.changePagination}
        />
        {editClassModalVisible && editClassKey !== "undefined" && (
          <EditClassModal
            selClassData={selectedClass}
            modalVisible={editClassModalVisible}
            saveClass={this.updateClass}
            closeModal={this.closeEditClassModal}
            schoolsData={schoolsData}
            teacherList={teacherList}
          />
        )}

        {addClassModalVisible && (
          <AddClassModal
            modalVisible={addClassModalVisible}
            addClass={this.addClass}
            closeModal={this.closeAddClassModal}
            userOrgId={userOrgId}
            searchCourseList={searchCourseList}
            coursesForDistrictList={coursesForDistrictList}
          />
        )}

        {archiveClassModalVisible && (
          <ArchiveClassModal
            modalVisible={archiveClassModalVisible}
            archiveClass={this.archiveClass}
            closeModal={this.closeArchiveModal}
            classNames={selectedArchiveClasses.map(id => {
              const { _source = {} } = dataSource[id];
              return <StyledClassName key={id}>{_source.name}</StyledClassName>;
            })}
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
      classList: getClassListSelector(state),
      coursesForDistrictList: getCoursesForDistrictSelector(state),
      totalClassCount: get(state, ["classesReducer", "totalClassCount"], 0),
      teacherList: getTeachersListSelector(state),
      schoolsData: getSchoolsSelector(state)
    }),
    {
      createClass: createClassAction,
      updateClass: updateClassAction,
      deleteClass: deleteClassAction,
      loadClassListData: receiveClassListAction,
      searchCourseList: receiveSearchCourseAction,
      loadSchoolsData: receiveSchoolsAction,
      loadTeachersListData: receiveTeachersListAction
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
  searchCourseList: PropTypes.func.isRequired,
  coursesForDistrictList: PropTypes.array.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  loadTeachersListData: PropTypes.func.isRequired
};
