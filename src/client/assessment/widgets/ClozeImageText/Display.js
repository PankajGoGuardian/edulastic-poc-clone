import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';
import { isUndefined } from 'lodash';
import { withTheme } from 'styled-components';

import MapImage from '../../assets/map.svg';

import { QuestionHeader } from '../../styled/QuestionHeader';
import CorrectAnswerBoxLayout from '../../components/CorrectAnswerBoxLayout';

import CheckboxTemplateBoxLayout from './components/CheckboxTemplateBoxLayout';
import { StyledPreviewTemplateBox } from './styled/StyledPreviewTemplateBox';
import { StyledPreviewContainer } from './styled/StyledPreviewContainer';
import { StyledPreviewImage } from './styled/StyledPreviewImage';
import { StyledDisplayContainer } from './styled/StyledDisplayContainer';
import { TemplateBoxContainer } from './styled/TemplateBoxContainer';
import { TemplateBoxLayoutContainer } from './styled/TemplateBoxLayoutContainer';
import { getFontSize } from '../../utils/helpers';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

class Display extends Component {
  constructor(props) {
    super(props);
    const userAnswers = new Array(props.responseContainers.length).fill('');
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
      return 0;
    });

    this.state = {
      userAnswers
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      this.setState({
        userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : []
      });
    }
  }

  selectChange = (value, index) => {
    const { userAnswers: newAnswers } = this.state;
    const { onChange: changeAnswers } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
    changeAnswers(newAnswers);
  };

  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  render() {
    const {
      qIndex,
      question,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      imageUrl,
      responseContainers,
      imageAlterText,
      imageWidth,
      showDashedBorder,
      backgroundColor,
      theme
    } = this.props;
    const { userAnswers } = this.state;

    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize);
    const { heightpx, wordwrap, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
      whiteSpace: wordwrap ? 'inherit' : 'nowrap'
    };

    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox fontSize={fontSize}>
        <StyledPreviewContainer width={imageWidth}>
          <StyledPreviewImage
            src={imageUrl || MapImage}
            alt={imageAlterText}
          />
          {
            responseContainers.map((responseContainer, index) => {
              const dropTargetIndex = index;
              const btnStyle = {
                widthpx: responseContainer.width,
                width: responseContainer.width,
                top: responseContainer.top,
                left: responseContainer.left,
                height: responseContainer.height,
                border: showDashedBorder
                  ? `dashed 2px ${theme.widgets.clozeImageText.responseContainerDashedBorderColor}`
                  : `solid 1px ${theme.widgets.clozeImageText.responseContainerSolidBorderColor}`,
                position: 'absolute',
                background: backgroundColor,
                borderRadius: 5
              };
              if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
                const { widthpx } = responsecontainerindividuals[dropTargetIndex];
                btnStyle.width = widthpx;
                btnStyle.widthpx = widthpx;
              }
              if (btnStyle && btnStyle.width === 0) {
                btnStyle.width = responseBtnStyle.widthpx;
              } else {
                btnStyle.width = btnStyle.widthpx;
              }
              let indexStr = '';
              switch (stemnumeration) {
                case 'lowercase': {
                  indexStr = ALPHABET[dropTargetIndex];
                  break;
                }
                case 'uppercase': {
                  indexStr = ALPHABET[dropTargetIndex].toUpperCase();
                  break;
                }
                default:
                  indexStr = dropTargetIndex + 1;
              }
              const inputStyle = {
                borderRadius: 0,
                border: 'none',
                boxShadow: 'none',
                height: '100%'
              };
              return (
                <div
                  key={index}
                  style={{
                    ...btnStyle,
                    borderStyle: 'solid',
                    overflow: 'hidden'
                  }}
                  className="imagelabeldragdrop-droppable active"
                >
                  <span className="index-box">{indexStr}</span>
                  {(isUndefined(btnStyle.inputtype) || btnStyle.inputtype === 'text') && (
                    <Input
                      defaultValue={userAnswers[dropTargetIndex]}
                      key={`input_${dropTargetIndex}`}
                      style={inputStyle}
                      placeholder={btnStyle.placeholder}
                      onChange={e => this.selectChange(e.target.value, dropTargetIndex)}
                    />
                    )}
                  {!(isUndefined(btnStyle.inputtype) || btnStyle.inputtype === 'text') && (
                    <InputNumber
                      defaultValue={userAnswers[dropTargetIndex]}
                      key={`inputnumber_${dropTargetIndex}`}
                      style={inputStyle}
                      placeholder={btnStyle.placeholder}
                      onChange={e => this.selectChange(e, dropTargetIndex)}
                    />
                    )}
                </div>
              );
            })}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        responseContainers={responseContainers}
        responsecontainerindividuals={responsecontainerindividuals}
        responseBtnStyle={responseBtnStyle}
        imageUrl={imageUrl || MapImage}
        imageWidth={imageWidth}
        imageAlterText={imageAlterText}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        showAnswer={showAnswer}
        options={options}
        userSelections={userAnswers}
        evaluation={evaluation}
      />
    );
    console.log('Validation:', validation);
    const templateBoxLayout =
      showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (
      <div />
    );
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;
    return (
      <StyledDisplayContainer fontSize={fontSize}>
        <QuestionHeader qIndex={qIndex} dangerouslySetInnerHTML={{ __html: question }} />
        <TemplateBoxContainer>
          <TemplateBoxLayoutContainer>{templateBoxLayout}</TemplateBoxLayoutContainer>
        </TemplateBoxContainer>
        {answerBox}
      </StyledDisplayContainer>
    );
  }
}

Display.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  userSelections: PropTypes.array,
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string,
  uiStyle: PropTypes.object,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  theme: PropTypes.object.isRequired
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  responseContainers: [],
  showDashedBorder: false,
  backgroundColor: '#0288d1',
  validation: {},
  imageUrl: undefined,
  imageAlterText: '',
  imageWidth: 600,
  uiStyle: {
    fontsize: 'normal',
    stemnumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  }
};

export default withTheme(Display);
