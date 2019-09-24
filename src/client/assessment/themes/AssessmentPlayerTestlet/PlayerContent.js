/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PlayerHeader from "./PlayerHeader";
import ParentController from "./utility/parentController";

import { MainContent, Main } from "./styled";

const frameController = new ParentController("iCat");

const PlayerContent = ({ openExitPopup, title }) => {
  const [currentPage, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [unlockNext, setUnlockNext] = useState(false);

  const nextQuestion = () => {
    frameController.sendNext();
  };

  const prevQuestion = () => {
    frameController.sendPrevDev();
  };

  useEffect(() => {
    const context = document.getElementById("testlet").contentWindow;
    frameController.connect(context);
    frameController.setCallback({
      setCurrentQuestion: val => {
        setCurrentQuestion(val);
      },
      setQuestions: _questions => {
        setQuestions(_questions);
      },
      unlockNext: flag => {
        setUnlockNext(flag);
      }
    });
    return () => {
      frameController.disconnect();
    };
  }, []);

  return (
    <>
      <PlayerHeader
        title={title}
        dropdownOptions={questions}
        currentItem={currentPage}
        onOpenExitPopup={openExitPopup}
        onNextQuestion={nextQuestion}
        unlockNext={unlockNext}
        onPrevQuestion={prevQuestion}
      />
      <Main skinB="true">
        <MainContent>
          <iframe id="testlet" src="testlets/testlet-biometrics/main.html" title="testlet" />
        </MainContent>
      </Main>
    </>
  );
};

export default PlayerContent;
