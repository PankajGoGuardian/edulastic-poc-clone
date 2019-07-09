import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Howl, Howler } from "howler";
import { IconPlay, IconPause } from "@edulastic/icons";
import styled from "styled-components";
import { connect } from "react-redux";
import { curentPlayerDetailsSelector } from "./selectors/test";
import { setCurrentAudioDetailsAction } from "./actions/test";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const StopIcon = styled.span`
  border: 6px black solid;
`;

const ControlButtons = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 12px;
  margin-right: 10px;
  transition: none;
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

const AudioControls = ({ item: questionData = {}, audioSrc, qId, currentPlayingDetails, setCurrentPlayingDetails }) => {
  const [loading, setLoading] = useState(true);
  const [stimulusHowl, setStimulusHowl] = useState({});
  const [optionHowl, setOptionHowl] = useState({});
  const [currentHowl, setCurrentHowl] = useState({});
  // Loading audio
  const audioLoadResolve = url =>
    new Promise((resolve, reject) => {
      const sound = new Howl({
        src: url
      });
      sound.load();
      sound.on("load", () => {
        resolve(sound);
      });
      sound.on("loaderror", (id, e) => {
        reject({ id, e, url });
      });
    });
  //Playing audio
  const audioPlayResolve = _howl =>
    new Promise(resolve => {
      _howl.play();
      _howl.once("end", () => {
        resolve(_howl);
      });
      setCurrentHowl(_howl);
    });
  //Stop all audios
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
      if (questionData.type === "multipleChoice") {
        const optionUrls = questionData.tts.optionUrls;
        const audioLoad = [];
        const choicePrefix = "https://cdn.edulastic.com/choice-";
        const optionKeys = Object.keys(optionUrls);
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
    if (currentHowl.playing()) {
      currentHowl.pause();
      currentHowl.isPaused = true;
      return setCurrentPlayingDetails();
    }
    if (currentHowl.isPaused) {
      currentHowl.play();
      currentHowl.isPaused = false;
      return setCurrentPlayingDetails(qId);
    }
    stopAllAudios();
    setCurrentPlayingDetails(qId);
    audioPlayResolve(stimulusHowl).then(() => {
      if (questionData.type === "multipleChoice") {
        const { options } = questionData;
        let mapOptById = options.map(item => item.value);
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
      } else {
        setCurrentPlayingDetails();
      }
    });
  };

  const handleStopAudio = () => {
    currentHowl.stop();
    setCurrentPlayingDetails();
  };
  const playPauseToolTip = loading
    ? "We are still processing the audio file for this question. Please return back to this question after some time."
    : currentPlayingDetails.qId === qId
    ? "Pause"
    : "Play";
  return (
    <AudioButtonsWrapper>
      <ControlButtons onClick={handlePlayPauseAudio} loading={loading} title={playPauseToolTip}>
        {currentPlayingDetails.qId === qId ? <IconPause /> : !loading && <IconPlay />}
      </ControlButtons>
      <ControlButtons onClick={handleStopAudio} disabled={currentPlayingDetails.qId !== qId} title={"Stop"}>
        <StopIcon />
      </ControlButtons>
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
  padding: 20px 20px 0px;
`;
