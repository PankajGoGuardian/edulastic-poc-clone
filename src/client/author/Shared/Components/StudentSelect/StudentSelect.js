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

  const studentIcon = student => (
    <span>
      <i className={`fa fa-${student.icon}`} style={{ color: student.color }} /> {student.fakeName}{" "}
    </span>
  );

  const valid = x => x.testActivityId && !x.redirect && x.status != "absent";

  const selected =
    find(students, student => student.studentId === selectedStudent && valid(student)) || students.filter(valid)[0];
  console.log("selected", selected, "selectedStudent", selectedStudent);
  const user = isPresentationMode ? studentIcon(selected) : selected && selected.studentName;

  return (
    <Fragment>
      {students && students.filter(valid).length !== 0 && (
        <FlexContainer justifyContent="flex-end">
          <Container>
            <StyledSelect value={user} onChange={onSortChange}>
              {students.map((student, index) => {
                const testActivityId = student.testActivityId ? student.testActivityId : null;
                const isActive = testActivityId === null;
                return (
                  <Select.Option key={index} value={testActivityId} disabled={isActive}>
                    {isPresentationMode ? studentIcon(student) : student.studentName}
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
