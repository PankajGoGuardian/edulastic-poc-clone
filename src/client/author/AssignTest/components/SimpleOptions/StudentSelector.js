/* eslint-disable react/prop-types */
import { FieldLabel, SelectInputStyled } from "@edulastic/common";
import { TreeSelect } from "antd";
import { keyBy, groupBy, sortBy } from "lodash";
import PropTypes from "prop-types";
import React, { useState, useMemo } from "react";
import { SelectStudentColumn, HeaderButtonsWrapper, SelectAll, UnselectAll, SelectTextInline } from "./styled";

const StudentsSelector = ({
  students = [],
  updateStudents,
  selectAllStudents,
  unselectAllStudents,
  handleRemoveStudents,
  groups
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const groupKeyed = useMemo(() => keyBy(groups, "_id"), [groups]);
  const studentsGroupedByGroupId = useMemo(
    () => groupBy(students.filter(({ enrollmentStatus }) => enrollmentStatus > 0), "groupId"),
    [students]
  );

  const SelectedStudents = Object.keys(studentsGroupedByGroupId).flatMap(groupId => {
    const groupName = groupKeyed[groupId].name;
    const studentRows = (studentsGroupedByGroupId[groupId] || []).map(
      ({ _id, firstName, lastName, groupId: _groupId }) => {
        const fullName = `${lastName ? `${lastName}, ` : ""}${firstName ? `${firstName}` : ""}`;
        return {
          title: fullName,
          key: _id,
          value: _id,
          groupId: _groupId
        };
      }
    );
    return [
      {
        title: <SelectTextInline>{groupName}</SelectTextInline>,
        disableCheckbox: true,
        disabled: true,
        value: groupName
      },
      ...sortBy(studentRows, x => x.title)
    ];
  });

  const allIds = SelectedStudents.filter(x => !x.disabled).map(({ value }) => value);

  return (
    <React.Fragment>
      <SelectStudentColumn span={12}>
        <FieldLabel>STUDENTS</FieldLabel>
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
  updateStudents: PropTypes.func.isRequired
};

export default StudentsSelector;
