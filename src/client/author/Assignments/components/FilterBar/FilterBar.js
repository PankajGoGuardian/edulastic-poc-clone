import React, { useState } from "react";
import { Dropdown, Select } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";

import { FlexContainer } from "@edulastic/common";
import selectsData from "../../../../author/TestPage/components/common/selectsData";
import { receiveAssignmentsAction } from "../../../src/actions/assignments";
import FilterIcon from "../../assets/filter.svg";
import {
  Container,
  FilterImg,
  MainContainer,
  StyledBoldText,
  StyledParagraph,
  ModalContent,
  StyledModal,
  HeaderContent,
  FilterHeader,
  StyledCloseIcon,
  FilterCheckbox,
  FilterCheckboxWrapper,
  FilterButtonWrapper
} from "./styled";

const { allGrades, allSubjects } = selectsData;
const filterState = {
  grades: [],
  subject: "",
  termId: ""
};

const FilterBar = ({ windowWidth, windowHeight, loadAssignments, termsData }) => {
  const [modalshow, toggleModal] = useState(false);
  const [popoverVisible, togglePopover] = useState(false);
  const handleChange = key => value => {
    filterState[key] = value;
    const filters = { filters: filterState };
    loadAssignments(filters);
  };
  const FilterElement = (
    <MainContainer>
      <FilterButtonWrapper>
        <Container active={popoverVisible}>
          <FilterImg src={FilterIcon} /> Filter
        </Container>
      </FilterButtonWrapper>
      <StyledBoldText>Grade</StyledBoldText>
      <Select mode="multiple" style={{ width: "100%" }} placeholder="All grades" onChange={handleChange("grades")}>
        {allGrades.map(
          ({ value, text, isContentGrade }) =>
            !isContentGrade && (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            )
        )}
      </Select>
      ,
      <FilterCheckboxWrapper>
        <StyledParagraph>
          <FilterCheckbox>All</FilterCheckbox>
        </StyledParagraph>
        <StyledParagraph>
          <FilterCheckbox>Lorem</FilterCheckbox>
        </StyledParagraph>
        <StyledParagraph>
          <FilterCheckbox>Lorem</FilterCheckbox>
        </StyledParagraph>
      </FilterCheckboxWrapper>
      <StyledBoldText>Subject</StyledBoldText>
      <Select mode="default" style={{ width: "100%" }} placeholder="All subjects" onChange={handleChange("subject")}>
        {allSubjects.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </Select>
      <StyledBoldText>Year</StyledBoldText>
      <Select mode="default" style={{ width: "100%" }} placeholder="All years" onChange={handleChange("termId")}>
        <Select.Option key="all" value="">
          {"All years"}
        </Select.Option>
        {termsData.map(({ _id, name }) => (
          <Select.Option key={_id} value={_id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </MainContainer>
  );

  return (
    <FlexContainer>
      <Dropdown
        overlay={FilterElement}
        placement="bottomRight"
        trigger={["click"]}
        visible={popoverVisible}
        onVisibleChange={() => togglePopover(!popoverVisible)}
      >
        <Container active={popoverVisible}>
          <FilterImg src={FilterIcon} /> Filter
        </Container>
      </Dropdown>
      <ModalContent>
        <Container active={modalshow} onClick={() => toggleModal(true)}>
          <FilterImg src={FilterIcon} /> Filter
        </Container>
        <StyledModal
          footer={false}
          closable={false}
          visible={modalshow}
          bodyStyle={{ height: windowHeight, width: windowWidth }}
        >
          <HeaderContent>
            <FilterHeader>Filters</FilterHeader>
            <StyledCloseIcon onClick={() => toggleModal(false)} type="close" />
          </HeaderContent>
          {FilterElement}
        </StyledModal>
      </ModalContent>
    </FlexContainer>
  );
};

export default connect(
  state => ({
    termsData: get(state, "user.user.orgData.terms", [])
  }),
  {
    loadAssignments: receiveAssignmentsAction
  }
)(FilterBar);
