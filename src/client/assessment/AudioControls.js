/* eslint-disable guard-for-in */
/* eslint-disable prefer-promise-reject-errors */
import { white } from '@edulastic/colors'
import { EduButton, notification } from '@edulastic/common'
import { questionType } from '@edulastic/constants'
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
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import AppConfig from '../../app-config'
import { setCurrentAudioDetailsAction } from './actions/test'
import { curentPlayerDetailsSelector } from './selectors/test'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const AudioButton = styled(EduButton)`
  position: relative;
  z-index: 998;
  &.ant-btn.ant-btn-primary.not-supported {
    background: white;
    border: 1px solid #de0b83;
  }
`

const AudioControls = ({
  item: questionData = {},
  btnWithText = false,
  audioSrc,
  qId: targetQId,
  currentPlayingDetails,
  setCurrentPlayingDetails,
  className,
  page,
  hideVisibility,
}) => {
  const [loading, setLoading] = useState(true)
  const [stimulusHowl, setStimulusHowl] = useState({})
  const [optionHowl, setOptionHowl] = useState({})
  const [currentHowl, setCurrentHowl] = useState({})
  const [pageHowls, setPageHowls] = useState([])

  const qId = useMemo(() => targetQId, [targetQId])

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
            .filter((p) => p?.contentAudioUrl)
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
  }, [qId])

  const handlePlayPauseAudio = () => {
    if (loading || !currentHowl) {
      return
    }

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
              Sentry.captureException(
                new Error(
                  `[AudioControls] Option audio missing for choice_${i}`
                )
              )

            if (optionHowl[item]) await audioPlayResolve(optionHowl[item])
            else
              Sentry.captureException(
                new Error(`[AudioControls] Option audio missing for ${item}`)
              )
          }
        }
        asyncPlay()
        setCurrentPlayingDetails(qId)
      })
    } else if (questionData.type === questionType.PASSAGE) {
      if (page > 1) {
        audioPlayResolve(pageHowls[page - 1]).then(() =>
          setCurrentPlayingDetails(qId)
        )
      } else {
        audioPlayResolve(stimulusHowl).then(async () => {
          await audioPlayResolve(pageHowls[page - 1])
          setCurrentPlayingDetails(qId)
        })
      }
    } else {
      audioPlayResolve(stimulusHowl).then(() => setCurrentPlayingDetails(qId))
    }
  }

  const isSupported = Howler.codecs('mp3')

  const handleStopAudio = () => {
    currentHowl?.stop()
    setCurrentPlayingDetails()
  }
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
            IconBtn={!btnWithText}
            onClick={handlePlayPauseAudio}
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
            disabled={currentPlayingDetails.qId !== qId}
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
  }),
  {
    setCurrentPlayingDetails: setCurrentAudioDetailsAction,
  }
)(AudioControls)

const AudioButtonsWrapper = styled.div`
  top: 0px;
  padding: 20px 20px 0;
  ${({ btnWithText, hideVisibility }) => {
    const visibility = hideVisibility ? 'hidden' : 'visible'
    const display = btnWithText ? 'flex' : 'block'
    return css`
      display: ${display};
      visibility: ${visibility};
    `
  }}
`
