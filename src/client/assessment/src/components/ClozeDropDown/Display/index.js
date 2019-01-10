import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select } from 'antd';
import { isUndefined, mapValues, cloneDeep } from 'lodash';

import QuestionHeader from '../common/QuestionHeader';
import CheckboxTemplateBoxLayout from './CheckboxResponseBoxLayout';
import CorrectAnswerBoxLayout from './CorrectAnswerBoxLayout';

const { Option } = Select;

/* eslint-disable */
const defaultTemplateMarkup = '<p>"It\'s all clear" he</p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p><br/>Have you the </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> and the bags? <br /> Great Scott!!! Jump, archie, jump, and I\'ll swing for it</p>';

class ClozeDropDownDisplay extends Component {
  constructor(props) {
    super(props);
    const { templateParts, respLength } = this.getTemplateParts(props);
    let userAnswers = new Array(respLength).fill(false);
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
    });
    this.state = {
      templateParts,
      userAnswers,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps;
    if (this.state !== undefined) {
      const { templateParts, respLength } = this.getTemplateParts(nextProps);
      this.setState({
        templateParts,
      });
    }
  }

  getTemplateParts = (props) => {
    const { templateMarkUp } = props;
    let templateMarkUpStr = templateMarkUp;
    if (!templateMarkUpStr) {
      templateMarkUpStr = defaultTemplateMarkup;
    }
    const templateParts = templateMarkUpStr.match(/<p.*?<\/p>/g);
    const responseParts = templateMarkUpStr.match(/<p class="response-btn.*?<\/p>/g);
    const respLength = responseParts !== null ? responseParts.length : 0;
    return {templateParts, respLength}; 
  }

  selectChange = (value, index) => {
    console.log('handleResponseSelectChange');
    const { userAnswers: newAnswers } = this.state;
    const {
      onChange: changeAnswers,
    } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
    changeAnswers(newAnswers);
  }

  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  shuffleGroup = (data) => {
    return mapValues(data, (value, key) => {
      if (!isUndefined(value)) {
        const arr = this.shuffle(value);
        data[key] = arr;
      }
      data[key] = value;
      return data[key];
    });
  }

  getFontSize = (size) => {
    switch (size) {
      case 'small':
        return '10px';
      case 'normal':
        return '13px';
      case 'large':
        return '17px';
      case 'xlarge':
        return '20px';
      case 'xxlarge':
        return '24px';
      default:
        return '12px';
    }
  }

  render() {
    const {
      smallSize,
      question,
      configureOptions,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation
    } = this.props;
    const { templateParts, userAnswers } = this.state;
    const { shuffleOptions } = configureOptions;
    let responseIndex = 0;
    let responses = cloneDeep(options);
    if (preview && shuffleOptions) {
        responses = this.shuffleGroup(responses);
    }

    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, placeholder, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
    }

    let maxLineHeight = smallSize ? 50 : 40;

    const previewTemplateBoxLayout = (
      <div className={`template_box ${smallSize ? 'dropdown-small' : ''}`} style={{ fontSize: smallSize ? 14 : fontSize, padding: smallSize ? 0 : 20 }}>
          {templateParts.map((templatePart, index) => {
            if (templatePart.indexOf('class="response-btn"') !== -1) {
              const dropTargetIndex = responseIndex;
              responseIndex++;
              let btnStyle = {
                width: 0,
                height: 0,
                widthpx: 0,
                heightpx: 0,
                placeholder,
              }
              if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
                const { widthpx, heightpx } = responsecontainerindividuals[dropTargetIndex];
                btnStyle.width = widthpx;
                btnStyle.height = heightpx;
                btnStyle.widthpx = widthpx;
                btnStyle.heightpx = heightpx;
                btnStyle.placeholder = placeholder;
              }
              if (btnStyle && btnStyle.width === 0) {
                btnStyle['width'] = responseBtnStyle.widthpx;
              } else {
                btnStyle.width = btnStyle.widthpx;
              }
              if (btnStyle && btnStyle.height === 0) {
                btnStyle['height'] = responseBtnStyle.heightpx;
              } else {
                btnStyle['height'] = btnStyle.heightpx;
              }
              if (btnStyle && btnStyle.placeholder === undefined) {
                btnStyle['placeholder'] = responseBtnStyle.placeholder;
              } else {
                btnStyle['placeholder'] = btnStyle.placeholder;
              }
              maxLineHeight = maxLineHeight < btnStyle['height'] ? btnStyle['height'] : maxLineHeight;
              return (
                <Select defaultValue={userAnswers[dropTargetIndex]} style={btnStyle} onChange={value => this.selectChange(value, dropTargetIndex)}>
                  <Option value="**default_value**" disabled>{placeholder}</Option>
                  {responses && responses[dropTargetIndex] && responses[dropTargetIndex].map((response, respID) => (
                    <Option value={response} key={respID}>{response}</Option>
                  ))}
                </Select>
              );
            }
            return (
              <span style={{ userSelect: 'none', lineHeight: maxLineHeight + 'px' }} key={index} dangerouslySetInnerHTML={{ __html: templatePart }}></span>
            );
          })}
        </div>
    )

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        templateParts={templateParts}
        responsecontainerindividuals={responsecontainerindividuals}
        responseBtnStyle={responseBtnStyle}
        stemNumeration={stemnumeration}
        fontSize={fontSize}
        showAnswer={showAnswer}
        userSelections={userAnswers}
        evaluation={evaluation}
      />
    )
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (<div/>);
    const answerBox = showAnswer ? correctAnswerBoxLayout : (<div/>);
    return (
      <div style={{ fontSize: fontSize }}>
        <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }}/>
        <div>
          <React.Fragment>
            <div style={{ margin: smallSize ? '-10px -20px' : 0, borderRadius: 0 }}>
              {templateBoxLayout}
            </div>
          </React.Fragment>
        </div>
        {answerBox}
      </div>
    );
  }
}

ClozeDropDownDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  templateMarkUp: PropTypes.string,
  question: PropTypes.string.isRequired,
  configureOptions: PropTypes.object,
  validation: PropTypes.object,
  evaluation: PropTypes.object,
  uiStyle: PropTypes.object.isRequired,
};

ClozeDropDownDisplay.defaultProps = {
  options: {},
  onChange: () => {},
  preview: true,
  showAnswer: false,
  evaluation: {},
  checkAnswer: false,
  userSelections: [],
  templateMarkUp: defaultTemplateMarkup,
  smallSize: false,
  validation: {},
  configureOptions: {
    shuffleOptions: false,
  },
  uiStyle: {
    fontsize: 'normal',
    stemnumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    placeholder: null,
    responsecontainerindividuals: []
  }
};

export default ClozeDropDownDisplay;
