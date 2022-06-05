import { isNumber, isNaN } from 'lodash'

function getCountDecimals(numStr) {
  if (Math.floor(numStr) === parseFloat(numStr)) {
    return 0
  }
  const [, decimals] = (numStr || '').split('.')
  return (decimals || '').length
}

function normalOperation(numberOne, numberTwo, callBack) {
  const oneDecimals = getCountDecimals(numberOne)
  const twoDecimals = getCountDecimals(numberTwo)
  const decimals = Math.max(oneDecimals, twoDecimals)

  const one = numberOne * 10 ** decimals
  const two = numberTwo * 10 ** decimals
  return callBack(one, two, 10 ** decimals)
}

function multiply(numberOne, numberTwo) {
  const oneDecimals = getCountDecimals(numberOne)
  const twoDecimals = getCountDecimals(numberTwo)
  const decimals = oneDecimals + twoDecimals
  const one = numberOne * 10 ** oneDecimals
  const two = numberTwo * 10 ** twoDecimals
  const result = (one * two) / 10 ** decimals

  return result
}

export default function calculate(obj, buttonName) {
  function operate(numberOne, numberTwo, operation) {
    const two = parseFloat(numberTwo)

    if (operation === '+') {
      return normalOperation(numberOne, numberTwo, (a, b, c) => {
        const result = (a + b) / c
        return result.toString()
      })
    }

    if (operation === '-') {
      return normalOperation(numberOne, numberTwo, (a, b, c) => {
        const result = (a - b) / c
        return result.toString()
      })
    }

    if (operation === 'x') {
      const result = multiply(numberOne, numberTwo)
      return result.toString()
    }

    if (operation === '÷') {
      if (two == '0') {
        alert('Divide by 0 error')
        return '0'
      }
      return normalOperation(numberOne, numberTwo, (a, b) => {
        const result = a / b
        return result.toString()
      })
    }
    throw Error(`Unknown operation '${operation}'`)
  }

  if (buttonName === 'AC') {
    return {
      total: null,
      next: null,
      operation: null,
    }
  }

  if (!isNaN(parseFloat(buttonName)) && isNumber(parseFloat(buttonName))) {
    if (buttonName === '0' && obj.next === '0') {
      return {}
    }

    if (obj.operation) {
      if (obj.next) {
        return { next: obj.next + buttonName }
      }
      return { next: buttonName }
    }

    if (obj.next) {
      return {
        next: obj.next + buttonName,
        total: null,
      }
    }
    return {
      next: buttonName,
      total: null,
    }
  }

  if (buttonName === '%') {
    if (obj.operation && obj.next) {
      const result = operate(obj.total, obj.next, obj.operation)
      return {
        total: (parseFloat(result) / 100).toString(),
        next: null,
        operation: null,
      }
    }
    if (obj.next) {
      return {
        next: (parseFloat(obj.next) / 100).toString(),
      }
    }
    return {}
  }

  if (buttonName === '.') {
    if (obj.next) {
      if (obj.next.includes('.')) {
        return {}
      }
      return { next: `${obj.next}.` }
    }
    return { next: '0.' }
  }

  if (buttonName === '=') {
    if (obj.next && obj.operation) {
      return {
        total: operate(obj.total, obj.next, obj.operation),
        next: null,
        operation: null,
      }
    }
    return {}
  }

  if (buttonName === '+/-') {
    if (obj.next) {
      return { next: (-1 * parseFloat(obj.next)).toString() }
    }
    if (obj.total) {
      return { total: (-1 * parseFloat(obj.total)).toString() }
    }
    return {}
  }

  if (obj.operation) {
    return {
      total: operate(obj.total, obj.next, obj.operation),
      next: null,
      operation: buttonName,
    }
  }

  if (!obj.next) {
    return { operation: buttonName }
  }

  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  }
}
