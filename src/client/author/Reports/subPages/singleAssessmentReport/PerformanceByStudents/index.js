import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get } from "lodash";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Row, Col } from "antd";
import { Redirect } from "react-router-dom";
import qs from "qs";
import queryString from "query-string";

// components
import { EduButton, SpinLoader, notification } from "@edulastic/common";
import { IconPlusCircle } from "@edulastic/icons";

import CsvTable from "../../../common/components/tables/CsvTable";
import { StyledH3, StyledCard } from "../../../common/styled";
import { UpperContainer, StyledDropDownContainer, StyledTable, StyledCharWrapper } from "./components/styled";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import SimpleBarChartContainer from "./components/charts/SimpleBarChartContainer";
import AddToGroupModal from "../../../common/components/Popups/AddToGroupModal";
import FeaturesSwitch from "../../../../../features/components/FeaturesSwitch";
import PerformanceBandPieChart from "./components/charts/StudentPerformancePie";

// ducks & helpers
import { parseData, getTableData, getColumns, getProficiencyBandData } from "./util/transformers";
import { downloadCSV } from "../../../common/util";
import {
  getPerformanceByStudentsRequestAction,
  getReportsPerformanceByStudents,
  getReportsPerformanceByStudentsLoader
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getSAFFilterSelectedPerformanceBandProfile,
  getSAFFilterPerformanceBandProfiles
} from "../common/filterDataDucks";

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
  location = { pathname: "" },
  pageTitle,
  filters,
  t,
  customStudentUserId
}) => {
  const bandInfo =
    performanceBandProfiles.find(profile => profile._id === selectedPerformanceBand)?.performanceBand ||
    performanceBandProfiles[0]?.performanceBand;

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [selectedRowKeys, onSelectChange] = useState([]);
  const [checkedStudents, setCheckedStudents] = useState({});

  const [range, setRange] = useState({
    left: "",
    right: ""
  });

  const [pagination, setPagination] = useState({
    defaultPageSize: 50,
    current: 0
  });

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {};
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

  const parsedData = useMemo(() => parseData(res, filters), [res, filters]);

  const tableData = useMemo(() => getTableData(res, filters, range, selectedProficiency.key), [
    res,
    filters,
    range,
    selectedProficiency.key
  ]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ studentId, testActivityId }) => {
      let tids = checkedStudents[studentId];
      if (tids?.length) {
        if (tids.includes(testActivityId)) {
          tids = tids.filter(tid => tid !== testActivityId);
          setCheckedStudents({ ...checkedStudents, [studentId]: tids });
        } else {
          setCheckedStudents({ ...checkedStudents, [studentId]: [...tids, testActivityId] });
        }
      } else {
        setCheckedStudents({ ...checkedStudents, [studentId]: [testActivityId] });
      }
    },
    onSelectAll: flag => {
      if (flag) {
        const _res = {};
        tableData.forEach(ele => {
          if (_res[ele.studentId]) {
            _res[ele.studentId].push(ele.testActivityId);
          } else {
            _res[ele.studentId] = [ele.testActivityId];
          }
        });
        setCheckedStudents(_res);
      } else {
        setCheckedStudents({});
      }
    }
  };

  const updateProficiencyFilter = (_, selected) => {
    setProficiency(selected);
  };

  const onCsvConvert = data => downloadCSV(`Performance by Students.csv`, data);

  const _columns = getColumns(columns, res && res.testName, role, location, pageTitle, t);
  const testName = get(settings, "selectedTest.title", "");

  const checkedStudentsForModal = tableData
    .filter(d => checkedStudents[d.studentId] && checkedStudents[d.studentId][0] === d.testActivityId)
    .map(({ studentId, firstName, lastName, username }) => ({ _id: studentId, firstName, lastName, username }));

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length < 1) {
      notification({ messageKey: "selectOneOrMoreStudentsForGroup" });
    } else {
      setShowAddToGroupModal(true);
    }
  };

  const chartData = useMemo(() => getTableData(res, filters, range), [res, filters]);

  // if custom_student_user_id passed as params then
  // it will check if student have assignment for this test
  // then redirect to lcb student veiw
  // or show notification
  if (customStudentUserId && !loading) {
    const studentData = tableData.find(d => d.studentId === customStudentUserId);
    if (studentData) {
      const { pathname, search } = window.location;
      const parseSearch = queryString.parse(search);
      delete parseSearch.customStudentUserId;
      const { assignmentId, groupId, testActivityId } = studentData;
      return (
        <Redirect
          to={{
            pathname: `/author/classboard/${assignmentId}/${groupId}/test-activity/${testActivityId}`,
            state: { from: `${pathname}?${qs.stringify(parseSearch)}` }
          }}
        />
      );
    }
  }

  return (
    <>
      {loading ? (
        <SpinLoader position="fixed" />
      ) : (
        <UpperContainer>
          <FeaturesSwitch inputFeatures="studentGroups" actionOnInaccessible="hidden">
            <AddToGroupModal
              groupType="custom"
              visible={showAddToGroupModal}
              onCancel={() => setShowAddToGroupModal(false)}
              checkedStudents={checkedStudentsForModal}
            />
          </FeaturesSwitch>
          <StyledCharWrapper>
            <StyledCard>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <StyledH3>Students in Performance Bands(%)</StyledH3>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <PerformanceBandPieChart bands={bandInfo} data={chartData} onSelect={updateProficiencyFilter} />
                </Col>
              </Row>
            </StyledCard>
            <StyledCard style={{ width: "100%" }}>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <StyledH3>Student score distribution | {testName}</StyledH3>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <SimpleBarChartContainer data={parsedData} setRange={setRange} range={range} />
                </Col>
              </Row>
            </StyledCard>
          </StyledCharWrapper>
          <StyledCard>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <StyledH3>Student Performance | {testName}</StyledH3>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="dropdown-container">
                <FeaturesSwitch inputFeatures="studentGroups" actionOnInaccessible="hidden">
                  <StyledDropDownContainer>
                    <EduButton
                      style={{ height: "31px", padding: "0 15px 0 10px", marginRight: "5px" }}
                      onClick={handleAddToGroupClick}
                    >
                      <IconPlusCircle /> Add To Student Group
                    </EduButton>
                  </StyledDropDownContainer>
                </FeaturesSwitch>
                <StyledDropDownContainer>
                  <ControlDropDown
                    prefix="Proficiency Band - "
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
                  location={location}
                  scroll={{ x: "100%" }}
                  pageTitle={pageTitle}
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

const withConnect = connect(
  state => ({
    loading: getReportsPerformanceByStudentsLoader(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    performanceBandProfiles: getSAFFilterPerformanceBandProfiles(state),
    selectedPerformanceBand: getSAFFilterSelectedPerformanceBandProfile(state),
    performanceByStudents: getReportsPerformanceByStudents(state)
  }),
  {
    getPerformanceByStudents: getPerformanceByStudentsRequestAction
  }
);

export default compose(
  withConnect,
  withNamespaces("student")
)(PerformanceByStudents);
