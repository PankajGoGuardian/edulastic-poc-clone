import React, { useEffect, useState, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { get, keyBy, isEmpty, cloneDeep } from "lodash";
import next from "immer";

import { parseData, idToName } from "./util/transformers";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { CustomizedHeaderWrapper } from "../../common/components/header";
import { StyledCard, StyledH3, StyledControlDropDown, StyledFilterDropDownWithDropDown } from "../../common/styled";
import { SimpleStackedBarChartContainer } from "./components/charts/simpleStackedBarChartContainer";
import { SignedStackedBarChartContainer } from "./components/charts/signedStackedBarChartContainer";
import { UpperContainer, TableContainer, StyledTable } from "./components/styled";
import { PeerPerformanceTable } from "./components/table/peerPerformanceTable";
import { getPeerPerformanceRequestAction, getReportsPeerPerformance } from "./ducks";
import dropDownFormat from "./static/json/dropDownFormat.json";
import { getUserRole } from "../../../src/selectors/user";
import { NavigatorTabs } from "../../common/components/navigatorTabs";
import { getNavigationTabLinks } from "../../common/util";
import chartNavigatorLinks from "../../common/static/json/singleAssessmentSummaryChartNavigator.json";
import columns from "./static/json/tableColumns.json";
import tempData from "./static/json/tempData";

const denormalizeData = res => {
  let hMap = keyBy(res.metaInfo, "groupId");

  if (res && !isEmpty(res.metricInfo)) {
    let filteredArr = res.metricInfo.filter((data, index) => {
      if (hMap[data.groupId]) return true;
      else return false;
    });

    let denormArr = filteredArr.map((data, index) => {
      return {
        ...hMap[data.groupId],
        ...data,
        gender: data.gender.toLowerCase() === "m" ? "Male" : data.gender.toLowerCase() === "f" ? "Female" : data.gender
      };
    });

    return denormArr;
  }

  return [];
};

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const PeerPerformance = ({ peerPerformance, match, getPeerPerformanceRequestAction, role }) => {
  const [ddfilter, setDdFilter] = useState({
    analyseBy: "score(%)",
    compareBy: role === "teacher" ? "groupId" : "schoolId",
    gender: "all",
    frlStatus: "all",
    ellStatus: "all",
    iepStatus: "all",
    race: "all"
  });
  const [chartFilter, setChartFilter] = useState({});

  const breadcrumbData = [
    {
      title: "REPORTS",
      to: "/author/reports"
    },
    {
      title: "PEER PERFORMANCE"
    }
  ];

  useEffect(() => {
    let q = {};
    q.testId = match.params.testId;
    getPeerPerformanceRequestAction(q);
  }, []);

  let compareByDropDownData = dropDownFormat.compareByDropDownData;
  if (role === "teacher") {
    compareByDropDownData = next(dropDownFormat.compareByDropDownData, tempCompareBy => {
      if (role === "teacher") {
        tempCompareBy.splice(0, 2);
      }
    });
  }

  const getColumns = () => {
    return columns.columns[ddfilter.analyseBy][ddfilter.compareBy];
  };

  const res = get(peerPerformance, "data.result", false);

  const denormData = useMemo(() => {
    return denormalizeData(res);
  }, [res]);

  const parsedData = useMemo(() => {
    return { data: parseData(res, denormData, ddfilter), columns: getColumns() };
  }, [ddfilter, res]);

  //
  const updateAnalyseByCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      analyseBy: selected.key
    });
    setChartFilter({});
  };

  const updateCompareByCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      compareBy: selected.key
    });
    setChartFilter({});
  };

  const filterDropDownCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      [comData]: selected.key
    });
  };
  //

  const onBarClickCB = key => {
    let _chartFilter = { ...chartFilter };
    if (_chartFilter[key]) {
      delete _chartFilter[key];
    } else {
      _chartFilter[key] = true;
    }
    setChartFilter(_chartFilter);
  };

  const onResetClickCB = () => {
    setChartFilter({});
  };

  const computedChartNavigatorLinks = useMemo(() => {
    return next(chartNavigatorLinks, arr => {
      getNavigationTabLinks(arr, match.params.testId);
    });
  }, [match.params.testId]);

  return (
    <div>
      <CustomizedHeaderWrapper title="Peer Performance" />
      <Breadcrumb data={breadcrumbData} style={{ position: "unset", padding: "10px" }} />
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={"peerPerformance"} />
      <UpperContainer>
        <StyledCard>
          <Row type="flex" justify="start">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <StyledH3>
                Assessment Performance by {idToName[ddfilter.compareBy]} | {res.assessmentName}
              </StyledH3>
            </Col>
            <Col className="dropdown-container" xs={24} sm={24} md={12} lg={12} xl={12}>
              <StyledControlDropDown
                prefix={"Analyse by"}
                by={dropDownFormat.analyseByDropDownData[0]}
                updateCB={updateAnalyseByCB}
                data={dropDownFormat.analyseByDropDownData}
              />
              <StyledControlDropDown
                prefix={"Compare by"}
                by={compareByDropDownData[0]}
                updateCB={updateCompareByCB}
                data={compareByDropDownData}
              />
              <StyledFilterDropDownWithDropDown updateCB={filterDropDownCB} data={dropDownFormat.filterDropDownData} />
            </Col>
          </Row>
          <div>
            {ddfilter.analyseBy === "score(%)" || ddfilter.analyseBy === "rawScore" ? (
              <SimpleStackedBarChartContainer
                data={parsedData.data}
                analyseBy={ddfilter.analyseBy}
                compareBy={ddfilter.compareBy}
                filter={chartFilter}
                assessmentName={res.assessmentName}
                onBarClickCB={onBarClickCB}
                onResetClickCB={onResetClickCB}
                bandInfo={res.bandInfo}
                role={role}
              />
            ) : (
              <SignedStackedBarChartContainer
                data={parsedData.data}
                analyseBy={ddfilter.analyseBy}
                compareBy={ddfilter.compareBy}
                filter={chartFilter}
                assessmentName={res.assessmentName}
                onBarClickCB={onBarClickCB}
                onResetClickCB={onResetClickCB}
                bandInfo={res.bandInfo}
                role={role}
              />
            )}
          </div>
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <StyledCard>
          <PeerPerformanceTable
            columns={parsedData.columns}
            dataSource={parsedData.data}
            rowKey={"compareBylabel"}
            filter={chartFilter}
            analyseBy={ddfilter.analyseBy}
            compareBy={ddfilter.compareBy}
            assessmentName={res.assessmentName}
            bandInfo={res.bandInfo}
            role={role}
          />
        </StyledCard>
      </TableContainer>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      peerPerformance: getReportsPeerPerformance(state),
      role: getUserRole(state)
    }),
    {
      getPeerPerformanceRequestAction: getPeerPerformanceRequestAction
    }
  )
);

export default enhance(PeerPerformance);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
