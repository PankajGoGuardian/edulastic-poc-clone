import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu, Select } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
import ResourceItem from "../ResourceItem";
import SELECT_DATA from "../../../TestPage/components/common/selectsData";
import {
  ManageContentContainer,
  SearchByNavigationBar,
  SearchByTab,
  SearchBar,
  FilterBtn,
  ActionsContainer,
  ManageModuleBtn,
  ResourceDataList,
  FilterContainer,
  Title,
  StyledCheckbox
} from "./styled";

// Static resources data
const resourceData = [
  {
    type: "video",
    title: "Recognize Transformations with Parall"
  },
  {
    type: "tests",
    title: "Identifying Exponential …"
  },
  {
    type: "lessons",
    title: "Triangles and Angle Properties"
  },
  {
    type: "video",
    title: "Operations with Scientific Notation"
  },
  {
    type: "tests",
    title: "Triangles and Angle Properties"
  },
  {
    type: "lessons",
    title: "QUIZ - Identifying Exponential Expressions"
  }
];

const resourceTabs = ["all", "tests", "video", "lessons"];

const ManageContentBlock = () => {
  const { Option } = Select;
  const { allGrades, allSubjects } = SELECT_DATA;

  const [searchBy, setSearchBy] = useState("keywords");
  const [searchResourceBy, setSearchResourceBy] = useState("all");
  const [isShowFilter, setShowFilter] = useState(false);

  const onChange = () => {};

  const menu = (
    <Menu onClick={onchange}>
      <Menu.Item key="1">Website URL</Menu.Item>
      <Menu.Item key="2">Youtube</Menu.Item>
      <Menu.Item key="3">External LTI Resource</Menu.Item>
    </Menu>
  );

  const filteredData =
    searchResourceBy === "all" ? resourceData : resourceData.filter(x => x?.type === searchResourceBy) || [];

  return (
    <ManageContentContainer>
      <SearchByNavigationBar>
        <SearchByTab onClick={() => setSearchBy("keywords")} isTabActive={searchBy === "keywords"}>
          keywords
        </SearchByTab>
        <SearchByTab onClick={() => setSearchBy("standards")} isTabActive={searchBy === "standards"}>
          standards
        </SearchByTab>
      </SearchByNavigationBar>
      <FlexContainer>
        <SearchBar placeholder={`Search by ${searchBy}`} onChange={onchange} />
        <FilterBtn onClick={() => setShowFilter(x => !x)} isActive={isShowFilter}>
          <IconFilter color={isShowFilter ? white : themeColor} width={20} height={20} />
        </FilterBtn>
      </FlexContainer>
      <br />
      {isShowFilter ? (
        <FilterContainer>
          <Title>grade</Title>
          <Select
            mode="multiple"
            style={{ width: 315, minHeight: "40px", lineHeight: 40 }}
            placeholder="Select Grades"
            defaultValue={[]}
            onChange={onchange}
          >
            {allGrades?.map(({ text, value }) => <Option key={value}>{text}</Option>)}
          </Select>

          <br />
          <Title>subject</Title>
          <Select placeholder="Select a Subject" style={{ width: 315, height: 40, lineHeight: 40 }} onChange={onchange}>
            {allSubjects.map(({ text, value }) => (
              <Option value={value}>{text}</Option>
            ))}
          </Select>

          <br />
          <br />
          <Title>source</Title>
          <FlexContainer flexDirection="column" alignItems="start">
            <StyledCheckbox onChange={onChange}>Everything</StyledCheckbox>
            <StyledCheckbox onChange={onChange}>LearnZillion</StyledCheckbox>
            <StyledCheckbox onChange={onChange}>Khan Academy</StyledCheckbox>
            <StyledCheckbox onChange={onChange}>CK12</StyledCheckbox>
            <StyledCheckbox onChange={onChange}>GRADE</StyledCheckbox>
          </FlexContainer>
        </FilterContainer>
      ) : (
        <>
          <SearchByNavigationBar justify="space-evenly">
            {resourceTabs.map(tab => (
              <SearchByTab onClick={() => setSearchResourceBy(tab)} isTabActive={searchResourceBy === tab}>
                {tab}
              </SearchByTab>
            ))}
          </SearchByNavigationBar>
          <br />
          <ResourceDataList>
            {filteredData.map(resource => (
              <ResourceItem {...resource} />
            ))}
          </ResourceDataList>
        </>
      )}

      <ActionsContainer>
        <Dropdown overlay={menu} placement="topCenter">
          <ManageModuleBtn width="190px">
            Add Resource
            <i class="fa fa-chevron-down" aria-hidden="true" />
          </ManageModuleBtn>
        </Dropdown>

        <ManageModuleBtn>manage modules</ManageModuleBtn>
      </ActionsContainer>
    </ManageContentContainer>
  );
};

export default ManageContentBlock;
