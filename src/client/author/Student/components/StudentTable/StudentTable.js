import { themeColor } from "@edulastic/colors";
import { CheckboxLabel, TypeToConfirmModal } from "@edulastic/common";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Button, Icon, Menu, message, Select } from "antd";
import { get, identity, isEmpty, pickBy, unset } from "lodash";
import * as moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import {
  StyledActionDropDown,
  StyledAddFilterButton,
  StyledClassName,
  StyledControlDiv,
  StyledFilterDiv,
  StyledFilterInput,
  StyledFilterSelect
} from "../../../../admin/Common/StyledComponents";
import { UserFormModal as EditStudentFormModal } from "../../../../common/components/UserFormModal/UserFormModal";
import {
  FilterWrapper,
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledButton,
  StyledPagination,
  StyledSchoolSearch,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer
} from "../../../../common/styled";
import { getFullNameFromString } from "../../../../common/utils/helpers";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { receiveClassListAction } from "../../../Classes/ducks";
import { getPolicies, receiveDistrictPolicyAction, receiveSchoolPolicyAction } from "../../../DistrictPolicy/ducks";
import AddStudentModal from "../../../ManageClass/components/ClassDetails/AddStudent/AddStudentModal";
import {
  addFilterAction,
  changeFilterColumnAction,
  changeFilterTypeAction,
  changeFilterValueAction,
  createAdminUserAction,
  deleteAdminUserAction,
  getAdminUsersDataCountSelector,
  getAdminUsersDataSelector,
  getFiltersSelector,
  getPageNoSelector,
  getShowActiveUsersSelector,
  receiveAdminDataAction,
  removeFilterAction,
  setPageNoAction,
  setRoleAction,
  setSearchNameAction,
  setShowActiveUsersAction,
  updateAdminUserAction
} from "../../../SchoolAdmin/ducks";
import { receiveSchoolsAction } from "../../../Schools/ducks";
import Breadcrumb from "../../../src/components/Breadcrumb";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/UserSubHeader";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
import {
  addMultiStudentsRequestAction,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction,
  getAddStudentsToOtherClassSelector,
  getValidatedClassDetails,
  resetFetchedClassDetailsAction,
  setAddStudentsToOtherClassVisiblityAction,
  setMultiStudentsProviderAction,
  setStudentsDetailsModalVisibleAction
} from "../../ducks";
import { AddStudentsToOtherClassModal } from "./AddStudentToOtherClass";
import InviteMultipleStudentModal from "./InviteMultipleStudentModal/InviteMultipleStudentModal";
import StudentsDetailsModal from "./StudentsDetailsModal/StudentsDetailsModal";
import { StyledStudentTable } from "./styled";
import { MergeStudentsModal } from "../../../MergeUsers";

const menuActive = { mainMenu: "Users", subMenu: "Student" };

const { Option } = Select;

const filterStrDD = {
  status: {
    list: [
      { title: "Select a value", value: undefined, disabled: true },
      { title: "Active", value: 1, disabled: false },
      { title: "Inactive", value: 0, disabled: false }
    ],
    placeholder: "Select a value"
  }
};

class StudentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      addStudentModalVisible: false,
      editStudentModaVisible: false,
      inviteStudentModalVisible: false,
      editStudentKey: "",
      selectedAdminsForDeactivate: [],
      deactivateAdminModalVisible: false,
      showMergeStudentsModal: false,
      showActive: true,
      searchByName: "",
      filtersData: [
        {
          filtersColumn: "",
          filtersValue: "",
          filterStr: "",
          filterAdded: false
        }
      ],
      currentPage: 1,
      refineButtonActive: false
    };
    const { t } = this.props;
    this.columns = [
      {
        title: t("users.student.name"),
        render: (_, { _source }) => {
          const firstName = get(_source, "firstName", "");
          const lastName = get(_source, "lastName", "");
          return (
            <span>
              {firstName === "Anonymous" || isEmpty(firstName) ? "-" : firstName} {lastName}
            </span>
          );
        },
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.firstName", "");
          const next = get(b, "_source.firstName", "");
          return next.localeCompare(prev);
        }
      },
      {
        title: t("users.student.username"),
        dataIndex: "_source.username",
        render: (text, record, index) => record._source.username || record._source.email,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          const prev = get(a, "_source.username", "");
          const next = get(b, "_source.username", "");
          return next.localeCompare(prev);
        }
      },
      {
        title: t("users.student.sso"),
        dataIndex: "_source.lastSigninSSO",
        render: (sso = "N/A") => sso
      },
      {
        title: t("users.student.school"),
        dataIndex: "_source.institutionDetails",
        render: (schools = []) => schools.map(school => school.name),
        width: 250
      },
      {
        title: t("users.student.classes"),
        dataIndex: "classCount",
        align: "center",
        render: (classCount, record) => {
          const username = get(record, "_source.username", "");
          return (
            <Link
              to={{
                pathname: "/author/Class-Enrollment",
                state: {
                  filtersColumn: "username",
                  filtersValue: "eq",
                  filterStr: username,
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
        dataIndex: "_id",
        render: id => (
          <div style={{ whiteSpace: "nowrap" }}>
            <>
              <StyledTableButton onClick={() => this.onEditStudent(id)} title="Edit">
                <IconPencilEdit color={themeColor} />
              </StyledTableButton>
              <StyledTableButton onClick={() => this.handleDeactivateAdmin(id)} title="Deactivate">
                <IconTrash color={themeColor} />
              </StyledTableButton>
            </>
          </div>
        )
      }
    ];

    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    const { dataPassedWithRoute, loadSchoolPolicy, role, loadDistrictPolicy, schoolId, userOrgId } = this.props;
    if (role === "school-admin") {
      loadSchoolPolicy(schoolId);
    } else {
      loadDistrictPolicy({ orgId: userOrgId, orgType: "district" });
    }
    if (!isEmpty(dataPassedWithRoute)) {
      this.setState({ filtersData: [{ ...dataPassedWithRoute }] }, this.loadFilteredList);
    } else {
      this.loadFilteredList();
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result } = nextProps;
    return {
      selectedRowKeys: state.selectedRowKeys.filter(rowKey => !!result[rowKey])
    };
  }

  componentDidUpdate(prevProps) {}

  onEditStudent = key => {
    this.setState({
      editStudentModaVisible: true,
      editStudentKey: key
    });
  };

  handleDeactivateAdmin = id => {
    this.setState({
      selectedAdminsForDeactivate: [id],
      deactivateAdminModalVisible: true
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showAddStudentModal = () => {
    this.setState({
      addStudentModalVisible: true
    });
  };

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    const { setAddStudentsToOtherClassVisiblity, t } = this.props;
    if (e.key === "add student") {
      this.setState({ addStudentModalVisible: true });
    }
    if (e.key === "merge user") {
      if (selectedRowKeys.length > 1) {
        this.setState({ showMergeStudentsModal: true });
      } else {
        message.info("Select two or more students to merge");
      }
    }
    if (e.key === "edit user") {
      if (selectedRowKeys.length === 0) {
        message.error(t("users.validations.edituser"));
      } else if (selectedRowKeys.length === 1) {
        this.onEditStudent(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        message.error(t("users.validations.editsingleuser"));
      }
    } else if (e.key === "deactivate user") {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true
        });
      } else {
        message.error(t("users.validations.deleteuser"));
      }
    } else if (e.key === "addStudentsToAnotherClass") {
      if (selectedRowKeys.length) {
        setAddStudentsToOtherClassVisiblity(true);
      } else {
        message.error("Please select atleast 1 user");
      }
    }
  };

  closeEditStudentModal = () => {
    this.setState({
      editStudentModaVisible: false
    });
  };

  showInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: true
    });
  };

  closeInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: false
    });
  };

  closeStudentsDetailModal = () => {
    this.props.setStudentsDetailsModalVisible(false);
  };

  saveFormRef = node => {
    this.formRef = node;
  };

  setPageNo = page => {
    this.setState({ currentPage: page }, this.loadFilteredList);
  };

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  sendInvite = inviteStudentList => {
    this.setState({
      inviteStudentModalVisible: false
    });
    const { addMultiStudents, userOrgId } = this.props;

    let o = {
      addReq: { districtId: userOrgId, data: inviteStudentList },
      listReq: this.getSearchQuery()
    };

    addMultiStudents(o);
  };

  createUser = () => {
    if (this.formRef) {
      const { userOrgId: districtId, createAdminUser } = this.props;
      const { form } = this.formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName, email, password } = values;

          let name = getFullNameFromString(fullName);
          values.firstName = name.firstName;
          values.middleName = name.middleName;
          values.lastName = name.lastName;

          const contactEmails = get(values, "contactEmails");
          if (contactEmails) {
            values.contactEmails = [contactEmails];
          }

          if (values.dob) {
            values.dob = moment(values.dob).format("x");
          }
          unset(values, ["confirmPassword"]);
          unset(values, ["fullName"]);

          let o = {
            createReq: pickBy(values, identity),
            listReq: this.getSearchQuery()
          };

          createAdminUser(o);
          this.setState({ addStudentModalVisible: false });
        }
      });
    }
  };

  closeAddUserModal = () => {
    this.setState({
      addStudentModalVisible: false
    });
  };

  onCloseMergeStudentsModal = () => {
    this.setState({ showMergeStudentsModal: false });
  };

  onSubmitMergeStudentsModal = () => {
    this.handleSearchName(" ");
    this.onCloseMergeStudentsModal();
  };

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props;
    const { selectedAdminsForDeactivate } = this.state;

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: "student" },
      listReq: this.getSearchQuery()
    };

    deleteAdminUser(o);
    this.setState({
      deactivateAdminModalVisible: false
    });
  };
  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive });
  };

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = event => {
    this.setState({ searchByName: event.currentTarget.value });
  };

  handleSearchName = value => {
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
          filterAdded: value !== "" ? true : false
        };
      }
      return item;
    });

    this.setState({ filtersData: _filtersData }, () => this.loadFilteredList(key));
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
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (key === index) {
        let _item = {
          ...item,
          filtersColumn: value
        };
        if (value === "status") _item.filtersValue = "eq";
        return _item;
      }
      return item;
    });
    this.setState({ filtersData: _filtersData }, this.loadFilteredList);
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
    this.setState({ filtersData: _filtersData }, this.loadFilteredList);
  };

  onChangeShowActive = e => {
    this.setState({ showActive: e.target.checked }, this.loadFilteredList);
  };

  addFilter = (e, key) => {
    const { filtersData } = this.state;
    if (filtersData.length < 3) {
      this.setState({
        filtersData: [
          ...filtersData,
          {
            filtersColumn: "",
            filtersValue: "",
            filterStr: "",
            prevFilterStr: "",
            filterAdded: false
          }
        ]
      });
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
    const { userOrgId, location = {} } = this.props;
    const { filtersData, searchByName, currentPage } = this.state;
    let { showActive } = this.state;

    let search = {};
    for (let [index, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item;
      if (filtersColumn !== "" && filtersValue !== "" && filterStr !== "") {
        if (filtersColumn === "status") {
          showActive = filterStr;
          continue;
        }
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }];
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr });
        }
      }
    }

    if (searchByName) {
      search["name"] = searchByName;
    }
    const queryObj = {
      search,
      districtId: userOrgId,
      role: "student",
      limit: 25,
      page: currentPage
      // uncomment after elastic search is fixed
      // sortField,
      // order
    };

    if (location.institutionId) {
      queryObj.institutionId = location.institutionId;
    }

    queryObj["status"] = 0;

    if (showActive) {
      queryObj["status"] = 1;
    }
    return queryObj;
  };

  loadFilteredList = () => {
    const { loadAdminData } = this.props;
    loadAdminData(this.getSearchQuery());
  };

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      addStudentModalVisible,
      editStudentModaVisible,
      inviteStudentModalVisible,
      editStudentKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,
      showMergeStudentsModal,
      filtersData,
      currentPage,
      refineButtonActive
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const {
      adminUsersData: result,
      totalUsers,
      userOrgId,
      setShowActiveUsers,
      showActiveUsers,
      updateAdminUser,
      pageNo,
      setPageNo,
      filters,
      changeFilterColumn,
      changeFilterType,
      changeFilterValue,
      loadAdminData,
      addFilter,
      removeFilter,
      // schoolsData,
      // classList,
      studentDetailsModalVisible,
      addStudentsToOtherClassData,
      setAddStudentsToOtherClassVisiblity,
      putStudentsToOtherClass,
      fetchClassDetailsUsingCode,
      features,
      setProvider,
      validatedClassDetails,
      resetClassDetails,
      history,
      policy,
      t
    } = this.props;

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add student">{t("users.student.addstudent")}</Menu.Item>
        <Menu.Item key="edit user">{t("users.student.updateuser")}</Menu.Item>
        <Menu.Item key="merge user">{t("users.student.mergeuser")}</Menu.Item>
        <Menu.Item key="deactivate user">{t("users.student.deactivateuser")}</Menu.Item>
        <Menu.Item key="addStudentsToAnotherClass">{t("users.student.addstudentootherclass")}</Menu.Item>
      </Menu>
    );

    const breadcrumbData = [
      {
        title: "MANAGE DISTRICT",
        to: "/author/districtprofile"
      },
      {
        title: "USERS",
        to: ""
      }
    ];

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
          <StyledButton type={"default"} shape="round" icon="filter" onClick={this._onRefineResultsCB}>
            {t("common.refineresults")}
            <Icon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        </SubHeaderWrapper>
        <AdminSubHeader active={menuActive} history={history} />
        {refineButtonActive && (
          <FilterWrapper>
            {filtersData.map((item, i) => {
              const { filtersColumn, filtersValue, filterStr, filterAdded } = item;
              const isFilterTextDisable = filtersColumn === "" || filtersValue === "";
              const isAddFilterDisable =
                filtersColumn === "" || filtersValue === "" || filterStr === "" || !filterAdded;

              return (
                <StyledControlDiv key={i}>
                  <StyledFilterSelect
                    placeholder={t("common.selectcolumn")}
                    onChange={e => this.changeFilterColumn(e, i)}
                    value={filtersColumn ? filtersColumn : undefined}
                  >
                    <Option value="other" disabled={true}>
                      {t("common.selectcolumn")}
                    </Option>
                    <Option value="username">{t("users.student.username")}</Option>
                    <Option value="email">{t("users.student.email")}</Option>
                    <Option value="status">{t("users.student.status")}</Option>
                    {/* TODO: Uncomment after backend is done */}
                    {/* <Option value="institutionNames">School</Option> */}
                  </StyledFilterSelect>
                  <StyledFilterSelect
                    placeholder={t("common.selectvalue")}
                    onChange={e => this.changeFilterValue(e, i)}
                    value={filtersValue ? filtersValue : undefined}
                  >
                    <Option value="" disabled={true}>
                      {t("common.selectvalue")}
                    </Option>
                    <Option value="eq">{t("common.equals")}</Option>
                    {!filterStrDD[filtersColumn] ? <Option value="cont">{t("common.contains")}</Option> : null}
                  </StyledFilterSelect>
                  {!filterStrDD[filtersColumn] ? (
                    <StyledFilterInput
                      placeholder={t("common.entertext")}
                      onChange={e => this.changeFilterText(e, i)}
                      onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                      onBlur={e => this.onBlurFilterText(e, i)}
                      value={filterStr ? filterStr : undefined}
                      disabled={isFilterTextDisable}
                      ref={this.filterTextInputRef[i]}
                    />
                  ) : (
                    <StyledFilterSelect
                      placeholder={filterStrDD[filtersColumn].placeholder}
                      onChange={v => this.changeStatusValue(v, i)}
                      value={filterStr !== "" ? filterStr : undefined}
                    >
                      {filterStrDD[filtersColumn].list.map(item => (
                        <Option key={item.title} value={item.value} disabled={item.disabled}>
                          {item.title}
                        </Option>
                      ))}
                    </StyledFilterSelect>
                  )}
                  {i < 2 && (
                    <StyledAddFilterButton
                      type="primary"
                      onClick={e => this.addFilter(e, i)}
                      disabled={isAddFilterDisable || i < filtersData.length - 1}
                    >
                      {t("common.addfilter")}
                    </StyledAddFilterButton>
                  )}
                  {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
                    <StyledAddFilterButton type="primary" onClick={e => this.removeFilter(e, i)}>
                      {t("common.removefilter")}
                    </StyledAddFilterButton>
                  )}
                </StyledControlDiv>
              );
            })}
          </FilterWrapper>
        )}

        <StyledFilterDiv>
          <LeftFilterDiv width={50}>
            <StyledSchoolSearch
              placeholder={t("common.searchbyname")}
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
            />
            <Button type="primary" onClick={this.showInviteStudentModal}>
              + Add Multiple Students
            </Button>
          </LeftFilterDiv>

          <RightFilterDiv width={40}>
            <CheckboxLabel
              checked={this.state.showActive}
              onChange={this.onChangeShowActive}
              disabled={!!filtersData.find(item => item.filtersColumn === "status")}
            >
              {t("common.showcurrent")}
            </CheckboxLabel>
            <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
              <Button>
                {t("common.actions")} <Icon type="down" />
              </Button>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>
        <TableContainer>
          <StyledStudentTable
            rowKey={record => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(result)}
            columns={this.columns}
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalUsers}
            onChange={page => this.setPageNo(page)}
            hideOnSinglePage={true}
            pagination={{
              current: pageNo,
              total: totalUsers,
              pageSize: 25,
              onChange: page => setPageNo(page)
            }}
          />
        </TableContainer>
        {inviteStudentModalVisible && (
          <InviteMultipleStudentModal
            modalVisible={inviteStudentModalVisible}
            inviteStudents={this.sendInvite}
            closeModal={this.closeInviteStudentModal}
            features={features}
            setProvider={setProvider}
            t={t}
            policy={policy}
          />
        )}

        {editStudentModaVisible && (
          <EditStudentFormModal
            showModal={editStudentModaVisible}
            role="student"
            formTitle="Update User"
            showAdditionalFields={true}
            userOrgId={userOrgId}
            modalData={result[editStudentKey]}
            modalFunc={updateAdminUser}
            closeModal={this.closeEditStudentModal}
            buttonText="Yes, Update"
            isStudentEdit
          />
        )}
        {addStudentModalVisible && (
          <AddStudentModal
            handleAdd={this.createUser}
            handleCancel={this.closeAddUserModal}
            isOpen={addStudentModalVisible}
            submitted={false}
            wrappedComponentRef={this.saveFormRef}
            showClassCodeField={true}
            fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
            showTtsField
            validatedClassDetails={validatedClassDetails}
            resetClassDetails={resetClassDetails}
          />
        )}
        {studentDetailsModalVisible && (
          <StudentsDetailsModal
            modalVisible={studentDetailsModalVisible}
            closeModal={this.closeStudentsDetailModal}
            role="student"
            title={t("users.student.studentdetail.title")}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t("users.student.deactivatestudent.title")}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={t("users.student.deactivatestudent.confirmText")}
            secondaryLabel={selectedAdminsForDeactivate.map(id => {
              const { _source: { firstName, lastName } = {} } = result[id];
              return (
                <StyledClassName key={id}>
                  {firstName} {lastName}
                </StyledClassName>
              );
            })}
            closeModal={() =>
              this.setState({
                deactivateAdminModalVisible: false
              })
            }
          />
        )}
        <AddStudentsToOtherClassModal
          titleText={t("users.student.addstudentootherclass")}
          buttonText={t("users.student.addstudents")}
          {...addStudentsToOtherClassData}
          handleSubmit={classCode => putStudentsToOtherClass({ classCode, userDetails: selectedRowKeys })}
          onCloseModal={() => setAddStudentsToOtherClassVisiblity(false)}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          t={t}
        />
        <MergeStudentsModal
          visible={showMergeStudentsModal}
          userIds={selectedRowKeys}
          onSubmit={this.onSubmitMergeStudentsModal}
          onCancel={this.onCloseMergeStudentsModal}
        />
      </MainContainer>
    );
  }
}

const enhance = compose(
  withNamespaces("manageDistrict"),
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      // schoolsData: getSchoolsSelector(state),
      // classList: get(state, ["classesReducer", "data"], []),
      studentDetailsModalVisible: get(state, ["studentReducer", "studentDetailsModalVisible"], false),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state),
      features: getUserFeatures(state),
      validatedClassDetails: getValidatedClassDetails(state),
      policy: getPolicies(state),
      schoolId: get(state, "user.saSettingsSchool"),
      role: getUserRole(state)
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      loadClassList: receiveClassListAction,
      addMultiStudents: addMultiStudentsRequestAction,
      setStudentsDetailsModalVisible: setStudentsDetailsModalVisibleAction,
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
      setShowActiveUsers: setShowActiveUsersAction,
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
      removeFilter: removeFilterAction,
      setRole: setRoleAction,
      setAddStudentsToOtherClassVisiblity: setAddStudentsToOtherClassVisiblityAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      setProvider: setMultiStudentsProviderAction,
      resetClassDetails: resetFetchedClassDetailsAction,
      loadSchoolPolicy: receiveSchoolPolicyAction,
      loadDistrictPolicy: receiveDistrictPolicyAction
    }
  )
);

export default enhance(withRouter(StudentTable));
