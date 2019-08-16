import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Progress, Row, Col } from "antd";
import styled from "styled-components";
import { greenDark, title, extraDesktopWidth, mediumDesktopWidth, largeDesktopWidth } from "@edulastic/colors";
import StyledTable from "../styled/Table";
import * as S from "./styled";

import { Wrapper } from "../styled";

const computeColumns = t => [
  {
    title: t("common.tableHeaderTitleGrade"),
    dataIndex: "grade",
    sorter: (a, b) => a.grade - b.grade,
    render: grade => <S.GradeTag>{grade}</S.GradeTag>,
    width: "15%"
  },
  {
    title: t("common.tableHeaderTitleTopicName"),
    dataIndex: "domain",
    sorter: (a, b) => a.domain.length - b.domain.length,
    render: domain => `${domain}`,
    width: "45%"
  },
  {
    title: t("common.tableHeaderTitlePercentScore"),
    dataIndex: "percentage",
    sorter: (a, b) => a.percentage - b.percentage,
    render: percentage =>
      isNaN(percentage) ? (
        <Row type="flex" justify="center">
          <Col>-</Col>
        </Row>
      ) : (
        <StyledProgress percent={Number(percentage.toFixed(1))} />
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
        score += standardsData.score || 0;
        maxScore += standardsData.max_points || 1;
        return {
          domain: standard.description || "-",
          grade: standard.identifier || "-",
          total: standardsData.score || "-",
          percentage
        };
      });
    }
    const skillPercentage = Number(((score / maxScore) * 100).toFixed(1));

    return (
      <WrapperContent>
        <S.Title onClick={this.handlerTable}>
          <S.RelationTitle>{summary.domain}</S.RelationTitle>
          {!isNaN(skillPercentage) && <StyledScoreProgress percent={skillPercentage} />}
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
    background: ${props =>
      props.percent >= 50
        ? props.theme.skillReport.greenColor
        : props.percent >= 30
        ? props.theme.skillReport.yellowColor
        : props.theme.skillReport.redColor};
  }

  .ant-progress-text {
    font-size: 14px;
    font-weight: 600;
    color: ${title};
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
    background: ${props =>
      props.percent >= 50
        ? props.theme.skillReport.greenColor
        : props.percent >= 30
        ? props.theme.skillReport.yellowColor
        : props.theme.skillReport.redColor};
  }
`;

export const StyledTableWrapper = styled.div`
  margin-top: 10px;

  .ant-table-tbody > tr {
    > td {
      &:not(:first-child) {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: ${title};

        @media (max-width: ${extraDesktopWidth}) {
          font-size: 12px;
        }

        @media (max-width: ${largeDesktopWidth}) {
          font-size: 11px;
        }
      }
    }
  }
`;

const WrapperContent = styled(Wrapper)`
  padding: 39px 39px;
  min-height: 0;

  @media (max-width: ${extraDesktopWidth}) {
    padding: 27px 23px;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    padding: 26px 22px;
  }
`;
