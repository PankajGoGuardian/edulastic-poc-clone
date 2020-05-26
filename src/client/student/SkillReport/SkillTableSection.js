import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Progress, Row, Col } from "antd";
import styled from "styled-components";
import {
  greenDark,
  title,
  extraDesktopWidth,
  largeDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";
import StyledTable from "../styled/Table";
import * as S from "./styled";
import { getBandWithColor } from "./utils";
import { Wrapper } from "../styled";

const computeColumns = t => [
  {
    title: t("common.tableHeaderTitleGrade"),
    dataIndex: "grade",
    align: "left",
    sorter: (a, b) => a.grade - b.grade,
    render: grade => <S.GradeTag>{grade}</S.GradeTag>,
    width: "10%"
  },
  {
    title: t("common.tableHeaderTitleTopicName"),
    dataIndex: "domain",
    align: "left",
    sorter: (a, b) => a.domain.length - b.domain.length,
    render: domain => `${domain}`,
    width: "45%"
  },
  {
    title: t("common.tableHeaderTitlePercentScore"),
    dataIndex: "percentage",
    align: "left",
    sorter: (a, b) => a.percentage - b.percentage,
    render: (percentage, record) =>
      isNaN(percentage) ? (
        <Row type="flex" justify="center">
          <Col>-</Col>
        </Row>
      ) : (
        <StyledProgress color={record.color} percent={Number(percentage.toFixed(1))} />
      ),
    width: "20%"
  }
];

class DomainDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  handlerTable = () => {
    this.setState(prevState => ({ isShow: !prevState.isShow }));
  };

  render() {
    const { summary, skillReport, t } = this.props;
    const { isShow } = this.state;
    const columns = computeColumns(t);
    let sumData = [];
    let score = 0;
    let maxScore = 1;
    if (summary) {
      const getStandardsScoreDetails = id =>
        skillReport.reports.reportData.standardLevel &&
        skillReport.reports.reportData.standardLevel.filter(item => item.standard_id === id);
      sumData = summary.standards.map(standard => {
        const standardsData = getStandardsScoreDetails(standard._id)[0] || {};
        const percentage = (standardsData.score / standardsData.max_points) * 100;
        const scale = getBandWithColor(skillReport.reports.scaleInfo, percentage) || {};
        score += standardsData.score || 0;
        maxScore += standardsData.max_points || 1;
        return {
          domain: standard.description || "-",
          grade: standard.identifier || "-",
          total: standardsData.score || "-",
          percentage,
          color: scale.color
        };
      });
    }
    const skillPercentage = Number(((score / maxScore) * 100).toFixed(1));

    const scale = getBandWithColor(skillReport.reports.scaleInfo, skillPercentage);
    return (
      <WrapperContent>
        <S.Title onClick={this.handlerTable}>
          <S.RelationTitle>
            <span>({summary.identifier})</span> {summary.domain}
          </S.RelationTitle>
          {!isNaN(skillPercentage) && <StyledScoreProgress percent={skillPercentage} color={scale.color || ""} />}
          {isShow ? <S.IconClose /> : <S.IconOpen color={greenDark} />}
        </S.Title>
        {isShow && (
          <StyledTableWrapper>
            <StyledTable columns={columns} dataSource={sumData} pagination={false} />
          </StyledTableWrapper>
        )}
      </WrapperContent>
    );
  }
}

DomainDetail.propTypes = {
  summary: PropTypes.object.isRequired,
  skillReport: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("reports"));

export default enhance(DomainDetail);

export const StyledScoreProgress = styled(Progress)`
  width: 319px;
  margin-right: 40px;
  height: 20px;

  .ant-progress-inner {
    height: 20px;
    background-color: #fff;
    border: 1px solid #e6e6e6;
  }

  .ant-progress-outer {
    margin-right: calc(-2em - 32px);
    padding-right: calc(2em + 31px);
  }

  .ant-progress-bg {
    height: 20px !important;
    background: ${props => props.color};
  }

  .ant-progress-text {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.skillReport.RelationTitleColor};
    margin-left: 19px;
    margin-top: 1px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 195px;
    height: 16px;

    .ant-progress-text {
      font-size: 12px;
      margin-left: 16px;
    }
  }
`;

export const StyledProgress = styled(Progress)`
  height: 16px;

  .ant-progress-inner {
    height: 16px;
  }

  .ant-progress-bg {
    height: 16px !important;
    background: ${props => props.color};
  }
`;

export const StyledTableWrapper = styled.div`
  margin-top: 10px;

  .ant-table-tbody > tr {
    > td {
      &:not(:first-child) {
        font-size: 11px;
        font-weight: 400;
        text-align: left;
        color: ${title};

        @media (min-width: ${largeDesktopWidth}) {
          font-size: 12px;
        }
        @media (min-width: ${extraDesktopWidth}) {
          font-size: 14px;
        }
      }
    }
  }
`;

const WrapperContent = styled(Wrapper)`
  padding: 26px 22px;
  min-height: 0;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 27px 23px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 39px 39px;
  }
`;
