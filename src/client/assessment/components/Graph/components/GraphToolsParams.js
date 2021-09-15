import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Radio } from 'antd'
import unset from 'lodash/unset'
import { withNamespaces } from '@edulastic/localization'

import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { InnerTitle } from '../../../styled/InnerTitle'
import { RadioLabel } from '../../../styled/RadioWithLabel'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { Label } from '../../../styled/WidgetOptions/Label'
import QuestionTextArea from '../../QuestionTextArea'
import { WidgetFRInput } from '../../../styled/Widget'

class GraphToolsParams extends Component {
  getDrawingPromptOptions = () => {
    const { t } = this.props
    return [
      { value: 'byObjects', label: t('component.graphing.withObjects') },
      { value: 'byTools', label: t('component.graphing.withDrawingTools') },
    ]
  }

  handleSelectDrawingPrompt = (e) => {
    const { toolbar, setToolbar } = this.props
    const {
      target: { value },
    } = e

    if (value === 'byTools') {
      unset(toolbar, 'includeDashed')
    }

    setToolbar({
      ...toolbar,
      drawingPrompt: value,
    })
  }

  changeLabel = (id) => (value) => {
    const { changeLabel } = this.props
    changeLabel(id, value)
  }

  changeToolbarOption = (prop) => (e) => {
    const { toolbar, setToolbar } = this.props
    setToolbar({
      ...toolbar,
      [prop]: e.target.checked,
    })
  }

  render() {
    const {
      t,
      toolbar: { drawingPrompt, drawingObjects, includeDashed },
    } = this.props

    return (
      <>
        <Row>
          <InnerTitle innerText={t('component.graphing.drawingprompt')} />
          <Radio.Group
            value={drawingPrompt}
            onChange={this.handleSelectDrawingPrompt}
            data-cy="drawingPrompt"
          >
            {this.getDrawingPromptOptions().map(({ value, label }) => (
              <Col md={12} marginBottom="0px" key={value}>
                <RadioLabel width="100%" mb="10px" value={value}>
                  {label}
                </RadioLabel>
              </Col>
            ))}
          </Radio.Group>
        </Row>
        {drawingPrompt == 'byObjects' && drawingObjects && (
          <Row gutter={24}>
            <Col md={12}>
              {drawingObjects.map((obj, i) => (
                <Row key={i} center>
                  <Col md={24}>
                    <Label>
                      {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: obj.pointLabels
                            ? obj.pointLabels
                                .map((point) => point.label)
                                .join('')
                            : '',
                        }}
                      />
                    </Label>
                    <WidgetFRInput>
                      <QuestionTextArea
                        toolbarId={obj.id}
                        toolbarSize="SM"
                        border="border"
                        // placeholder="Enter label text"
                        onChange={this.changeLabel(obj.id)}
                        value={typeof obj.label === 'boolean' ? '' : obj.label}
                      />
                    </WidgetFRInput>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col md={12}>
              <Row>
                <Col md={24}>
                  <CheckboxLabel
                    name="includeDashed"
                    onChange={this.changeToolbarOption('includeDashed')}
                    checked={includeDashed}
                  >
                    {t('component.graphing.includeDashed')}
                  </CheckboxLabel>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </>
    )
  }
}

GraphToolsParams.propTypes = {
  t: PropTypes.func.isRequired,
  toolbar: PropTypes.object,
  setToolbar: PropTypes.func.isRequired,
}

GraphToolsParams.defaultProps = {
  toolbar: {
    defaultTool: '',
    tools: [],
    drawingPrompt: 'byTools',
  },
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(GraphToolsParams)
