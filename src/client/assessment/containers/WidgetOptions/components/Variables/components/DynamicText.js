import React from 'react'
import styled from 'styled-components'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
import { extraDesktopWidthMax } from '@edulastic/colors'

import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Subtitle } from '../../../../../styled/Subtitle'

const DynamicText = ({ t, item }) => {
  return (
    <>
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.options.dynamicParameters')}`
        )}
      >
        {t('component.options.dynamicParameters')}
      </Subtitle>

      <Row gutter={24}>
        <Col md={24}>
          <Text>{t('component.options.dynamicParametersDescription')}</Text>
        </Col>
      </Row>
    </>
  )
}

export default withNamespaces('assessment')(DynamicText)

const Text = styled.div`
  font-size: ${(props) => props.theme.smallFontSize};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => props.theme.widgetOptions.labelFontSize};
  }
`
