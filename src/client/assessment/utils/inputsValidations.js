export const validations = {
  tolerance: (value = '', isGraph) => {
    if (!value) {
      return true
    }
    if (!isGraph) {
      return (
        /^(0|[1-9]\d*)?%?$/.test(value) &&
        parseInt(value, 10) >= 0 &&
        parseInt(value, 10) <= 100
      )
    }
    return /^-?\d*\.?\d*$/.test(value) && value >= 0 && value <= 100
  },
  isIn: (value = '') => {
    if (!value) {
      return true
    }
    return /^-?\+?(0|[1-9]\d*)?%?$/.test(value)
  },
  satisfies: (value = '') => {
    if (!value) {
      return true
    }
    return /^-?\+?(0|[1-9]\d*)?%?$/.test(value)
  },
  significantDecimalPlaces: (value = '') => {
    if (!value) {
      return true
    }
    return /^(0|[1-9]\d*)?$/g.test(value)
  },
  minorTicks: (value = '') => {
    if (!value) {
      return true
    }
    return /^\d+$/g.test(value)
  },
}
