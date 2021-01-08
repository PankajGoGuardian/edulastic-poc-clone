export const validations = {
  tolerance: (value = '') => {
    if (!value) {
      return true
    }
    return /^-?\d*\.?\d*$/.test(value)
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
}
