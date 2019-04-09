import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Select } from "antd";
import { FlexContainer } from "@edulastic/common";
import { Container, StyledSelect } from "./styled";

const SortBar = ({ loadStudentResponses, handleChange, students, selectedStudent }) => {
  const onSortChange = testActivityId => {
    if (testActivityId !== undefined) {
      if (handleChange) {
        const selected = find(students, student => student.testActivityId === testActivityId);
        handleChange(selected.studentId);
      }
      loadStudentResponses({ testActivityId });
    }
  };

  const getDefaultValue = () => {
    if (selectedStudent) {
      const selected = find(students, student => student.studentId === selectedStudent);
      if (selected) {
        return selected.studentName;
      }
    }
    return students[0].studentName;
  };

  return (
    <Fragment>
      {students && students.length !== 0 && (
        <FlexContainer justifyContent="flex-end">
          <Container>
            <StyledSelect defaultValue={getDefaultValue()} onChange={onSortChange}>
              {students.map((student, index) => {
                const testActivityId = student.testActivityId ? student.testActivityId : null;
                const isActive = testActivityId === null;
                return (
                  <Select.Option key={index} value={testActivityId} disabled={isActive}>
                    {student.studentName}
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
  loadStudentResponses: PropTypes.func.isRequired,
  handleChange: PropTypes.func,
  students: PropTypes.array.isRequired,
  selectedStudent: PropTypes.string
};

SortBar.defaultProps = {
  selectedStudent: "",
  handleChange: () => {}
};

export default SortBar;
