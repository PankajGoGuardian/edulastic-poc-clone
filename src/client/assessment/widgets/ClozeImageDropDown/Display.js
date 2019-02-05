import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffle } from 'lodash';

import MapImage from '../../assets/map.svg';
import CardMapImage from '../../assets/map-card.svg';

import { QuestionHeader } from '../../styled/QuestionHeader';

import AnswerDropdown from './components/AnswerDropdown/index';
import CorrectAnswerBoxLayout from './components/CorrectAnswerBoxLayout/index';
import CheckboxTemplateBoxLayout from './components/CheckboxTemplateBoxLayout/index';
import { StyledPreviewTemplateBox } from './styled/StyledPreviewTemplateBox';
import { StyledPreviewContainer } from './styled/StyledPreviewContainer';
import { StyledPreviewImage } from './styled/StyledPreviewImage';
import { StyledDisplayContainer } from './styled/StyledDisplayContainer';
import { TemplateBoxContainer } from './styled/TemplateBoxContainer';
import { TemplateBoxLayoutContainer } from './styled/TemplateBoxLayoutContainer';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

class Display extends Component {
  constructor(props) {
    super(props);
    const userAnswers = new Array(props.responseContainers.length).fill(false);
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
    const {
      onChange: changeAnswers
    } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
    changeAnswers(newAnswers);
  }

  shuffle = (arr) => {
    const newArr = arr.map(item =>
      shuffle(item)
    );

    return newArr;
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
  };

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
      evaluation,
      imageUrl,
      responseContainers,
      imageAlterText,
      imageWidth,
      showDashedBorder,
      backgroundColor
    } = this.props;
    const { userAnswers } = this.state;
    const { shuffleOptions } = configureOptions;
    let newOptions;
    if (preview && shuffleOptions) {
      newOptions = this.shuffle(options);
    } else {
      newOptions = options;
    }

    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const {
      heightpx,
      wordwrap,
      responsecontainerindividuals,
      stemnumeration
    } = uiStyle;

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
      whiteSpace: wordwrap ? 'inherit' : 'nowrap'
    };

    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox smallSize={smallSize} fontSize={fontSize}>
        <StyledPreviewContainer smallSize={smallSize} width={imageWidth}>
          <StyledPreviewImage
            src={smallSize ? CardMapImage : (imageUrl || MapImage)}
            smallSize={smallSize}
            alt={imageAlterText}
          />
          {
            !smallSize &&
            responseContainers.map((responseContainer, index) => {
              const dropTargetIndex = index;
              const btnStyle = {
                widthpx: smallSize ? responseContainer.width / 2 : responseContainer.width,
                width: smallSize ? responseContainer.width / 2 : responseContainer.width,
                top: smallSize ? responseContainer.top / 2 : responseContainer.top,
                left: smallSize ? responseContainer.left / 2 : responseContainer.left,
                height: smallSize ? responseContainer.height / 2 : responseContainer.height,
                border: showDashedBorder ? 'dashed 2px rgba(0, 0, 0, 0.65)' : 'solid 1px lightgray',
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
              return (
                <div
                  key={index}
                  style={{
                    ...btnStyle,
                    borderStyle: smallSize ? 'dashed' : 'solid',
                    overflow: 'hidden'
                  }}
                  className="imagelabeldragdrop-droppable active"
                >
                  {
                    !smallSize &&
                    <span className="index-box">{indexStr}</span>
                  }
                  {
                    !smallSize && (
                    <AnswerDropdown
                      style={{ width: '100%', height: '100%' }}
                      options={newOptions[dropTargetIndex].map(op => ({ value: op, label: op }))}
                      onChange={value => this.selectChange(value, dropTargetIndex)}
                      defaultValue={userAnswers[dropTargetIndex]}
                    />
                    )}
                </div>
              );
            })
          }
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
        options={newOptions}
        userSelections={userAnswers}
        evaluation={evaluation}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer
      ? checkboxTemplateBoxLayout
      : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={newOptions}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (<div />);
    const answerBox = showAnswer ? correctAnswerBoxLayout : (<div />);
    return (
      <StyledDisplayContainer fontSize={fontSize} smallSize={smallSize}>
        <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        <TemplateBoxContainer smallSize={smallSize}>
          <TemplateBoxLayoutContainer smallSize={smallSize}>
            {templateBoxLayout}
          </TemplateBoxLayoutContainer>
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
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string,
  uiStyle: PropTypes.object,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number
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
  smallSize: false,
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

export default Display;
