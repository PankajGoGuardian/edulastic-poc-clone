import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import React from 'react'
import { ItemBody } from '../../../../assessment/containers/QuestionMetadata/styled/ItemBody'
import { triggerParent } from '../ResourcesAlignment'

const Alignments = ({
  selectsData,
  subject,
  curriculum,
  formattedCuriculums,
  grades,
  t,
  setGrades = () => {},
  setSubject = () => {},
  handleChangeStandard = () => {},
  isVerticalView = false,
}) => {
  return (
    <>
      {isVerticalView && (
        <ItemBody data-cy="gradeItem">
          <FieldLabel>{t('component.options.grade')}</FieldLabel>
          <SelectInputStyled
            data-cy="gradeSelect"
            mode="multiple"
            showSearch
            value={grades}
            onChange={setGrades}
            getPopupContainer={triggerParent}
          >
            {selectsData.allGrades.map(({ text, value }) => (
              <Select.Option key={text} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </ItemBody>
      )}
      <ItemBody data-cy="subjectItem">
        <FieldLabel>{t('component.options.subject')}</FieldLabel>
        <SelectInputStyled
          getPopupContainer={triggerParent}
          data-cy="subjectSelect"
          value={subject}
          onChange={setSubject}
        >
          {selectsData.allSubjects.map(({ text, value }) =>
            value ? (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ) : (
              ''
            )
          )}
        </SelectInputStyled>
      </ItemBody>
      <ItemBody data-cy="standardItem">
        <FieldLabel>{t('component.options.standardSet')}</FieldLabel>
        <SelectInputStyled
          data-cy="standardSetSelect"
          showSearch
          filterOption
          value={curriculum}
          onChange={handleChangeStandard}
          getPopupContainer={triggerParent}
        >
          {formattedCuriculums.map(({ value, text, disabled }) => (
            <Select.Option key={value} value={text} disabled={disabled}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </ItemBody>
      {!isVerticalView && (
        <ItemBody data-cy="gradeItem">
          <FieldLabel>{t('component.options.grade')}</FieldLabel>
          <SelectInputStyled
            data-cy="gradeSelect"
            mode="multiple"
            showSearch
            value={grades}
            onChange={setGrades}
            getPopupContainer={triggerParent}
          >
            {selectsData.allGrades.map(({ text, value }) => (
              <Select.Option key={text} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </ItemBody>
      )}
    </>
  )
}

export default Alignments
