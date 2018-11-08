import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Draggable, Droppable } from 'react-drag-and-drop';
import { cloneDeep } from 'lodash';
import QuestionHeader from '../common/QuestionHeader';
import ResponseContainer from './ResponseContainer';
import ResponseBoxLayout from './ResponseBoxLayout';
import CheckboxTemplateBoxLayout from './CheckboxResponseBoxLayout';
import CorrectAnswerBoxLayout from './CorrectAnswerBoxLayout';

/* eslint-disable */
const defaultTemplateMarkup = '<p>Risus </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p>, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum. Nunc diam enim, porta sed eros vitae. </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> dignissim, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum.</p>';

class ClozeDragDropDisplay extends Component {
  constructor(props) {
    super(props);
    const { templateParts, respLength } = this.getTemplateParts(props);
    let userAnswers = new Array(respLength).fill(false);
    userAnswers = props.userSelections;
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
    });
    const possibleResponses = this.getInitialResponses(props.options);

    this.state = {
      templateParts,
      userAnswers,
      possibleResponses
    };
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps;
    if (this.state !== undefined) {
      const possibleResponses = this.getInitialResponses(options);
      const { templateParts, respLength } = this.getTemplateParts(nextProps);
      this.setState({
        possibleResponses,
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

  onDrop = (data, index) => {
    const { userAnswers: newAnswers, possibleResponses } = this.state;
    const {
      onChange: changeAnswers,
      hasGroupResponses,
      userSelections,
      configureOptions,
    } = this.props;
    const { duplicatedResponses: isDuplicated } = configureOptions;
    const newResponses = cloneDeep(possibleResponses);

    // Remove duplicated responses if duplicated option is disable
    if (!isDuplicated) {
      if (hasGroupResponses) {
        const groupIndex = data.metal.split('_')[1];
        const groupData = data.metal.split('_')[0];
        const sourceIndex = data.metal.split('_')[2];
        const fromResp = data.metal.split('_')[3];
        if (fromResp) {
          const temp = newAnswers[sourceIndex];
          newAnswers[sourceIndex] = newAnswers[index];
          newAnswers[index] = temp;
        } else {
          for (let i = 0; i < newResponses[groupIndex].options.length; i++) {
            if (newResponses[groupIndex].options[i] === groupData) {
              if (userSelections[index] !== null && typeof userSelections[index] === 'object') {
                newResponses[userSelections[index].group].options.push(userSelections[index].data);
              }
              newResponses[groupIndex].options.splice(i, 1);
              break;
            }
          }
        }
        newAnswers[index] = {
          group: groupIndex,
          data: groupData
        };
      } else {
        const sourceIndex = data.metal.split('_')[1];
        const sourceData = data.metal.split('_')[0];
        const fromResp = data.metal.split('_')[2];
        if (fromResp) {
          const temp = newAnswers[sourceIndex];
          newAnswers[sourceIndex] = newAnswers[index];
          newAnswers[index] = temp;
        } else {
          newAnswers[index] = sourceData;
          for (let i = 0; i < newResponses.length; i++) {
            if (newResponses[i] === sourceData) {
              newResponses.splice(i, 1);
              break;
            }
          }
        }
      }
    } else {
      if (hasGroupResponses) {
        const groupIndex = data.metal.split('_')[1];
        const groupData = data.metal.split('_')[0];
        newAnswers[index] = {
          group: groupIndex,
          data: groupData
        };
      } else {
        newAnswers[index] = data.metal;
      }
    }
    console.log('newAnswers display index:', newAnswers);
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
      hasGroupResponses,
      configureOptions,
    } = this.props;
    const { duplicatedResponses: isDuplicated } = configureOptions;
    let userSelections = [];
    if (this.state !== undefined) {
      const { userAnswers } = this.state;
      userSelections = userAnswers;
    }

    let possibleResps = [];
    possibleResps = cloneDeep(options);
    if (!isDuplicated) {
      if (hasGroupResponses) {
        userSelections.forEach((userSelection) => {
          if (userSelection !== null && typeof userSelection === 'object') {
            for (let i = 0; i < possibleResps[userSelection.group].options.length; i++) {
              if (possibleResps[userSelection.group].options[i] === userSelection.data) {
                possibleResps[userSelection.group].options.splice(i, 1);
                break;
              }
            }
          }
        });
      } else {
        for (let j = 0; j < userSelections.length; j++) {
          for (let i = 0; i < possibleResps.length; i++) {
            if (possibleResps[i] === userSelections[j]) {
              possibleResps.splice(i, 1);
              break;
            }
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
      userSelections,
      smallSize,
      question,
      configureOptions,
      hasGroupResponses,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation
    } = this.props;
    const { templateParts, userAnswers, possibleResponses } = this.state;
    const { showDraghandle: dragHandler, shuffleOptions } = configureOptions;
    let responseIndex = 0;
    let responses = possibleResponses;

    if (preview && shuffleOptions) {
      if (hasGroupResponses) {
        responses = this.shuffleGroup(possibleResponses);
      } else {
        responses = this.shuffle(possibleResponses);
      }
    }

    console.log('userSelection in display: ', userSelections, validation);

    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, wordwrap, responsecontainerposition, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 'auto',
      heightpx: heightpx !== 0 ? heightpx : 'auto',
      whiteSpace: wordwrap ? 'inherit' : 'nowrap',
    }
    const previewTemplateBoxLayout = (
      <div className="template_box" style={{ fontSize: smallSize ? 10 : fontSize, padding: smallSize ? 0 : 20 }}>
          {templateParts.map((templatePart, index) => {
            if (templatePart.indexOf('class="response-btn"') !== -1) {
              const dropTargetIndex = responseIndex;
              responseIndex++;
              let btnStyle = {
                width: 0,
                height: 0,
                widthpx: 0,
                heightpx: 0,
                whiteSpace: undefined,
                wordwrap: undefined,
              }
              // Object.defineProperties(btnStyle, {
              //   width: {
              //     value: 0,
              //     writable: true
              //   },
              //   height: {
              //     value: 0,
              //     writable: true,
              //   },
              //   widthpx: {
              //     value: 0,
              //     writable: true
              //   },
              //   heightpx: {
              //     value: 0,
              //     writable: true,
              //   },
              //   whiteSpace: {
              //     value: undefined,
              //     writable: true,
              //   },
              //   wordwrap: {
              //     value: undefined,
              //     writable: true,
              //   }
              // });
              if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
                const { widthpx, heightpx, wordwrap } = responsecontainerindividuals[dropTargetIndex];
                btnStyle.width = widthpx;
                btnStyle.height = heightpx;
                btnStyle.whiteSpace = wordwrap;
                btnStyle.widthpx = widthpx;
                btnStyle.heightpx = heightpx;
                btnStyle.wordwrap = wordwrap;
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
              if (btnStyle && btnStyle.whiteSpace === undefined) {
                btnStyle['whiteSpace'] = responseBtnStyle.whiteSpace;
              } else {
                btnStyle['whiteSpace'] = btnStyle.wordwrap;
              }
              return (
                <Droppable
                  key={index}
                  types={['metal']} // <= allowed drop types
                  onDrop={data => this.onDrop(data, dropTargetIndex)}
                >
                  {!hasGroupResponses && (
                    <ResponseContainer style={btnStyle} smallSize={smallSize}>
                      <Draggable className="content" type="metal" data={`${userAnswers[dropTargetIndex]}_${dropTargetIndex}_fromResp`}>
                        {userAnswers[dropTargetIndex]}
                      </Draggable>&nbsp;
                    </ResponseContainer>
                  )}
                  {hasGroupResponses && (
                    <ResponseContainer style={btnStyle} smallSize={smallSize}>
                      <Draggable className="content" type="metal" data={`${userAnswers[dropTargetIndex] && userAnswers[dropTargetIndex].data}_${userAnswers[dropTargetIndex] && userAnswers[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}>
                      {
                        (userAnswers[dropTargetIndex] && userAnswers[dropTargetIndex].data)
                      }
                      </Draggable>&nbsp;
                    </ResponseContainer>
                  )}
                </Droppable>
              );
            }
            return (
              <span style={{ userSelect: 'none' }} key={index} dangerouslySetInnerHTML={{ __html: templatePart }}></span>
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
        hasGroupResponses={hasGroupResponses}
        fontSize={fontSize}
        userSelections={userAnswers}
        evaluation={evaluation}
      />
    )
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        hasGroupResponses={hasGroupResponses}
        responses={responses}
        fontSize={fontSize}
        dragHandler={dragHandler}
      />
    )
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        hasGroupResponses={hasGroupResponses}
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (<div/>);
    const responseBoxLayout = checkAnswer || showAnswer ? (<div/>) : previewResponseBoxLayout;
    const answerBox = showAnswer ? correctAnswerBoxLayout : (<div/>);
    return (
      <div style={{ fontSize: fontSize }}>
        <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }}/>
        <div>
          {responsecontainerposition === 'top' && (
            <React.Fragment>
              <div style={{ margin: 15, borderRadius: 10 }}>
                {responseBoxLayout}
              </div>
              <div style={{ margin: 15, borderRadius: 10 }}>
                {templateBoxLayout}
              </div>
            </React.Fragment>
          )}
          {responsecontainerposition === 'bottom' && (
            <React.Fragment>
              <div style={{ margin: 15, borderRadius: 10 }}>
                {templateBoxLayout}
              </div>
              <div style={{ margin: 15, borderRadius: 10 }}>
                {responseBoxLayout}
              </div>
            </React.Fragment>
          )}
          {responsecontainerposition === 'left' && (
            <div style={{ display: 'flex', width: '80vw' }}>
              <div hidden={checkAnswer || showAnswer} style={{ width: '30%', margin: 15, borderRadius: 10, background: 'lightgray', display: 'flex', justifyContent: 'center' }}>
                {responseBoxLayout}
              </div>
              <div style={{ margin: 15, borderRadius: 10, flex: 1 }}>
                {templateBoxLayout}
              </div>
            </div>
          )}
          {responsecontainerposition === 'right' && (
            <div style={{ display: 'flex', width: '80vw' }}>
              <div style={{ flex: 1, margin: 15, borderRadius: 10 }}>
                {templateBoxLayout}
              </div>
              <div hidden={checkAnswer || showAnswer} style={{ width: '30%', margin: 15, borderRadius: 10, background: 'lightgray', display: 'flex', justifyContent: 'center' }}>
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

ClozeDragDropDisplay.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  templateMarkUp: PropTypes.string,
  question: PropTypes.string.isRequired,
  hasGroupResponses: PropTypes.bool,
  configureOptions: PropTypes.object,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  uiStyle: PropTypes.object.isRequired,
};

ClozeDragDropDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  preview: true,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  templateMarkUp: defaultTemplateMarkup,
  smallSize: false,
  hasGroupResponses: false,
  validation: {},
  configureOptions: {
    showDraghandle: false,
    duplicatedResponses: false,
    shuffleOptions: false,
  },
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemnumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  }
};

export default ClozeDragDropDisplay;
