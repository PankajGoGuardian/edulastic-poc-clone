/* eslint-disable react/prop-types */
import {
  FieldLabel,
  SelectInputStyled,
  RadioBtn,
  RadioGrp,
} from '@edulastic/common'
import { TreeSelect, Tooltip } from 'antd'
import { keyBy, groupBy, sortBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useEffect } from 'react'
import {
  HeaderButtonsWrapper,
  SelectAll,
  UnselectAll,
  SelectTextInline,
  StyledRow,
  SelectStudentColumn,
  RadioButtonWrapper,
  Label,
} from './styled'
import { getFormattedName } from '../../../Gradebook/transformers'

const StudentsSelector = ({
  students = [],
  updateStudents,
  selectAllStudents,
  unselectAllStudents,
  handleRemoveStudents,
  groups,
  selectedGroups,
}) => {
  const [selectedValues, setSelectedValues] = useState([])
  const [isSpecificStudents, toggleIsSpecificStudents] = useState(false)
  useEffect(() => {
    if (!selectedGroups?.length && selectedValues.length) {
      setSelectedValues([])
    }
    if (selectedGroups?.length && selectedValues.length) {
      const selectedStudentByClassId = groupBy(
        selectedValues,
        (item) => item.split('_')[0]
      )
      setSelectedValues(
        selectedGroups.flatMap(
          (item) => selectedStudentByClassId[item] || []
        ) || []
      )
    }
  }, [selectedGroups])
  const groupKeyed = useMemo(() => keyBy(groups, '_id'), [groups])
  const studentsGroupedByGroupId = useMemo(() => groupBy(students, 'groupId'), [
    students,
  ])
  const SelectedStudents = Object.keys(studentsGroupedByGroupId).flatMap(
    (groupId) => {
      const groupName = groupKeyed[groupId]?.name
      const studentRows = (studentsGroupedByGroupId[groupId] || []).map(
        ({ _id, firstName, lastName, middleName }) => {
          const fullName = getFormattedName(firstName, middleName, lastName)
          return {
            title: fullName || 'Anonymous',
            key: `${groupId}_${_id}`,
            value: `${groupId}_${_id}`,
            groupId,
          }
        }
      )
      return [
        {
          title: <SelectTextInline>{groupName}</SelectTextInline>,
          disableCheckbox: true,
          disabled: true,
          value: groupName,
        },
        ...sortBy(studentRows, (x) => x.title),
      ]
    }
  )

  const allIds = SelectedStudents.filter((x) => !x.disabled).map(
    ({ value }) => value
  )

  const handleToggleSpecificStudents = (e) => {
    const { value } = e.target
    toggleIsSpecificStudents(value)
    if (!value) unselectAllStudents()
  }

  return (
    <StyledRow gutter={16}>
      <SelectStudentColumn span={10}>
        <FieldLabel>STUDENTS</FieldLabel>
      </SelectStudentColumn>
      <SelectStudentColumn span={14}>
        <StyledRow gutter={16} borderBottom="0px" padding="0px">
          <SelectStudentColumn
            span={24}
            marginBottom={isSpecificStudents ? '10px' : '0px'}
          >
            <RadioGrp
              style={{ display: 'flex' }}
              onChange={handleToggleSpecificStudents}
              value={isSpecificStudents}
            >
              <RadioButtonWrapper>
                <RadioBtn data-cy="radioAllStudents" value={false} />
                <Label>All students in selected classes</Label>
              </RadioButtonWrapper>
              <RadioButtonWrapper style={{ marginLeft: '20px' }}>
                <RadioBtn data-cy="radioSpecificStudents" value />
                <Label>Specific students</Label>
              </RadioButtonWrapper>
            </RadioGrp>
          </SelectStudentColumn>
          {isSpecificStudents && (
            <SelectStudentColumn span={24}>
              <Tooltip
                autoAdjustOverflow
                overlayStyle={{ maxWidth: '100%' }}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                title={
                  !SelectedStudents?.length
                    ? 'Select one or more Class/Group'
                    : ''
                }
              >
                <div>
                  <SelectInputStyled
                    as={TreeSelect}
                    placeholder={
                      !SelectedStudents?.length
                        ? 'Select one or more Class/Group'
                        : 'Select a student to assign'
                    }
                    treeCheckable
                    data-cy="selectStudent"
                    dropdownStyle={{ maxHeight: '300px' }}
                    onChange={(ids) => setSelectedValues(ids)}
                    value={selectedValues}
                    maxTagCount={2}
                    dropdownClassName="student-dropdown"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    maxTagPlaceholder={(omittedValues) =>
                      `+ ${omittedValues.length} Students ...`
                    }
                    onSelect={updateStudents}
                    onDeselect={handleRemoveStudents}
                    treeData={[
                      {
                        title: (
                          <HeaderButtonsWrapper>
                            {selectedValues.length ===
                            SelectedStudents.length ? (
                              <SelectAll className="disabled">
                                Select all
                              </SelectAll>
                            ) : (
                              <SelectAll
                                data-cy="selectAllButton"
                                onClick={() => {
                                  setSelectedValues(allIds)
                                  selectAllStudents()
                                }}
                              >
                                Select all
                              </SelectAll>
                            )}
                            {selectedValues.length === 0 ? (
                              <UnselectAll className="disabled">
                                Unselect all
                              </UnselectAll>
                            ) : (
                              <UnselectAll
                                data-cy="unselectAllButton"
                                onClick={() => {
                                  setSelectedValues([])
                                  unselectAllStudents()
                                }}
                              >
                                Unselect all
                              </UnselectAll>
                            )}
                          </HeaderButtonsWrapper>
                        ),
                        value: 'all',
                        disableCheckbox: true,
                        disabled: true,
                      },
                      ...SelectedStudents,
                    ]}
                  />
                </div>
              </Tooltip>
            </SelectStudentColumn>
          )}
        </StyledRow>
      </SelectStudentColumn>
    </StyledRow>
  )
}

StudentsSelector.propTypes = {
  students: PropTypes.array.isRequired,
  updateStudents: PropTypes.func.isRequired,
}

export default StudentsSelector
