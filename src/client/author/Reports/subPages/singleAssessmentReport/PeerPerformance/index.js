import { SpinLoader } from "@edulastic/common";
import { Col, Row } from "antd";
import next from "immer";
import { get, isEmpty, keyBy } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUserRole } from "../../../../src/selectors/user";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import dropDownFormat from "../../../common/static/json/dropDownFormat.json";
import { StyledCard, StyledH3, StyledSignedBarContainer } from "../../../common/styled";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getSAFFilterPerformanceBandProfiles,
  getSAFFilterSelectedPerformanceBandProfile
} from "../common/filterDataDucks";
import { SignedStackedBarChartContainer } from "./components/charts/signedStackedBarChartContainer";
import { SimpleStackedBarChartContainer } from "./components/charts/simpleStackedBarChartContainer";
import { TableContainer, UpperContainer } from "./components/styled";
import { PeerPerformanceTable } from "./components/table/peerPerformanceTable";
import { getPeerPerformanceRequestAction, getReportsPeerPerformance, getReportsPeerPerformanceLoader } from "./ducks";
import columns from "./static/json/tableColumns.json";
import { idToName, parseData } from "./util/transformers";

const denormalizeData = res => {
  const hMap = keyBy(res.metaInfo, "groupId");

  if (res && !isEmpty(res.metricInfo)) {
    const filteredArr = res.metricInfo.filter((data, index) => {
      if (hMap[data.groupId]) return true;
      return false;
    });

    const denormArr = filteredArr.map((data, index) => {
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

const PeerPerformance = ({
  loading,
  isCsvDownloading,
  role,
  performanceBandProfiles,
  selectedPerformanceBand,
  peerPerformance,
  getPeerPerformance,
  settings
}) => {
  const bandInfo =
    performanceBandProfiles.find(profile => profile._id === selectedPerformanceBand)?.performanceBand ||
    performanceBandProfiles[0]?.performanceBand;

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

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getPeerPerformance(q);
    }
  }, [settings]);

  let { compareByDropDownData } = dropDownFormat;
  if (role === "teacher") {
    compareByDropDownData = next(dropDownFormat.compareByDropDownData, tempCompareBy => {
      if (role === "teacher") {
        tempCompareBy.splice(0, 2);
      }
    });
  }

  const getColumns = () => columns.columns[ddfilter.analyseBy][ddfilter.compareBy];

  const res = { ...peerPerformance, bandInfo };

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
    const _chartFilter = { ...chartFilter };
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

  const assessmentName = get(settings, "selectedTest.title", "");

  return (
    <div>
      {loading ? (
        <SpinLoader position="fixed" />
      ) : (
        <>
          <UpperContainer>
            <StyledCard>
              <StyledSignedBarContainer>
                <Row type="flex" justify="start">
                  <Col xs={24} sm={24} md={12} lg={8} xl={12}>
                    <StyledH3>
                      Assessment Performance by {idToName[ddfilter.compareBy]} | {assessmentName}
                    </StyledH3>
                  </Col>
                  <Col className="dropdown-container" xs={24} sm={24} md={12} lg={16} xl={12}>
                    <ControlDropDown
                      prefix={"Analyse by"}
                      by={dropDownFormat.analyseByDropDownData[0]}
                      selectCB={updateAnalyseByCB}
                      data={dropDownFormat.analyseByDropDownData}
                    />
                    <ControlDropDown
                      prefix={"Compare by"}
                      by={compareByDropDownData[0]}
                      selectCB={updateCompareByCB}
                      data={compareByDropDownData}
                    />
                    <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={dropDownFormat.filterDropDownData} />
                  </Col>
                </Row>
                <div>
                  {ddfilter.analyseBy === "score(%)" || ddfilter.analyseBy === "rawScore" ? (
                    <SimpleStackedBarChartContainer
                      data={parsedData.data}
                      analyseBy={ddfilter.analyseBy}
                      compareBy={ddfilter.compareBy}
                      filter={chartFilter}
                      assessmentName={assessmentName}
                      onBarClickCB={onBarClickCB}
                      onResetClickCB={onResetClickCB}
                      bandInfo={bandInfo}
                      role={role}
                    />
                  ) : (
                    <SignedStackedBarChartContainer
                      data={parsedData.data}
                      analyseBy={ddfilter.analyseBy}
                      compareBy={ddfilter.compareBy}
                      filter={chartFilter}
                      assessmentName={assessmentName}
                      onBarClickCB={onBarClickCB}
                      onResetClickCB={onResetClickCB}
                      bandInfo={bandInfo}
                      role={role}
                    />
                  )}
                </div>
              </StyledSignedBarContainer>
            </StyledCard>
          </UpperContainer>
          <TableContainer>
            <StyledCard>
              <PeerPerformanceTable
                isCsvDownloading={isCsvDownloading}
                columns={parsedData.columns}
                dataSource={parsedData.data}
                rowKey={"compareBylabel"}
                filter={chartFilter}
                analyseBy={ddfilter.analyseBy}
                compareBy={ddfilter.compareBy}
                assessmentName={assessmentName}
                bandInfo={bandInfo}
                role={role}
              />
            </StyledCard>
          </TableContainer>
        </>
      )}
    </div>
  );
};

const reportPropType = PropTypes.shape({
  districtAvg: PropTypes.number,
  districtAvgPerf: PropTypes.number,
  metaInfo: PropTypes.array,
  metricInfo: PropTypes.array
});

PeerPerformance.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  peerPerformance: reportPropType.isRequired,
  performanceBandProfiles: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.string.isRequired,
  getPeerPerformance: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

const enhance = compose(
  connect(
    state => ({
      loading: getReportsPeerPerformanceLoader(state),
      isCsvDownloading: getCsvDownloadingState(state),
      role: getUserRole(state),
      selectedPerformanceBand: getSAFFilterSelectedPerformanceBandProfile(state),
      performanceBandProfiles: getSAFFilterPerformanceBandProfiles(state),
      peerPerformance: getReportsPeerPerformance(state)
    }),
    {
      getPeerPerformance: getPeerPerformanceRequestAction
    }
  )
);

export default enhance(PeerPerformance);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
