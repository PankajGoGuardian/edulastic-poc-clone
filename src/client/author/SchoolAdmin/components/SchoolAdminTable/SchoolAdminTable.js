import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Icon, Select, message, Button, Menu, Checkbox } from "antd";
import { StyledComponents, TypeToConfirmModal } from "@edulastic/common";
import {
  StyledTableContainer,
  StyledControlDiv,
  StyledFilterSelect,
  StyledClassName,
  StyledFilterInput,
  StyledAddFilterButton,
  StyledSchoolSearch,
  StyledActionDropDown
} from "./styled";

import CreateSchoolAdminModal from "./CreateSchoolAdminModal/CreateSchoolAdminModal";
import EditSchoolAdminModal from "./EditSchoolAdminModal/EditSchoolAdminModal";

import {
  receiveSchoolAdminAction,
  createSchoolAdminAction,
  updateSchoolAdminAction,
  deleteSchoolAdminAction,
  setSearchNameAction,
  getSchoolAdminSelector,
  getShowActiveCoursesSelector,
  setShowActiveCoursesAction,
  getPageNoSelector,
  setPageNoAction,
  getFiltersSelector,
  changeFilterColumnAction,
  changeFilterTypeAction,
  changeFilterValueAction,
  addFilterAction,
  removeFilterAction
} from "../../ducks";
import { receiveSchoolsAction, getSchoolsSelector } from "../../../Schools/ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const { Option } = Select;
const { OnHoverTable, OnHoverButton } = StyledComponents;

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

class SchoolAdminTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      createSchoolAdminModalVisible: false,
      editSchoolAdminModaVisible: false,
      editSchoolAdminKey: "",
      deactivateSchoolAdminModalVisible: false
    };
    this.columns = [
      {
        title: "First Name",
        dataIndex: "_source.firstName",
        sorter: (a, b) => compareByAlph(a.firstName, b.secondName)
      },
      {
        title: "Last Name",
        dataIndex: "_source.lastName",
        sorter: (a, b) => compareByAlph(a.lastName, b.lastName)
      },
      {
        title: "Email",
        dataIndex: "_source.email",
        sorter: (a, b) => compareByAlph(a.email, b.email)
      },
      {
        title: "SSO",
        dataIndex: "_source.sso",
        render: (sso = "N/A") => sso
      },
      {
        title: "School",
        dataIndex: "_source.institutionDetails",
        render: (schools = []) => schools.map(school => school.name)
      },
      {
        dataIndex: "_id",
        render: id => (
          <React.Fragment>
            <OnHoverButton onClick={() => this.onEditSchoolAdmin(id)}>
              <Icon type="edit" theme="twoTone" />
            </OnHoverButton>
            <OnHoverButton onClick={() => this.handleDeleteSchoolAdmin(id)}>
              <Icon type="delete" theme="twoTone" />
            </OnHoverButton>
          </React.Fragment>
        )
      }
    ];
  }

  componentDidMount() {
    const { loadSchoolAdminData, loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({
      districtId: userOrgId
    });
    loadSchoolAdminData();
  }

  static getDerivedStateFromProps(nextProps, state) {
    const {
      schoolAdminData: { result }
    } = nextProps;
    return {
      selectedRowKeys: state.selectedRowKeys.filter(rowKey => !!result[rowKey])
    };
  }

  componentDidUpdate(prevProps) {
    const { loadSchoolAdminData, showActiveCourses, pageNo } = this.props;
    // here when the ShowActiveCourses checkbox is toggled, or the page number changes,
    // an api call is fired to get the data
    if (showActiveCourses !== prevProps.showActiveCourses || pageNo !== prevProps.pageNo) {
      loadSchoolAdminData();
    }
  }

  onEditSchoolAdmin = id => {
    this.setState({
      editSchoolAdminModaVisible: true,
      editSchoolAdminKey: id
    });
  };

  confirmDeactivate = () => {
    const { deleteSchoolAdmin } = this.props;
    const { selectedSchoolsForDeactivate } = this.state;
    deleteSchoolAdmin({ userIds: selectedSchoolsForDeactivate, role: "school-admin" });
    this.setState({
      deactivateSchoolAdminModalVisible: false
    });
  };

  handleDeleteSchoolAdmin = id => {
    this.setState({
      selectedSchoolsForDeactivate: [id],
      deactivateSchoolAdminModalVisible: true
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: true
    });
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    if (e.key === "edit user") {
      if (selectedRowKeys.length === 0) {
        message.error("Please select user to edit.");
      } else if (selectedRowKeys.length === 1) {
        this.onEditSchoolAdmin(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error("Please select single user to edit.");
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedSchoolsForDeactivate: selectedRowKeys,
          deactivateSchoolAdminModalVisible: true
        });
      } else {
        message.error("Please select schools to delete.");
      }
    }
  };

  createSchoolAdmin = newSchoolAdminData => {
    const { userOrgId, createSchoolAdmin } = this.props;
    newSchoolAdminData.role = "school-admin";
    newSchoolAdminData.districtId = userOrgId;
    createSchoolAdmin(newSchoolAdminData);
    this.setState({ createSchoolAdminModalVisible: false });
  };

  closeCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: false
    });
  };

  closeEditSchoolAdminModal = () => {
    this.setState({
      editSchoolAdminModaVisible: false
    });
  };

  searchByName = e => {
    const { setSearchName } = this.props;
    setSearchName(e);
  };

  render() {
    const {
      selectedRowKeys,
      createSchoolAdminModalVisible,
      editSchoolAdminModaVisible,
      editSchoolAdminKey,
      deactivateSchoolAdminModalVisible,
      selectedSchoolsForDeactivate
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const {
      userOrgId,
      schoolAdminData: { result = {}, totalUsers },
      schoolsData,
      setShowActiveCourses,
      showActiveCourses,
      updateSchoolAdmin,
      pageNo,
      setPageNo,
      filters,
      changeFilterColumn,
      changeFilterType,
      changeFilterValue,
      loadSchoolAdminData,
      addFilter,
      removeFilter
    } = this.props;
    // const selectedSchoolAdmin = dataSource.filter(item => item.key == editSchoolAdminKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">Update Selected User</Menu.Item>
        <Menu.Item key="deactivate user">Deactivate Selected User(s)</Menu.Item>
      </Menu>
    );

    // const isFilterTextDisable = filters.column === "" || filters.value === "";
    // const isAddFilterDisable = filters.column === "" || filters.value === "" || filters.text === "";
    const filterKeysArray = Object.keys(filters);

    return (
      <StyledTableContainer>
        <StyledControlDiv>
          <Button type="primary" onClick={this.showCreateSchoolAdminModal}>
            + Add School Admin
          </Button>
          {createSchoolAdminModalVisible && (
            <CreateSchoolAdminModal
              modalVisible={createSchoolAdminModalVisible}
              createSchoolAdmin={this.createSchoolAdmin}
              closeModal={this.closeCreateSchoolAdminModal}
              userOrgId={userOrgId}
            />
          )}
          <StyledSchoolSearch placeholder="Search by name" onSearch={this.searchByName} />
          <Checkbox checked={showActiveCourses} onChange={evt => setShowActiveCourses(evt.target.checked)}>
            Show active courses only
          </Checkbox>
          <StyledActionDropDown overlay={actionMenu}>
            <Button>
              Actions <Icon type="down" />
            </Button>
          </StyledActionDropDown>
        </StyledControlDiv>
        {filterKeysArray.map(filterKey => {
          const { type, value } = filters[filterKey];
          return (
            <StyledControlDiv key={filterKey}>
              <StyledFilterSelect
                placeholder="Select a column"
                onChange={filterColumn => changeFilterColumn({ prevKey: filterKey, newKey: filterColumn })}
                value={filterKey}
              >
                <Option value="other">Select a column</Option>
                <Option value="username">Username</Option>
                <Option value="email">Email</Option>
              </StyledFilterSelect>
              <StyledFilterSelect
                placeholder="Select a value"
                onChange={filterType => changeFilterType({ key: filterKey, value: filterType })}
                value={type}
              >
                <Option value="">Select a value</Option>
                <Option value="eq">Equals</Option>
                <Option value="cont">Contains</Option>
              </StyledFilterSelect>
              <StyledFilterInput
                placeholder="Enter text"
                onChange={({ target }) => changeFilterValue({ key: filterKey, value: target.value })}
                value={value}
                disabled={!type}
                onSearch={loadSchoolAdminData}
              />
              <StyledAddFilterButton type="primary" onClick={addFilter} disabled={!!filters.other}>
                + Add Filter
              </StyledAddFilterButton>
              <StyledAddFilterButton
                type="primary"
                disabled={filterKey === "other" || filterKeysArray.length === 1}
                onClick={() => {
                  removeFilter(filterKey);
                  loadSchoolAdminData();
                }}
              >
                - Remove Filter
              </StyledAddFilterButton>
            </StyledControlDiv>
          );
        })}
        <OnHoverTable
          rowKey={record => record._id}
          rowSelection={rowSelection}
          dataSource={Object.values(result)}
          columns={this.columns}
          pagination={{
            current: pageNo,
            total: totalUsers,
            pageSize: 25,
            onChange: page => setPageNo(page)
          }}
        />
        {editSchoolAdminModaVisible && (
          <EditSchoolAdminModal
            schoolAdminData={result[editSchoolAdminKey]}
            modalVisible={editSchoolAdminModaVisible}
            updateSchoolAdmin={updateSchoolAdmin}
            closeModal={this.closeEditSchoolAdminModal}
            userOrgId={userOrgId}
            schoolsList={schoolsData}
          />
        )}
        {deactivateSchoolAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateSchoolAdminModalVisible}
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following school admin(s)?"
            secondaryLabel={selectedSchoolsForDeactivate.map(id => {
              const { _source: { firstName, lastName } = {} } = result[id];
              return <StyledClassName>{`${firstName} ${lastName}`}</StyledClassName>;
            })}
            closeModal={() =>
              this.setState({
                deactivateSchoolAdminModalVisible: false
              })
            }
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
      schoolAdminData: getSchoolAdminSelector(state),
      schoolsData: getSchoolsSelector(state),
      showActiveCourses: getShowActiveCoursesSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state)
    }),
    {
      createSchoolAdmin: createSchoolAdminAction,
      updateSchoolAdmin: updateSchoolAdminAction,
      deleteSchoolAdmin: deleteSchoolAdminAction,
      loadSchoolAdminData: receiveSchoolAdminAction,
      setSearchName: setSearchNameAction,
      loadSchoolsData: receiveSchoolsAction,
      setShowActiveCourses: setShowActiveCoursesAction,
      setPageNo: setPageNoAction,
      /**
       * Action to set the filter Column.
       * @param {string} str1 The previous value held by the select.
       * @param {string} str2 The new value that is to be set in the select
       */
      changeFilterColumn: changeFilterColumnAction,
      changeFilterType: changeFilterTypeAction,
      changeFilterValue: changeFilterValueAction,
      addFilter: addFilterAction,
      removeFilter: removeFilterAction
    }
  )
);

export default enhance(SchoolAdminTable);

SchoolAdminTable.propTypes = {
  loadSchoolAdminData: PropTypes.func.isRequired,
  createSchoolAdmin: PropTypes.func.isRequired,
  updateSchoolAdmin: PropTypes.func.isRequired,
  deleteSchoolAdmin: PropTypes.func.isRequired,
  setSearchName: PropTypes.func.isRequired,
  schoolAdminData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  showActiveCourses: PropTypes.bool.isRequired,
  pageNo: PropTypes.number.isRequired,
  setPageNo: PropTypes.func.isRequired,
  setShowActiveCourses: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  changeFilterColumn: PropTypes.func.isRequired,
  changeFilterType: PropTypes.func.isRequired,
  changeFilterValue: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired
};
