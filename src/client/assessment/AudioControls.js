/* eslint-disable guard-for-in */
/* eslint-disable prefer-promise-reject-errors */
import { white, themeColorBlue } from '@edulastic/colors'
import { EduButton, notification } from '@edulastic/common'
import { questionType } from '@edulastic/constants'
import { playerSkinValues } from '@edulastic/constants/const/test'
import {
  IconAudioPause,
  IconExclamationMark,
  IconPlayBig,
  IconPlayFilled,
  IconStop,
  IconStopCircle,
} from '@edulastic/icons'
import * as Sentry from '@sentry/browser'
import { Tooltip } from 'antd'
import { Howl, Howler } from 'howler'
import React, {
  useImperativeHandle,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import AppConfig from '../../app-config'
import { getTextToSpeechPlaybackSpeed } from '../author/sharedDucks/testPlayer'
import { setCurrentAudioDetailsAction } from './actions/test'
import {
  curentPlayerDetailsSelector,
  playerSkinTypeSelector,
} from './selectors/test'
import { themes } from '../theme'

const { playerSkin } = themes
const { defaultButton, navigationButtons } = playerSkin.sbac

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const { edulastic, drc, parcc, cmas, sbac } = playerSkinValues
const showText = [edulastic, sbac]

const AudioControls = ({
  item: questionData = {},
  audioSrc,
  qId: targetQId,
  currentPlayingDetails,
  setCurrentPlayingDetails,
  className,
  page,
  hideVisibility,
  isPremiumContentWithoutAccess = false,
  ttsPlaybackSpeed,
  playerSkinType,
  isStudentReport,
  controlRef,
}) => {
  const [loading, setLoading] = useState(true)
  const [stimulusHowl, setStimulusHowl] = useState({})
  const [optionHowl, setOptionHowl] = useState({})
  const [currentHowl, setCurrentHowl] = useState({})
  const [pageHowls, setPageHowls] = useState([])

  const qId = useMemo(() => targetQId, [targetQId])

  const btnWithText = showText.includes(playerSkinType?.toLowerCase())

  const ttsAudioPlaybackRate = parseFloat(
    [edulastic, drc, cmas, parcc].includes(playerSkinType) && !isStudentReport
      ? ttsPlaybackSpeed
      : '1'
  )

  const ttsAudioPlaybackRateRef = useRef(ttsAudioPlaybackRate)

  useEffect(() => {
    const findAllPlayingHowls = Howler._howls.filter((item) => item.playing())
    /** Ref is needed to change audio rate for already loaded audio */
    if (ttsAudioPlaybackRateRef?.current) {
      ttsAudioPlaybackRateRef.current = ttsAudioPlaybackRate
    }

    if (findAllPlayingHowls.length) {
      findAllPlayingHowls.forEach((item) => item.rate(ttsAudioPlaybackRate))
    }
  }, [ttsAudioPlaybackRate])

  // Loading audio
  const audioLoadResolve = (url) => {
    const _prom = new Promise((resolve, reject) => {
      const srcArr = [url].filter((a) => a)

      if (!srcArr.length) {
        reject([4, 'Tried to initialize howl with empty urls'], url)
      }

      const sound = new Howl({
        src: srcArr,
        preload: false,
        html5: true,
        rate: ttsAudioPlaybackRateRef.current || 1,
      })

      resolve(sound)

      sound.on('playerror', (...args) => {
        reject({ args, url })
      })
      sound.on('loaderror', (...args) => {
        reject({ args, url })
      })
    })

    _prom.catch((err) => {
      setLoading(false)
      Sentry.withScope((scope) => {
        scope.setExtra('error', err)
        notification({ type: 'error', messageKey: 'ttsErrorMessage' })
        Sentry.captureException(
          new Error('[AudioControls] audio load failure.')
        )
      })
    })

    return _prom
  }

  // Playing audio
  const audioPlayResolve = (_howl) => {
    if (!_howl) return
    _howl.rate(ttsAudioPlaybackRateRef?.current || 1)
    const _prom = new Promise((resolve, reject) => {
      _howl?.load()
      if (_howl?.state() === 'loading' || _howl?.state() === 'unloaded') {
        _howl.on('load', () => {
          if (!_howl?.playing(_howl?._idRef)) _howl._idRef = _howl?.play()
        })
      } else if (!_howl?.playing(_howl?._idRef)) _howl._idRef = _howl?.play()

      _howl?.on('playerror', (...args) => {
        reject({ args })
      })

      setCurrentHowl(_howl)
      _howl?.once('end', () => {
        resolve(_howl)
      })
    })

    _prom.catch((err) => {
      setLoading(false)
      Sentry.withScope((scope) => {
        scope.setExtra('error', err)
        notification({ type: 'error', messageKey: 'ttsErrorMessage' })
        Sentry.captureException(
          new Error('[AudioControls] audio playing failure.')
        )
      })
    })

    return _prom
  }

  // Stop all audios
  const stopAllAudios = () => {
    const findAllPlayingHowls = Howler._howls.filter((item) => item.playing())
    if (findAllPlayingHowls.length) {
      findAllPlayingHowls.forEach((item) => item.stop())
    }
  }

  useEffect(() => {
    const isSupported = Howler.codecs('mp3')

    if (!isSupported) {
      notification({ type: 'error', msg: 'Audio format is not supported.' })
      Sentry.captureException(new Error('[AudioControls] Mp3 not supported.'))
    }
  }, [])

  useEffect(() => {
    if (!audioSrc) return
    audioLoadResolve(audioSrc).then((sound) => {
      setStimulusHowl(sound)
      setCurrentHowl(sound)
      if (questionData.type === questionType.MULTIPLE_CHOICE) {
        const optionUrls = questionData.tts.optionUrls
        const audioLoad = []
        const choicePrefix = `${AppConfig.ttsChoicesPath}/choice-`
        const optionKeys = (optionUrls && Object.keys(optionUrls)) || []
        optionKeys.forEach((item, i) => {
          const choiceVal = ALPHABET[i]
          const choiceAudio = `${choicePrefix}${choiceVal}.mp3`
          audioLoad[optionKeys.length + i + 1] = audioLoadResolve(
            choiceAudio
          ).then((choice) => {
            setOptionHowl((prev) => ({ ...prev, [`choice_${i}`]: choice }))
            if (!optionUrls?.[item].optionAudioURL) return
            audioLoad[i] = audioLoadResolve(optionUrls?.[item].optionAudioURL)
            audioLoad[i].then((val) => {
              setOptionHowl((prev) => ({ ...prev, [item]: val }))
            })
          })
        })
        Promise.all(audioLoad).then(() => {
          setLoading(false)
        })
      } else if (questionData.type === questionType.PASSAGE) {
        if (!questionData.paginated_content) {
          if (!questionData?.tts?.content.contentAudioURL) return
          audioLoadResolve(questionData?.tts?.content.contentAudioURL).then(
            (contentAudio) => {
              setPageHowls([contentAudio])
              setLoading(false)
            }
          )
        } else {
          const pageAudio = questionData.tts.pages
            .filter((p) => p?.contentAudioURL)
            .map((p) => audioLoadResolve(p?.contentAudioURL))

          if (pageAudio.length) {
            Promise.all(pageAudio).then((contentAudios) => {
              setPageHowls(contentAudios)
              setLoading(false)
            })
          } else {
            setLoading(false)
          }
        }
      } else {
        setLoading(false)
      }
    })

    return () => {
      setCurrentPlayingDetails()
      stopAllAudios()
      Howler.unload()
    }
  }, [qId, audioSrc])

  const handleStopAudio = () => {
    currentHowl?.stop()
    setCurrentPlayingDetails()
  }

  const handlePlayPauseAudio = () => {
    if (loading || !currentHowl) {
      return
    }

    currentHowl.rate(ttsAudioPlaybackRateRef?.current)
    if (currentHowl?.playing()) {
      currentHowl.pause()
      currentHowl.isPaused = true
      return setCurrentPlayingDetails()
    }
    if (currentHowl?.isPaused) {
      currentHowl.play()
      currentHowl.isPaused = false
      return setCurrentPlayingDetails(qId)
    }
    handleStopAudio()
    stopAllAudios()
    setCurrentPlayingDetails(qId)

    if (questionData.type === questionType.MULTIPLE_CHOICE) {
      audioPlayResolve(stimulusHowl).then(() => {
        const { options } = questionData
        const mapOptById = options.map((item) => item.value)
        const asyncPlay = async () => {
          for (const i in mapOptById) {
            const item = mapOptById[i]
            const choiceAudioHowl = optionHowl[`choice_${i}`]

            if (choiceAudioHowl) await audioPlayResolve(choiceAudioHowl)
            else
              Sentry.captureMessage(
                `[AudioControls] Option audio missing for choice_${i}`,
                'info'
              )

            if (optionHowl[item]) await audioPlayResolve(optionHowl[item])
            else
              Sentry.captureMessage(
                `[AudioControls] Option audio missing for ${item}`,
                'info'
              )
          }
          setCurrentPlayingDetails()
        }
        asyncPlay()
      })
    } else if (questionData.type === questionType.PASSAGE) {
      if (page > 1) {
        audioPlayResolve(pageHowls[page - 1]).then(() =>
          setCurrentPlayingDetails()
        )
      } else {
        audioPlayResolve(stimulusHowl).then(async () => {
          await audioPlayResolve(pageHowls[page - 1])
          setCurrentPlayingDetails()
        })
      }
    } else {
      audioPlayResolve(stimulusHowl).then(() => setCurrentPlayingDetails())
    }
  }

  useImperativeHandle(controlRef, () => ({
    play: handlePlayPauseAudio,
    stop: handleStopAudio,
  }))

  const isSupported = Howler.codecs('mp3')

  const playPauseToolTip = loading
    ? 'We are still processing the audio file for this question. Please return back to this question after some time.'
    : currentPlayingDetails.qId === qId
    ? 'Pause'
    : 'Play'

  return (
    <AudioButtonsWrapper
      btnWithText={btnWithText}
      hideVisibility={hideVisibility}
      className={className}
    >
      {isSupported ? (
        <>
          <AudioButton
            title={!btnWithText ? playPauseToolTip : ''}
            loading={loading}
            height="40px"
            ml="0px"
            IconBtn={!btnWithText}
            onClick={handlePlayPauseAudio}
            playerSkinType={playerSkinType}
            disabled={isPremiumContentWithoutAccess}
          >
            {currentPlayingDetails.qId === qId ? (
              <>
                {btnWithText ? (
                  <>
                    <IconAudioPause /> PAUSE
                  </>
                ) : (
                  <IconAudioPause color={white} className="audio-pause" />
                )}
              </>
            ) : (
              <>
                {btnWithText ? (
                  <>
                    <IconPlayBig /> PLAY
                  </>
                ) : (
                  <IconPlayFilled color={white} className="audio-play" />
                )}
              </>
            )}
          </AudioButton>
          <AudioButton
            title={!btnWithText ? 'Stop' : ''}
            loading={loading}
            height="40px"
            IconBtn={!btnWithText}
            onClick={handleStopAudio}
            playerSkinType={playerSkinType}
            disabled={
              currentPlayingDetails.qId !== qId || isPremiumContentWithoutAccess
            }
          >
            <>
              {btnWithText ? (
                <>
                  <IconStopCircle /> STOP
                </>
              ) : (
                <IconStop color={white} className="audio-stop" />
              )}
            </>
          </AudioButton>
        </>
      ) : (
        <Tooltip title="MP3 playback is not supported in this browser">
          <AudioButton
            height="40px"
            IconBtn={!btnWithText}
            className="not-supported"
            playerSkinType={playerSkinType}
            disabled
          >
            <IconExclamationMark width={20} height={20} color={white} />
          </AudioButton>
        </Tooltip>
      )}
    </AudioButtonsWrapper>
  )
}

export default connect(
  (state) => ({
    currentPlayingDetails: curentPlayerDetailsSelector(state),
    ttsPlaybackSpeed: getTextToSpeechPlaybackSpeed(state),
    playerSkinType: playerSkinTypeSelector(state),
  }),
  {
    setCurrentPlayingDetails: setCurrentAudioDetailsAction,
  }
)(AudioControls)

const AudioButtonsWrapper = styled.div`
  top: 0px;
  padding: 8px 16px;
  ${({ btnWithText, hideVisibility }) => {
    const visibility = hideVisibility ? 'hidden' : 'visible'
    const display = btnWithText ? 'flex' : 'block'
    return css`
      display: ${display};
      visibility: ${visibility};
    `
  }}
`

const buttonStyles = {
  sbac: css`
    &.ant-btn.ant-btn-primary {
      background: ${navigationButtons.background};
      color: ${navigationButtons.color};
      border: 1px solid ${navigationButtons.color};

      svg {
        fill: ${navigationButtons.color};
      }

      &:hover {
        border: 1px solid ${defaultButton.hover.background};
        color: ${defaultButton.hover.color};
        background: ${defaultButton.hover.background};

        svg {
          fill: ${defaultButton.hover.color};
        }
      }
      &:active,
      &:focus {
        outline: 0;
        box-shadow: none !important;
        background: ${defaultButton.hover.background};
      }
    }
  `,
}

const AudioButton = styled(EduButton)`
  position: relative;
  z-index: 998;

  &.ant-btn.ant-btn-primary.not-supported {
    background: white;
    border: 1px solid #de0b83;
  }
  &:focus {
    border: none;
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }

  ${({ playerSkinType }) => buttonStyles[playerSkinType]}
`
