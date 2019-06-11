import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Select } from "antd";
import { FlexContainer } from "@edulastic/common";
import { Container, StyledSelect } from "./styled";

const SortBar = ({ handleChange, students, selectedStudent, isPresentationMode }) => {
  const onSortChange = testActivityId => {
    if (testActivityId !== undefined) {
      if (handleChange) {
        const selected = find(students, student => student.testActivityId === testActivityId);
        handleChange(selected.studentId);
      }
    }
  };

  const getDefaultValue = () => {
    if (selectedStudent) {
      const selected = find(students, student => student.studentId === selectedStudent);
      if (selected) {
        return isPresentationMode ? selected.fakeName : selected.studentName;
      }
    }
    return isPresentationMode ? students[0].fakeName : students[0].studentName;
  };

  const defaultUser = getDefaultValue();

  const selected = find(students, student => student.studentId === selectedStudent) || students[0];
  const user = isPresentationMode ? selected.fakeName : selected.studentName;

  return (
    <Fragment>
      {students && students.length !== 0 && (
        <FlexContainer justifyContent="flex-end">
          <Container>
            <StyledSelect value={user} onChange={onSortChange}>
              {students.map((student, index) => {
                const testActivityId = student.testActivityId ? student.testActivityId : null;
                const isActive = testActivityId === null;
                return (
                  <Select.Option key={index} value={testActivityId} disabled={isActive}>
                    {isPresentationMode ? student.fakeName : student.studentName}
                  </Select.Option>
                );
              })}
            </StyledSelect>
          </Container>
        </FlexContainer>
      )}
    </Fragment>
  );
};

SortBar.propTypes = {
  handleChange: PropTypes.func,
  students: PropTypes.array.isRequired,
  selectedStudent: PropTypes.string,
  isPresentationMode: PropTypes.bool
};

SortBar.defaultProps = {
  selectedStudent: "",
  handleChange: () => {},
  isPresentationMode: false
};

export default SortBar;
