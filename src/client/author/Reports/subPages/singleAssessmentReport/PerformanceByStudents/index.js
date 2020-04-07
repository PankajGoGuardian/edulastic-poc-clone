import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get } from "lodash";
import { Row, Col, Dropdown, Menu, message } from "antd";
import { EduButton } from "@edulastic/common";
import {
  getPerformanceByStudentsRequestAction,
  getReportsPerformanceByStudents,
  getReportsPerformanceByStudentsLoader
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import { getCsvDownloadingState } from "../../../ducks";

import { parseData, getTableData, getColumns, getProficiencyBandData } from "./util/transformers";
import { downloadCSV } from "../../../common/util";

import CsvTable from "../../../common/components/tables/CsvTable";
import { StyledH3, StyledCard } from "../../../common/styled";
import { UpperContainer, StyledDropDownContainer, StyledTable } from "./components/styled";
import { Placeholder } from "../../../common/components/loader";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import SimpleBarChartContainer from "./components/charts/SimpleBarChartContainer";
import AddToGroupModal from "../../../common/components/Popups/AddToGroupModal";
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
  location = { pathname: "" },
  pageTitle
}) => {
  const bandInfo =
    performanceBandProfiles.find(profile => profile._id === selectedPerformanceBand)?.performanceBand ||
    performanceBandProfiles[0]?.performanceBand;

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [selectedRowKeys, onSelectChange] = useState([]);
  const [checkedStudents, setCheckedStudents] = useState({});

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
        const res = {};
        tableData.forEach(ele => {
          if (res[ele.studentId]) {
            res[ele.studentId].push(ele.testActivityId);
          } else {
            res[ele.studentId] = [ele.testActivityId];
          }
        });
        setCheckedStudents(res);
      } else {
        setCheckedStudents({});
      }
    }
  };

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

  const _columns = getColumns(columns, res && res.testName, role, location, pageTitle);

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

  const checkedStudentsForModal = tableData
    .filter(d => checkedStudents[d.studentId] && checkedStudents[d.studentId][0] === d.testActivityId)
    .map(({ studentId, firstName, lastName, username }) => ({ _id: studentId, firstName, lastName, username }));

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
            groupType="custom"
            visible={showAddToGroupModal}
            onCancel={() => setShowAddToGroupModal(false)}
            checkedStudents={checkedStudentsForModal}
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
                    <EduButton data-cy="actions" height="32px" width="180px">
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
                  location={location}
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

const enhance = connect(
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

export default enhance(PerformanceByStudents);
