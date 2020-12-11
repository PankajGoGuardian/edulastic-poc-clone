import React from 'react'
import Col from "antd/es/Col";
import Row from "antd/es/Row";
import PropTypes from 'prop-types'
import ColorPicker from 'rc-color-picker'
import { withTheme } from 'styled-components'
import { compose } from 'redux'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
import { FlexContainer, Paper } from '@edulastic/common'

import { Subtitle } from '../../../styled/Subtitle'

import { IconTrash } from '../styled/IconTrash'

const ColorPikers = ({ onRemove, colors, changeHandler, t, theme, item }) => {
  const getAlpha = (color) => {
    const regexValuesFromRgbaColor = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/

    return color.match(regexValuesFromRgbaColor) !== null
      ? +color.match(regexValuesFromRgbaColor).slice(-1) * 100
      : 100
  }

  return (
    <Row gutter={60}>
      {colors.map((color, i) => (
        <Col key={i} span={8} xs={24}>
          <Paper style={{ marginBottom: 20 }} padding="16px">
            <Subtitle
              id={getFormattedAttrId(
                `${item?.title}-${t(
                  'component.highlightImage.lineColorLabel'
                )}-${i + 1}`
              )}
              padding="0 0 16px 0"
              fontSize={theme.widgets.highlightImage.subtitleFontSize}
              color={theme.widgets.highlightImage.subtitleColor}
            >
              {`${t('component.highlightImage.lineColorLabel')} ${i + 1}`}
            </Subtitle>
            <FlexContainer
              style={{ width: '100%' }}
              justifyContent="space-between"
            >
              <ColorPicker
                animation="slide-up"
                color={color}
                alpha={getAlpha(color)}
                onChange={changeHandler(i)}
              />
              {onRemove && <IconTrash onClick={onRemove(i)} />}
            </FlexContainer>
          </Paper>
        </Col>
      ))}
    </Row>
  )
}

ColorPikers.propTypes = {
  t: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  colors: PropTypes.array.isRequired,
  onRemove: PropTypes.any,
  item: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

ColorPikers.defaultProps = {
  onRemove: undefined,
}

const enhance = compose(withNamespaces('assessment'), withTheme)

export default enhance(ColorPikers)
