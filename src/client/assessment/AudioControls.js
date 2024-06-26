/* eslint-disable guard-for-in */
/* eslint-disable prefer-promise-reject-errors */
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Howl, Howler } from "howler";
import styled, { css } from "styled-components";
import { connect } from "react-redux";

import { questionType } from "@edulastic/constants";
import { EduButton } from "@edulastic/common";
import { themeColor, white } from "@edulastic/colors";
import { IconPlayFilled, IconAudioPause, IconStop, IconStopCircle, IconPlayBig } from "@edulastic/icons";

import { curentPlayerDetailsSelector } from "./selectors/test";
import { setCurrentAudioDetailsAction } from "./actions/test";
import AppConfig from "../../../app-config";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const ControlButtons = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 12px;
  margin-right: 10px;
  transition: none;
  background: ${themeColor};
  position: relative;
  z-index: 1020;
  &.ant-btn[disabled] {
    background: ${themeColor};
  }
  &:hover,
  &:focus,
  &:active {
    background: ${themeColor};
  }

  i {
    position: absolute;
    left: 13px;
    top: 12px;
  }
  &.ant-btn.ant-btn-loading {
    pointer-events: all;
    cursor: default;
  }
`;

const AudioButton = styled(EduButton)`
  position: relative;
  z-index: 1020;
