import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Draggable, Droppable } from 'react-drag-and-drop';
import { cloneDeep, flattenDeep, isUndefined } from 'lodash';
import QuestionHeader from '../common/QuestionHeader';
import ResponseBoxLayout from './ResponseBoxLayout';
import CheckboxTemplateBoxLayout from './CheckboxResponseBoxLayout';
import CorrectAnswerBoxLayout from './CorrectAnswerBoxLayout';
import { Pointer, Point, Triangle } from '../common';

/* eslint-disable */
const defaultImageURL = 'https://assets.learnosity.com/demos/docs/colored_world_map.png';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

class ClozeImageDragDropDisplay extends Component {
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

  onDrop = (data, index) => {
    const { userAnswers: newAnswers, possibleResponses } = this.state;
    const { maxRespCount } = this.props;
    const {
      onChange: changeAnswers,
      configureOptions,
    } = this.props;
    const { duplicatedResponses: isDuplicated } = configureOptions;
    const newResponses = cloneDeep(possibleResponses);

    // Remove duplicated responses if duplicated option is disable
    if (newAnswers[index] && newAnswers[index].length < maxRespCount || isUndefined(newAnswers[index])) {
      if (!isDuplicated) {
        const sourceIndex = data.metal.split('_')[1];
        const sourceData = data.metal.split('_')[0];
        const fromResp = data.metal.split('_')[2];
        if (fromResp) {
          if (newAnswers[index] === undefined) newAnswers[index] = [];
          newAnswers[index].push(sourceData);
          for (let i = 0; i < newAnswers[sourceIndex].length; i++) {
            if (newAnswers[sourceIndex][i] === sourceData) {
              newAnswers[sourceIndex].splice(i, 1);
              break;
            }
          }
        } else {
          if (newAnswers[index] === undefined) newAnswers[index] = [];
          newAnswers[index].push(sourceData);
          for (let i = 0; i < newResponses.length; i++) {
            if (newResponses[i] === sourceData) {
              newResponses.splice(i, 1);
              break;
            }
          }
        }
      } else {
      const value = data.metal.split('_')[0];
      const sourceIndex = data.metal.split('_')[1];
      const fromResp = data.metal.split('_')[2];
      if (fromResp) {
        if (newAnswers[index] === undefined) newAnswers[index] = [];
        newAnswers[index].push(sourceData);
        for (let i = 0; i < newAnswers[sourceIndex].length; i++) {
          if (newAnswers[sourceIndex][i] === sourceData) {
            newAnswers[sourceIndex].splice(i, 1);
            break;
          }
        }
      } else {
        if (newAnswers[index] === undefined) newAnswers[index] = [];
        newAnswers[index].push(value);
      }
      }
    }
    this.setState({ userAnswers: newAnswers, possibleResponses: newResponses });
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
    const { showDraghandle: dragHandler, shuffleOptions, transparentResponses } = configureOptions;
    let responses = cloneDeep(possibleResponses);
    if (preview && shuffleOptions) {
      responses = this.shuffle(possibleResponses);
    }
    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, wordwrap, responsecontainerposition, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
      whiteSpace: wordwrap ? 'inherit' : 'nowrap',
    }

