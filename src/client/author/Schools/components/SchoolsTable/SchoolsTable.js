import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Popconfirm, Form, Icon, Select, message, Button } from "antd";
const Option = Select.Option;

import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledTableButton,
  StyledFilterInput,
  StyledFilterButton,
  StyledSchoolSearch,
  StyledSelectStatus,
  StyledTable,
  StyledHeaderColumn,
  StyledSortIconDiv,
  StyledSortIcon
} from "./styled";

import CreateSchoolModal from "./CreateSchoolModal/CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal/EditSchoolModal";

// actions
import {
  receiveSchoolsAction,
  createSchoolsAction,
  updateSchoolsAction,
  deleteSchoolsAction,
  setSearchByNameValueAction,
  setSchoolFiltersDataAction,
  setSchoolActionStatusAction,
  setSchoolsSortInfoAction
} from "../../ducks";

import { getSchoolsSelector } from "../../ducks";
import { getUserOrgId } from "../../../src/selectors/user";

function compareByAlph(a, b) {
  if (a.toString().toLowerCase() > b.toString().toLowerCase()) {
    return -1;
  }
  if (a.toString().toLowerCase() < b.toString().toLowerCase()) {
    return 1;
  }
  return 0;
}

class SchoolsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingKey: "",
      isAdding: false,
      selectedRowKeys: [],
      createSchoolModalVisible: false,
      editSchoolModaVisible: false,
      editSchoolKey: ""
    };
  }

  componentDidMount() {
    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({ districtId: userOrgId, limit: 100, page: 1 });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.schoolList.length === undefined) return { dataSource: [] };
    else return { dataSource: nextProps.schoolList };
  }

  compareByAlph(a, b) {
    if (a.toString().toLowerCase() > b.toString().toLowerCase()) {
      return -1;
    }
    if (a.toString().toLowerCase() < b.toString().toLowerCase()) {
      return 1;
    }
    return 0;
  }

  onHeaderCell = colName => {
    const { setSortInfo } = this.props;
    setSortInfo(colName);
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
    const data = [...this.state.dataSource];
    this.setState({ dataSource: data.filter(item => item.key !== key) });
    const selectedSchool = data.filter(item => item.key == key);

    const { deleteSchool } = this.props;
    deleteSchool([{ schoolId: selectedSchool[0]._id, orgId: selectedSchool[0].districtId }]);
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

  changeStatusValue = (value, key) => {
    const { filtersData } = this.props;
    filtersData[key].filterStr = value;
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

  changeActionMode = value => {
    const { selectedRowKeys } = this.state;
    const { setActionStatus } = this.props;
    if (value === "") {
      setActionStatus("");
    } else if (value === "edit school") {
      if (selectedRowKeys.length == 0) {
        setActionStatus("");
        message.error("Please select school to edit.");
      } else if (selectedRowKeys.length == 1) {
        setActionStatus("edit school");
        this.onEditSchool(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        setActionStatus("");
        message.error("Please select single school to edit.");
      }
    } else if (value === "deactivate school") {
      if (selectedRowKeys.length > 0) {
        setActionStatus("deactivate school");
        const data = [...this.state.dataSource];
        this.setState({
          dataSource: data.filter(item => {
            if (selectedRowKeys.indexOf(item.key) == -1) return item;
          })
        });

        const selectedSchoolsData = [];
        selectedRowKeys.map(value => {
          selectedSchoolsData.push({ schoolId: value, orgId: this.props.userOrgId });
        });
        const { deleteSchool } = this.props;
        deleteSchool(selectedSchoolsData);
      } else {
        setActionStatus("");
        message.error("Please select schools to delete.");
      }
    }
  };

  createSchool = newSchoolData => {
    const newData = {
      name: newSchoolData.name,
      districtId: this.props.districtId,
      location: {
        address: newSchoolData.address,
        city: newSchoolData.city,
        state: newSchoolData.state,
        zip: newSchoolData.zip,
        country: newSchoolData.country
      }
    };

    const { createSchool } = this.props;
    createSchool({ body: newData });

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
    delete updateSchoolsAction.key;
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...updatedSchoolData
      });
      this.setState({ dataSource: newData, editingKey: "" });
    } else {
      newData.push(updatedSchoolData);
      this.setState({ dataSource: newData, editingKey: "" });
    }

    this.setState({
      isAdding: false,
      isChangeState: true,
      editSchoolModaVisible: false
    });

    const updateData = {
      _id: newData[index]._id,
      name: newData[index].name,
      districtId: newData[index].districtId,
      location: {
        address: updatedSchoolData.address,
        city: updatedSchoolData.city,
        state: updatedSchoolData.state,
        country: newData[index].country,
        zip: updatedSchoolData.zip
      }
    };
    const { updateSchool } = this.props;
    updateSchool({ id: newData[index]._id, body: updateData });
  };

  closeEditSchoolModal = () => {
    this.props.setActionStatus("");
    this.setState({ editSchoolModaVisible: false });
  };

  searchByName = e => {
    const { setSearchByName } = this.props;
    setSearchByName(e.target.value);
  };

  render() {
    const { dataSource, selectedRowKeys, createSchoolModalVisible, editSchoolModaVisible, editSchoolKey } = this.state;

    const { filtersData, sortedInfo, selectedAction } = this.props;

    const columnsInfo = [
      {
        title: (
          <StyledHeaderColumn>
            <p>Name</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "name" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "name" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "name",
        editable: true,
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
                colorValue={sortedInfo.columnKey === "city" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "city" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "city",
        editable: true,
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
                colorValue={sortedInfo.columnKey === "state" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "state" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "state",
        editable: true,
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
                colorValue={sortedInfo.columnKey === "zip" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "zip" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "zip",
        editable: true,
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
                colorValue={sortedInfo.columnKey === "status" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "status" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "status",
        editable: true,
        onHeaderCell: column => {
          return {
            onClick: () => {
              this.onHeaderCell("status");
            }
          };
        },
        render: (text, record) => {
          return (
            <React.Fragment>{record.status == 0 ? <span>Approved</span> : <span>Not Approved</span>}</React.Fragment>
          );
        }
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>Teacher</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "teachersCount" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "teachersCount" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
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
        title: (
          <StyledHeaderColumn>
            <p>Student</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "studentsCount" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "studentsCount" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
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
        title: (
          <StyledHeaderColumn>
            <p>Section</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "sectionsCount" && sortedInfo.order === "descend"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "sectionsCount" && sortedInfo.order === "ascend"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
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
            <Option value="">Select a value</Option>
            <Option value="eq">Equals</Option>
            <Option value="cont">Contains</Option>
          </StyledFilterSelect>
          {filtersData[i].filtersColumn !== "status" ? (
            <StyledFilterInput
              placeholder="Enter text"
              onChange={e => this.changeFilterText(e, i)}
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
              <Option value="0">Approved</Option>
              <Option value="1">All</Option>
            </StyledFilterSelect>
          )}
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
          <Button type="primary" onClick={this.showCreateSchoolModal}>
            + Create School
          </Button>
          {createSchoolModalVisible && (
            <CreateSchoolModal
              modalVisible={createSchoolModalVisible}
              createSchool={this.createSchool}
              closeModal={this.closeCreateSchoolModal}
              dataSource={dataSource}
            />
          )}

          <StyledSchoolSearch placeholder="Search by name" onChange={this.searchByName} />
          <StyledSelectStatus defaultValue="" onChange={this.changeActionMode} value={selectedAction}>
            <Option value="">Actions</Option>
            <Option value="edit school">Edit School</Option>
            <Option value="deactivate school">Deactivate School</Option>
          </StyledSelectStatus>
        </StyledControlDiv>
        {SearchRows}
        <StyledTable
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 20 }}
        />

        {editSchoolModaVisible && editSchoolKey !== "" && (
          <EditSchoolModal
            schoolData={editSchoolData[0]}
            modalVisible={editSchoolModaVisible}
            updateSchool={this.updateSchool}
            closeModal={this.closeEditSchoolModal}
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
      filtersData: get(state, ["schoolsReducer", "filtersData"], []),
      selectedAction: get(state, ["schoolsReducer", "selectedAction"], ""),
      sortedInfo: get(state, ["schoolsReducer", "sortedInfo"])
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      createSchool: createSchoolsAction,
      updateSchool: updateSchoolsAction,
      deleteSchool: deleteSchoolsAction,
      setSearchByName: setSearchByNameValueAction,
      setFiltersData: setSchoolFiltersDataAction,
      setActionStatus: setSchoolActionStatusAction,
      setSortInfo: setSchoolsSortInfoAction
    }
  )
);

export default enhance(EditableSchoolsTable);

SchoolsTable.propTypes = {
  loadSchoolsData: PropTypes.func.isRequired,
  updateSchool: PropTypes.func.isRequired,
  createSchool: PropTypes.func.isRequired,
  deleteSchool: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired
};
