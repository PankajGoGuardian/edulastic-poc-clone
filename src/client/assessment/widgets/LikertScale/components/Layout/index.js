import React, { useEffect } from 'react'
import produce from 'immer'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import { Subtitle } from '../../../../styled/Subtitle'
import { SelectInputStyled } from '../../../../styled/InputStyles'
import { Row } from '../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../styled/WidgetOptions/Label'
import Question from '../../../../components/Question'
import { displayOrderOptions, ASC } from '../../constants'

const Layout = ({ t, item, fillSections, cleanSections, setQuestionData }) => {
  const { displayOrder = ASC } = item
  useEffect(() => {}, [])

  const onChangeDisplayOrder = (value) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.displayOrder = value
      })
    )
  }

  return (
    <Question
      section="main"
      label={t('component.likertScale.display')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      {' '}
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.likertScale.display')}`
        )}
      >
        {t('component.likertScale.display')}
      </Subtitle>
      <Row gutter={24}>
        <Col md={6}>
          <Label>{t('component.likertScale.selectDisplayOrder')}</Label>
          <SelectInputStyled
            size="large"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(val) => onChangeDisplayOrder(val)}
            value={displayOrder}
          >
            {Object.keys(displayOrderOptions).map((option) => (
              <Select.Option data-cy={option} key={option} value={option}>
                {displayOrderOptions[option]}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </Row>
    </Question>
  )
}

Layout.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
}

export default Layout
