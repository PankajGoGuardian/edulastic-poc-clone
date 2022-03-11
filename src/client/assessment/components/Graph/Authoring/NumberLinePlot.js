import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import produce from 'immer'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { Select, Col, Row as AntdRow } from 'antd'
import styled from 'styled-components'
import { TextField } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { white } from '@edulastic/colors'
import { Subtitle } from '../../../styled/Subtitle'
import { setQuestionDataAction } from '../../../../author/QuestionEditor/ducks'
import { FRACTION_FORMATS } from '../../../constants/constantsForQuestions'
import QuestionTextArea from '../../QuestionTextArea'
import Question from '../../Question'
import { ColumnLabel, RowLabel } from '../../../styled/Grid'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { SelectInputStyled } from '../../../styled/InputStyles'
import { getFontSize } from '../../../utils/helpers'

class NumberLinePlot extends Component {
  onChangeQuestion = (stimulus) => {
    const { graphData, setQuestionData } = this.props
    setQuestionData({ ...graphData, stimulus })
  }

  resetCorrectAnsers = (graphData) => {
    const newData = produce(graphData, (draft) => {
      if (draft?.validation?.validResponse?.value?.length) {
        draft.validation.validResponse.value.length = []
      }
      if (draft?.validation?.altResponses?.length) {
        draft.validation.altResponses = draft.validation.altResponses.map(
          (altResponse) => {
            if (altResponse?.value?.length) {
              altResponse.value = []
            }
            return altResponse
          }
        )
      }
    })
    return newData
  }

  handleCanvasChange = (event) => {
    const { value, name } = event.target
    const { graphData, setQuestionData } = this.props
    const newGrapData = this.resetCorrectAnsers(graphData)
    const { canvas } = newGrapData

    canvas[name] = +value
    setQuestionData({ ...newGrapData, canvas })
  }

  handleNumberlineCheckboxChange = (name) => () => {
    const { graphData, setQuestionData } = this.props

    const { numberlineAxis } = graphData

    numberlineAxis[name] = !numberlineAxis[name]
    setQuestionData({ ...graphData, numberlineAxis })
  }

  handleNumberlineInputChange = (event) => {
    const { value, name } = event.target
    const { graphData, setQuestionData } = this.props
    const newGrapData = this.resetCorrectAnsers(graphData)
    const { numberlineAxis } = newGrapData

    numberlineAxis[name] = +value
    setQuestionData({ ...newGrapData, numberlineAxis })
  }

  changeFractionsFormat = (value) => {
    const { graphData, setQuestionData } = this.props
    const { numberlineAxis } = graphData

    numberlineAxis.fractionsFormat = value
    setQuestionData({ ...graphData, numberlineAxis })
  }

  getFractionFormatSettings = () => {
    const { t } = this.props
    return [
      {
        label: t('component.options.fractionFormatOptions.decimal'),
        value: FRACTION_FORMATS.decimal,
      },
      {
        label: t('component.options.fractionFormatOptions.fraction'),
        value: FRACTION_FORMATS.fraction,
      },
      {
        label: t('component.options.fractionFormatOptions.mixedFraction'),
        value: FRACTION_FORMATS.mixedFraction,
      },
    ]
  }

  render() {
    const { t, graphData, fillSections, cleanSections } = this.props
    const { canvas, stimulus, firstMount, numberlineAxis } = graphData
    const { fractionsFormat } = numberlineAxis
    return (
      <div>
        <Question
          section="main"
          label="Question"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t(
                'component.graphing.question.composequestion'
              )}`
            )}
          >
            {t('component.graphing.question.composequestion')}
          </Subtitle>

          <QuestionTextArea
            placeholder={t('component.graphing.question.enteryourquestion')}
            onChange={this.onChangeQuestion}
            value={stimulus}
            firstFocus={firstMount}
            border="border"
            fontSize={getFontSize(graphData?.uiStyle?.fontSize)}
          />
        </Question>

        <Question
          section="main"
          label={t('component.graphing.lineplotchart')}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.lineplotchart')}`
            )}
          >
            {t('component.graphing.lineplotchart')}
          </Subtitle>
          <Row gutter={12}>
            <Col md={3} />
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.ticksoptions.minimum')}
              </ColumnLabel>
            </Col>
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.ticksoptions.maximum')}
              </ColumnLabel>
            </Col>
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.ticksoptions.tickdistance')}
              </ColumnLabel>
            </Col>
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.ticksoptions.minorTicks')}
              </ColumnLabel>
            </Col>
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.ticksoptions.showticks')}
              </ColumnLabel>
            </Col>
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.labelsoptions.showmax')}
              </ColumnLabel>
            </Col>
            <Col md={3}>
              <ColumnLabel>
                {t('component.graphing.labelsoptions.showmin')}
              </ColumnLabel>
            </Col>
          </Row>
          <ColoredRow gutter={12}>
            <Col md={3}>
              <RowLabel>X AXIS</RowLabel>
            </Col>
            <Col md={3}>
              <StyledTextField
                type="number"
                name="xMin"
                value={canvas.xMin}
                onChange={this.handleCanvasChange}
                disabled={false}
              />
            </Col>
            <Col md={3}>
              <StyledTextField
                type="number"
                name="xMax"
                value={canvas.xMax}
                onChange={this.handleCanvasChange}
                disabled={false}
              />
            </Col>
            <Col md={3}>
              <StyledTextField
                type="number"
                name="ticksDistance"
                min={0}
                disabled={false}
                value={numberlineAxis.ticksDistance}
                onChange={this.handleNumberlineInputChange}
              />
            </Col>
            <Col md={3}>
              <StyledTextField
                type="number"
                name="minorTicks"
                min={0}
                disabled={false}
                value={numberlineAxis.minorTicks}
                onChange={this.handleNumberlineInputChange}
              />
            </Col>
            <CenteredCol md={3}>
              <CheckboxLabel
                name="showTicks"
                onChange={this.handleNumberlineCheckboxChange('showTicks')}
                checked={numberlineAxis.showTicks}
              />
            </CenteredCol>
            <CenteredCol md={3}>
              <CheckboxLabel
                name="showMax"
                onChange={this.handleNumberlineCheckboxChange('showMax')}
                checked={numberlineAxis.showMax}
              />
            </CenteredCol>
            <CenteredCol md={3}>
              <CheckboxLabel
                name="showMin"
                onChange={this.handleNumberlineCheckboxChange('showMin')}
                checked={numberlineAxis.showMin}
              />
            </CenteredCol>
          </ColoredRow>
          <ColoredRow gutter={12}>
            <Col md={3}>
              <RowLabel textTransform="capitalize" height={30}>
                X-Axis Tick Label
              </RowLabel>
            </Col>
            <Col md={6}>
              <SelectInputStyled
                height="32px"
                onChange={this.changeFractionsFormat}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={fractionsFormat || FRACTION_FORMATS.decimal}
              >
                {this.getFractionFormatSettings().map((option) => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </ColoredRow>
        </Question>
      </div>
    )
  }
}

NumberLinePlot.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)

export default enhance(NumberLinePlot)

const StyledTextField = styled(TextField)`
  padding: 5px 10px;
  width: 100%;
  height: 32px;
  margin-bottom: 0px;
  margin-right: 0px;
`

const CenteredCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32;
`

const Row = styled(AntdRow)`
  margin-bottom: 8px;
  padding: 5px 10px;
`

const ColoredRow = styled(Row)`
  background: ${white};
`
