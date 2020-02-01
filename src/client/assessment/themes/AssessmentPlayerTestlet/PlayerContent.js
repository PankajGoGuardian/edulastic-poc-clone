/* eslint-disable no-prototype-builtins */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { isEqual, find, isObject, isArray } from "lodash";
import { withRouter } from "react-router-dom";
import { questionType } from "@edulastic/constants";
import PlayerHeader from "./PlayerHeader";
import ParentController from "./utility/parentController";
import { getLineFromExpression, getPoinstFromString, ALPHABET } from "./utility/helpers";
import { MainContent, Main, OverlayDiv } from "./styled";

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
  saveUserAnswer,
  saveTestletState,
  setTestUserWork,
  gotoSummary,
  testActivityId,
  testletState,
  testletConfig = {},
  LCBPreviewModal,
  previewPlayer,
  location = { state: {} },
  groupId
}) => {
  const frameRef = useRef();
  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now());
  const [currentPage, setCurrentQuestion] = useState(0);
  const [testletItems, setQuestions] = useState([]);
  const [currentScoring, setCurrentScoring] = useState(false);
  const [unlockNext, setUnlockNext] = useState(false);

  const findItemIdMap = (cPageIds, pageNum) =>
    find(
      testletConfig.mapping,
      ({ testletItemId, testletPageNum }) => isEqual(testletItemId, cPageIds) || testletPageNum === pageNum
    );

  const findTestletValue = testletId => {
    const { response: testletResponse } = frameController;
    const allResponses = {};
    for (const key in testletResponse) {
      if (testletResponse.hasOwnProperty(key) && isObject(testletResponse[key])) {
        Object.assign(allResponses, testletResponse[key]);
      }
    }

    return allResponses[testletId];
  };

  const findCurrentItemFromIdMap = () => {
    const { currentPageIds, currentPageNum } = frameController;
    const cPageIds = Object.keys(currentPageIds);
    const currentItem = findItemIdMap(cPageIds, currentPageNum);
    return currentItem;
  };

  const getCurrentQuestion = id => {
    if (questions[id]) {
      return questions[id];
    }
    return find(questions, _q => _q.previousQuestionId === id);
  };

  const saveUserResponse = () => {
    if (!LCBPreviewModal) {
      const currentItem = findCurrentItemFromIdMap();
      if (currentItem) {
        const cItemIndex = Object.keys(questions).indexOf(currentItem.uuid);
        const timeSpent = Date.now() - lastTime.current;
        saveUserAnswer(cItemIndex, timeSpent, false, groupId);
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
  };

  const prevQuestion = () => {
    saveUserResponse();
    frameController.sendPrevDev();
  };

  const mapTestletToEdu = () => {
    if (LCBPreviewModal) {
      return;
    }
    const currentItem = findCurrentItemFromIdMap();

    if (!currentItem) {
      return;
    }

    const cQuestion = getCurrentQuestion(currentItem.uuid);

    if (!cQuestion) {
      return;
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
      currentItem.responses.map(({ responseId }) => {
        const testletValue = findTestletValue(responseId);
        if (testletValue) {
          if (isArray(testletValue)) {
            // here is checkbox type
            testletValue.map(v => {
              const opIndex = ALPHABET.indexOf(v);
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
    }

    setUserAnswer(cQuestion.id, data);
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
            setTestUserWork({ [testActivityId]: { testletState: { state: itemState, response: itemResponse } } });
          }
        }
      });
      return () => {
        frameController.disconnect();
      };
    }
  }, [testletConfig]);

  useEffect(() => {
    if (currentPage > 0) {
      if (!LCBPreviewModal) {
        saveTestletState();
      }
      window.localStorage.assessmentLastTime = Date.now();
      frameController.getCurrentPageScoreID();
    }
  }, [currentPage]);

  return (
    <>
      <PlayerHeader
        title={title}
        dropdownOptions={testletItems}
        currentItem={currentPage}
        onOpenExitPopup={openExitPopup}
        onNextQuestion={nextQuestion}
        unlockNext={unlockNext}
        onPrevQuestion={prevQuestion}
        previewPlayer={previewPlayer}
      />
      <Main skinB="true" LCBPreviewModal={LCBPreviewModal}>
        <MainContent>
          {LCBPreviewModal && currentScoring && <OverlayDiv />}
          {testletConfig.testletURL && (
            <iframe ref={frameRef} id={testletConfig.testletId} src={testletConfig.testletURL} title="testlet player" />
          )}
        </MainContent>
      </Main>
    </>
  );
};

export default withRouter(PlayerContent);
