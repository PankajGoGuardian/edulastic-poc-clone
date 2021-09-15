import React, { Component } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'

import QuillSortableHintsList from '../../../components/QuillSortableHintsList'
import QuestionTextArea from '../../../components/QuestionTextArea'
import { updateVariables } from '../../../utils/variables'

import { Subtitle } from '../../../styled/Subtitle'
import { Widget } from '../../../styled/Widget'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'

class Extras extends Component {
  render() {
    const {
      t,
      item: { transcript },
      item,
      setQuestionData,
      advancedAreOpen,
    } = this.props

    const handleChange = (prop, value) => {
      setQuestionData(
        produce(item, (draft) => {
          draft[prop] = value
          updateVariables(draft)
        })
      )
    }

    return (
      <Widget style={{ display: advancedAreOpen ? 'block' : 'none' }}>
        <Subtitle>{t('component.options.solution')}</Subtitle>

        <Row>
          <Col md={24}>
            <Label>{t('component.video.transcript')}</Label>
            <QuestionTextArea
              value={transcript}
              onChange={(value) => handleChange('transcript', value)}
            />
          </Col>
        </Row>

        <QuillSortableHintsList />
      </Widget>
    )
  }
}

Extras.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    uiStyle: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
}

Extras.defaultProps = {
  advancedAreOpen: false,
}

export default Extras
