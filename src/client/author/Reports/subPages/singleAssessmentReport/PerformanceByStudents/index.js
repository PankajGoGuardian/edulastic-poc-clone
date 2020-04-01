import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get } from "lodash";
import * as moment from "moment";
import { Row, Col, Dropdown, Menu, message } from "antd";
import { EduButton } from "@edulastic/common";
import { groupApi } from "@edulastic/api";
import {
  getPerformanceByStudentsRequestAction,
  getReportsPerformanceByStudents,
  getReportsPerformanceByStudentsLoader
} from "./ducks";
import { getUserId, getUserRole } from "../../../../../student/Login/ducks";
import { getCsvDownloadingState } from "../../../ducks";
import {
  addGroupAction,
  fetchGroupsAction,
  getGroupsSelector,
  groupsLoadingSelector
} from "../../../../sharedDucks/groups";
import { requestEnrolExistingUserToClassAction } from "../../../../ClassEnrollment/ducks";
import { getUserOrgData } from "../../../../src/selectors/user";

import { parseData, getTableData, getColumns, getProficiencyBandData } from "./util/transformers";
import { downloadCSV } from "../../../common/util";

import CsvTable from "../../../common/components/tables/CsvTable";
import { StyledH3, StyledCard } from "../../../common/styled";
import { UpperContainer, StyledDropDownContainer, StyledTable } from "./components/styled";
import { Placeholder } from "../../../common/components/loader";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import SimpleBarChartContainer from "./components/charts/SimpleBarChartContainer";
import AddToGroupModal from "./components/AddToGroupModal";
import {
  getSAFFilterSelectedPerformanceBandProfile,
  getSAFFilterPerformanceBandProfiles
} from "../common/filterDataDucks";

import dropDownFormat from "../../../common/static/json/dropDownFormat.json";
import columns from "./static/json/tableColumns.json";

