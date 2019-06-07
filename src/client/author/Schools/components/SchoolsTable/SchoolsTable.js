import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Form, Icon, Select, message, Button, Menu } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTableButton,
  StyledFilterInput,
  StyledFilterButton,
  StyledSchoolSearch,
  StyledTable,
  StyledHeaderColumn,
  StyledSortIconDiv,
  StyledSortIcon,
  StyledPagination,
  StyledActionDropDown
} from "./styled";

import CreateSchoolModal from "./CreateSchoolModal/CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal/EditSchoolModal";

// actions
import { receiveSchoolsAction, createSchoolsAction, updateSchoolsAction, deleteSchoolsAction } from "../../ducks";

import { getSchoolsSelector } from "../../ducks";
import { getUserOrgId } from "../../../src/selectors/user";
import DeactivateSchoolModal from "./DeactivateSchoolModal/DeactivateSchoolModal";

class SchoolsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingKey: "",
      isAdding: false,
      selectedRowKeys: [],
      createSchoolModalVisible: false,
      editSchoolModaVisible: false,
      deactivateSchoolModalVisible: false,
      selectedDeactivateSchools: [],
      editSchoolKey: "",
      searchByName: "",
      filtersData: [
        {
          filtersColumn: "",
          filtersValue: "",
          filterStr: "",
          prevFilterStr: "",
          filterAdded: false
        }
      ],
      sortedInfo: {
        columnKey: "name",
        order: "asc"
      },
      currentPage: 1
    };
  }

  componentDidMount() {
    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({
      districtId: userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc"
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.schoolList.length === undefined) return { dataSource: [] };
    else return { dataSource: nextProps.schoolList };
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
    this.loadFilteredSchoolList(filtersData, sortedInfo, searchByName, currentPage);
  };

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
    const { dataSource } = this.state;
    this.setState({
      selectedDeactivateSchools: dataSource.filter(item => item.key === key),
      deactivateSchoolModalVisible: true
    });
  };

  onDeactivateSchool = () => {
    const { dataSource, selectedRowKeys } = this.state;
    const selectedSchools = dataSource.filter(item => {
      const selectedSchool = selectedRowKeys.filter(row => row === item.key);
      return selectedSchool.length > 0;
    });
    for (let i = 0; i < selectedSchools.length; i++) {
      if (selectedSchools[i].status != 1) {
        message.error("Please select active schools only");
        return;
      }
    }
    this.setState({
      selectedDeactivateSchools: selectedSchools,
      deactivateSchoolModalVisible: true
    });
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
    const filtersData = [...this.state.filtersData];
    if (filtersData[key].filtersColumn === value) return;

    filtersData[key].filtersColumn = value;
    if (value === "status") {
      filtersData[key].filtersValue = "eq";
      filtersData[key].filterStr = "";
      filtersData[key].prevFilterStr = "";
    }

    this.setState({ filtersData });

    if (filtersData[key].filtersValue !== "" && filtersData[key].filterStr !== "") {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredSchoolList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  changeFilterValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    if (filtersData[key].filtersValue === value) return;

    filtersData[key].filtersValue = value;
    this.setState({ filtersData });

    if (
      (filtersData[key].filterAdded || key == 2) &&
      filtersData[key].filtersColumn !== "" &&
      filtersData[key].filterStr !== ""
    ) {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredSchoolList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  onSearchFilterText = (e, key) => {
    const filtersData = [...this.state.filtersData];
    if (e === filtersData[key].prevFilterStr) return;

    filtersData[key].filterStr = e;
    filtersData[key].prevFilterStr = e;
    filtersData[key].filterAdded = true;

    this.setState({ filtersData });

    const { sortedInfo, searchByName, currentPage } = this.state;
    this.loadFilteredSchoolList(filtersData, sortedInfo, searchByName, currentPage);
  };

  changeFilterText = (e, key) => {
    const filtersData = [...this.state.filtersData];
    filtersData[key].filterStr = e.target.value;
    this.setState({ filtersData });
  };

  changeStatusValue = (value, key) => {
    const filtersData = [...this.state.filtersData];

    if (filtersData[key].filterStr === value) return;

    filtersData[key].filterStr = value;
    filtersData.filterAdded = true;
    this.setState({ filtersData });

    if (filtersData[key].filterAdded || key == 2) {
      const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredSchoolList(filtersData, sortedInfo, searchByName, currentPage);
    }
  };

  addFilter = (e, key) => {
    const filtersData = [...this.state.filtersData];
    if (filtersData[key].filterAdded && filtersData.length == 3) return;
    if (filtersData.length < 3) {
      filtersData[key].filterAdded = true;
      filtersData.push({
        filtersColumn: "",
        filtersValue: "",
        filterStr: "",
        prevFilterStr: "",
        filterAdded: false
      });
    }
    this.setState({ filtersData });
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
    this.loadFilteredSchoolList(newFiltersData, sortedInfo, searchByName, currentPage);
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    const { userOrgId: districtId, deleteSchool } = this.props;

    if (e.key === "edit school") {
      if (selectedRowKeys.length == 0) {
        message.error("Please select school to edit.");
      } else if (selectedRowKeys.length == 1) {
        this.onEditSchool(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single school to edit.");
      }
    } else if (e.key === "deactivate school") {
      if (selectedRowKeys.length > 0) {
        this.onDeactivateSchool();
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
    const { sortedInfo, filtersData, searchByName } = this.state;

    let search = {};
    if (searchByName.length > 0) {
      search.name = { type: "cont", value: searchByName };
    }
    for (let i = 0; i < filtersData.length; i++) {
      if (filtersData[i].filterAdded) {
        search[filtersData[i].filtersColumn] = { type: filtersData[i].filtersValue, value: filtersData[i].filterStr };
      }
    }

    createSchool({ body: newData, sortedInfo, search });

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

    this.setState({
      isAdding: false,
      isChangeState: true,
      editSchoolModaVisible: false
    });

    const updateData = {
      _id: newData[index]._id,
      name: updatedSchoolData.name,
      districtId: newData[index].districtId,
      location: {
        address: updatedSchoolData.address,
        city: updatedSchoolData.city,
        state: updatedSchoolData.state,
        country: newData[index].country,
        zip: updatedSchoolData.zip
      }
    };

    this.props.updateSchool({ id: newData[index]._id, body: updateData });
  };

  closeEditSchoolModal = () => {
    this.setState({ editSchoolModaVisible: false });
  };

  handleSearchName = e => {
    const { filtersData, sortedInfo, currentPage } = this.state;
    this.setState({ searchByName: e });
    this.loadFilteredSchoolList(filtersData, sortedInfo, e, currentPage);
  };

  changePagination = pageNumber => {
    const { filtersData, sortedInfo, searchByName } = this.state;
    this.setState({ currentPage: pageNumber });
    this.loadFilteredSchoolList(filtersData, sortedInfo, searchByName, pageNumber);
  };

  deactivateSchool = () => {
    const { selectedDeactivateSchools } = this.state;
    const { userOrgId, deleteSchool } = this.props;

    const schoolIds = [];
    selectedDeactivateSchools.map(row => {
      schoolIds.push(row._id);
    });
    this.setState({ deactivateSchoolModalVisible: false });
    deleteSchool({ districtId: userOrgId, schoolIds });
  };

  closeDeactivateSchoolModal = () => {
    this.setState({ deactivateSchoolModalVisible: false });
  };

  loadFilteredSchoolList(filtersData, sortedInfo, searchByName, currentPage) {
    const { loadSchoolsData, userOrgId } = this.props;
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

    loadSchoolsData({
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order,
      search
    });
  }

  render() {
    const {
      dataSource,
      selectedRowKeys,
      createSchoolModalVisible,
      editSchoolModaVisible,
      deactivateSchoolModalVisible,
      selectedDeactivateSchools,
      editSchoolKey,
      filtersData,
      sortedInfo,
      currentPage
    } = this.state;
    const { userOrgId, totalSchoolsCount } = this.props;

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
        width: "20%",
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
            <p>City</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "city" && sortedInfo.order === "asc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "city" && sortedInfo.order === "desc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "city",
        editable: true,
        width: "15%",
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("city");
            }
          };
        }
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>State</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "state" && sortedInfo.order === "asc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "state" && sortedInfo.order === "desc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "state",
        editable: true,
        width: "15%",
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("state");
            }
          };
        }
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>Zip</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "zip" && sortedInfo.order === "asc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "zip" && sortedInfo.order === "desc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "zip",
        editable: true,
        width: "10%",
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("zip");
            }
          };
        }
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>Status</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "status" && sortedInfo.order === "desc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "status" && sortedInfo.order === "asc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "status",
        editable: true,
        width: "15%",
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("status");
            }
          };
        },
        render: (text, record) => {
          return (
            <React.Fragment>{record.status == 1 ? <span>Approved</span> : <span>Not Approved</span>}</React.Fragment>
          );
        }
      },
      {
        title: "Teacher",
        dataIndex: "teachersCount",
        editable: true,
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("teachersCount");
            }
          };
        }
      },
      {
        title: "Student",
        dataIndex: "studentsCount",
        editable: true,
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("studentsCount");
            }
          };
        }
      },
      {
        title: "Section",
        dataIndex: "sectionsCount",
        editable: true,
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("sectionsCount");
            }
          };
        }
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

    const editSchoolData = dataSource.filter(item => item.key === editSchoolKey);

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit school">Edit School</Menu.Item>
        <Menu.Item key="deactivate school">Deactivate School</Menu.Item>
      </Menu>
    );

    const SearchRows = [];
    for (let i = 0; i < filtersData.length; i++) {
      const isFilterTextDisable = filtersData[i].filtersColumn === "" || filtersData[i].filtersValue === "";
      const isAddFilterDisable =
        filtersData[i].filtersColumn === "" || filtersData[i].filtersValue === "" || filtersData[i].filterStr === "";

      let showRemoveButton = false;
      if (i > 0) showRemoveButton = true;
      else if (i == 0) {
        showRemoveButton = !isAddFilterDisable && filtersData[i].filterAdded;
      }

      const optValues = [];
      if (filtersData[i].filtersColumn === "status") {
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
            <Option value="address">Address</Option>
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
            {optValues}
          </StyledFilterSelect>
          {filtersData[i].filtersColumn !== "status" ? (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
              onSearch={e => this.onSearchFilterText(e, i)}
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
              <Option value="">Select a value</Option>
              <Option value="1">Approved</Option>
              <Option value="0">Not Approved</Option>
            </StyledFilterSelect>
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

          {showRemoveButton && (
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
          <Button type="primary" onClick={this.showCreateSchoolModal}>
            + Create School
          </Button>
          {createSchoolModalVisible && (
            <CreateSchoolModal
              modalVisible={createSchoolModalVisible}
              createSchool={this.createSchool}
              closeModal={this.closeCreateSchoolModal}
              dataSource={dataSource}
              userOrgId={userOrgId}
            />
          )}

          <StyledSchoolSearch placeholder="Search by name" onSearch={this.handleSearchName} />

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
          total={totalSchoolsCount}
          onChange={this.changePagination}
        />

        {editSchoolModaVisible && editSchoolKey !== "" && (
          <EditSchoolModal
            schoolData={editSchoolData[0]}
            modalVisible={editSchoolModaVisible}
            updateSchool={this.updateSchool}
            closeModal={this.closeEditSchoolModal}
            userOrgId={userOrgId}
          />
        )}

        {deactivateSchoolModalVisible && (
          <DeactivateSchoolModal
            modalVisible={deactivateSchoolModalVisible}
            deactivateSchool={this.deactivateSchool}
            closeModal={this.closeDeactivateSchoolModal}
            schoolData={selectedDeactivateSchools}
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
      totalSchoolsCount: get(state, ["schoolsReducer", "totalSchoolCount"], 0)
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      createSchool: createSchoolsAction,
      updateSchool: updateSchoolsAction,
      deleteSchool: deleteSchoolsAction
    }
  )
);

export default enhance(EditableSchoolsTable);

SchoolsTable.propTypes = {
  schoolList: PropTypes.array.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  updateSchool: PropTypes.func.isRequired,
  createSchool: PropTypes.func.isRequired,
  deleteSchool: PropTypes.func.isRequired
};
