import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from '@edulastic/localization'
import { arrayMove } from 'react-sortable-hoc'
import { cloneDeep, clone } from 'lodash'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'
import { Subtitle } from '../../../styled/Subtitle'
import { setQuestionDataAction } from '../../../../author/QuestionEditor/ducks'
import QuestionTextArea from '../../QuestionTextArea'
import QuillSortableList from '../../QuillSortableList'
import Question from '../../Question'
import { TextInputStyled } from '../../../styled/InputStyles'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'

class GraphAxisLabels extends Component {
  onChangeQuestion = (stimulus) => {
    const { graphData, setQuestionData } = this.props
    setQuestionData({ ...graphData, stimulus })
  }

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { graphData, setQuestionData } = this.props

    setQuestionData({
      ...graphData,
      list: arrayMove(graphData.list, oldIndex, newIndex),
    })
  }

  handleQuestionsChange = (index, value) => {
    const { setQuestionData, graphData } = this.props
    const list = cloneDeep(graphData.list)

    list[index].text = value

    const responses = [
      graphData.validation.validResponse,
      ...graphData.validation.altResponses,
    ]
    responses.forEach((response) => {
      const responseValue = response.value.find(
        (el) => el.id === list[index].id
      )
      if (responseValue) {
        responseValue.point = value
      }
    })

    setQuestionData({ ...graphData, list })
  }

  handleDeleteQuestion = (index) => {
    const { setQuestionData, graphData } = this.props

    const filteredItems = cloneDeep(graphData.list).filter(
      (q, i) => i !== index
    )

    const responses = [
      graphData.validation.validResponse,
      ...graphData.validation.altResponses,
    ]
    responses.forEach((response) => {
      response.value = response.value.filter(
        (el) => el.id !== graphData.list[index].id
      )
    })

    setQuestionData({ ...graphData, list: filteredItems })
  }

  handleAddQuestion = () => {
    const { setQuestionData, graphData } = this.props
    const newItem = cloneDeep(graphData)

    newItem.list = newItem.list.concat({
      text: 'New Option',
      id: `list-item-${Math.random().toString(36).substr(2, 9)}`,
    })

    setQuestionData({ ...graphData, list: newItem.list })
  }

  handleCanvasChange = (event) => {
    const { value, name } = event.target
    const { graphData, setQuestionData } = this.props
    const { canvas } = graphData

    canvas[name] = value
    setQuestionData({ ...graphData, canvas })
  }

  handleCanvasBlur = (event, defaultValue) => {
    const { value, name } = event.target
    const { graphData, setQuestionData } = this.props
    const { canvas } = graphData

    if (!value) {
      canvas[name] = defaultValue
      setQuestionData({ ...graphData, canvas })
    }
  }

  render() {
    const { t, graphData, cleanSections, fillSections, fontSize } = this.props
    const { canvas, stimulus, firstMount } = graphData

    return (
      <div>
        <Question
          section="main"
          label="Compose Question"
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
            fontSize={fontSize}
          />
        </Question>

        <Question
          section="main"
          label="Line"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.graphline')}`
            )}
          >
            {t('component.graphing.graphline')}
          </Subtitle>
          <Row gutter={24}>
            <Col md={12}>
              <Label>Minimum value</Label>
              <TextInputStyled
                type="number"
                value={canvas.xMin}
                name="xMin"
                onChange={this.handleCanvasChange}
                onBlur={(event) => this.handleCanvasBlur(event, 0)}
                step={1}
                disabled={false}
              />
            </Col>
            <Col md={12}>
              <Label>Maximum value</Label>
              <TextInputStyled
                type="number"
                value={canvas.xMax}
                name="xMax"
                onChange={this.handleCanvasChange}
                onBlur={(event) => this.handleCanvasBlur(event, 10)}
                step={1}
                disabled={false}
              />
            </Col>
          </Row>
        </Question>

        <Question
          section="main"
          label="Title"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.title')}`
            )}
          >
            {t('component.graphing.title')}
          </Subtitle>
          <TextInputStyled
            type="text"
            name="title"
            value={canvas.title}
            onChange={this.handleCanvasChange}
          />
        </Question>

        <Question
          section="main"
          label="Possible Responses"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.possibleresponses')}`
            )}
          >
            {t('component.graphing.possibleresponses')}
          </Subtitle>
          <QuillSortableList
            items={graphData.list.map((o) => o.text)}
            onSortEnd={this.onSortOrderListEnd}
            useDragHandle
            onRemove={this.handleDeleteQuestion}
            onChange={this.handleQuestionsChange}
          />
          <CustomStyleBtn
            width="auto"
            onClick={this.handleAddQuestion}
            variant="extendedFab"
            type="button"
          >
            {t('component.graphing.addnewpossibleresponsebtn')}
          </CustomStyleBtn>
        </Question>
      </div>
    )
  }
}

GraphAxisLabels.propTypes = {
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

export default enhance(GraphAxisLabels)
