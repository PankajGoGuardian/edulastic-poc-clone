import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { cloneDeep, flattenDeep } from 'lodash';
import AnswerDropdown from './AnswerDropdown';
import QuestionHeader from '../common/QuestionHeader';
import CheckboxTemplateBoxLayout from './CheckboxResponseBoxLayout';
import MapImage from '../../../assets/map.svg';
import CardMapImage from '../../../assets/map-card.svg';
import CorrectAnswerBoxLayout from './CorrectAnswerBoxLayout';

/* eslint-disable */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

class ClozeImageDropDownDisplay extends Component {
  constructor(props) {
    super(props);
    let userAnswers = new Array(props.responseContainers.length).fill(false);
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
        userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : [],
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
    const { userAnswers, possibleResponses } = this.state;
    const { shuffleOptions } = configureOptions;
    if (preview && shuffleOptions) {
      responses = this.shuffle(possibleResponses);
    }
    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, wordwrap, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
      whiteSpace: wordwrap ? 'inherit' : 'nowrap',
    }

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
              let btnStyle = {
                widthpx: smallSize ? responseContainer.width / 2 : responseContainer.width,
                width: smallSize ? responseContainer.width / 2 : responseContainer.width,
                top: smallSize ? responseContainer.top / 2 : responseContainer.top,
                left: smallSize ? responseContainer.left / 2 : responseContainer.left,
                height: smallSize ? responseContainer.height / 2 : responseContainer.height,
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
              return (
                <div
                  key={index}
                  style={{
                    ...btnStyle,
                    borderStyle: smallSize ? 'dashed' : 'solid',
                    overflow: 'hidden'
                  }}
                  className={'imagelabeldragdrop-droppable active'}
                >
                  {
                    !smallSize &&
                    <span className="index-box">{indexStr}</span>
                  }
                  {
                    !smallSize &&
                    <AnswerDropdown
                      style={{ width: '100%', height: '100%' }}
                      options={options[dropTargetIndex].map(op => ({value: op, label: op}))}
                      onChange={value => this.selectChange(value, dropTargetIndex)}
                      defaultValue={userAnswers[dropTargetIndex]}
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
      <StyledDisplayContainer fontSize={fontSize} smallSize={smallSize}>
        <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }}/>
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

ClozeImageDropDownDisplay.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
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

ClozeImageDropDownDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  preview: true,
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

export default ClozeImageDropDownDisplay;

const StyledPreviewTemplateBox = styled.div.attrs({
  className: props => `imagedropdown_template_box ${props.smallSize ? 'small' : ''}`
})`
  fontSize: ${props => props.smallSize ? 10 : props.fontSize}px;
  overflow-y: ${props => props.smallSize && 'hidden'};
`;

const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${props => props.smallSize ? '100%' : (props.width + 'px')};
  height: 100%;
  min-width: ${props => props.smallSize ? '100%' : '600px'};
  max-width: 100%;
  margin: auto;
`;

const StyledPreviewImage = styled.img`
  width: 100%;
  height: ${props => props.smallSize ? '100%' : 'auto'};
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
  height: ${props => props.smallSize ? '190px' : '100%'};
  margin: ${props => props.smallSize ? '-30px -40px' : '0px'};
`;

const TemplateBoxLayoutContainer = styled.div`
  flex: 1;
  margin: ${props => props.smallSize ? '0px' : '15px 0px'};
  border-radius: 10px;
`;
