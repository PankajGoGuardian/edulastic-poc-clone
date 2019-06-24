import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, cloneDeep } from "lodash";

import { Icon, Select, message, Button, Menu, Checkbox } from "antd";

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
import BulkEditModal from "./BulkEditModal";

import {
  receiveClassListAction,
  createClassAction,
  updateClassAction,
  deleteClassAction,
  getClassListSelector,
  setBulkEditVisibilityAction,
  getBulkEditSelector,
  setBulkEditModeAction,
  setBulkEditUpdateViewAction,
  bulkUpdateClassesAction
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
      editClassKey: "",
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
      selectedArchiveClasses: [],
      showActiveClassCheckbox: true,
      disableActiveUsers: false
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

  // onHeaderCell = colName => {
  //   const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
  //   if (sortedInfo.columnKey === colName) {
  //     if (sortedInfo.order === "asc") {
  //       sortedInfo.order = "desc";
  //     } else if (sortedInfo.order === "desc") {
  //       sortedInfo.order = "asc";
  //     }
  //   } else {
  //     sortedInfo.columnKey = colName;
  //     sortedInfo.order = sortedInfo.columnKey === "status" ? "desc" : "asc";
  //   }
  //   this.setState({ sortedInfo });
  //   this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
  // };

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
    // here we need to use cloneDeep since a simple spread operator mutates the state
    const filtersData = cloneDeep(this.state.filtersData);
    filtersData[key].filtersColumn = value;

    if (value === "subjects" || value === "grades" || value === "active") filtersData[key].filtersValue = "eq";
    // here we check if the filter chosen is active or if the previous value held by the select was active
    // then according to this, we either disable or enable the checkbox
    if (value === "active" || this.state.filtersData[key].filtersColumn === "active") {
      this.setState(
        {
          disableActiveUsers: value === "active",
          filtersData
        },
        () => this.afterSetState(key)
      );
    } else this.setState({ filtersData }, () => this.afterSetState(key)); // this is done so that we dont have multiple set states and we can avoid two renders
  };

  afterSetState = key => {
    const { filtersColumn, filtersValue, filterStr } = this.state.filtersData[key];
    if (
      // (filtersData[key].filterAdded || key === 2) &&
      filtersColumn &&
      filtersValue &&
      filterStr !== "" // here because 0 can be a value too for "active" select
    ) {
      // const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredClassList();
    }
  };

  changeFilterValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filtersValue = value;
    this.setState({ filtersData }, () => this.afterSetState(key));

    // if (
    //   // (filtersData[key].filterAdded || key === 2) &&
    //   filtersData[key].filtersColumn !== "" &&
    //   filtersData[key].filterStr !== ""
    // ) {
    //   const { sortedInfo, searchByName, currentPage } = this.state;
    //   this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
    // }
  };

  // onBlurFilterText = (key) => {
  //   const filtersData = [...this.state.filtersData];
  //   // filtersData[key].filterStr = e.target.value;
  //   // this.setState({ filtersData });

  //   if (
  //     filtersData[key].filtersColumn !== "" &&
  //     filtersData[key].filtersValue !== ""
  //   ) {
  //     const { sortedInfo, searchByName, currentPage } = this.state;
  //     this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
  //   }
  // };

  changeFilterText = (e, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = e.target.value;
    this.setState({ filtersData });
  };

  changeStatusValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = value;
    this.setState({ filtersData }, () => this.afterSetState(key));

    // if (
    //   // filtersData[key].filterAdded || key === 2 &&
    //   filtersData[key].filtersColumn !== "" &&
    //   filtersData[key].filtersValue !== ""
    // ) {
    //   const { sortedInfo, searchByName, currentPage } = this.state;
    //   this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
    // }
  };

  addFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    // if (filtersData[key].filterAdded && filtersData.length === 3) return;
    // filtersData[key].filterAdded = true;
    if (filtersData.length < 3) {
      // filtersData[key].filterAdded = true;
      this.setState(state => ({
        filtersData: [
          ...state.filtersData,
          {
            filtersColumn: "",
            filtersValue: "",
            filterStr: "",
            filterAdded: false
          }
        ]
      }));
      // filtersData.push({
      //   filtersColumn: "",
      //   filtersValue: "",
      //   filterStr: "",
      //   filterAdded: false
      // });
    }
    // this.loadFilteredClassList(filtersData, sortedInfo, searchByName, currentPage);
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
      newFiltersData = filtersData.filter((item, index) => index !== key);
    }
    // here we check if the filter we are removing is the active filter, then we enable the checkbox back
    if (filtersData[key].filtersColumn === "active") {
      this.setState(
        {
          filtersData: newFiltersData,
          disableActiveUsers: false
        },
        this.loadFilteredClassList
      );
    } else this.setState({ filtersData: newFiltersData }, this.loadFilteredClassList);

    // this.loadFilteredClassList(newFiltersData, sortedInfo, searchByName, currentPage);
  };

  handleSearchName = e => {
    const { filtersData, sortedInfo, currentPage } = this.state;
    this.setState({ searchByName: e }, this.loadFilteredClassList);
    // this.loadFilteredClassList(filtersData, sortedInfo, e, currentPage);
  };

  changePagination = pageNumber => {
    const { filtersData, sortedInfo, searchByName } = this.state;
    this.setState({ currentPage: pageNumber }, this.loadFilteredClassList);
    // this.loadFilteredClassList(filtersData, sortedInfo, searchByName, pageNumber);
  };

  loadFilteredClassList = () => {
    const { loadClassListData, userOrgId } = this.props;
    const { filtersData, searchByName, currentPage, showActiveClassCheckbox, disableActiveUsers } = this.state;
    const search = {};

    if (searchByName.length > 0) {
      search.name = searchByName;
    }

    if (!disableActiveUsers && showActiveClassCheckbox) {
      search.active = 1;
    }

    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr } = filtersData[i];
      if (
        filtersColumn &&
        filtersValue &&
        filterStr !== "" // here because 0 can be a value too for "active" select
      ) {
        if (filtersColumn === "active") {
          search[filtersColumn] = filterStr;
        } else {
          if (!search.filtersColumn) {
            search[filtersColumn] = [];
          }
          if (filtersColumn === "grades" || filtersColumn === "subjects") {
            search[filtersColumn].push(filterStr);
          } else {
            search[filtersColumn].push({
              type: filtersValue,
              value: filterStr
            });
          }
        }
        // search[filtersData[i].filtersColumn] = { type: filtersData[i].filtersValue, value: filtersData[i].filterStr };
      }
    }

    loadClassListData({
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      search
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
      if (selectedRowKeys.length > 0) this.onArchiveClass();
      else message.error("Please select class to archive.");
    } else if (e.key === "bulk edit") {
      if (!selectedRowKeys.length) {
        message.warning("Please select atleast 1 class");
      } else {
        const { setBulkEditVisibility } = this.props;
        setBulkEditVisibility(true);
      }
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
      selectedArchiveClasses,
      showActiveClassCheckbox,
      disableActiveUsers
    } = this.state;

    const {
      userOrgId,
      searchCourseList,
      coursesForDistrictList,
      totalClassCount,
      schoolsData,
      teacherList,
      bulkEditData,
      setBulkEditVisibility,
      setBulkEditMode,
      setBulkEditUpdateView,
      bulkUpdateClasses
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
      const { filtersColumn, filtersValue, filterStr } = filtersData[i];
      const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
      const isAddFilterDisable = filtersColumn === "" || filtersValue === "" || filterStr === "";

      const optValues = [];
      if (filtersColumn === "subjects" || filtersColumn === "grades" || filtersColumn === "active") {
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
            value={filtersColumn}
          >
            <Option value="">Select a column</Option>
            <Option value="codes">Class Code</Option>
            <Option value="courses">Course</Option>
            <Option value="teachers">Teacher</Option>
            <Option value="grades">Grade</Option>
            <Option value="subjects">Subject</Option>
            <Option value="institutionNames">School Name</Option>
            <Option value="active">Status</Option>
          </StyledFilterSelect>

          <StyledFilterSelect
            placeholder="Select a value"
            onChange={e => this.changeFilterValue(e, i)}
            value={filtersValue}
          >
            {optValues}
          </StyledFilterSelect>
          {filtersColumn === "subjects" ? (
            <StyledFilterSelect
              placeholder="Select a value"
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            >
              <Option value="">Select a subject</Option>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="ELA">ELA</Option>
              <Option value="Science">Science</Option>
              <Option value="Social Studies">Social Studies</Option>
              <Option value="Other Subjects">Other Subjects</Option>
            </StyledFilterSelect>
          ) : filtersColumn === "grades" ? (
            <StyledFilterSelect
              placeholder="Select a grade"
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            >
              {gradeOptions}
            </StyledFilterSelect>
          ) : filtersColumn === "active" ? (
            <StyledFilterSelect
              placeholder="Select a value"
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            >
              <Option value={1}>Active</Option>
              <Option value={0}>Archived</Option>
            </StyledFilterSelect>
          ) : (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
              onSearch={this.loadFilteredClassList}
              disabled={isFilterTextDisable}
              value={filterStr}
            />
          )}
          {i < 2 && (
            <StyledFilterButton
              type="primary"
              onClick={e => this.addFilter(e, i)}
              disabled={isAddFilterDisable || i < filtersData.length - 1}
            >
              + Add Filter
            </StyledFilterButton>
          )}
          {filtersData.length > 1 && (
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

          <StyledSearch placeholder="Search by name" onSearch={this.handleSearchName} />
          <Checkbox
            disabled={disableActiveUsers}
            style={{ margin: "auto" }}
            value={showActiveClassCheckbox}
            onChange={evt =>
              this.setState(
                {
                  showActiveClassCheckbox: evt.target.checked
                },
                this.loadFilteredClassList
              )
            }
          >
            Show Active Classes
          </Checkbox>
          <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
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
        {editClassModalVisible && (
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
        <BulkEditModal
          bulkEditData={bulkEditData}
          districtId={userOrgId}
          onCloseModal={() => setBulkEditVisibility(false)}
          setBulkEditMode={setBulkEditMode}
          setBulkEditUpdateView={setBulkEditUpdateView}
          selectedIds={selectedRowKeys}
          selectedClasses={selectedRowKeys.map(_id => dataSource[_id])}
          bulkUpdateClasses={bulkUpdateClasses}
          searchCourseList={searchCourseList}
          coursesForDistrictList={coursesForDistrictList}
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
      coursesForDistrictList: getCoursesForDistrictSelector(state),
      totalClassCount: get(state, ["classesReducer", "totalClassCount"], 0),
      teacherList: getTeachersListSelector(state),
      schoolsData: getSchoolsSelector(state),
      bulkEditData: getBulkEditSelector(state)
    }),
    {
      createClass: createClassAction,
      updateClass: updateClassAction,
      deleteClass: deleteClassAction,
      loadClassListData: receiveClassListAction,
      searchCourseList: receiveSearchCourseAction,
      loadSchoolsData: receiveSchoolsAction,
      loadTeachersListData: receiveTeachersListAction,
      setBulkEditVisibility: setBulkEditVisibilityAction,
      setBulkEditMode: setBulkEditModeAction,
      setBulkEditUpdateView: setBulkEditUpdateViewAction,
      bulkUpdateClasses: bulkUpdateClassesAction
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
  loadTeachersListData: PropTypes.func.isRequired,
  setBulkEditVisibility: PropTypes.func.isRequired,
  setBulkEditMode: PropTypes.func.isRequired,
  setBulkEditUpdateView: PropTypes.func.isRequired,
  bulkUpdateClasses: PropTypes.func.isRequired
};
