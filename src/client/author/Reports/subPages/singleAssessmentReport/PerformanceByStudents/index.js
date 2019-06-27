import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { Row, Col } from "antd";

import {
  getPerformanceByStudentsRequestAction,
  getReportsPerformanceByStudents,
  getReportsPerformanceByStudentsLoader
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import { parseData, getTableData, getColumns, getProficiencyBandData } from "./util/transformers";

import { StyledH3, StyledCard } from "../../../common/styled";
import { UpperContainer, StyledDropDownContainer, StyledTable } from "./components/styled";
import { Placeholder } from "../../../common/components/loader";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import SimpleBarChartContainer from "./components/charts/SimpleBarChartContainer";

import dropDownFormat from "../../../common/static/json/dropDownFormat.json";
import columns from "./static/json/tableColumns.json";

const PerformanceByStudents = ({
  role,
  performanceByStudents,
  getPerformanceByStudentsRequestAction,
  settings,
  loading
}) => {
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
    defaultPageSize: 15,
    current: 0
  });

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getPerformanceByStudentsRequestAction(q);
    }
  }, [settings]);

  useEffect(() => {
    setPagination({ ...pagination, current: 0 });
  }, [range.left, range.right]);

  const res = get(performanceByStudents, "data.result", false);
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

  const _columns = getColumns(columns, res && res.testName, role);

  return (
    <>
      {loading ? (
        <>
          <Placeholder />
          <Placeholder />
        </>
      ) : (
        <UpperContainer>
          <StyledCard>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <StyledH3>Student score distribution | {res && res.testName}</StyledH3>
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
                <StyledH3>Student Performance | {res && res.testName}</StyledH3>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="dropdown-container">
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
                <StyledTable
                  columns={_columns}
                  dataSource={tableData}
                  colouredCellsNo={4}
                  rightAligned={8}
                  pagination={pagination}
                  onChange={setPagination}
                />
              </Col>
            </Row>
          </StyledCard>
        </UpperContainer>
      )}
    </>
  );
};

const enhance = connect(
  state => ({
    performanceByStudents: getReportsPerformanceByStudents(state),
    loading: getReportsPerformanceByStudentsLoader(state),
    role: getUserRole(state)
  }),
  {
    getPerformanceByStudentsRequestAction
  }
);

export default enhance(PerformanceByStudents);
