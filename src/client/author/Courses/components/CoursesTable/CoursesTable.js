import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { get } from "lodash";

import { Icon, Select, message, Button, Menu } from "antd";
const Option = Select.Option;

import AddCourseModal from "./AddCourseModal/AddCourseModal";
import EditCourseModal from "./EditCourseModal/EditCourseModal";
import UploadCourseModal from "./UploadCourseModal";
import {
  StyledControlDiv,
  StyledFilterDiv,
  StyledFilterSelect,
  StyledFilterInput,
  StyledActionDropDown,
  StyledClassName
} from "../../../../admin/Common/StyledComponents";
import {
  StyledCoursesTable,
  StyledFilterButton,
  StyledActiveCheckbox,
  StyledPagination,
  StyledHeaderColumn,
  StyledSortIconDiv,
  StyledSortIcon,
  UserNameContainer,
  UserName,
  CreateCourseBtn
} from "./styled";

import {
  receiveCourseListAction,
  createCourseAction,
  updateCourseAction,
  deactivateCourseAction,
  getCourseListSelector,
  setSelectedRowKeysAction,
  setShowActiveStatusAction,
  resetUploadModalStatusAction
} from "../../ducks";

import {
  MainContainer,
  TableContainer,
  SubHeaderWrapper,
  FilterWrapper,
  StyledButton,
  StyledSchoolSearch,
  StyledTableButton,
  RightFilterDiv,
  LeftFilterDiv
} from "../../../../common/styled";

import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { roleuser } from "@edulastic/constants";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { TypeToConfirmModal } from "@edulastic/common";

class CoursesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      addCourseModalVisible: false,
      editCourseModalVisible: false,
      uploadCourseModalVisible: false,
      editCourseKey: "",
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
      showActive: true,
      searchData: {},
      deactivateCourseModalVisible: false,
      refineButtonActive: false
    };
    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    const { userOrgId, loadCourseListData } = this.props;
    loadCourseListData({
      districtId: userOrgId,
      page: 1,
      limit: 25,
      sortField: "name",
      order: "asc",
      search: {},
      active: 1
    });

    this.setState({
      searchData: {
        districtId: userOrgId,
        page: 1,
        limit: 25,
        sortField: "name",
        order: "asc",
        search: {},
        active: 1
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      dataSource: nextProps.courseList,
      selectedRowKeys: nextProps.selectedRowKeys
    };
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
      sortedInfo.order = "asc";
    }
    this.setState({ sortedInfo }, this.loadFilteredList);
  };

  onEditCourse = key => {
    this.setState({
      editCourseModalVisible: true,
      editCourseKey: key
    });
  };

  confirmDeactivate = () => {
    const { selectedRowKeys } = this.state;
    const { deactivateCourse } = this.props;
    const selectedCourses = selectedRowKeys.map(id => {
      return {
        id
      };
    });
    deactivateCourse(selectedCourses);
    this.setState({
      deactivateCourseModalVisible: false
    });
  };

  onSelectChange = selectedRowKeys => {
    this.props.setSelectedRowKeys(selectedRowKeys);
  };

  showAddCourseModal = () => {
    this.setState({
      addCourseModalVisible: true
    });
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
        this.setState({
          deactivateCourseModalVisible: true
        });
      } else {
        message.error("Please select course to delete.");
      }
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
    const { updateCourse, userOrgId } = this.props;
    const { dataSource, editCourseKey, filtersData, sortedInfo, searchByName, currentPage, showActive } = this.state;
    const selectedSourceKey = dataSource.filter(item => item.key == editCourseKey);

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

    const loadListJsonData = {
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order,
      search
    };

    if (showActive) loadListJsonData.active = 1;

    updateCourse({
      updateData: {
        courseId: selectedSourceKey[0]._id,
        data: updatedCourseData
      },
      searchData: loadListJsonData
    });

    this.setState({
      editCourseModalVisible: false
    });
  };

  closeEditCourseModal = () => {
    this.setState({
      editCourseModalVisible: false
    });
  };

  changePagination = pageNumber => {
    const { filtersData, sortedInfo, searchByName } = this.state;
    this.setState({ currentPage: pageNumber }, this.loadFilteredList);
  };

  onChangeShowActive = e => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    this.setState({ showActive: e.target.checked }, this.loadFilteredList);
  };

  closeUploadCourseModal = () => {
    this.setState({ uploadCourseModalVisible: false });
    this.props.resetUploadModal();
  };

  renderCourseNames() {
    const { dataSource, selectedRowKeys } = this.state;
    const selectedCourses = dataSource.filter(item => selectedRowKeys.includes(item._id));
    return selectedCourses.map(_course => {
      const { id, name, number } = _course;
      return (
        <StyledClassName key={id}>
          {name} {number}
        </StyledClassName>
      );
    });
  }
  onInputChangeHandler = ({ target }) => this.setState({ confirmText: target.value });

  deactivateSingleCourse = ({ _id }) => {
    this.props.setSelectedRowKeys([_id]);
    this.setState({
      deactivateCourseModalVisible: true
    });
  };

  onCancelConfirmModal = () => {
    this.setState({
      deactivateCourseModalVisible: false
    });
  };

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive });
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
        return { ...item, filterAdded: !!value };
      }
      return item;
    });

    // For some unknown reason till now calling blur() synchronously doesnt work.
    this.setState({ filtersData: _filtersData }, () => this.filterTextInputRef[i].current.blur());
  };

  onBlurFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: e.target.value,
          filterAdded: true
        };
      }
      return item;
    });
    this.setState({ filtersData: _filtersData }, this.loadFilteredList);
  };

  changeStatusValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = value;
    this.setState({ filtersData }, this.loadFilteredList);
  };

  changeFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return { ...item, filterStr: e.target.value };
      }
      return item;
    });
    this.setState({ filtersData: _filtersData });
  };

  changeFilterColumn = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filtersColumn = value;
    if (value === "status") filtersData[key].filtersValue = "eq";
    this.setState({ filtersData }, this.loadFilteredList);
  };

  changeFilterValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filtersValue = value;
    this.setState({ filtersData }, this.loadFilteredList);
  };

  addFilter = (e, key) => {
    const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
    if (filtersData.length < 3) {
      const _filtersData = filtersData.map((item, index) => {
        if (index === key) {
          return {
            ...item,
            filterAdded: true
          };
        }
        return item;
      });

      _filtersData.push({
        filterAdded: false,
        filtersColumn: "",
        filtersValue: "",
        filterStr: ""
      });
      this.setState({ filtersData: _filtersData });
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
      newFiltersData = filtersData.filter((item, index) => index != key);
    }
    this.setState({ filtersData: newFiltersData }, this.loadFilteredList);
  };

  getSearchQuery = () => {
    const { filtersData, sortedInfo, searchByName, currentPage, showActive } = this.state;
    const { userOrgId } = this.props;

    let search = {};

    if (searchByName.length > 0) {
      search.name = [{ type: "cont", value: searchByName }];
    }

    for (let i = 0; i < filtersData.length; i++) {
      let { filtersColumn, filtersValue, filterStr } = filtersData[i];
      if (filtersColumn !== "" && filtersValue !== "" && filterStr !== "") {
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }];
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr });
        }
      }
    }

    const loadListJsonData = {
      search,
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order
    };
    if (showActive) {
      loadListJsonData.active = 1;
    }

    // TO DO: remove this line after further investigation
    this.setState({ searchData: loadListJsonData });

    return loadListJsonData;
  };

  loadFilteredList() {
    const { loadCourseListData } = this.props;
    loadCourseListData(this.getSearchQuery());
  }
  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      dataSource,
      selectedRowKeys,
      addCourseModalVisible,
      editCourseModalVisible,
      uploadCourseModalVisible,
      editCourseKey,
      filtersData,
      sortedInfo,
      currentPage,
      showActive,
      searchData,
      deactivateCourseModalVisible,
      refineButtonActive
    } = this.state;

    const { totalCourseCount, userOrgId, role } = this.props;

    const columnsInfo = [
      {
        title: (
          <StyledHeaderColumn>
            <p>Name</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "name" && sortedInfo.order === "asc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "name" && sortedInfo.order === "desc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "name",
        editable: true,
        width: 200,
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("name");
            }
          };
        }
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>Number</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "number" && sortedInfo.order === "asc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "number" && sortedInfo.order === "desc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "number",
        editable: true,
        width: 200,
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("number");
            }
          };
        }
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>Classes</p>
          </StyledHeaderColumn>
        ),
        dataIndex: "classCount",
        editable: true,
        width: 100,
        render: (classCount, record) => {
          const courseName = get(record, "name", "");
          return (
            <Link
              to={{
                pathname: "/author/Classes",
                state: {
                  filtersColumn: "courses",
                  filtersValue: "eq",
                  filterStr: courseName,
                  filterAdded: true
                }
              }}
            >
              {classCount}
            </Link>
          );
        }
      },
      {
        dataIndex: "operation",
        width: 100,
        render: (text, record) => {
          return (
            <div style={{ whiteSpace: "nowrap" }}>
              {role === roleuser.DISTRICT_ADMIN && !!record.active && (
                <>
                  <StyledTableButton onClick={() => this.onEditCourse(record.key)} title="Edit">
                    <IconPencilEdit color={themeColor} />
                  </StyledTableButton>
                  <StyledTableButton onClick={() => this.deactivateSingleCourse(record)} title="Deactivate">
                    <IconTrash color={themeColor} />
                  </StyledTableButton>
                </>
              )}
            </div>
          );
        }
      }
    ];

    const breadcrumbData = [
      {
        title: "MANAGE DISTRICT",
        to: "/author/Courses"
      },
      {
        title: "COURSES",
        to: ""
      }
    ];

    const columns = columnsInfo.map(col => {
      return {
        ...col
      };
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

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
        !filtersData[i].filterAdded;

      SearchRows.push(
        <StyledControlDiv key={`${filtersData[i].filtersColumn}${i}`}>
          <StyledFilterSelect
            placeholder="Select a column"
            onChange={e => this.changeFilterColumn(e, i)}
            defaultValue={filtersData[i].filtersColumn}
            value={filtersData[i].filtersColumn}
          >
            <Option value="">Select a column</Option>
            <Option value="name">Course Name</Option>
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
            onSearch={(v, e) => this.onSearchFilter(v, e, i)}
            onBlur={e => this.onBlurFilterText(e, i)}
            disabled={isFilterTextDisable}
            value={filtersData[i].filterStr}
            ref={this.filterTextInputRef[i]}
          />
          {i < 2 && (
            <StyledFilterButton
              type="primary"
              onClick={e => this.addFilter(e, i)}
              disabled={isAddFilterDisable || i < filtersData.length - 1}
            >
              + Add Filter
            </StyledFilterButton>
          )}

          {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
            <StyledFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
              - Remove Filter
            </StyledFilterButton>
          )}
        </StyledControlDiv>
      );
    }

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
          <StyledButton type={"default"} shape="round" icon="filter" onClick={this._onRefineResultsCB}>
            REFINE RESULTS
            <Icon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        </SubHeaderWrapper>

        {refineButtonActive && <FilterWrapper>{SearchRows}</FilterWrapper>}

        <StyledFilterDiv>
          <LeftFilterDiv width={60}>
            <StyledSchoolSearch
              placeholder="Search by name"
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
            />
            <CreateCourseBtn type="primary" onClick={this.showAddCourseModal}>
              + Create Course
            </CreateCourseBtn>
          </LeftFilterDiv>
          <RightFilterDiv>
            <StyledActiveCheckbox defaultChecked={showActive} onChange={this.onChangeShowActive}>
              Show active courses only
            </StyledActiveCheckbox>
            <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
              <Button>
                Actions <Icon type="down" />
              </Button>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>
        <TableContainer>
          <StyledCoursesTable
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <StyledPagination
            current={currentPage}
            defaultCurrent={1}
            pageSize={25}
            total={totalCourseCount}
            onChange={this.changePagination}
            hideOnSinglePage={true}
          />
        </TableContainer>
        {editCourseModalVisible && editCourseKey != "" && (
          <EditCourseModal
            courseData={selectedCourse[0]}
            modalVisible={editCourseModalVisible}
            saveCourse={this.updateCourse}
            closeModal={this.closeEditCourseModal}
            userOrgId={userOrgId}
          />
        )}
        {addCourseModalVisible && (
          <AddCourseModal
            modalVisible={addCourseModalVisible}
            addCourse={this.addCourse}
            closeModal={this.closeAddCourseModal}
            userOrgId={userOrgId}
          />
        )}
        {uploadCourseModalVisible && (
          <UploadCourseModal
            modalVisible={uploadCourseModalVisible}
            closeModal={this.closeUploadCourseModal}
            searchData={searchData}
          />
        )}

        <TypeToConfirmModal
          modalVisible={deactivateCourseModalVisible}
          title="Deactivate course(s)"
          handleOnOkClick={this.confirmDeactivate}
          wordToBeTyped="DEACTIVATE"
          primaryLabel="Are you sure you want to deactivate the following course(s)?"
          secondaryLabel={this.renderCourseNames()}
          closeModal={() =>
            this.setState({
              deactivateCourseModalVisible: false
            })
          }
        />
      </MainContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      courseList: getCourseListSelector(state),
      selectedRowKeys: get(state, ["coursesReducer", "selectedRowKeys"], []),
      totalCourseCount: get(state, ["coursesReducer", "totalCourseCount"], 0),
      role: getUserRole(state)
    }),
    {
      createCourse: createCourseAction,
      updateCourse: updateCourseAction,
      deactivateCourse: deactivateCourseAction,
      loadCourseListData: receiveCourseListAction,
      setSelectedRowKeys: setSelectedRowKeysAction,
      setShowActiveStatus: setShowActiveStatusAction,
      resetUploadModal: resetUploadModalStatusAction
    }
  )
);

export default enhance(CoursesTable);

CoursesTable.propTypes = {
  userOrgId: PropTypes.string.isRequired,
  courseList: PropTypes.array.isRequired,
  loadCourseListData: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
  updateCourse: PropTypes.func.isRequired,
  deactivateCourse: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  setSelectedRowKeys: PropTypes.func.isRequired,
  setShowActiveStatus: PropTypes.func.isRequired,
  resetUploadModal: PropTypes.func.isRequired
};
