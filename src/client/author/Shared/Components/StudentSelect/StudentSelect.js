import { LegendContainer, Legends } from "@edulastic/common";
import { Select } from "antd";
import { find } from "lodash";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Container, StyledSelect } from "./styled";

const SortBar = ({ handleChange, students, selectedStudent, isPresentationMode }) => {
  const onSortChange = testActivityId => {
    if (testActivityId !== undefined) {
      if (handleChange) {
        const selected = find(students, student => student.testActivityId === testActivityId);
        handleChange(selected.studentId, testActivityId);
      }
    }
  };

  const studentIcon = student => (
    <span>
      <i className={`fa fa-${student.icon}`} style={{ color: student.color }} /> {student.fakeName}{" "}
    </span>
  );

  const valid = x => !!x.testActivityId;

  const selected =
    find(students, student => student.studentId === selectedStudent && valid(student)) || students.filter(valid)[0];
  const user = isPresentationMode ? studentIcon(selected) : selected && selected.testActivityId;
  return (
    <Fragment>
      {students && students.filter(valid).length !== 0 && (
        <LegendContainer>
          <Legends />
          <Container>
            <StyledSelect value={user} onChange={onSortChange}>
              {students.map((student, index) => {
                return (
                  <Select.Option key={index} value={student.testActivityId || null} disabled={!valid(student)}>
                    {isPresentationMode ? studentIcon(student) : student.studentName}
                  </Select.Option>
                );
              })}
            </StyledSelect>
          </Container>
        </LegendContainer>
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
