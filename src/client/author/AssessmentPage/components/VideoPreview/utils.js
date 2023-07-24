import { useEffect, useRef, useState } from 'react'
import * as mjslive from 'markerjs-live'
import * as markerjs2 from 'markerjs2'

export const useStateRef = (initialValue) => {
  const [value, setValue] = useState(initialValue)

  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return [value, setValue, ref]
}

export const getVideoDuration = (videoRef) => {
  return videoRef?.current?.getDuration() || 0
}

export const getCurrentTime = (videoRef) => {
  return videoRef?.current?.getCurrentTime() || 0
}

export const getMarks = (annotations) => {
  const marks = {}
  ;(annotations || [])
    .filter(({ toolbarMode }) => toolbarMode === 'question')
    .forEach(({ qIndex, time }) => {
      marks[Math.floor(time - 1)] = qIndex.toString()
    })

  return marks
}

export const showMarkerArea = (
  annotationContainer,
  markerArea,
  viewMode,
  onDropAnnotation,
  videoRef,
  state
) => {
  if (annotationContainer.current !== null) {
    if (viewMode === 'review') {
      if (markerArea.current) {
        markerArea.current.close()
      }

      markerArea.current = new mjslive.MarkerView(annotationContainer.current)
      markerArea.current.targetRoot = annotationContainer.current

      if (state) {
        const config = {
          height: annotationContainer.current.clientHeight,
          width: annotationContainer.current.clientWidth,
          markers: state.map((item) => item.markerJsData).flat(1),
        }

        markerArea.current.show(config)
      }
    } else {
      if (markerArea.current) {
        markerArea.current.close()
      }

      markerArea.current = new markerjs2.MarkerArea(annotationContainer.current)

      markerArea.current.settings.displayMode = 'inline'
      markerArea.current.targetRoot = annotationContainer.current
      // attach an event handler to assign annotated image back to our image element
      markerArea.current.addEventListener('render', (event) => {
        onDropAnnotation(
          {
            x: event.state.markers[0].left,
            y: event.state.markers[0].top,
            markerJsData: event.state.markers,
            time: Math.floor(videoRef.current.getCurrentTime()),
            toolbarMode: 'markerJs',
          },
          'video'
        )
      })
      // launch marker.js
      markerArea.current.show()
      if (state) {
        markerArea.current.restoreState({
          height: annotationContainer.current.clientHeight,
          width: annotationContainer.current.clientWidth,
          markers: state.map((item) => item.markerJsData).flat(1),
        })
      }
    }
  }
}

export const getNumberStyles = (x, y, scale) => ({
  position: 'absolute',
  top: `${y * scale}px`,
  left: `${x * scale}px`,
  zIndex: 1000,
})

export const getVisibleAnnotation = (annotations, currentTime) => {
  return (annotations || []).filter(
    (annotation) =>
      annotation.time && Math.floor(currentTime) === Math.floor(annotation.time)
  )
}
