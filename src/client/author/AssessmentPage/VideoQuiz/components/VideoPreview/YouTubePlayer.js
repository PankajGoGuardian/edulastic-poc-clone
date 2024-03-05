import React, { useEffect } from 'react'
import { extractVideoId, isInputElement } from '../../utils/videoPreviewHelpers'
import { StyledYouTubePlayer } from '../../styled-components/VideoPreview'
import appConfig from '../../../../../../app-config'
import { SEEK_DATA, KEYCODES } from '../../constants'

const PLAYER_ID = 'youtube-player'
const TAG_ID = 'iframe_api'
const ED_YOUTUBE_SDK = 'https://www.youtubeeducation.com/iframe_api'
const getYoutubeHost = (isVideoQuizAndAIEnabled) =>
  appConfig.edYouTubePlayerKey && isVideoQuizAndAIEnabled
    ? 'https://www.youtubeeducation.com'
    : 'https://www.youtube.com'

const YouTubePlayer = React.forwardRef(
  (
    {
      url,
      playing,
      onPlay,
      onPause,
      onProgress,
      volume,
      muted,
      progressInterval,
      height,
      width,
      config,
      onEnded,
      onReady,
      handleKeyboardSeek,
      isVideoQuizAndAIEnabled,
    },
    ref
  ) => {
    const { playerVars, embedConfig } = config?.youtube || {}
    const onStateChange = (event) => {
      const player = event.target
      if (event.data === 0) {
        onEnded()
      }

      if (event.data === window.YT.PlayerState.PLAYING) {
        onPlay()
        if (onProgress) {
          const interval = setInterval(() => {
            if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
              onProgress({ playedSeconds: player.getCurrentTime() })
            } else {
              clearInterval(interval)
            }
          }, progressInterval)
        }
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        if (onPause) {
          onPause()
        }
      }
    }

    const initialize = () => {
      // Extract the video ID from the URL
      const videoId = extractVideoId(url)
      ref.current = new window.YT.Player(PLAYER_ID, {
        videoId,
        height,
        width,
        host: getYoutubeHost(isVideoQuizAndAIEnabled),
        events: {
          onStateChange,
          onReady,
        },
        playerVars,
        embedConfig,
      })
    }

    const handleKeyDown = (e) => {
      if (ref.current) {
        e = e || window.event
        if (isInputElement(e?.target || document.activeElement)) {
          return true
        }
        const keyCode = window.event ? e.which : e.keyCode
        const isPlaying =
          ref.current?.getPlayerState?.() === window.YT.PlayerState.PLAYING

        if (keyCode == KEYCODES.SPACE) {
          e.preventDefault()
          if (isPlaying) {
            onPause()
          } else {
            onPlay()
          }
          return false
        }

        if (keyCode == KEYCODES.LEFT_ARROW) {
          e.preventDefault()
          handleKeyboardSeek(SEEK_DATA.BACKWARD)
          return false
        }

        if (keyCode == KEYCODES.RIGHT_ARROW) {
          e.preventDefault()
          handleKeyboardSeek(SEEK_DATA.FORWARD)
          return false
        }
      }
    }

    useEffect(() => {
      if (document.getElementById(TAG_ID) === null) {
        // Load the YouTube iframe API script
        const tag = document.createElement('script')
        tag.id = TAG_ID
        tag.src = ED_YOUTUBE_SDK
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        initialize()
      }

      // Initialize the YouTube player when the API script is loaded
      window.onYouTubeIframeAPIReady = () => {
        initialize()
      }

      document.addEventListener('keydown', handleKeyDown)

      // Clean up the YouTube player when the component is unmounted
      return () => {
        if (ref.current) {
          ref.current?.destroy()
        }
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [url])

    useEffect(() => {
      if (ref.current) {
        ref.current?.setVolume?.(volume * 100)
        ref.current?.[muted ? 'mute' : 'unMute']?.()
      }
    }, [volume, muted])

    useEffect(() => {
      if (ref.current) {
        if (playing) {
          ref.current?.playVideo?.()
        } else {
          ref.current?.pauseVideo?.()
        }
      }
    }, [playing])

    return (
      <StyledYouTubePlayer>
        <div id={PLAYER_ID} />
      </StyledYouTubePlayer>
    )
  }
)

export default YouTubePlayer
