import clickSound from './data/click-sound.base64.json'

export function playClickAudio() {
  const audio = new Audio(`data:audio/mp3;base64,${clickSound.base64}`)
  audio.play()
}

export function printCameraInfo(info) {
  console.info('react-html5-camera-photo info:', info)
}
