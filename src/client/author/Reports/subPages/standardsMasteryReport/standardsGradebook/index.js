import React, { useEffect, useState, useMemo, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import next from "immer";
import queryString from "query-string";

import { StyledH3, StyledCard } from "../../../common/styled";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import { Placeholder } from "../../../common/components/loader";

import { UpperContainer, TableContainer } from "./components/styled";
import { SignedStackBarChartContainer } from "./components/charts/signedStackBarChartContainer";
import {
  getStandardsGradebookRequestAction,
  getStandardsGradebookFiltersRequestAction,
  getReportsStandardsGradebook,
  getReportsStandardsGradebookFilters,
  getReportsStandardsGradebookLoader
} from "./ducks";

import { getFilterDropDownData, getDenormalizedData } from "./utils/transformers";

import dropDownFormat from "./static/json/dropDownFormat.json";
import { getUserRole, getUser, getInterestedCurriculumsSelector } from "../../../../src/selectors/user";
import { StandardsGradebookTable } from "./components/table/standardsGradebookTable";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const StandardsGradebook = ({
  standardsGradebook,
  standardsGradebookFilters,
  getStandardsGradebookRequestAction,
  role,
  user,
  settings,
  history,
  location,
  match,
  loading
}) => {
  const [ddfilter, setDdFilter] = useState({
    schoolId: "all",
    teacherId: "all",
    groupId: "all",
    gender: "all",
    frlStatus: "all",
    ellStatus: "all",
    iepStatus: "all",
    race: "all"
  });

  const [chartFilter, setChartFilter] = useState({});

  useEffect(() => {
    if (settings.requestFilters.termId && settings.requestFilters.domainIds) {
      let q = {
        testId: settings.selectedTest.key,
        ...settings.requestFilters
      };
      getStandardsGradebookRequestAction(q);
    }
  }, [settings]);

  const denormalizedData = useMemo(() => {
    return getDenormalizedData(standardsGradebook);
  }, [standardsGradebook]);

  let filterDropDownData = dropDownFormat.filterDropDownData;
  filterDropDownData = useMemo(() => {
    let _standardsGradebook = get(standardsGradebook, "data.result", {});
    if (!isEmpty(_standardsGradebook)) {
      let ddTeacherInfo = _standardsGradebook.teacherInfo;
      let temp = next(dropDownFormat.filterDropDownData, arr => {});
      return getFilterDropDownData(ddTeacherInfo, role).concat(temp);
    } else {
      return dropDownFormat.filterDropDownData;
    }
  }, [standardsGradebook]);

  const filterDropDownCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      [comData]: selected.key
    });
  };

  const onBarClickCB = key => {
    let _chartFilter = { ...chartFilter };
    if (_chartFilter[key]) {
      delete _chartFilter[key];
    } else {
      _chartFilter[key] = true;
    }
    setChartFilter(_chartFilter);
  };

  const masteryScale = get(standardsGradebookFilters, "data.result.bandInfo", []);

  return (
    <div>
      {loading ? (
        <div>
          <Row type="flex">
            <Placeholder />
          </Row>
          <Row type="flex">
            <Placeholder />
          </Row>
        </div>
      ) : (
        <>
          <UpperContainer>
            <StyledCard>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <StyledH3>Mastery Level Distribution Standards</StyledH3>
                </Col>
                <Col className="dropdown-container" xs={24} sm={24} md={12} lg={12} xl={12}>
                  <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={filterDropDownData} />
                </Col>
              </Row>
              <Row>
                <SignedStackBarChartContainer
                  denormalizedData={denormalizedData}
                  filters={ddfilter}
                  chartFilter={chartFilter}
                  masteryScale={masteryScale}
                  role={role}
                  onBarClickCB={onBarClickCB}
                />
              </Row>
            </StyledCard>
          </UpperContainer>
          <TableContainer>
            <StandardsGradebookTable
              denormalizedData={denormalizedData}
              masteryScale={masteryScale}
              chartFilter={chartFilter}
              role={role}
            />
          </TableContainer>
        </>
      )}
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      standardsGradebook: getReportsStandardsGradebook(state),
      standardsGradebookFilters: getReportsStandardsGradebookFilters(state),
      loading: getReportsStandardsGradebookLoader(state),
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state)
    }),
    {
      getStandardsGradebookRequestAction: getStandardsGradebookRequestAction,
      getStandardsGradebookFiltersRequestAction: getStandardsGradebookFiltersRequestAction
    }
  )
);

export default enhance(StandardsGradebook);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
