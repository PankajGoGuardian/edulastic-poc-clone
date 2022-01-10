import React from 'react'
import styled from 'styled-components'
import { Popover } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { IconCharInfo } from '@edulastic/icons'

import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../../styled/WidgetOptions/Label'

const VariablesHeader = ({ t }) => {
  return (
    <Row gutter={4}>
      <Col md={2}>
        <Label>{t('component.options.variable')}</Label>
      </Col>
      <Col md={5}>
        <Label>
          <Wrapper>
            {t('component.options.variableType')}
            <Popover
              content={
                <ContentWrapper>
                  {t('component.helperText.variableType')}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://edulastic.com/help-center/specific-answer-formats-for-dynamic-parameter-questions-604"
                  >
                    <span> Read more</span>
                  </a>
                </ContentWrapper>
              }
              placement="topLeft"
              zIndex={1500}
            >
              <InfoIcon />
            </Popover>
          </Wrapper>
        </Label>
      </Col>
      <Col md={3}>
        <Label>{t('component.options.variableMin')}</Label>
      </Col>
      <Col md={3}>
        <Label>{t('component.options.variableMax')}</Label>
      </Col>
      <Col md={3}>
        <Label>{t('component.options.variableStep')}</Label>
      </Col>
      <Col md={3}>
        <Label>{t('component.options.variableDecimalPlaces')}</Label>
      </Col>
      <Col md={5}>
        <Label>{t('component.options.variableExample')}</Label>
      </Col>
    </Row>
  )
}

export default withNamespaces('assessment')(VariablesHeader)

const Wrapper = styled.span`
  position: relative;
`

const ContentWrapper = styled.div`
  max-width: 320px;
`

const InfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: absolute;
  top: -4px;
  right: -16px;
  cursor: pointer;
`
