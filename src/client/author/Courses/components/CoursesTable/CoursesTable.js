import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Icon, Select, message, Button, Menu } from "antd";
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
  StyledActiveCheckbox,
  StyledPagination,
  StyledHeaderColumn,
  StyledSortIconDiv,
  StyledSortIcon
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

import { getUserOrgId } from "../../../src/selectors/user";

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
      searchData: {}
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

  handleDelete = key => {
    const data = [...this.state.dataSource];
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

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //
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
    for (let i = 0; i < filtersData.length; i++) {
      if (
        filtersData[i].filtersColumn !== "" &&
        filtersData[i].filtersValue !== "" &&
        filtersData[i].filterStr !== ""
      ) {
        search[filtersData[i].filtersColumn] = { type: filtersData[i].filtersValue, value: filtersData[i].filterStr };
      }
    }

    if (searchByName.length > 0) {
      search.name = { type: "cont", value: searchByName };
    }

    const loadListJsonData = {
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order,
      active: showActive ? 1 : 0,
      search
    };

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
      searchData
    } = this.state;

    const { totalCourseCount, userOrgId } = this.props;

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
        width: "40%",
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
        width: "30%",
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
        width: "20%",
        render: (text, record) => {
          const strClassCount = record.classCount == 0 ? "-" : record.classCount;
          return <React.Fragment>{strClassCount}</React.Fragment>;
        }
      },
      {
        dataIndex: "operation",
        width: "94px",
        render: (text, record) => {
          return (
            <React.Fragment>
              <StyledTableButton onClick={() => this.onEditCourse(record.key)}>
                <Icon type="edit" theme="twoTone" />
              </StyledTableButton>
              <StyledTableButton onClick={() => this.handleDelete(record.key)}>
                <Icon type="delete" theme="twoTone" />
              </StyledTableButton>
            </React.Fragment>
          );
        }
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
            innerRef={this.filterTextInputRef[i]}
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
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showAddCourseModal}>
            + Create Course
          </Button>

          <StyledNameSearch placeholder="Search by name" onSearch={this.handleSearchName} />
          <StyledActiveCheckbox defaultChecked={showActive} onChange={this.onChangeShowActive}>
            Show active courses only
          </StyledActiveCheckbox>
          <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} pagination={false} />
        <StyledPagination
          current={currentPage}
          defaultCurrent={1}
          pageSize={25}
          total={totalCourseCount}
          onChange={this.changePagination}
        />
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
      </StyledTableContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      courseList: getCourseListSelector(state),
      selectedRowKeys: get(state, ["coursesReducer", "selectedRowKeys"], []),
      totalCourseCount: get(state, ["coursesReducer", "totalCourseCount"], 0)
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