    const previewTemplateBoxLayout = (
      <div className={`imagedragdrop_template_box ${smallSize ? 'small' : ''}`} style={{ fontSize: smallSize ? 10 : fontSize, overflowY: smallSize && 'hidden' }}>
        <div style={{ position: 'relative', top: 0, left: 0, width: smallSize ? '100%' : imageWidth, margin: 'auto', minWidth: smallSize ? '100%' : 600, maxWidth: '100%' }}>
          <img src={imageUrl || defaultImageURL} width={'100%'} alt="resp-preview" style={{ userSelect: 'none', pointerEvents: 'none' }} alt={imageAlterText} />
            {responseContainers.map((responseContainer, index) => {
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
                  <Droppable
                    key={index}
                    types={['metal']} // <= allowed drop types
                    style={{
                      ...btnStyle,
                      borderStyle: smallSize ? 'dashed' : 'solid'
                    }}
                    className={'imagelabeldragdrop-droppable active'}
                    onDrop={data => this.onDrop(data, dropTargetIndex)}
                  >
                    <span className="index-box">{indexStr}</span>
                    <div className="container">
                    {userAnswers[dropTargetIndex] && userAnswers[dropTargetIndex].map((answer, item_index) => (
                      <Draggable
                        type="metal"
                        key={item_index}
                        data={`${answer}_${dropTargetIndex}_fromResp`}
                        style={{ border: 'solid 1px lightgray', margin: 5, padding: 5, display: 'inline-block' }}
                      >
                        {answer}
                      </Draggable>
                    ))}
                    </div>
                    <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                      <Point />
                      <Triangle />
                    </Pointer>
                  </Droppable>
                );
            })}
          </div>
      </div>
    )

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        responseContainers={responseContainers}
        responsecontainerindividuals={responsecontainerindividuals}
        responseBtnStyle={responseBtnStyle}
        imageUrl={imageUrl || defaultImageURL}
        imageWidth={imageWidth}
        imageAlterText={imageAlterText}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        showAnswer={showAnswer}
        userSelections={userAnswers}
        evaluation={evaluation}
        onDropHandler={this.onDrop}
      />
    )
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        responses={responses}
        fontSize={fontSize}
        dragHandler={dragHandler}
        transparentResponses={transparentResponses}
      />
    )
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (<div/>);
    const responseBoxLayout = showAnswer ? (<div/>) : previewResponseBoxLayout;
    const answerBox = showAnswer ? correctAnswerBoxLayout : (<div/>);

    const responseposition  = smallSize ? 'right' : responsecontainerposition;

    return (
      <div style={{ fontSize: fontSize }}>
        <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }}/>
        <div>
          {responseposition === 'top' && (
            <React.Fragment>
              <div style={{ margin: '15px 0', borderRadius: 10 }}>
                {responseBoxLayout}
              </div>
              <div style={{ margin: '15px 0', borderRadius: 10 }}>
                {templateBoxLayout}
              </div>
            </React.Fragment>
          )}
          {responseposition === 'bottom' && (
            <React.Fragment>
              <div style={{ margin: '15px 0', borderRadius: 10 }}>
                {templateBoxLayout}
              </div>
              <div style={{ margin: '15px 0', borderRadius: 10 }}>
                {responseBoxLayout}
              </div>
            </React.Fragment>
          )}
          {responseposition === 'left' && (
            <div style={{ display: 'flex' }}>
              <div
                hidden={checkAnswer || showAnswer}
                className="left responseboxContainer"
                style={{
                  width: '20%',
                  margin: 15,
                  height: 'auto',
                  borderRadius: 10,
                  background: 'lightgray',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                {responseBoxLayout}
              </div>
              <div style={{ margin: '15px 0 15px 15px', borderRadius: 10, flex: 1 }}>
                {templateBoxLayout}
              </div>
            </div>
          )}
          {responseposition === 'right' && (
            <div style={{ display: 'flex', height: smallSize ? 190 : '100%', margin: smallSize ? '-30px -40px' : 0 }}>
              <div style={{
                flex: 1,
                margin: smallSize ? 0 : '15px 15px 15px 0',
                borderRadius: 10
              }}>
                {templateBoxLayout}
              </div>
              <div
                hidden={checkAnswer || showAnswer}
                className={`right responseboxContainer ${smallSize ? 'small' : ''}`}
                style={{
                  height: 'auto',
                  width: smallSize ? '120px' : '20%',
                  margin: smallSize ? 0 : 15,
                  borderRadius: smallSize ? 0 : 10,
                  background: 'lightgray',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {responseBoxLayout}
              </div>
            </div>
          )}
        </div>
        {answerBox}
      </div>
    );
  }
}

ClozeImageDragDropDisplay.propTypes = {
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

ClozeImageDragDropDisplay.defaultProps = {
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
  backgroundColor: '#fff',
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
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemnumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  // item: {}
};

export default ClozeImageDragDropDisplay;
