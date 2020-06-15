/* eslint-disable react/prop-types */
import { FieldLabel, SelectInputStyled } from "@edulastic/common";
import { TreeSelect } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { SelectStudentColumn, HeaderButtonsWrapper, SelectAll, UnselectAll } from "./styled";

const StudentsSelector = ({
  students = [],
  updateStudents,
  selectAllStudents,
  unselectAllStudents,
  handleRemoveStudents
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const SelectedStudents = students
    .filter(({ enrollmentStatus }) => enrollmentStatus > 0)
    .map(({ _id, firstName, lastName, groupId }) => {
      const fullName = `${lastName ? `${lastName}, ` : ""}${firstName ? `${firstName}` : ""}`;
      return {
        title: fullName,
        key: _id,
        value: _id,
        groupId
      };
    });

  const allIds = SelectedStudents.map(({ value }) => value);

  return (
    <React.Fragment>
      <SelectStudentColumn span={12}>
        <FieldLabel>STUDENT</FieldLabel>
        <SelectInputStyled
          as={TreeSelect}
          placeholder="Select a student to assign"
          treeCheckable
          data-cy="selectStudent"
          dropdownStyle={{ maxHeight: "300px" }}
          onChange={ids => setSelectedValues(ids)}
          value={selectedValues}
          maxTagCount={2}
          dropdownClassName="student-dropdown"
          getPopupContainer={triggerNode => triggerNode.parentNode}
          maxTagPlaceholder={omittedValues => `+ ${omittedValues.length} Students ...`}
          onSelect={updateStudents}
          onDeselect={handleRemoveStudents}
          disabled={SelectedStudents.length === 0}
          treeData={[
            {
              title: (
                <HeaderButtonsWrapper>
                  {selectedValues.length === SelectedStudents.length ? (
                    <SelectAll className="disabled">Select all</SelectAll>
                  ) : (
                    <SelectAll
                      onClick={() => {
                        setSelectedValues(allIds);
                        selectAllStudents(SelectedStudents, selectedValues);
                      }}
                    >
                      Select all
                    </SelectAll>
                  )}
                  {selectedValues.length === 0 ? (
                    <UnselectAll className="disabled">Unselect all</UnselectAll>
                  ) : (
                    <UnselectAll
                      onClick={() => {
                        setSelectedValues([]);
                        unselectAllStudents(SelectedStudents, selectedValues);
                      }}
                    >
                      Unselect all
                    </UnselectAll>
                  )}
                </HeaderButtonsWrapper>
              ),
              value: "all",
              disableCheckbox: true,
              disabled: true
            },
            ...SelectedStudents
          ]}
        />
      </SelectStudentColumn>
    </React.Fragment>
  );
};

StudentsSelector.propTypes = {
  students: PropTypes.array.isRequired,
  updateStudents: PropTypes.func.isRequired,
  studentNames: PropTypes.array
};

StudentsSelector.defaultProps = {
  studentNames: []
};

export default StudentsSelector;
