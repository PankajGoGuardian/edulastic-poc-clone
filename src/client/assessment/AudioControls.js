import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { Howl, Howler } from "howler";
import { IconPlay, IconPause } from "@edulastic/icons";
import styled from "styled-components";
import { connect } from "react-redux";
import { curentPlayerDetailsSelector } from "./selectors/test";
import { setCurrentAudioDetailsAction } from "./actions/test";

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
`;

const AudioControls = ({ item: questionData, audioSrc, qId, currentPlayingDetails, setCurrentPlayingDetails }) => {
  const [loading, setLoading] = useState(true);
  const [stimulusHowl, setStimulusHowl] = useState({});
  const [optionHowl, setOptionHowl] = useState({});
  const [currentHowl, setCurrentHowl] = useState({});
  const audioLoadResolve = url =>
    new Promise((resolve, reject) => {
      const sound = new Howl({
        src: url
      });
      sound.load();
      sound.once("load", () => {
        resolve(sound);
      });
      sound.once("loaderror", () => {
        reject(sound);
      });
    });
  const audioPlayResolve = _howl =>
    new Promise(resolve => {
      _howl.play();
      _howl.once("end", () => {
        resolve(_howl);
      });
      setCurrentHowl(_howl);
    });

  useEffect(() => {
    if (!audioSrc) return;
    audioLoadResolve(audioSrc).then(sound => {
      setStimulusHowl(sound);
      setCurrentHowl(sound);
      if (questionData.type === "multipleChoice") {
        const optionUrls = questionData.tts.optionUrls;
        const audioLoad = [];
        Object.keys(optionUrls).forEach((item, i) => {
          audioLoad[i] = audioLoadResolve(optionUrls[item].optionAudioURL);
          audioLoad[i].then(val => {
            setOptionHowl(prev => ({ ...prev, [item]: val }));
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
    const findAllPlayingHowls = Howler._howls.filter(item => item.playing());
    if (findAllPlayingHowls.length) {
      findAllPlayingHowls.forEach(item => item.stop());
    }
    setCurrentPlayingDetails(qId);
    audioPlayResolve(stimulusHowl).then(() => {
      if (questionData.type === "multipleChoice") {
        const { options } = questionData;
        let mapOptById = options.map(item => item.value);
        const asyncPlay = async () => {
          for (const item of mapOptById) {
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

  return (
    <div>
      <ControlButtons onClick={handlePlayPauseAudio} loading={loading}>
        {currentPlayingDetails.qId === qId ? <IconPause /> : !loading && <IconPlay />}
      </ControlButtons>
      <ControlButtons onClick={handleStopAudio} disabled={currentPlayingDetails.qId !== qId}>
        <StopIcon />
      </ControlButtons>
    </div>
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
