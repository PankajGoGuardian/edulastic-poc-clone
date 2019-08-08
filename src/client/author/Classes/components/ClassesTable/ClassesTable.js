import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, cloneDeep } from "lodash";

import { Icon, Select, message, Button, Menu, Checkbox } from "antd";
import {
  StyledControlDiv,
  StyledFilterDiv,
  RightFilterDiv,
  StyledFilterSelect,
  StyledFilterInput,
  StyledSchoolSearch as StyledSearch,
  StyledActionDropDown,
  StyledClassName
} from "../../../../admin/Common/StyledComponents";
import {
  StyledTableContainer,
  StyledTable,
  StyledTableButton,
  StyledAddFilterButton,
  TeacherSpan,
  StyledPagination
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

import { getUserOrgId, getUser } from "../../../src/selectors/user";
import { receiveSearchCourseAction, getCoursesForDistrictSelector } from "../../../Courses/ducks";
import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";
import { receiveTeachersListAction, getTeachersListSelector } from "../../../Teacher/ducks";

const { Option } = Select;

const gradeOptions = [];
gradeOptions.push({ title: "Kindergarten", value: "K", disabled: false });
for (let i = 1; i <= 12; i++) gradeOptions.push({ title: `Grade ${i}`, value: i + "", disabled: false });
gradeOptions.push({ title: "Other", value: "O", disabled: false });

const filterStrDD = {
  subjects: {
    list: [
      { title: "Select a subject", value: "", disabled: true },
      { title: "Mathematics", value: "Mathematics", disabled: false },
      { title: "ELA", value: "ELA", disabled: false },
      { title: "Science", value: "Science", disabled: false },
      { title: "Social Studies", value: "Social Studies", disabled: false },
      { title: "Other Subjects", value: "Other Subjects", disabled: false }
    ],
    placeholder: "Select a subject"
  },
  grades: { list: gradeOptions, placeholder: "Select a grade" },
  active: {
    list: [{ title: "Active", value: 1, disabled: false }, { title: "Archived", value: 0, disabled: false }],
    placeholder: "Select a value"
  }
};

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
      showActive: true
    };
    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    const { userOrgId, loadClassListData } = this.props;
    this.loadFilteredList();
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
  //   this.loadFilteredList(filtersData, sortedInfo, searchByName, currentPage);
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

  afterSetState = key => {
    const { filtersColumn, filtersValue, filterStr } = this.state.filtersData[key];
    if (
      // (filtersData[key].filterAdded || key === 2) &&
      filtersColumn &&
      filtersValue &&
      filterStr !== "" // here because 0 can be a value too for "active" select
    ) {
      // const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredList();
    }
  };

  changePagination = pageNumber => {
    const { filtersData, sortedInfo, searchByName } = this.state;
    this.setState({ currentPage: pageNumber }, this.loadFilteredList);
  };

  onChangeShowActive = e => {
    this.setState({ showActive: e.target.checked }, this.loadFilteredList);
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

  _bulkUpdateClasses = obj => {
    let _obj = {
      data: obj,
      searchQuery: this.getSearchQuery()
    };
    this.props.bulkUpdateClasses(_obj);
  };

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = event => {
    this.setState({ searchByName: event.currentTarget.value });
  };

  handleSearchName = value => {
    const { filtersData, sortedInfo, currentPage } = this.state;
    this.setState({ searchByName: value }, this.loadFilteredList);
  };

  onSearchFilter = (value, event, i) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          filterAdded: value ? true : false
        };
      }
      return item;
    });

    // For some unknown reason till now calling blur() synchronously doesnt work.
    this.setState({ filtersData: _filtersData }, () => this.filterTextInputRef[i].current.blur());
  };

  onBlurFilterText = (event, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterAdded: event.target.value ? true : false
        };
      }
      return item;
    });
    this.setState(state => ({ filtersData: _filtersData }), this.loadFilteredList);
  };

  changeStatusValue = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: value,
          filterAdded: value ? true : false
        };
      }
      return item;
    });

    this.setState({ filtersData: _filtersData }, () => this.afterSetState(key));
  };

  changeFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: e.target.value
        };
      }
      return item;
    });
    this.setState({ filtersData: _filtersData });
  };

  changeFilterColumn = (value, key) => {
    // here we need to use cloneDeep since a simple spread operator mutates the state
    const filtersData = cloneDeep(this.state.filtersData);
    filtersData[key].filtersColumn = value;

    if (value === "subjects" || value === "grades" || value === "active") filtersData[key].filtersValue = "eq";
    this.setState({ filtersData }, () => this.afterSetState(key)); // this is done so that we dont have multiple set states and we can avoid two renders
  };

  changeFilterValue = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filtersValue: value
        };
      }
      return item;
    });

    this.setState({ filtersData: _filtersData }, () => this.afterSetState(key));
  };

  addFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    if (filtersData.length < 3) {
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
    }
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
    this.setState({ filtersData: newFiltersData }, this.loadFilteredList);
  };

  getSearchQuery = () => {
    const { userOrgId, userDetails } = this.props;
    const { role, institutionIds } = userDetails;
    const { filtersData, searchByName, currentPage, showActive } = this.state;
    const search = {};

    if (searchByName.length > 0) {
      search.name = searchByName;
    }

    if (!filtersData.find(item => item.filtersColumn === "active")) {
      search.active = showActive ? [1] : [0];
    }

    for (let i = 0; i < filtersData.length; i++) {
      let { filtersColumn, filtersValue, filterStr } = filtersData[i];
      if (
        filtersColumn &&
        filtersValue &&
        filterStr !== "" // here because 0 can be a value too for "active" select
      ) {
        if (filtersColumn === "grades" || filtersColumn === "subjects" || filtersColumn === "active") {
          if (!search[filtersColumn]) {
            search[filtersColumn] = [filterStr];
          } else {
            search[filtersColumn].push(filterStr);
          }
        } else {
          if (!search[filtersColumn]) {
            search[filtersColumn] = [{ type: filtersValue, value: filterStr }];
          } else {
            search[filtersColumn].push({ type: filtersValue, value: filterStr });
          }
        }
      }
    }
    if (role === "school-admin") {
      Object.assign(search, { institutionIds });
    }
    return {
      search,
      districtId: userOrgId,
      limit: 25,
      page: currentPage
    };
  };

  loadFilteredList = () => {
    const { loadClassListData } = this.props;
    loadClassListData(this.getSearchQuery());
  };
  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const columnsData = [
      {
        title: "Class Name",
        dataIndex: "_source.name",
        editable: true,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a._source.name.localeCompare(b._source.name),
        width: 200
      },
      {
        title: "Class Code",
        dataIndex: "_source.code",
        editable: true,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a._source.code.localeCompare(b._source.code),
        width: 100
      },
      {
        title: "Course",
        dataIndex: "_source.course",
        editable: true,
        render: course => (course ? course.name : "-"),
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.course.name", "");
          const next = get(b, "_source.course.name", "");
          return next.localeCompare(prev);
        },
        width: 200
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
        },
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a._source.owners[0].name.localeCompare(b._source.owners[0].name),
        width: 100
      },
      {
        title: "Users",
        dataIndex: "_source.studentCount",
        editable: true,
        render: (studentCount = 0) => studentCount,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a._source.studentCount - b._source.studentCount,
        width: 50
      },
      {
        dataIndex: "_id",
        render: id => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditClass(id)} title="Edit">
                <Icon type="edit" theme="twoTone" />
              </StyledTableButton>
              <StyledTableButton onClick={() => this.handleDelete(id)} title="Archive">
                <Icon type="delete" theme="twoTone" />
              </StyledTableButton>
            </React.Fragment>
          );
        },
        width: 100
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
      showActive
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

    const SearchRows = [];
    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr, filterAdded } = filtersData[i];
      const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
      const isAddFilterDisable = filtersColumn === "" || filtersValue === "" || filterStr === "" || !filterAdded;

      const optValues = [];
      if (filtersColumn === "subjects" || filtersColumn === "grades" || filtersColumn === "active") {
        optValues.push(<Option value="eq">Equals</Option>);
      } else {
        optValues.push(
          <Option value="" disabled={true}>
            Select a value
          </Option>
        );
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
            <Option value="" disabled={true}>
              Select a column
            </Option>
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
          {filterStrDD[filtersColumn] ? (
            <StyledFilterSelect
              placeholder={filterStrDD[filtersColumn].placeholder}
              onChange={e => this.changeStatusValue(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
            >
              {filterStrDD[filtersColumn].list.map(item => (
                <Option value={item.value} disabled={item.disabled}>
                  {item.title}
                </Option>
              ))}
            </StyledFilterSelect>
          ) : (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
              onSearch={(v, e) => this.onSearchFilter(v, e, i)}
              onBlur={e => this.onBlurFilterText(e, i)}
              disabled={isFilterTextDisable}
              value={filterStr}
              innerRef={this.filterTextInputRef[i]}
            />
          )}
          {i < 2 && (
            <StyledAddFilterButton
              type="primary"
              onClick={e => this.addFilter(e, i)}
              disabled={isAddFilterDisable || i < filtersData.length - 1}
            >
              + Add Filter
            </StyledAddFilterButton>
          )}
          {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
            <StyledAddFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
              - Remove Filter
            </StyledAddFilterButton>
          )}
        </StyledControlDiv>
      );
    }
    return (
      <StyledTableContainer>
        <StyledFilterDiv>
          <div>
            <Button type="primary" onClick={this.showAddClassModal}>
              + Create new class
            </Button>

            <StyledSearch
              placeholder="Search by name"
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
            />
          </div>

          <RightFilterDiv>
            <Checkbox
              disabled={!!filtersData.find(item => item.filtersColumn === "active")}
              style={{ margin: "auto" }}
              value={showActive}
              onChange={this.onChangeShowActive}
            >
              Show Active Classes
            </Checkbox>
            <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
              <Button>
                Actions <Icon type="down" />
              </Button>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>
        {SearchRows}
        <StyledTable
          rowKey={record => record._id}
          rowSelection={rowSelection}
          dataSource={Object.values(dataSource)}
          columns={columnsData}
          pagination={false}
          scroll={{ y: 500 }}
        />
        <StyledPagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={25}
          total={totalClassCount}
          onChange={this.changePagination}
          hideOnSinglePage={true}
        />
        {editClassModalVisible && (
          <EditClassModal
            selClassData={selectedClass}
            modalVisible={editClassModalVisible}
            saveClass={this.updateClass}
            closeModal={this.closeEditClassModal}
            schoolsData={schoolsData}
            teacherList={teacherList}
            userOrgId={userOrgId}
            searchCourseList={searchCourseList}
            coursesForDistrictList={coursesForDistrictList}
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
          bulkUpdateClasses={this._bulkUpdateClasses}
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
      userDetails: getUser(state),
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
