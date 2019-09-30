/* eslint-disable no-prototype-builtins */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { isEqual, find, isObject } from "lodash";
import { questionType } from "@edulastic/constants";

import PlayerHeader from "./PlayerHeader";
import ParentController from "./utility/parentController";

import { MainContent, Main } from "./styled";

let frameController = {};

const responseType = {
  dropdown: "dropdown",
  input: "input",
  radio: "radio"
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const PlayerContent = ({
  openExitPopup,
  title,
  questions,
  setUserAnswer,
  saveUserAnswer,
  saveUserWork,
  testActivityId,
  testletState,
  testletConfig = {}
}) => {
  const frameRef = useRef();
  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now());
  const [currentPage, setCurrentQuestion] = useState(0);
  const [testletItems, setQuestions] = useState([]);
  const [unlockNext, setUnlockNext] = useState(false);

  const findItemIdMap = cPageIds =>
    find(testletConfig.mapping, ({ testletItemId }) => isEqual(testletItemId, cPageIds));

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
    const { currentPageIds } = frameController;
    const cPageIds = Object.keys(currentPageIds);
    const currentItem = findItemIdMap(cPageIds);
    return currentItem;
  };

  const saveUserResponse = () => {
    const currentItem = findCurrentItemFromIdMap();
    if (currentItem) {
      const cItemIndex = Object.keys(questions).indexOf(currentItem.uuid);
      const timeSpent = Date.now() - lastTime.current;
      saveUserAnswer(cItemIndex, timeSpent);
    }
  };

  const nextQuestion = () => {
    saveUserResponse();
    if (currentPage < testletItems.length) {
      frameController.sendNext();
    } else {
      // TODO submit test here
    }
  };

  const prevQuestion = () => {
    saveUserResponse();
    frameController.sendPrevDev();
  };

  const mapTestletToEdu = () => {
    const currentItem = findCurrentItemFromIdMap();
    if (!currentItem) {
      return;
    }
    const cQuestion = questions[currentItem.uuid];
    if (!cQuestion) {
      return;
    }

    // TODO need to restore previous response...
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
          const opIndex = ALPHABET.indexOf(testletValue);
          if (options[opIndex]) {
            data.push(options[opIndex].value);
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
    }
    setUserAnswer(currentItem.uuid, data);
  };

  useEffect(() => {
    if (testletConfig.testletURL && frameRef.current) {
      frameController = new ParentController(testletConfig.testletId, testletState);
      frameController.connect(frameRef.current.contentWindow);
      frameController.setCallback({
        setCurrentQuestion: val => {
          setCurrentQuestion(val);
        },
        setQuestions: _questions => {
          setQuestions(_questions);
        },
        unlockNext: flag => {
          setUnlockNext(flag);
        },
        handleReponse: mapTestletToEdu,
        playerStateHandler: itemState => {
          saveUserWork({ [testActivityId]: itemState });
        }
      });
      return () => {
        frameController.disconnect();
      };
    }
  }, [testletConfig]);

  useEffect(() => {
    if (currentPage > 0) {
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
      />
      <Main skinB="true">
        <MainContent>
          {testletConfig.testletURL && (
            <iframe ref={frameRef} id={testletConfig.testletId} src={testletConfig.testletURL} title="testlet player" />
          )}
        </MainContent>
      </Main>
    </>
  );
};

export default PlayerContent;