`;

const AudioControls = ({
  item: questionData = {},
  btnWithText = false,
  audioSrc,
  qId,
  currentPlayingDetails,
  setCurrentPlayingDetails,
  className,
  page,
  hideVisibility
}) => {
  const [loading, setLoading] = useState(true);
  const [stimulusHowl, setStimulusHowl] = useState({});
  const [optionHowl, setOptionHowl] = useState({});
  const [currentHowl, setCurrentHowl] = useState({});
  const [pageHowls, setPageHowls] = useState([]);

  // Loading audio
  const audioLoadResolve = url =>
    new Promise((resolve, reject) => {
      const sound = new Howl({
        src: url,
        html5: true
      });
      sound.load();
      sound.on("load", () => {
        resolve(sound);
      });
      sound.on("loaderror", (id, e) => {
        reject({ id, e, url });
      });
    });

  // Playing audio
  const audioPlayResolve = _howl =>
    new Promise(resolve => {
      _howl?.play();
      _howl?.once("end", () => {
        resolve(_howl);
      });
      setCurrentHowl(_howl);
    });

  // Stop all audios
  const stopAllAudios = () => {
    const findAllPlayingHowls = Howler._howls.filter(item => item.playing());
    if (findAllPlayingHowls.length) {
      findAllPlayingHowls.forEach(item => item.stop());
    }
  };

  useEffect(() => {
    if (!audioSrc) return;
    audioLoadResolve(audioSrc).then(sound => {
      setStimulusHowl(sound);
      setCurrentHowl(sound);
      if (questionData.type === questionType.MULTIPLE_CHOICE) {
        const optionUrls = questionData.tts.optionUrls;
        const audioLoad = [];
        const choicePrefix = `${AppConfig.ttsChoicesPath}/choice-`;
        const optionKeys = (optionUrls && Object.keys(optionUrls)) || [];
        optionKeys.forEach((item, i) => {
          const choiceVal = ALPHABET[i];
          const choiceAudio = `${choicePrefix}${choiceVal}.mp3`;
          audioLoad[optionKeys.length + i + 1] = audioLoadResolve(choiceAudio).then(choice => {
            setOptionHowl(prev => ({ ...prev, [`choice_${i}`]: choice }));
            audioLoad[i] = audioLoadResolve(optionUrls[item].optionAudioURL);
            audioLoad[i].then(val => {
              setOptionHowl(prev => ({ ...prev, [item]: val }));
            });
          });
        });
        Promise.all(audioLoad).then(() => {
          setLoading(false);
        });
      } else if (questionData.type === questionType.PASSAGE) {
        if (!questionData.paginated_content) {
          audioLoadResolve(questionData.tts.content.contentAudioURL).then(contentAudio => {
            setPageHowls([contentAudio]);
            setLoading(false);
          });
        } else {
          Promise.all(questionData.tts.pages.map(p => audioLoadResolve(p.contentAudioURL))).then(contentAudios => {
            setPageHowls(contentAudios);
            setLoading(false);
          });
        }
      } else {
        setLoading(false);
      }
    });
    return () => {
      setCurrentPlayingDetails();
      stopAllAudios();
      Howler.unload();
    };
  }, [qId]);

  const handlePlayPauseAudio = () => {
    if (loading) return;
    if (currentHowl?.playing()) {
      currentHowl.pause();
      currentHowl.isPaused = true;
      return setCurrentPlayingDetails();
    }
    if (currentHowl?.isPaused) {
      currentHowl.play();
      currentHowl.isPaused = false;
      return setCurrentPlayingDetails(qId);
    }
    stopAllAudios();
    setCurrentPlayingDetails(qId);

    if (questionData.type === questionType.MULTIPLE_CHOICE) {
      audioPlayResolve(stimulusHowl).then(() => {
        const { options } = questionData;
        const mapOptById = options.map(item => item.value);
        const asyncPlay = async () => {
          for (const i in mapOptById) {
            const item = mapOptById[i];
            const choiceAudioHowl = optionHowl[`choice_${i}`];
            await audioPlayResolve(choiceAudioHowl);
            await audioPlayResolve(optionHowl[item]);
          }
          setCurrentPlayingDetails();
        };
        asyncPlay();
      });
    } else if (questionData.type === questionType.PASSAGE) {
      if (page > 1) {
        audioPlayResolve(pageHowls[page - 1]).then(() => setCurrentPlayingDetails());
      } else {
        audioPlayResolve(stimulusHowl).then(async () => {
          await audioPlayResolve(pageHowls[page - 1]);
          setCurrentPlayingDetails();
        });
      }
    } else {
      audioPlayResolve(stimulusHowl).then(() => setCurrentPlayingDetails());
    }
  };

  const handleStopAudio = () => {
    currentHowl?.stop();
    setCurrentPlayingDetails();
  };
  const playPauseToolTip = loading
    ? "We are still processing the audio file for this question. Please return back to this question after some time."
    : currentPlayingDetails.qId === qId
    ? "Pause"
    : "Play";
  return !btnWithText ? (
    <AudioButtonsWrapper btnWithText={btnWithText} hideVisibility={hideVisibility} className={className}>
      <ControlButtons onClick={handlePlayPauseAudio} loading={loading} title={playPauseToolTip}>
        {currentPlayingDetails.qId === qId ? (
          <IconAudioPause color={white} className="audio-pause" />
        ) : (
          !loading && <IconPlayFilled color={white} className="audio-play" />
        )}
      </ControlButtons>
      <ControlButtons onClick={handleStopAudio} disabled={currentPlayingDetails.qId !== qId} title="Stop">
        <IconStop color={white} className="audio-stop" />
      </ControlButtons>
    </AudioButtonsWrapper>
  ) : (
    <AudioButtonsWrapper btnWithText={btnWithText} hideVisibility={hideVisibility} className={className}>
      <AudioButton height="40px" onClick={handlePlayPauseAudio}>
        {currentPlayingDetails.qId === qId ? (
          <>
            <IconAudioPause />
            PAUSE
          </>
        ) : (
          !loading && (
            <>
              <IconPlayBig />
              PLAY
            </>
          )
        )}
      </AudioButton>
      <AudioButton height="40px" onClick={handleStopAudio} disabled={currentPlayingDetails.qId !== qId}>
        <IconStopCircle />
        STOP
      </AudioButton>
    </AudioButtonsWrapper>
  );
};

export default connect(
  state => ({
    currentPlayingDetails: curentPlayerDetailsSelector(state)
  }),
  {
    setCurrentPlayingDetails: setCurrentAudioDetailsAction
  }
)(AudioControls);

const AudioButtonsWrapper = styled.div`
  top: 0px;
  padding: 20px 20px 0;
  ${({ btnWithText, hideVisibility }) => {
    const visibility = hideVisibility ? "hidden" : "visible";
    const display = btnWithText ? "flex" : "block";
    return css`
      display: ${display};
      visibility: ${visibility};
    `;
  }}
`;
