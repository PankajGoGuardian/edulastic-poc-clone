/* eslint-disable no-prototype-builtins */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { isEqual, find, isObject } from "lodash";
import { questionType } from "@edulastic/constants";

import PlayerHeader from "./PlayerHeader";
import ParentController from "./utility/parentController";

import { MainContent, Main } from "./styled";

import mockMapJson from "./mock";

const frameController = new ParentController("iCat");

const responseType = {
  dropdown: "dropdown",
  input: "input",
  radio: "radio"
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const PlayerContent = ({ openExitPopup, title, questions, setUserAnswer, gotoQuestion }) => {
  const frameRef = useRef();
  const [currentPage, setCurrentQuestion] = useState(0);
  const [testletItems, setQuestions] = useState([]);
  const [unlockNext, setUnlockNext] = useState(false);

  const nextQuestion = () => {
    frameController.sendNext();
  };

  const prevQuestion = () => {
    frameController.sendPrevDev();
  };

  const findItemIdMap = cPageIds => find(mockMapJson.mapping, ({ testletItemId }) => isEqual(testletItemId, cPageIds));

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

  const mapTestletToEdu = () => {
    const { currentPageIds } = frameController;
    const cPageIds = Object.keys(currentPageIds);
    const currentItem = findItemIdMap(cPageIds);
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
    }
    setUserAnswer(currentItem.uuid, data);
  };

  useEffect(() => {
    if (frameRef.current) {
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
        gotoParticularQuestion: pageIds => {
          if (pageIds.length) {
            const currentItem = findItemIdMap(pageIds);
            if (currentItem && currentItem.uuid) {
              const cItemIndex = Object.keys(questions).indexOf(currentItem.uuid);
              if (cItemIndex !== -1) {
                gotoQuestion(cItemIndex);
              }
            }
          }
        },
        handleReponse: mapTestletToEdu
      });
      return () => {
        frameController.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (currentPage > 0) {
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
          <iframe ref={frameRef} id="testlet" src="testlets/testlet-musicmixer/main.html" title="testlet" />
        </MainContent>
      </Main>
    </>
  );
};

export default PlayerContent;
