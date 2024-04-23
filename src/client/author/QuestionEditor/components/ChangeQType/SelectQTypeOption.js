import React from 'react'
import { Row, Col } from 'antd'
import { IconExclamationMark } from '@edulastic/icons'
import { ChangeQTypeOptions } from '../../constants'
import {
  IconContainer,
  StyledInfoContainer,
  StyledInfoTextContainer,
  StyledQuestionTypeContainer,
} from './styled'

const SelectQTypeOption = ({ onQuestionTypeSelect }) => {
  return (
    <>
      <StyledInfoContainer>
        <Col span={2} style={{ lineHeight: '32px' }}>
          <Row type="flex" align="center">
            <Col>
              <IconExclamationMark
                backgroundColor="#ECAB28"
                foregroundColor="black"
              />
            </Col>
          </Row>
        </Col>
        <Col span={22}>
          <StyledInfoTextContainer>
            Move question, standards, & rubric into a different item type.{' '}
            <br />
            Not all item details will be copied into new item type
          </StyledInfoTextContainer>
        </Col>
      </StyledInfoContainer>
      <Row style={{ padding: '16px' }}>
        {ChangeQTypeOptions.map(({ key, icon, title }) => {
          return (
            <StyledQuestionTypeContainer
              key={key}
              span={12}
              onClick={() => onQuestionTypeSelect(key)}
            >
              <Row type="flex" gutter={16} align="middle">
                <Col span={6}>
                  <IconContainer>{icon}</IconContainer>
                </Col>
                <Col span={18}>
                  <span style={{ fontWeight: '600' }}>{title}</span>
                </Col>
              </Row>
            </StyledQuestionTypeContainer>
          )
        })}
      </Row>
    </>
  )
}

export default SelectQTypeOption
