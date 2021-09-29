const allowedNumbersRegex = new RegExp('[0-9]+')

export default {
  decimal: (evt) => {
    const pressedKey = String.fromCharCode(
      !evt.charCode ? evt.which : evt.charCode
    )
    const allowedKeys = [8, 9, 37, 38, 39, 40] // to allow arrow keys, backspace and tab
    if (
      !(
        allowedKeys.includes(evt?.which || evt?.charCode) ||
        allowedNumbersRegex?.test(pressedKey)
      )
    ) {
      evt.stopPropagation()
      evt.preventDefault()
      return
    }
    return pressedKey
  },
  step: (evt) => {
    const pressedKey = String.fromCharCode(
      !evt.charCode ? evt.which : evt.charCode
    )
    // allow arrow keys, backspace, tab, and decimal
    const allowedKeys = [8, 9, 37, 38, 39, 40, 110, 190]
    if (
      !(
        allowedKeys.includes(evt?.which || evt?.charCode) ||
        allowedNumbersRegex?.test(pressedKey)
      )
    ) {
      evt.stopPropagation()
      evt.preventDefault()
      return
    }
    return pressedKey
  },
  numSequence: (evt) => {
    if (evt.shiftKey) {
      evt.stopPropagation()
      evt.preventDefault()
      return
    }
    const pressedKey = String.fromCharCode(
      !evt.charCode ? evt.which : evt.charCode
    )
    // allow arrow keys, backspace, delete, tab, minus, dot, and comma
    const allowedKeys = [8, 9, 37, 38, 39, 40, 46, 188, 189, 190]
    if (
      !(
        allowedKeys.includes(evt?.which || evt?.charCode) ||
        allowedNumbersRegex?.test(pressedKey)
      )
    ) {
      evt.stopPropagation()
      evt.preventDefault()
      return
    }
    return pressedKey
  },
}
