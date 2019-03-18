import React from "react";
import { Select } from "antd";
import { FlexContainer } from "@edulastic/common";
import { Container, StyledSelect } from "./styled";

const ClassSelect = ({ classname, selected, handleChange }) => {
  if (classname.length === 0) {
    return null;
  }
  const selectedValue = selected < classname.length ? selected : 0;
  return (
    <FlexContainer>
      <Container>
        <StyledSelect value={selectedValue} style={{ width: 120 }} onChange={handleChange}>
          {classname.map(({ name }, index) => (
            <Select.Option value={index}>{name}</Select.Option>
          ))}
        </StyledSelect>
      </Container>
    </FlexContainer>
  );
};

export default ClassSelect;
