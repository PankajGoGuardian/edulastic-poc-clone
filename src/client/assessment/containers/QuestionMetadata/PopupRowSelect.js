import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { Col, Row, Select } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { getFormattedCurriculumsSelector } from '../../../author/src/selectors/dictionaries'
import selectsData from '../../../author/TestPage/components/common/selectsData'
import { ItemBody } from './styled/ItemBody'

const PopupRowSelect = ({
  formattedCuriculums,
  handleChangeStandard,
  handleChangeGrades,
  handleChangeSubject,
  subject,
  standard,
  grades,
  t,
}) => (
  <Row gutter={24}>
    <Col md={8}>
      <ItemBody>
        <FieldLabel>{t('component.options.subject')}</FieldLabel>
        <SelectInputStyled
          data-cy="subject-Select"
          value={subject}
          onChange={handleChangeSubject}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
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
    </Col>
    <Col md={8}>
      <ItemBody>
        <FieldLabel>{t('component.options.standardSet')}</FieldLabel>
        <SelectInputStyled
          data-cy="standardSet-Select"
          showSearch
          filterOption
          value={standard.curriculum}
          onChange={handleChangeStandard}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {formattedCuriculums.map(({ value, text, disabled }) => (
            <Select.Option key={value} value={text} disabled={disabled}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </ItemBody>
    </Col>
    <Col md={8}>
      <ItemBody>
        <FieldLabel>{t('component.options.grade')}</FieldLabel>
        <SelectInputStyled
          showArrow
          data-cy="grade-Select"
          mode="multiple"
          showSearch
          value={grades}
          onChange={handleChangeGrades}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {selectsData.allGrades.map(({ text, value }) => (
            <Select.Option key={text} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </ItemBody>
    </Col>
  </Row>
)

export default connect(
  (state, props) => ({
    formattedCuriculums: getFormattedCurriculumsSelector(state, props),
  }),
  null
)(PopupRowSelect)
