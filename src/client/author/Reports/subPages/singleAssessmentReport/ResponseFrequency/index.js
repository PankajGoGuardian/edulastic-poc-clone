import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";

import { ResponseFrequencyTable } from "./components/table/responseFrequencyTable";
import { StackedBarChartContainer } from "./components/charts/stackedBarChartContainer";
import { StyledContainer, StyledCard } from "./components/styled";
import { StyledSlider, StyledH3 } from "../../../common/styled";
import { Placeholder } from "../../../common/components/loader";
import { EmptyData } from "../../../common/components/emptyData";
import jsonData from "./static/json/data.json";

import {
  getResponseFrequencyRequestAction,
  getReportsResponseFrequency,
  getReportsResponseFrequencyLoader
} from "./ducks";
import { getPrintingState, getCsvDownloadingState } from "../../../ducks";

const filterData = (data, filter) => (Object.keys(filter).length > 0 ? data.filter(item => filter[item.qType]) : data);

const ResponseFrequency = ({
  loading,
  isPrinting,
  isCsvDownloading,
  responseFrequency: res,
  getResponseFrequency,
  settings
}) => {
  const [difficultItems, setDifficultItems] = useState(40);
  const [misunderstoodItems, setMisunderstoodItems] = useState(20);

  const [filter, setFilter] = useState({});

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getResponseFrequency(q);
    }
  }, [settings]);

  const assessmentName = get(settings, "selectedTest.title", "");
  const obj = useMemo(() => {
    let obj = {
      metaData: {},
      data: [],
      filteredData: []
    };
    if (res && res.metrics && !isEmpty(res.metrics)) {
      let arr = Object.keys(res.metrics).map((key, i) => {
        res.metrics[key].uid = key;
        return res.metrics[key];
      });

      obj = {
        data: [...arr],
        filteredData: [...arr],
        metaData: { testName: assessmentName }
      };
    }
    return obj;
  }, [res]);

  const filteredData = useMemo(() => filterData(obj.data, filter), [filter, obj.data]);

  const onChangeDifficultSlider = value => {
    setDifficultItems(value);
  };

  const onChangeMisunderstoodSlider = value => {
    setMisunderstoodItems(value);
  };

  const onBarClickCB = key => {
    let _filter = { ...filter };
    if (_filter[key]) {
      delete _filter[key];
    } else {
      _filter[key] = true;
    }
    setFilter(_filter);
  };

  const onResetClickCB = () => {
    setFilter({});
  };

  if (isEmpty(res) && !loading) {
    return (
      <>
        <EmptyData />
      </>
    );
  }

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
        <StyledContainer type="flex">
          <StyledCard>
            <StyledH3>Question Type performance for Assessment: {assessmentName}</StyledH3>
            <StackedBarChartContainer
              data={obj.data}
              assessment={obj.metaData}
              filter={filter}
              onBarClickCB={onBarClickCB}
              onResetClickCB={onResetClickCB}
            />
          </StyledCard>
          <StyledCard>
            <Row type="flex" justify="center" className="question-area">
              <Col className="question-container">
                <p>What are the most difficult items?</p>
                <p>Set threshold to warn if % correct falls below:</p>
                <Row type="flex" justify="start" align="middle">
                  <Col className="answer-slider-percentage">
                    <span>{difficultItems}%</span>
                  </Col>
                  <Col className="answer-slider">
                    <StyledSlider
                      data-slider-id="difficult"
                      defaultValue={difficultItems}
                      onChange={onChangeDifficultSlider}
                    />
                  </Col>
                </Row>
              </Col>
              <Col className="question-container">
                <p>What items are misunderstood?</p>
                <p>Set threshold to warn if % frequency of an incorrect choice is above:</p>
                <Row type="flex" justify="start" align="middle">
                  <Col className="answer-slider-percentage">
                    <span>{misunderstoodItems}%</span>
                  </Col>
                  <Col className="answer-slider">
                    <StyledSlider
                      data-slider-id="misunderstood"
                      defaultValue={misunderstoodItems}
                      onChange={onChangeMisunderstoodSlider}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </StyledCard>
          <ResponseFrequencyTable
            data={filteredData}
            columns={jsonData.columns}
            assessment={obj.metaData}
            correctThreshold={difficultItems}
            incorrectFrequencyThreshold={misunderstoodItems}
            isPrinting={isPrinting}
            isCsvDownloading={isCsvDownloading}
          />
        </StyledContainer>
      )}
    </div>
  );
};
const reportPropType = PropTypes.shape({
  metricInfo: PropTypes.array
});

ResponseFrequency.propTypes = {
  loading: PropTypes.bool.isRequired,
  isPrinting: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  responseFrequency: reportPropType.isRequired,
  getResponseFrequency: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

const enhance = connect(
  state => ({
    loading: getReportsResponseFrequencyLoader(state),
    isPrinting: getPrintingState(state),
    isCsvDownloading: getCsvDownloadingState(state),
    responseFrequency: getReportsResponseFrequency(state)
  }),
  {
    getResponseFrequency: getResponseFrequencyRequestAction
  }
);

export default enhance(ResponseFrequency);
