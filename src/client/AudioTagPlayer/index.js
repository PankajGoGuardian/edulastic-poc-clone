import React, { useState, useEffect, useRef } from 'react'
import { Howl, Howler } from 'howler'
import * as Sentry from '@sentry/browser'
import useInterval from '@use-it/interval'
import moment from 'moment'
import {
  Container,
  Heading,
  PlayerContainer,
  PlayerProgressContainer,
  PlayerProgressBar,
  PlayerBtnsContainer,
  PlayerBtn,
  PlayerTimer,
} from './styled'

const PLAY = 'Audio Playing'
const PAUSE = 'Audio Paused'
const STOP = 'Audio Stopped'
const AUDIO_URL = `https://s3.us-east-1.amazonaws.com/edulastic-p/tts/title_5f7c6676c91f570008b9039a_d8ee1dae-9bde-4ba5-b86b-1901dcd5235c_.b50306d3-fdd5-4557-8f49-6b7b43312f7e.mp3`

const getFormattedTime = (t) => {
  const duration = moment.duration(t)
  const h = duration.hours() || 0
  const m = duration.minutes() || 0
  const s = duration.seconds() || 0
  const time = `${h > 9 ? h : `0${h}`} : ${m > 9 ? m : `0${m}`} : ${
    s > 9 ? s : `0${s}`
  }`
  return time
}

const AudioTagPlayer = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(null)
  const [player, setPlayer] = useState(null)
  const [currentProgress, setCurrentProgress] = useState(0)

  const htmlAudioNode = useRef()

  const { _id, role, districtId, kid } = user || {}

  const loadAudio = (url) =>
    new Promise((resolve, reject) => {
      const audio = new Howl({
        src: url,
        html5: true,
      })
      audio.load()
      audio.on('load', () => resolve(audio))
      audio.on('loaderror', (id, err) => reject(new Error({ id, err, url })))
      audio.on('playerror', (id, err) => reject(new Error({ id, err, url })))
    })

  const handlePlay = () => {
    if (loading || player === PLAY || !current) return
    setPlayer(PLAY)
    current.play()
  }

  const handlePause = () => {
    if (loading || player === PAUSE || !current) return
    setPlayer(PAUSE)
    current.pause()
  }

  const handleStop = () => {
    if (loading || player === STOP || !current) return
    setPlayer(STOP)
    current.stop()
  }

  useEffect(() => {
    loadAudio(AUDIO_URL)
      .then((data) => {
        setCurrent(data)
      })
      .catch((err) => {
        console.log('OOPS: ', err)
        Sentry.withScope((scope) => {
          scope.setExtra('howler-audio-error', err)
          scope.setTags({
            userId: _id,
            districtId,
            role,
            tid: window.sessionStorage.tid,
            kid: kid || window.sessionStorage.kid,
          })
          Sentry.captureException(
            new Error('[Audio Test - Howler] Loading Audio Failed.')
          )
        })
      })
      .finally(() => setLoading(false))

    return () => {
      handleStop()
      Howler.unload()
    }
  }, [])

  useEffect(() => {
    if (current) {
      current.on('end', () => setPlayer(null))
    }
  }, [current])

  useEffect(() => {
    if (htmlAudioNode && htmlAudioNode.current) {
      htmlAudioNode.current.onerror = (err) => {
        Sentry.withScope((scope) => {
          scope.setExtra('html5-audio-error', err)
          scope.setTags({
            userId: _id,
            districtId,
            role,
            tid: window.sessionStorage.tid,
            kid: kid || window.sessionStorage.kid,
          })
          Sentry.captureException(
            new Error('[Audio Test - HTML5] Loading Audio Failed.')
          )
        })
      }
    }
  }, [htmlAudioNode, htmlAudioNode?.current])

  useInterval(() => {
    if (player === PLAY && current) {
      setCurrentProgress(current.seek())
    }
  }, 100)

  const showPlayBtn = [PAUSE, STOP, null].includes(player)

  const duration = (current && current._duration) || '-'
  const progressValue = Math.round((currentProgress / duration) * 100 || 0)

  return (
    <Container>
      <Heading title="Built on howler.js and custom components">
        Edulastic - Audio Tag Player
      </Heading>
      <PlayerContainer>
        <PlayerBtnsContainer>
          {showPlayBtn ? (
            <PlayerBtn onClick={handlePlay}>
              <i class="fa fa-play-circle"></i>
              {/* <span>PLAY</span> */}
            </PlayerBtn>
          ) : (
            <PlayerBtn onClick={handlePause}>
              <i class="fa fa-pause-circle"></i>
              {/* <span>PAUSE</span> */}
            </PlayerBtn>
          )}
        </PlayerBtnsContainer>
        <PlayerProgressContainer>
          <PlayerProgressBar value={progressValue} max="100" />
        </PlayerProgressContainer>
        <PlayerTimer>
          {getFormattedTime((currentProgress || 0) * 1000)} /{' '}
          {getFormattedTime((duration || 0) * 1000)}
        </PlayerTimer>
      </PlayerContainer>
      <br />
      <br />
      <br />
      <Heading title="Built with HTML5 audio element">
        Browser - Audio Tag Player
      </Heading>
      <div style={{ marginTop: '30px' }}>
        <audio ref={htmlAudioNode} controls src={AUDIO_URL}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </div>
    </Container>
  )
}

export default AudioTagPlayer
