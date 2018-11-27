import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';
import { isEmpty, isUndefined, cloneDeep } from 'lodash';

import QuestionHeader from '../common/QuestionHeader';
import CheckboxTemplateBoxLayout from './CheckboxResponseBoxLayout';
import CorrectAnswerBoxLayout from './CorrectAnswerBoxLayout';

const defaultTemplateMarkup = '<p>"It\'s all clear" he</p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p><br/> Have you the </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> and the bags ? <br/>  Great Scott!!! Jump, archie, jump, and I\'ll swing for it</p>';

class ClozeTextDisplay extends Component {
  constructor(props) {
    super(props);
    const { templateParts, respLength } = this.getTemplateParts(props);
    let userAnswers = new Array(respLength).fill(false);
    userAnswers = props.userSelections;
    props.userSelections.forEach((userSelection, index) => {
      userAnswers[index] = userSelection;
    });

    this.state = {
      templateParts,
      userAnswers,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      const { templateParts } = this.getTemplateParts(nextProps);
      this.setState({
        templateParts,
      });
    }
  }

  getTemplateParts = (props) => {
    const { templateMarkUp, smallSize } = props;
    let templateMarkUpStr = templateMarkUp;
    if (isEmpty(templateMarkUpStr) || isUndefined(templateMarkUpStr)) {
      templateMarkUpStr = defaultTemplateMarkup;
    }
    templateMarkUpStr = !smallSize ? templateMarkUpStr.replace('<br/>', '') : templateMarkUpStr;
    const templateParts = templateMarkUpStr.match(/<p.*?<\/p>/g);
    const responseParts = templateMarkUpStr.match(/<p class="response-btn.*?<\/p>/g);
    const respLength = responseParts !== null ? responseParts.length : 0;
    return { templateParts, respLength };
  }

  selectChange = (value, index) => {
    const { userAnswers: newAnswers } = this.state;
    const {
      onChange: changeAnswers,
    } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
    changeAnswers(newAnswers);
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
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation
    } = this.props;
    const { templateParts, userAnswers } = this.state;
    let responseIndex = 0;
    const responses = cloneDeep(options);

    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, placeholder, inputtype, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : '100px',
      heightpx: heightpx !== 0 ? heightpx : '35px',
    };

    let maxLineHeight = smallSize ? 50 : 40;

    const previewTemplateBoxLayout = (
      <div className={`template_box ${smallSize ? 'text-small' : ''}`} style={{ fontSize: smallSize ? 14 : fontSize, padding: smallSize ? 0 : 20 }}>
        {templateParts.map((templatePart, index) => {
          if (templatePart.indexOf('class="response-btn"') !== -1) {
            const dropTargetIndex = responseIndex;
            responseIndex++;
            const btnStyle = {
              width: 0,
              height: 0,
              widthpx: 0,
              heightpx: 0,
              placeholder,
              inputtype,
            };
            if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
              const {
                widthpx: widthpx1,
                heightpx: heightpx1,
                placeholder: placeholder1,
                inputtype: inputtype1,
              } = responsecontainerindividuals[dropTargetIndex];
              btnStyle.width = widthpx1;
              btnStyle.height = heightpx1;
              btnStyle.widthpx = widthpx1;
              btnStyle.heightpx = heightpx1;
              btnStyle.placeholder = placeholder1;
              btnStyle.inputtype = inputtype1;
            }
            if (btnStyle && btnStyle.width === 0) {
              btnStyle.width = responseBtnStyle.widthpx;
            } else {
              btnStyle.width = btnStyle.widthpx;
            }
            if (btnStyle && btnStyle.height === 0) {
              btnStyle.height = responseBtnStyle.heightpx;
            } else {
              btnStyle.height = btnStyle.heightpx;
            }
            if (btnStyle && btnStyle.placeholder === undefined) {
              btnStyle.placeholder = responseBtnStyle.placeholder;
            } else {
              btnStyle.placeholder = btnStyle.placeholder;
            }
            if (btnStyle && btnStyle.inputtype === undefined) {
              btnStyle.inputtype = responseBtnStyle.inputtype;
            } else {
              btnStyle.inputtype = btnStyle.inputtype;
            }
            maxLineHeight = maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight;
            if (isUndefined(btnStyle.inputtype) || btnStyle.inputtype === 'text') {
              return (
                <Input
                  defaultValue={responses[dropTargetIndex]}
                  key={`input_${dropTargetIndex}`}
                  style={btnStyle}
                  placeholder={btnStyle.placeholder}
                  onChange={e => this.selectChange(e.target.value, dropTargetIndex)}
                />
              );
            }
            return (
              <InputNumber
                defaultValue={responses[dropTargetIndex]}
                key={`inputnumber${dropTargetIndex}`}
                style={btnStyle}
                onChange={e => this.selectChange(e, dropTargetIndex)}
              />
            );
          }
          return (
            <span style={{ userSelect: 'none', lineHeight: `${maxLineHeight}px` }} key={index} dangerouslySetInnerHTML={{ __html: templatePart }} />
          );
        })}
      </div>
    );

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
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (<div />);
    const answerBox = showAnswer ? correctAnswerBoxLayout : (<div />);
    return (
      <div style={{ fontSize }}>
        <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
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

ClozeTextDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.object,
  uiStyle: PropTypes.object,
};

ClozeTextDisplay.defaultProps = {
  options: {},
  onChange: () => {},
  showAnswer: false,
  evaluation: {},
  checkAnswer: false,
  userSelections: [],
  smallSize: false,
  validation: {},
  uiStyle: {
    fontsize: 'normal',
    stemnumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    placeholder: null,
    inputtype: 'text',
    responsecontainerindividuals: []
  }
};

export default ClozeTextDisplay;
