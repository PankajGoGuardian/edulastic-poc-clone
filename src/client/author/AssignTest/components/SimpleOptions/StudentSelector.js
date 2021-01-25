/* eslint-disable react/prop-types */
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { TreeSelect, Tooltip } from 'antd'
import { keyBy, groupBy, sortBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useEffect } from 'react'
import {
  StyledCol,
  HeaderButtonsWrapper,
  SelectAll,
  UnselectAll,
  SelectTextInline,
  StyledRow,
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
      const groupName = groupKeyed[groupId].name
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

  return (
    <StyledRow gutter={16}>
      <StyledCol span={12}>
        <FieldLabel>STUDENTS</FieldLabel>
      </StyledCol>
      <StyledCol span={12}>
        <Tooltip
          autoAdjustOverflow
          overlayStyle={{ maxWidth: '100%' }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          title={
            !SelectedStudents?.length
              ? 'Select one or more Class/Group Section'
              : ''
          }
        >
          <div>
            <SelectInputStyled
              as={TreeSelect}
              placeholder={
                !SelectedStudents?.length
                  ? 'Select one or more Class/Group Section'
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
                      {selectedValues.length === SelectedStudents.length ? (
                        <SelectAll className="disabled">Select all</SelectAll>
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
      </StyledCol>
    </StyledRow>
  )
}

StudentsSelector.propTypes = {
  students: PropTypes.array.isRequired,
  updateStudents: PropTypes.func.isRequired,
}

export default StudentsSelector