const PerformanceByStudents = ({
  loading,
  isCsvDownloading,
  role,
  performanceBandProfiles,
  selectedPerformanceBand,
  performanceByStudents,
  getPerformanceByStudents,
  settings,
  fetchGroups,
  groupList,
  loadingGroups,
  addToGroups,
  enrollStudentsToGroup,
  orgData,
  userId
}) => {
  const bandInfo =
    performanceBandProfiles.find(profile => profile._id === selectedPerformanceBand)?.performanceBand ||
    performanceBandProfiles[0]?.performanceBand;

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);

  const [selectedRowKeys, onSelectChange] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const [ddfilter, setDdFilter] = useState({
    gender: "all",
    frlStatus: "all",
    ellStatus: "all",
    iepStatus: "all",
    race: "all"
  });

  const [range, setRange] = useState({
    left: "",
    right: ""
  });

  const [pagination, setPagination] = useState({
    defaultPageSize: 50,
    current: 0
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getPerformanceByStudents(q);
    }
  }, [settings]);

  useEffect(() => {
    setPagination({ ...pagination, current: 0 });
  }, [range.left, range.right]);

  const res = { ...performanceByStudents, bandInfo };

  const proficiencyBandData = getProficiencyBandData(res && res.bandInfo);
  const [selectedProficiency, setProficiency] = useState(proficiencyBandData[0]);

  const parsedData = useMemo(() => {
    return parseData(res, ddfilter);
  }, [res, ddfilter]);

  const tableData = useMemo(() => {
    return getTableData(res, ddfilter, range, selectedProficiency.key);
  }, [res, ddfilter, range, selectedProficiency.key]);

  const filterDropDownCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      [comData]: selected.key
    });
  };

  const updateProficiencyFilter = (_, selected) => {
    setProficiency(selected);
  };

  const onCsvConvert = data => downloadCSV(`Performance by Students.csv`, data);

  const _columns = getColumns(columns, res && res.testName, role);

  const testName = get(settings, "selectedTest.title", "");

  const menu = (
    <Menu>
      <Menu.Item key="add-to-group" onClick={() => setShowAddToGroupModal(true)}>
        Add to Group
      </Menu.Item>
      {/* <Menu.Item key="remove-from-group">
        Remove from Group
      </Menu.Item> */}
    </Menu>
  );

  const handleModalOnSubmit = async (group, isNew = false) => {
    const { districtId, terms, defaultSchool } = orgData;
    const term = terms.length && terms.find(term => term.endDate > Date.now() && term.startDate < Date.now());
    const studentIds = tableData.filter((_, index) => selectedRowKeys.includes(index)).map(d => d.studentId);
    setShowAddToGroupModal(false);
    let groupInfo = {};
    if (studentIds.length) {
      // fetch group info for new / existing group
      if (isNew) {
        try {
          groupInfo = await groupApi.createGroup({
            type: "custom",
            ...group,
            startDate: moment().format("x"),
            endDate: moment(term ? term.endDate : moment().add(1, "year")).format("x"),
            districtId,
            institutionId: defaultSchool,
            grades: [],
            subject: "Other Subjects",
            standardSets: [],
            tags: [],
            parent: { id: userId },
            owners: [userId]
          });
        } catch ({ data: { message: errorMessage } }) {
          message.error(errorMessage);
        }
        addToGroups(groupInfo);
      } else {
        groupInfo = groupList.find(g => group.key === g._id);
      }
      // enroll students to group
      enrollStudentsToGroup({
        classCode: groupInfo.code,
        studentIds,
        districtId
      });
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Placeholder />
          <Placeholder />
        </>
      ) : (
        <UpperContainer>
          <AddToGroupModal
            title="Add To Group"
            description="Add selected students to an existing group or create a new one"
            visible={showAddToGroupModal}
            onSubmit={handleModalOnSubmit}
            onCancel={() => setShowAddToGroupModal(false)}
            groupList={groupList}
            loading={loadingGroups}
          />
          <StyledCard>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <StyledH3>Student score distribution | {testName}</StyledH3>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="dropdown-container">
                <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={dropDownFormat.filterDropDownData} />
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <SimpleBarChartContainer data={parsedData} setRange={setRange} range={range} />
              </Col>
            </Row>
          </StyledCard>
          <StyledCard>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <StyledH3>Student Performance | {testName}</StyledH3>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="dropdown-container">
                <StyledDropDownContainer padding="5px 0">
                  <Dropdown overlay={menu}>
                    <EduButton height="32px" width="180px">
                      Actions
                    </EduButton>
                  </Dropdown>
                </StyledDropDownContainer>
                <StyledDropDownContainer>
                  <ControlDropDown
                    prefix={"Proficiency Band - "}
                    data={proficiencyBandData}
                    by={selectedProficiency}
                    selectCB={updateProficiencyFilter}
                  />
                </StyledDropDownContainer>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <CsvTable
                  isCsvDownloading={isCsvDownloading}
                  onCsvConvert={onCsvConvert}
                  columns={_columns}
                  dataSource={tableData}
                  rowSelection={rowSelection}
                  colouredCellsNo={4}
                  rightAligned={6}
                  pagination={pagination}
                  onChange={setPagination}
                  tableToRender={StyledTable}
                />
              </Col>
            </Row>
          </StyledCard>
        </UpperContainer>
      )}
    </>
  );
};

const reportPropType = PropTypes.shape({
  districtAvg: PropTypes.number,
  districtAvgPerf: PropTypes.number,
  schoolMetricInfo: PropTypes.array,
  studentMetricInfo: PropTypes.array,
  metaInfo: PropTypes.array,
  metricInfo: PropTypes.array
});

PerformanceByStudents.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  performanceBandProfiles: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.string.isRequired,
  performanceByStudents: reportPropType.isRequired,
  getPerformanceByStudents: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

const enhance = connect(
  state => ({
    loading: getReportsPerformanceByStudentsLoader(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    performanceBandProfiles: getSAFFilterPerformanceBandProfiles(state),
    selectedPerformanceBand: getSAFFilterSelectedPerformanceBandProfile(state),
    performanceByStudents: getReportsPerformanceByStudents(state),
    groupList: getGroupsSelector(state),
    loadingGroups: groupsLoadingSelector(state),
    orgData: getUserOrgData(state),
    userId: getUserId(state)
  }),
  {
    getPerformanceByStudents: getPerformanceByStudentsRequestAction,
    fetchGroups: fetchGroupsAction,
    addToGroups: addGroupAction,
    enrollStudentsToGroup: requestEnrolExistingUserToClassAction
  }
);

export default enhance(PerformanceByStudents);
