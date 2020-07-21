import { themeColor } from "@edulastic/colors";
import { EduButton, notification, SelectInputStyled, TextInputStyled } from "@edulastic/common";
import { SearchInputStyled } from "@edulastic/common/src/components/InputStyles";
import { roleuser } from "@edulastic/constants";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Col, Form, Icon, Menu, Row, Select } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { StyledActionDropDown, StyledFilterDiv } from "../../../../admin/Common/StyledComponents";
import {
  FilterWrapper,
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledButton,
  StyledPagination,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer
} from "../../../../common/styled";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { getUserOrgId, getUserOrgName, getUserRole } from "../../../src/selectors/user";
// actions
import { createSchoolsAction, deleteSchoolsAction, getSchoolsSelector, receiveSchoolsAction, updateSchoolsAction } from "../../ducks";
import CreateSchoolModal from "./CreateSchoolModal/CreateSchoolModal";
import DeactivateSchoolModal from "./DeactivateSchoolModal/DeactivateSchoolModal";
import EditSchoolModal from "./EditSchoolModal/EditSchoolModal";
import {
  StyledHeaderColumn,
  StyledSchoolTable,
  StyledSortIcon,
  StyledSortIconDiv
} from "./styled";

const Option = Select.Option;

class SchoolsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      currentPage: 1,
      refineButtonActive: false
    };

    this.filterTextInputRef = [React.createRef(), React.createRef(), React.createRef()];
  }

  componentDidMount() {
    this.loadFilteredList();
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.schoolList.length === undefined) return { dataSource: [] };
    return { dataSource: nextProps.schoolList };
  }

  onHeaderCell = colName => {
    const { sortedInfo } = this.state;
    if (sortedInfo.columnKey === colName) {
      if (sortedInfo.order === "asc") {
        sortedInfo.order = "desc";
      } else if (sortedInfo.order === "desc") {
        sortedInfo.order = "asc";
      }
    } else {
      sortedInfo.columnKey = colName;
      sortedInfo.order = sortedInfo.columnKey === "isApproved" ? "desc" : "asc";
    }
    this.setState({ sortedInfo }, this.loadFilteredList);
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

  changeActionMode = e => {
    const { selectedRowKeys } = this.state;
    const { t } = this.props;

    if (e.key === "edit school") {
      if (selectedRowKeys.length == 0) {
        notification({ msg: t("school.validations.editSchool") });
      } else if (selectedRowKeys.length == 1) {
        this.onEditSchool(selectedRowKeys[0]);
      } else if (selectedRowKeys.length > 1) {
        notification({ msg: t("school.validations.editsingleschool") });
      }
    } else if (e.key === "deactivate school") {
      if (selectedRowKeys.length > 0) {
        this.onDeactivateSchool();
      } else {
        notification({ msg: t("school.validations.deleteschool") });
      }
    }
  };

  createSchool = newSchoolData => {
    const newData = {
      name: newSchoolData.name,
      districtId: this.props.userOrgId,
      districtName: this.props.userOrgName,
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

    const search = {};
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

  changePagination = pageNumber => {
    this.setState({ currentPage: pageNumber }, this.loadFilteredList);
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

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive });
  };

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = event => {
    this.setState({ searchByName: event.currentTarget.value });
  };

  handleSearchName = value => {
    this.setState({ searchByName: value }, this.loadFilteredList);
  };

  onSearchFilter = (value, event, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterAdded: !!value
        };
      }
      return item;
    });
    this.setState({ filtersData: _filtersData }, () => this.filterTextInputRef[key].current.blur());
  };

  onBlurFilterText = (event, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterAdded: !!event.target.value
        };
      }
      return item;
    });
    this.setState({ filtersData: _filtersData }, this.loadFilteredList);
  };

  changeStatusValue = (value, key) => {
    const filtersData = [...this.state.filtersData];

    if (filtersData[key].filterStr === value) return;

    filtersData[key].filterStr = value;
    filtersData[key].filterAdded = true;
    this.setState({ filtersData }, this.loadFilteredList);
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
    const filtersData = [...this.state.filtersData];
    if (filtersData[key].filtersColumn === value) return;

    filtersData[key].filtersColumn = value;
    if (value === "isApproved") {
      filtersData[key].filtersValue = "eq";
      filtersData[key].filterStr = "";
      filtersData[key].prevFilterStr = "";
    }

    this.setState({ filtersData }, this.loadFilteredList);
  };

  changeFilterValue = (value, key) => {
    const filtersData = [...this.state.filtersData];
    if (filtersData[key].filtersValue === value) return;

    filtersData[key].filtersValue = value;
    this.setState({ filtersData }, this.loadFilteredList);
  };

  addFilter = () => {
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
    const { filtersData } = this.state;
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
    const { filtersData, sortedInfo, searchByName, currentPage = 1 } = this.state;
    const { userOrgId } = this.props;

    const search = {};

    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr } = filtersData[i];
      if (filtersColumn !== "" && filtersValue !== "" && filterStr !== "") {
        if (filtersColumn === "isApproved" || filtersColumn === "status") {
          if (!search[filtersColumn]) {
            search[filtersColumn] = [filterStr];
          } else {
            search[filtersColumn].push(filterStr);
          }
        } else if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }];
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr });
        }
      }
    }

    if (searchByName.length > 0) {
      search.name = [{ type: "cont", value: searchByName }];
    }

    return {
      search,
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      includeStats: true,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order
    };
  };

  loadFilteredList() {
    const { loadSchoolsData } = this.props;
    loadSchoolsData(this.getSearchQuery());
  }
  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

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
      currentPage,
      refineButtonActive
    } = this.state;

    const { userOrgId, totalSchoolsCount, role, t } = this.props;

    const breadcrumbData = [
      {
        title: role === roleuser.SCHOOL_ADMIN ? "MANAGE SCHOOL" : "MANAGE DISTRICT",
        to: role === roleuser.SCHOOL_ADMIN ? "/author/Schools" : "/author/districtprofile"
      },
      {
        title: "SCHOOLS",
        to: ""
      }
    ];
    const columnsInfo = [
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.name")}</p>
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
        render: name => <span>{name || "-"}</span>,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell("name");
          }
        })
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.city")}</p>
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
        render: city => <span>{city || "-"}</span>,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell("city");
          }
        })
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
        render: state => <span>{state || "-"}</span>,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell("state");
          }
        })
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.zip")}</p>
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
        render: zip => <span>{zip || "-"}</span>,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell("zip");
          }
        })
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.status")}</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={sortedInfo.columnKey === "isApproved" && sortedInfo.order === "desc"}
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={sortedInfo.columnKey === "isApproved" && sortedInfo.order === "asc"}
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: "isApproved",
        editable: true,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell("isApproved");
          }
        }),
        render: (text, record) => (
          <React.Fragment>
            {typeof record.isApproved === "boolean" && record.isApproved === false ? (
              <span>{t("school.notapproved")}</span>
            ) : (
              <span>{t("school.approved")}</span>
              )}
          </React.Fragment>
        )
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.teacher")}</p>
          </StyledHeaderColumn>
        ),
        dataIndex: "teachersCount",
        editable: true,
        align: "center",
        render: (teachersCount, { _id } = {}) => (
          <Link
            to={{
              pathname: "/author/users/teacher",
              institutionId: _id
              // uncomment after school filter is implemented in backend
              // state: {
              //   filtersColumn: "institutionNames",
              //   filtersValue: "eq",
              //   filterStr: name,
              //   filterAdded: true
              // }
            }}
          >
            {teachersCount}
          </Link>
        )
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.student")}</p>
          </StyledHeaderColumn>
        ),
        dataIndex: "studentsCount",
        editable: true,
        align: "center",
        render: (studentsCount, { _id } = {}) => (
          <Link
            to={{
              pathname: "/author/users/student",
              institutionId: _id
            }}
          >
            {studentsCount}
          </Link>
        )
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t("school.section")}</p>
          </StyledHeaderColumn>
        ),
        dataIndex: "sectionsCount",
        align: "center",
        editable: true,
        render: (sectionsCount, { name } = {}) => (
          <Link
            to={{
              pathname: "/author/Classes",
              state: {
                filtersColumn: "institutionNames",
                filtersValue: "eq",
                filterStr: name,
                filterAdded: true
              }
            }}
          >
            {sectionsCount}
          </Link>
        )
      },
      {
        dataIndex: "operation",
        render: (text, record) => (
          <div style={{ whiteSpace: "nowrap" }}>
            <StyledTableButton onClick={() => this.onEditSchool(record.key)} title="Edit">
              <IconPencilEdit color={themeColor} />
            </StyledTableButton>
            {role === roleuser.DISTRICT_ADMIN && (
              <StyledTableButton onClick={() => this.handleDelete(record.key)} title="Deactivate">
                <IconTrash color={themeColor} />
              </StyledTableButton>
            )}
          </div>
        )
      }
    ];

    const columns = columnsInfo.map(col => ({
      ...col
    }));

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const editSchoolData = dataSource.filter(item => item.key === editSchoolKey);
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit school">{t("school.editschool")}</Menu.Item>
        {role === roleuser.DISTRICT_ADMIN ? (
          <Menu.Item key="deactivate school">{t("school.deactivateschool")}</Menu.Item>
        ) : null}
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

      const optValues = [];
      if (filtersData[i].filtersColumn === "isApproved") {
        optValues.push(<Option value="eq">{t("common.equals")}</Option>);
      } else {
        optValues.push(<Option value="">{t("common.selectvalue")}</Option>);
        optValues.push(<Option value="eq">{t("common.equals")}</Option>);
        optValues.push(<Option value="cont">{t("common.contains")}</Option>);
      }

      SearchRows.push(
        <Row gutter="20" style={{ marginBottom: "5px" }}>
          <Col span={6}>
            <SelectInputStyled
              placeholder={t("common.selectcolumn")}
              onChange={e => this.changeFilterColumn(e, i)}
              defaultValue={filtersData[i].filtersColumn}
              value={filtersData[i].filtersColumn}
              height="32px"
            >
              <Option value="">{t("common.selectcolumn")}</Option>
              <Option value="address">{t("school.address")}</Option>
              <Option value="city">{t("school.city")}</Option>
              <Option value="state">{t("school.state")}</Option>
              <Option value="zip">{t("school.zip")}</Option>
              <Option value="isApproved">{t("school.status")}</Option>
            </SelectInputStyled>
          </Col>
          <Col span={6}>
            <SelectInputStyled
              placeholder={t("common.selectvalue")}
              onChange={e => this.changeFilterValue(e, i)}
              value={filtersData[i].filtersValue}
              height="32px"
            >
              {optValues}
            </SelectInputStyled>
          </Col>
          <Col span={6}>
            {filtersData[i].filtersColumn !== "isApproved" ? (
              <TextInputStyled
                placeholder={t("common.entertext")}
                onChange={e => this.changeFilterText(e, i)}
                onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                onBlur={e => this.onBlurFilterText(e, i)}
                disabled={isFilterTextDisable}
                value={filtersData[i].filterStr}
                ref={this.filterTextInputRef[i]}
                height="32px"
              />
            ) : (
              <SelectInputStyled
                placeholder={t("common.selectvalue")}
                onChange={e => this.changeStatusValue(e, i)}
                disabled={isFilterTextDisable}
                value={filtersData[i].filterStr}
                height="32px"
              >
                <Option value="">{t("common.selectvalue")}</Option>
                <Option value="true">{t("school.approved")}</Option>
                <Option value="false">{t("school.notapproved")}</Option>
              </SelectInputStyled>
              )}
          </Col>
          <Col span={6} style={{ display: "flex" }}>
            {i < 2 && (
              <EduButton
                height="32px"
                width="50%"
                type="primary"
                onClick={e => this.addFilter(e, i)}
                disabled={isAddFilterDisable || i < filtersData.length - 1}
              >
                {t("common.addfilter")}
              </EduButton>
            )}


            {((filtersData.length === 1 && filtersData[0].filterAdded) || filtersData.length > 1) && (
              <EduButton width="50%" height="32px" type="primary" onClick={e => this.removeFilter(e, i)}>
                {t("common.removefilter")}
              </EduButton>
            )}
          </Col>
        </Row>
      );
    }

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
          <StyledButton isGhost type="default" shape="round" icon="filter" onClick={this._onRefineResultsCB}>
            {t("common.refineresults")}
            <Icon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        </SubHeaderWrapper>

        {refineButtonActive && <FilterWrapper>{SearchRows}</FilterWrapper>}

        <StyledFilterDiv>
          <LeftFilterDiv width={80}>
            <SearchInputStyled
              placeholder={t("common.searchbyname")}
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
              height="36px"
            />
            {role === roleuser.DISTRICT_ADMIN ? (
              <EduButton height="36px" type="primary" onClick={this.showCreateSchoolModal}>
                {t("school.createschool")}
              </EduButton>
            ) : null}
          </LeftFilterDiv>
          <RightFilterDiv width={15}>
            <StyledActionDropDown
              getPopupContainer={triggerNode => triggerNode.parentNode}
              overlay={actionMenu}
              trigger={["click"]}
            >
              <EduButton isGhost>
                {t("common.actions")} <Icon type="down" />
              </EduButton>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>

        <TableContainer>
          <StyledSchoolTable rowSelection={rowSelection} dataSource={dataSource} columns={columns} pagination={false} />
          <StyledPagination
            current={currentPage}
            defaultCurrent={1}
            pageSize={10}
            total={totalSchoolsCount}
            onChange={this.changePagination}
            hideOnSinglePage
          />
        </TableContainer>

        {createSchoolModalVisible && (
          <CreateSchoolModal
            modalVisible={createSchoolModalVisible}
            createSchool={this.createSchool}
            closeModal={this.closeCreateSchoolModal}
            dataSource={dataSource}
            userOrgId={userOrgId}
            t={t}
          />
        )}

        {editSchoolModaVisible && editSchoolKey !== "" && (
          <EditSchoolModal
            schoolData={editSchoolData[0]}
            modalVisible={editSchoolModaVisible}
            updateSchool={this.updateSchool}
            closeModal={this.closeEditSchoolModal}
            userOrgId={userOrgId}
            hideOnSinglePage
            t={t}
          />
        )}

        {deactivateSchoolModalVisible && (
          <DeactivateSchoolModal
            modalVisible={deactivateSchoolModalVisible}
            deactivateSchool={this.deactivateSchool}
            closeModal={this.closeDeactivateSchoolModal}
            schoolData={selectedDeactivateSchools}
            t={t}
          />
        )}
      </MainContainer>
    );
  }
}

const EditableSchoolsTable = Form.create()(SchoolsTable);
const enhance = compose(
  withNamespaces("manageDistrict"),
  connect(
    state => ({
      schoolList: getSchoolsSelector(state),
      userOrgId: getUserOrgId(state),
      userOrgName: getUserOrgName(state),
      role: getUserRole(state),
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
