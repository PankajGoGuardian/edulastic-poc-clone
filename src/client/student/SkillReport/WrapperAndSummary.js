import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { extraDesktopWidth, mobileWidthMax, smallDesktopWidth } from "@edulastic/colors";
import styled from "styled-components";
import * as S from "./styled";
import StyledTable from "../styled/Table";
import TableSection from "./SkillTableSection";
import { getBandWithColor } from "./utils";

import { Wrapper } from "../styled";

const computeColumns = t => [
  {
    title: t("common.tableHeaderTitleDomains"),
    dataIndex: "domain",
    sorter: (a, b) => a.domain.length - b.domain.length,
    render: (domain, record) => (
      <>
        <S.DomainTag>{record.identifier}</S.DomainTag> {domain}
      </>
    ),
    width: "40%"
  },
  {
    title: t("common.tableHeaderTitleTotalQuestions"),
    dataIndex: "total",
    sorter: (a, b) => a.total - b.total,
    render: total => `${total}`,
    width: "20%"
  },
  {
    title: t("common.tableHeaderTitlePercentage"),
    dataIndex: "percentage",
    sorter: (a, b) => a.percentage - b.percentage,
    render: (percentage, record) => (
      <PercentageWrapper>
        {Number.isNaN(percentage) ? "-" : `${Number(percentage.toFixed(1))}%`}
        {!Number.isNaN(percentage) && (
          <S.PercentageTag percentage={percentage} color={record.color || ""}>
            {record.masteryName}
          </S.PercentageTag>
        )}
      </PercentageWrapper>
    ),
    width: "20%"
  }
];

const SkillReportMainContent = ({ skillReport, t }) => {
  const summaryColumns = computeColumns(t);
  let sumData = [];
  if (skillReport) {
    const getDomainScoreDetails = id =>
      skillReport.reports.reportData.domainLevel &&
      skillReport.reports.reportData.domainLevel.filter(item => item.domain_id === id);
    sumData = skillReport.reports.curriculum.domains.map(domain => {
      const reportData = getDomainScoreDetails(domain._id)[0] || {};
      const percentage = (reportData.score / reportData.max_points) * 100;
      const scale = getBandWithColor(skillReport.reports.scaleInfo, percentage) || {};
      return {
        domain: domain.description || "-",
        standards: domain.standards || "-",
        total: reportData.total_questions || "-",
        hints: reportData.hints || "-",
        percentage,
        identifier: domain.identifier,
        color: scale.color,
        masteryName: scale.masteryName
      };
    });
  }
  return (
    <React.Fragment>
      <ContentWrapper>
        <WrapperContent>
          <S.SummaryTitle>{t("common.skillSummary")}</S.SummaryTitle>
          <StyledTable columns={summaryColumns} dataSource={sumData} pagination={false} />
        </WrapperContent>
        {sumData.map((summary, index) => (
          <TableSection summary={summary} dataSource={sumData} skillReport={skillReport} key={index} />
        ))}
      </ContentWrapper>
    </React.Fragment>
  );
};

SkillReportMainContent.propTypes = {
  skillReport: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("reports"));

export default enhance(SkillReportMainContent);

const ContentWrapper = styled.div`
  padding: 20px 40px;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 20px 30px;
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 10px 20px;
  }
`;

const WrapperContent = styled(Wrapper)`
  padding: 25px 20px;
  min-height: 0;

  @media (min-width: ${extraDesktopWidth}) {
    padding: 32px 39px;
  }
`;

export const PercentageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
