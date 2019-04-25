import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { IconHeart, IconShare, IconWorldWide } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";

import { selectsData } from "../../../common";
import { SummaryInput, SummarySelect } from "../../common/SummaryForm";
import { Block, MainTitle, MetaTitle, AnalyticsContainer, AnalyticsItem } from "./styled";

export const renderAnalytics = (title, Icon) => (
  <AnalyticsItem>
    <Icon color="#bbbfc4" width={15} height={15} />
    <MetaTitle>{title}</MetaTitle>
  </AnalyticsItem>
);

const Sidebar = ({
  title,
  subjects,
  onChangeSubjects,
  onChangeField,
  tags,
  analytics,
  grades,
  onChangeGrade,
  windowWidth
}) => (
  <FlexContainer flexDirection="column">
    <Block>
      <MainTitle>Assessment Name</MainTitle>
      <SummaryInput
        value={title}
        data-cy="inputTest"
        onChange={e => onChangeField("title", e.target.value)}
        size="large"
        placeholder="Enter an assessment name"
      />

      <MainTitle>Grade</MainTitle>
      <SummarySelect
        mode="multiple"
        size="large"
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={grades}
        onChange={onChangeGrade}
      >
        {selectsData.allGrades.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </SummarySelect>

      <MainTitle>Subject</MainTitle>
      <SummarySelect
        mode="multiple"
        size="large"
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={subjects}
        onChange={onChangeSubjects}
      >
        {selectsData.allSubjects.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </SummarySelect>

      <MainTitle>Tags</MainTitle>
      <SummarySelect
        mode="multiple"
        size="large"
        style={{ marginBottom: 0 }}
        placeholder="Please select"
        defaultValue={tags}
        onChange={value => onChangeField("tags", value)}
      >
        {selectsData.allTags.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </SummarySelect>
    </Block>
    <Block>
      <AnalyticsContainer style={{ marginBottom: windowWidth > 993 ? "0" : "15px" }}>
        {renderAnalytics("Public Library", IconWorldWide)}
        {renderAnalytics((analytics && analytics.usage) || "N/A", IconShare)}
        {renderAnalytics((analytics && analytics.likes) || "N/A", IconHeart)}
      </AnalyticsContainer>
    </Block>
  </FlexContainer>
);

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeField: PropTypes.func.isRequired,
  analytics: PropTypes.array.isRequired,
  grades: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  subjects: PropTypes.array.isRequired,
  onChangeSubjects: PropTypes.func.isRequired
};

export default Sidebar;
