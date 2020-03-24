/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { isEqual, find, isObject, isArray, isEmpty } from "lodash";
import { withRouter } from "react-router-dom";
import { questionType } from "@edulastic/constants";
import PlayerHeader from "./PlayerHeader";
import ParentController from "./utility/parentController";
import { getLineFromExpression, getPoinstFromString, ALPHABET } from "./utility/helpers";
import { MainContent, Main, OverlayDiv } from "./styled";
import Magnifier from "../../../common/components/Magnifier";

let frameController = {};
const responseType = {
  dropdown: "dropdown",
  input: "input",
  radio: "radio"
};

const PlayerContent = ({
  openExitPopup,
  title,
  questions,
  setUserAnswer,
  onSubmitAnswer,
  saveTestletState,
  setTestUserWork,
  gotoSummary,
  testActivityId,
  testletState,
  testletConfig = {},
  LCBPreviewModal,
  previewPlayer,
  location = { state: {} },
  groupId,
  saveTestletLog,
  ...restProps
}) => {
  const frameRef = useRef();
  const frameRefForMagnifier = useRef();
  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now());
  const [currentPage, setCurrentQuestion] = useState(0);
  const [testletItems, setQuestions] = useState([]);
  const [currentScoring, setCurrentScoring] = useState(false);
  const [unlockNext, setUnlockNext] = useState(false);
  let enableMagnifier = false;

  const showMagnifier = () => {
    if (frameRefForMagnifier.current) {
      frameRefForMagnifier.current.contentWindow.document.body.innerHTML =
        frameRef.current?.contentWindow?.document?.body?.innerHTML;
      document.getElementById("magnifier-wrapper").style.display = "block";
      const icon = document.getElementById("magnifier-icon");
      icon.style.backgroundColor = restProps.theme.default.default.headerButtonBgHoverColor;
      const svg = icon.getElementsByTagName("svg")[0];
      svg.style.fill = restProps.theme.default.header.headerButtonHoverColor;
      enableMagnifier = true;
    }
  };

  const hideMagnifier = () => {
    if (enableMagnifier) {
      document.getElementById("magnifier-wrapper").style.display = "none";
      const icon = document.getElementById("magnifier-icon");
      icon.style.backgroundColor = restProps.theme.default.default.headerButtonBgColor;
      const svg = icon.getElementsByTagName("svg")[0];
      svg.style.fill = restProps.theme.default.header.headerButtonColor;
      enableMagnifier = false;
    }
  };

  const handleMagnifier = () => {
    if (!enableMagnifier) {
      showMagnifier();
    } else {
      hideMagnifier();
    }
  };

  const findItemIdMap = cPageIds =>
    find(testletConfig.mapping, ({ testletItemId }) => isEqual(testletItemId, cPageIds));

  const findTestletValue = testletId => {
    const { response: testletResponse } = frameController;
    const allResponses = {};
    for (const key in testletResponse) {
      if (Object.prototype.hasOwnProperty.call(testletResponse, key) && isObject(testletResponse[key])) {
        Object.assign(allResponses, testletResponse[key]);
      }
    }

    return allResponses[testletId];
  };

  const getCurrentQuestion = id => {
    if (questions[id]) {
      return questions[id];
    }
    return find(questions, _q => _q.previousQuestionId === id);
  };

  const saveUserResponse = () => {
    if (!LCBPreviewModal) {
      const { currentPageIds } = frameController;
      const scoringIds = Object.keys(currentPageIds);
      if (!isEmpty(scoringIds)) {
        const currentItem = findItemIdMap([scoringIds[0]]);
        if (currentItem) {
          const timeSpent = Date.now() - lastTime.current;
          onSubmitAnswer(currentItem.uuid, timeSpent, groupId);
        }
      }
    }
  };

  const nextQuestion = () => {
    saveUserResponse();
    if (currentPage < testletItems.length) {
      frameController.sendNext();
    } else if (!LCBPreviewModal) {
      gotoSummary();
    }
    if (enableMagnifier) {
      hideMagnifier();
    }
  };

  const prevQuestion = () => {
    saveUserResponse();
    frameController.sendPrevDev();
    if (enableMagnifier) {
      hideMagnifier();
    }
  };

  const mapTestletToEdu = () => {
    if (LCBPreviewModal) {
      return;
    }
    const { currentPageIds } = frameController;

    for (const scoringId in currentPageIds) {
      if (Object.prototype.hasOwnProperty.call(currentPageIds, scoringId)) {
        const currentItem = findItemIdMap([scoringId]);
        if (!currentItem) {
          continue;
        }

        const cQuestion = getCurrentQuestion(currentItem.uuid);
        if (!cQuestion) {
          continue;
        }
        const { type: cQuestionType } = cQuestion;

        let data = {};
        if (cQuestionType === questionType.EXPRESSION_MULTIPART) {
          const { responseIds } = cQuestion;
          Object.keys(responseIds).map(key => {
            data[key] = {};
            responseIds[key].map(res => {
              const itemIds = find(currentItem.responses, ({ uuid }) => uuid === res.id);
              if (itemIds) {
                let testletValue = findTestletValue(itemIds.responseId);
                if (itemIds.type === responseType.dropdown || itemIds.type === responseType.radio) {
                  const { options } = cQuestion;
                  const option = options[itemIds.uuid];
                  if (testletValue && option) {
                    let opIndex = ALPHABET.indexOf(testletValue);
                    if (itemIds.choices) {
                      opIndex = itemIds.choices[testletValue];
                    }
                    testletValue = option[opIndex];
                  } else {
                    testletValue = "";
                  }
                }
                data[key][itemIds.uuid] = {
                  value: testletValue,
                  index: res.index
                };
              }
            });
          });
        } else if (cQuestionType === questionType.MULTIPLE_CHOICE) {
          data = [];
          const { options } = cQuestion;
          currentItem.responses.map(({ responseId, values }) => {
            const testletValue = findTestletValue(responseId);
            if (testletValue) {
              if (isArray(testletValue) && values) {
                // here is checkbox type
                testletValue.map(v => {
                  const opIndex = values.indexOf(v);
                  if (options[opIndex]) {
                    data.push(options[opIndex].value);
                  }
                });
              } else {
                // here is radio type
                const opIndex = ALPHABET.indexOf(testletValue);
                if (options[opIndex]) {
                  data.push(options[opIndex].value);
                }
              }
            }
          });
        } else if (cQuestionType === questionType.CLOZE_TEXT) {
          const { responseIds: eduItemResponses = [] } = cQuestion;
          data = eduItemResponses.map(eduRes => {
            const { responseId } = find(currentItem.responses, ({ uuid }) => uuid === eduRes.id) || {};
            const testletValue = findTestletValue(responseId);
            return { ...eduRes, value: testletValue };
          });
        } else if (cQuestionType === questionType.CHOICE_MATRIX) {
          // here is grid type
          data.value = [];
          currentItem.responses.map(({ responseId }) => {
            let testletValue = findTestletValue(responseId) || [];
            if (testletValue) {
              testletValue = testletValue.split(",");
              data.value = Array.from({
                length: testletValue.length
              }).fill([]);
              testletValue.map(v => {
                const num = v.match(/[0-9]+/);
                const alpha = v.match(/[a-z]+/);
                if (num && alpha) {
                  const opIndex = ALPHABET.indexOf(alpha[0]);
                  const answer = [opIndex];
                  data.value[num[0] - 1] = answer;
                }
              });
            }
          });
        } else if (cQuestionType === questionType.CLOZE_DRAG_DROP) {
          // here is match
          data = [];
          currentItem.responses.map(({ responseId }) => {
            const testletValue = findTestletValue(responseId);
            const { options } = cQuestion;
            const opIndex = ALPHABET.indexOf(testletValue);
            if (options[opIndex] && testletValue) {
              data.push(options[opIndex].value);
            } else {
              data.push(false);
            }
          });
        } else if (cQuestionType === questionType.CLOZE_DROP_DOWN) {
          const { responseIds: eduItemResponses = [], options } = cQuestion;
          data = eduItemResponses.map(eduRes => {
            const { responseId } = find(currentItem.responses, ({ uuid }) => uuid === eduRes.id) || {};

            const testletValue = findTestletValue(responseId);
            const opIndex = ALPHABET.indexOf(testletValue);
            const optionValue = testletValue ? options[eduRes.id][opIndex] : "";
            return { ...eduRes, value: optionValue };
          });
        } else if (cQuestionType === questionType.TOKEN_HIGHLIGHT) {
          const { templeWithTokens } = cQuestion;
          data = [];
          currentItem.responses.map(({ responseId }) => {
            const testletValue = findTestletValue(responseId);
            if (isArray(testletValue)) {
              const selections = testletValue.map(value => ALPHABET.indexOf(value));
              data = (templeWithTokens || []).map((el, i) => ({
                value: el.value,
                index: i,
                selected: selections && selections.length ? selections.includes(i) : false
              }));
            }
          });
        } else if (cQuestionType === questionType.ESSAY_PLAIN_TEXT || cQuestionType === questionType.SHORT_TEXT) {
          currentItem.responses.map(({ responseId }) => {
            data = findTestletValue(responseId);
          });
        } else if (cQuestionType === questionType.CLOZE_IMAGE_DRAG_DROP) {
          const { responses: eduItemResponses = [], options } = cQuestion;
          data = eduItemResponses.map((eduRes, contIndex) => {
            const { responseId } = find(currentItem.responses, ({ uuid }) => uuid === eduRes.id) || {};
            const testletValue = findTestletValue(responseId);
            const opIndex = ALPHABET.indexOf(testletValue);
            if (testletValue && options[opIndex]) {
              return {
                responseBoxID: eduRes.id,
                value: [options[opIndex]],
                containerIndex: contIndex
                // rect: {}, TODO: we will check this property later.
              };
            }
            return {
              responseBoxID: eduRes.id,
              value: [],
              containerIndex: contIndex
              // rect: {}, TODO: we will check this property later.
            };
          });
        } else if (cQuestionType === questionType.CLOZE_IMAGE_TEXT) {
          const { responses: eduItemResponses = [] } = cQuestion;
          data = eduItemResponses.map(eduRes => {
            const { responseId } = find(currentItem.responses, ({ uuid }) => uuid === eduRes.id) || {};
            return findTestletValue(responseId) || "";
          });
        } else if (cQuestionType === questionType.GRAPH) {
          currentItem.responses.map(({ responseId, elementType, points, labels }) => {
            if (elementType === "point") {
              const testletValue = findTestletValue(responseId);
              data = getPoinstFromString(testletValue, labels);
            } else if (elementType === "line") {
              const testletValue = findTestletValue(responseId);
              data = getLineFromExpression(testletValue, points, labels);
            }
          });
        } else if (cQuestionType === questionType.MATH) {
          currentItem.responses.map(({ responseId }) => {
            data = findTestletValue(responseId);
          });
        }

        setUserAnswer(cQuestion.id, data);
      }
    }
  };

  const rerenderMagnifier = () => {
    if (enableMagnifier) {
      showMagnifier();
    }
  };

  useEffect(() => {
    if (testletConfig.testletURL && frameRef.current) {
      const { state: initState = {} } = testletState;
      if (location.state) {
        const { fromSummary, question: questionId } = location.state;
        if (fromSummary && questionId) {
          const questionMap = find(testletConfig.mapping, ({ uuid }) => uuid === questionId);
          if (questionMap) {
            initState.pageNum = questionMap.testletPageNum;
          }
        }
      }
      frameController = new ParentController(testletConfig.testletId, initState, testletState.response);
      frameController.connect(frameRef.current.contentWindow);
      frameController.setCallback({
        setCurrentQuestion: val => {
          setCurrentQuestion(val);
        },
        setQuestions: _questions => {
          setQuestions(_questions);
        },
        unlockNext: flag => {
          setUnlockNext(flag || LCBPreviewModal);
        },
        setCurrentScoring: ids => {
          setCurrentScoring(!!Object.keys(ids).length);
        },
        handleReponse: mapTestletToEdu,
        playerStateHandler: (itemState, itemResponse) => {
          if (!LCBPreviewModal) {
            if (enableMagnifier) {
              setTimeout(showMagnifier, 1000);
            }
            setTestUserWork({
              [testActivityId]: { testletState: { state: itemState, response: itemResponse } }
            });
          }
        },
        handleLog: saveTestletLog
      });
      return () => {
        frameController.disconnect();
      };
    }
  }, [testletConfig]);

  useEffect(() => {
    window.addEventListener("resize", rerenderMagnifier);
    return () => window.removeEventListener("resize", rerenderMagnifier);
  }, []);

  useEffect(() => {
    if (currentPage > 0) {
      if (!LCBPreviewModal) {
        saveTestletState();
      }
      window.localStorage.assessmentLastTime = Date.now();
      frameController.getCurrentPageScoreID();
    }
  }, [currentPage]);

  const zoomedContent = () => (
    <>
      <PlayerHeader
        title={title}
        dropdownOptions={testletItems}
        currentPage={currentPage}
        onOpenExitPopup={openExitPopup}
        onNextQuestion={nextQuestion}
        unlockNext={unlockNext}
        onPrevQuestion={prevQuestion}
        previewPlayer={previewPlayer}
        handleMagnifier={handleMagnifier}
        enableMagnifier={enableMagnifier}
        {...restProps}
      />
      <Main skinB="true" LCBPreviewModal={LCBPreviewModal}>
        <MainContent id={`${testletConfig.testletId}_magnifier`}>
          {LCBPreviewModal && currentScoring && <OverlayDiv />}
          {testletConfig.testletURL && (
            <iframe
              ref={frameRefForMagnifier}
              id={`${testletConfig.testletId}_magnifier`}
              src={testletConfig.testletURL}
              title="testlet player"
            />
          )}
        </MainContent>
      </Main>
    </>
  );
  return (
    <Magnifier
      enable={enableMagnifier}
      zoomedContent={zoomedContent}
      type="testlet"
      offset={{
        top: 70,
        left: 0
      }}
    >
      <PlayerHeader
        title={title}
        dropdownOptions={testletItems}
        currentPage={currentPage}
        onOpenExitPopup={openExitPopup}
        onNextQuestion={nextQuestion}
        unlockNext={unlockNext}
        onPrevQuestion={prevQuestion}
        previewPlayer={previewPlayer}
        handleMagnifier={handleMagnifier}
        enableMagnifier={enableMagnifier}
        {...restProps}
      />
      <Main skinB="true" LCBPreviewModal={LCBPreviewModal}>
        <MainContent>
          {LCBPreviewModal && currentScoring && <OverlayDiv />}
          {testletConfig.testletURL && (
            <iframe ref={frameRef} id={testletConfig.testletId} src={testletConfig.testletURL} title="testlet player" />
          )}
        </MainContent>
      </Main>
    </Magnifier>
  );
};

PlayerContent.propTypes = {
  openExitPopup: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  questions: PropTypes.object.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  onSubmitAnswer: PropTypes.func.isRequired,
  saveTestletState: PropTypes.func.isRequired,
  setTestUserWork: PropTypes.func.isRequired,
  gotoSummary: PropTypes.func.isRequired,
  testActivityId: PropTypes.string.isRequired,
  testletState: PropTypes.object.isRequired,
  testletConfig: PropTypes.object.isRequired,
  LCBPreviewModal: PropTypes.bool,
  previewPlayer: PropTypes.bool,
  location: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  changeTool: PropTypes.func.isRequired,
  saveTestletLog: PropTypes.func.isRequired
};

PlayerContent.defaultProps = {
  LCBPreviewModal: false,
  previewPlayer: false
};

export default withRouter(PlayerContent);
