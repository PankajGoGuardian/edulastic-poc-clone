import React from 'react'
import { withNamespaces } from '@edulastic/localization'

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
        <Label>{t('component.options.variableType')}</Label>
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
