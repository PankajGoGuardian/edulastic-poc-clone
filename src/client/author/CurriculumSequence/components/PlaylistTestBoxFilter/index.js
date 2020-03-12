import React from "react";
import { Select, Icon } from "antd";
import { FlexContainer } from "@edulastic/common";
import SELECT_DATA from "../../../TestPage/components/common/selectsData";
import { FILTERS } from "../ManageContentBlock/ducks";
import { FilterContainer, Title, StyledCheckbox, Item, Label } from "./styled";

const PlaylistTestBoxFilter = props => {
  const {
    authoredList = [],
    collectionsList = [],
    sourceList = [],
    filter,
    onFilterChange,
    status = "",
    onStatusChange,
    authoredBy,
    onAuthorChange,
    grades = [],
    onGradesChange,
    subject = "",
    onSubjectChange,
    collection = "",
    onCollectionChange,
    sources = [],
    onSourceChange
  } = props;

  const { allGrades, allSubjects, allStatus } = SELECT_DATA;
  const { Option } = Select;

  return (
    <FilterContainer>
      {FILTERS.map(item => (
        <Item key={item.path} active={item.filter === filter} onClick={() => onFilterChange(item?.filter)}>
          <Icon type={item.icon} />
          <Label active={item.filter === filter}>{item.text}</Label>
        </Item>
      ))}

      <Title>status</Title>
      <Select
        placeholder="Select Status"
        style={{ width: 315, height: 40, lineHeight: 40 }}
        value={status}
        onChange={onStatusChange}
      >
        {allStatus.map(({ text, value }) => (
          <Option value={value}>{text}</Option>
        ))}
      </Select>

      <br />
      <Title>authored</Title>
      <Select
        placeholder="Select Authored"
        style={{ width: 315, height: 40, lineHeight: 40 }}
        value={authoredBy}
        onChange={onAuthorChange}
      >
        {authoredList.map(({ text, value }) => (
          <Option value={value}>{text}</Option>
        ))}
      </Select>

      <br />
      <Title>grade</Title>
      <Select
        mode="multiple"
        style={{ width: 315, minHeight: "40px", lineHeight: 40 }}
        placeholder="Select Grades"
        value={grades}
        onChange={onGradesChange}
      >
        {allGrades?.map(({ text, value }) => <Option key={value}>{text}</Option>)}
      </Select>

      <br />
      <Title>subject</Title>
      <Select
        placeholder="Select Subject"
        style={{ width: 315, height: 40, lineHeight: 40 }}
        value={subject}
        onChange={onSubjectChange}
      >
        {allSubjects.map(({ text, value }) => (
          <Option value={value}>{text}</Option>
        ))}
      </Select>

      <br />
      <Title>collection</Title>
      <Select
        placeholder="Select Collection"
        style={{ width: 315, height: 40, lineHeight: 40 }}
        value={collection}
        onChange={onCollectionChange}
      >
        {collectionsList.map(({ text, value }) => (
          <Option value={value}>{text}</Option>
        ))}
      </Select>

      <br />
      <br />
      <Title>source</Title>
      <FlexContainer flexDirection="column" alignItems="start">
        {sourceList.map(sourceName => (
          <StyledCheckbox
            checked={sources?.includes(sourceName)}
            onChange={e => onSourceChange({ checked: e?.target?.checked, value: sourceName })}
          >
            {sourceName}
          </StyledCheckbox>
        ))}
      </FlexContainer>
    </FilterContainer>
  );
};

export default PlaylistTestBoxFilter;
