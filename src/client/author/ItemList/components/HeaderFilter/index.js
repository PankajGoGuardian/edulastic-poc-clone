import React from "react";
import { connect } from "react-redux";
import { FiltersWrapper } from "../../../TestList/components/Container/styled";
import { Tag } from "antd";
import { curriculumsByIdSelector } from "../../../src/selectors/dictionaries";

const gradeKeys = { O: "Other", K: "Kindergarten", o: "Other", k: "Kindergarten" };

const HeaderFilter = ({ handleCloseFilter, search, curriculumById }) => {
  const { subject, grades = [], curriculumId } = search;
  const curriculum = curriculumById[curriculumId];

  const handleCloseTag = (e, type, value) => {
    //as curriculum and subject is a single selection just empty the value of those to clear the filter from header or side filer
    e.preventDefault();
    if (type === "curriculumId") {
      handleCloseFilter("curriculumId", "");
    }
    if (type === "grades") {
      handleCloseFilter("grades", grades.filter(grade => grade !== value));
    }
    if (type === "subject") {
      handleCloseFilter("subject", "");
    }
  };
  const reduceCount = !!subject ? (!!curriculum ? 2 : 1) : 0;
  return (
    <FiltersWrapper>
      {!!grades.length &&
        grades
          .filter((_, i) => i < 4 - reduceCount)
          .map(grade => (
            <Tag closable onClose={e => handleCloseTag(e, "grades", grade)}>
              {["O", "K", "o", "k"].includes(grade) ? gradeKeys[grade] : `Grade ${grade}`}
            </Tag>
          ))}
      {!!subject && (
        <Tag closable onClose={e => handleCloseTag(e, "subject")}>
          {subject}
        </Tag>
      )}

      {curriculum?._id && (
        <Tag closable onClose={e => handleCloseTag(e, "curriculumId")}>
          {curriculum.curriculum}
        </Tag>
      )}
    </FiltersWrapper>
  );
};

export default connect(state => ({ curriculumById: curriculumsByIdSelector(state) }))(HeaderFilter);
