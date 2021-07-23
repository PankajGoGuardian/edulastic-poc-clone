import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Display from './Display'
import { EDIT } from '../../constants/constantsForQuestions'

class CorrectAnswer extends Component {
  static propTypes = {
    setQuestionData: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    maxRespCount: PropTypes.number.isRequired,
    configureOptions: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired,
    imageUrl: PropTypes.string.isRequired,
    responses: PropTypes.array.isRequired,
    showDashedBorder: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    imageAlterText: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    item: PropTypes.object,
    imageOptions: PropTypes.object,
    imageHeight: PropTypes.number,
  }

  static defaultProps = {
    imageOptions: {},
    item: {},
    imageHeight: 490,
  }

  handleMultiSelect = (answers) => {
    const { onUpdateValidationValue } = this.props
    // replace the empty values in the value with null
    answers = Array.from(answers, (answer) => answer || null)
    onUpdateValidationValue(answers)
  }

  render() {
    const {
      t,
      options,
      stimulus,
      response,
      imageUrl,
      responses,
      configureOptions,
      imageAlterText,
      imageWidth,
      imageHeight,
      uiStyle,
      showDashedBorder,
      backgroundColor,
      maxRespCount,
      imageOptions = {},
      item,
      setQuestionData,
    } = this.props

    return (
      <Display
        preview={false}
        view={EDIT}
        setAnswers
        dragHandler
        options={options}
        uiStyle={uiStyle}
        question={stimulus}
        showDashedBorder={showDashedBorder}
        responseContainers={responses}
        maxRespCount={maxRespCount}
        imageUrl={imageUrl}
        backgroundColor={backgroundColor}
        userSelections={response.value}
        imageAlterText={imageAlterText}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        configureOptions={configureOptions}
        onChange={this.handleMultiSelect}
        imageOptions={imageOptions}
        showBorder={false}
        item={item}
        setQuestionData={setQuestionData}
        getHeading={t}
      />
    )
  }
}

export default withNamespaces('assessment')(CorrectAnswer)
