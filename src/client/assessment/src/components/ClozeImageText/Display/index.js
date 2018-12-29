import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Input, InputNumber } from 'antd';
import { isUndefined, cloneDeep, flattenDeep } from 'lodash';
import QuestionHeader from '../common/QuestionHeader';
import CheckboxTemplateBoxLayout from './CheckboxResponseBoxLayout';
import MapImage from '../../../assets/map.svg';
import CorrectAnswerBoxLayout from './CorrectAnswerBoxLayout';

/* eslint-disable */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

class ClozeImageTextDisplay extends Component {
  constructor(props) {
    super(props);
    let userAnswers = new Array(props.responseContainers).fill(false);
    userAnswers = props.userSelections;
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
    });
    const possibleResponses = this.getInitialResponses(props.options);

    this.state = {
      userAnswers,
      possibleResponses
    };
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps;
    if (this.state !== undefined) {
      const possibleResponses = this.getInitialResponses(options);
      this.setState({
        possibleResponses,
      });
    }
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

  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  shuffleGroup = (data) => {
    return data.map(arr => {
      arr.options = this.shuffle(arr.options);
      return arr;
    });
  }

  getInitialResponses = (options) => {
    const {
      configureOptions,
      userSelections: userSelectionsProp,
    } = this.props;
    const { duplicatedResponses: isDuplicated } = configureOptions;
    let userSelections = [];
    if (this.state !== undefined) {
      const { userAnswers } = this.state;
      userSelections = userAnswers;
    } else {
      userSelections = userSelectionsProp;
    }

    let possibleResps = [];
    possibleResps = cloneDeep(options);
    userSelections = flattenDeep(userSelections);
    if (!isDuplicated) {
      for (let j = 0; j < userSelections.length; j++) {
        for (let i = 0; i < possibleResps.length; i++) {
          if (possibleResps[i] === userSelections[j]) {
            possibleResps.splice(i, 1);
            break;
          }
        }
      }
    }
    return possibleResps;
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
      question,
      configureOptions,
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
    const responses = this.shuffle(options);

    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, wordwrap, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
      whiteSpace: wordwrap ? 'inherit' : 'nowrap'
    }

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
              let btnStyle = {
                widthpx: responseContainer.width,
                width: responseContainer.width,
                top: responseContainer.top,
                left: responseContainer.left,
                height: responseContainer.height,
                border: showDashedBorder ? 'dashed 2px rgba(0, 0, 0, 0.65)' : 'solid 1px lightgray',
                position: 'absolute',
                background: backgroundColor,
                borderRadius: 5,
              }
              if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
                const { widthpx } = responsecontainerindividuals[dropTargetIndex];
                btnStyle.width = widthpx;
                btnStyle.widthpx = widthpx;
              }
              if (btnStyle && btnStyle.width === 0) {
                btnStyle['width'] = responseBtnStyle.widthpx;
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
              let inputStyle = {
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
                  className={'imagelabeldragdrop-droppable active'}
                >
                  <span className="index-box">{indexStr}</span>
                  {
                    (isUndefined(btnStyle.inputtype) || btnStyle.inputtype === 'text') &&
                    <Input
                      defaultValue={userAnswers[dropTargetIndex]}
                      key={`input_${dropTargetIndex}`}
                      style={inputStyle}
                      placeholder={btnStyle.placeholder}
                      onChange={e => this.selectChange(e.target.value, dropTargetIndex)}
                    />
                  }
                  {
                    !(isUndefined(btnStyle.inputtype) || btnStyle.inputtype === 'text') &&
                    <InputNumber
                      defaultValue={userAnswers[dropTargetIndex]}
                      key={`inputnumber_${dropTargetIndex}`}
                      style={inputStyle}
                      placeholder={btnStyle.placeholder}
                      onChange={e => this.selectChange(e, dropTargetIndex)}
                    />
                  }
                </div>
              );
            })
          }
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    )

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
    )
    console.log('Validation:' , validation);
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
      <StyledDisplayContainer fontSize={fontSize}>
        <QuestionHeader dangerouslySetInnerHTML={{ __html: question }}/>
        <TemplateBoxContainer>
          <TemplateBoxLayoutContainer>
            {templateBoxLayout}
          </TemplateBoxLayoutContainer>
        </TemplateBoxContainer>
        {answerBox}
      </StyledDisplayContainer>
    );
  }
}

ClozeImageTextDisplay.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  userSelections: PropTypes.array,
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  configureOptions: PropTypes.object,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string.isRequired,
  uiStyle: PropTypes.object.isRequired,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
};

ClozeImageTextDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  preview: true,
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
  maxRespCount: 1,
  configureOptions: {
    showDraghandle: false,
    duplicatedResponses: false,
    shuffleOptions: false,
    transparentResponses: false,
  },
  uiStyle: {
    fontsize: 'normal',
    stemnumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  // item: {}
};

export default ClozeImageTextDisplay;

const StyledPreviewTemplateBox = styled.div.attrs({
  className: props => `imagedropdown_template_box`
})`
  fontSize: ${props => props.fontSize}px;
`;

const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${props => props.width + 'px'};
  height: 100%;
  min-width: 600px;
  max-width: 100%;
  margin: auto;
`;

const StyledPreviewImage = styled.img`
  width: 100%;
  height: ${props => 'auto'};
  user-select: none;
  pointer-events: none;
  object-fit: contain;
`;

const StyledDisplayContainer = styled.div`
  font-size: ${props => props.fontSize}px;
  width: 100%;
  height: 100%;
`;

const TemplateBoxContainer = styled.div`
  display: flex;
  height: 100%;
  margin: 0px;
`;

const TemplateBoxLayoutContainer = styled.div`
  flex: 1;
  margin: 15px 0px;
  border-radius: 10px;
`;
