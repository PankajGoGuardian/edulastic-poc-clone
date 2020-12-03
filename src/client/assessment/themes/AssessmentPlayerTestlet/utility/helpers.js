/* eslint-disable array-callback-return */
import JXG from 'jsxgraph'
import uuidv4 from 'uuid/v4'
import {
  isEmpty,
  keys,
  isArray,
  flatten,
  last,
  compact,
  flattenDeep,
  round,
  get,
} from 'lodash'
import { questionType } from '@edulastic/constants'
import AppConfig from '../../../../../app-config'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

export const insertTestletMML = (useFrame) => {
  if (useFrame) {
    const head = useFrame.contentWindow.document.getElementsByTagName('head')[0]

    // Define the script
    const script = useFrame.contentWindow.document.createElement('script')
    script.type = 'text/javascript'
    script.src = AppConfig.testletMathJax
    script.text =
      'MathJax.Hub.Config({extensions: ["tex2jax.js"], jax: ["input/TeX","output/HTML-CSS"]}); MathJax.Hub.Startup.onload();'

    head.appendChild(script)

    // Assign this testlet to be loaded with a local MML
    const localMMLAttr = useFrame.contentWindow.document.createAttribute(
      'data-testler'
    )
    localMMLAttr.value = 'true'
    useFrame.contentWindow.document
      .getElementsByTagName('body')[0]
      .setAttributeNode(localMMLAttr)
  }
}

const getLineFromExpression = (
  expressions,
  points = [
    {
      p0: 1,
      p1: 6,
    },
  ],
  labels = []
) => {
  const getLines = (expression, index = 0) => {
    if (!expression) {
      return []
    }

    const getPoint = (x, y, label = false) => ({
      _type: JXG.OBJECT_TYPE_POINT,
      type: 'point',
      x,
      y,
      id: uuidv4(),
      label,
      subElement: true,
    })

    const getPoints = (x, label) => {
      if (expression === 'x=1') {
        return getPoint(1, x, label)
      }
      const _expression = expression.replace(new RegExp('x', 'g'), x)
      try {
        // eslint-disable-next-line no-eval
        const y = round(eval(_expression), 2)
        return getPoint(x, y, label)
      } catch (err) {
        return {}
      }
    }

    const getLine = (p1, p2) => ({
      type: 'line',
      _type: JXG.OBJECT_TYPE_LINE,
      id: uuidv4(),
      label: labels[index] || false,
      subElementsIds: {
        startPoint: p1.id,
        endPoint: p2.id,
      },
    })
    const point1 = getPoints(points[index]?.p0)
    const point2 = getPoints(points[index]?.p1)
    const line = getLine(point1, point2)
    return [line, point1, point2]
  }

  if (typeof expressions === 'string') {
    return getLines(expressions)
  }

  if (Array.isArray(expressions)) {
    return expressions.reduce((lines, expression, lineIdex) => {
      const line = getLines(expression, lineIdex)
      return [...lines, ...line]
    }, [])
  }
  return []
}

const getPoinstFromString = (expression, labels = []) => {
  const pointRegex = new RegExp('([^()]+)', 'g')

  const getPoint = (str) => {
    if (!str) {
      return []
    }
    return (str.match(pointRegex) || []).map((point, pointIndex) => {
      const coords = point.split(',')
      return {
        _type: JXG.OBJECT_TYPE_POINT,
        id: uuidv4(),
        label: labels[pointIndex] || false,
        type: 'point',
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1]),
      }
    })
  }
  if (typeof expression === 'string') {
    return getPoint(expression)
  }
  if (Array.isArray(expression)) {
    return expression.reduce((points, exp) => {
      const point = getPoint(exp)
      return [...points, ...point]
    }, [])
  }
  return []
}

const convertStrToArr = (testletResponseIds) =>
  (testletResponseIds || '').split(',').map((id) => id.trim())

const getSimpleTextAnswer = (testletResponseIds, testletResponses) => {
  const data = testletResponseIds.map((id) => testletResponses[id])
  return last(data)
}

const generateAnswers = {
  [questionType.CLOZE_DRAG_DROP](item, testletResponseIds, testletResponses) {
    const { options } = item
    const data = testletResponseIds
      .map((id) => {
        const value = testletResponses[id]
        const opIndex = ALPHABET.indexOf(value)
        if (options[opIndex] && value) {
          return options[opIndex].value
        }
        return false
      })
      .filter((x) => !!x)

    return data
  },
  [questionType.CLOZE_IMAGE_DRAG_DROP](
    item,
    testletResponseIds,
    testletResponses
  ) {
    const { responses: eduResponses = [], options } = item
    const data = eduResponses.map((eduRes, contIndex) => {
      const value = testletResponses[testletResponseIds[contIndex]]
      const opIndex = ALPHABET.indexOf(value)
      if (value && options[opIndex]) {
        return {
          responseBoxID: eduRes.id,
          optionIds: [options[opIndex].id],
          containerIndex: contIndex,
          // rect: {}, TODO: we will check this property later.
        }
      }
      return {
        responseBoxID: eduRes.id,
        optionIds: [],
        containerIndex: contIndex,
        // rect: {}, TODO: we will check this property later.
      }
    })
    return data
  },
  [questionType.CLOZE_IMAGE_TEXT](item, testletResponseIds, testletResponses) {
    const { responses: options = [] } = item
    const data = {}
    options.forEach((op, index) => {
      const value = testletResponses[testletResponseIds[index]]
      data[op.id] = value || ''
    })

    return data
  },
  [questionType.CLOZE_IMAGE_DROP_DOWN](
    item,
    testletResponseIds,
    testletResponses
  ) {
    const { responses, options } = item
    const data = {}
    responses.forEach((responseBox, index) => {
      const value = testletResponses[testletResponseIds[index]]
      const opIndex = ALPHABET.indexOf(value)
      if (value && options[index]) {
        data[responseBox.id] = options[opIndex][opIndex]
      } else {
        data[responseBox.id] = ''
      }
    })
    return data
  },
  [questionType.CLOZE_IMAGE_DROP_DOWN](
    item,
    testletResponseIds,
    testletResponses
  ) {
    const { responses, options } = item
    const data = {}
    responses.forEach((responseBox, index) => {
      const value = testletResponses[testletResponseIds[index]]
      const opIndex = ALPHABET.indexOf(value)
      if (value && options[index]) {
        data[responseBox.id] = options[opIndex][opIndex]
      } else {
        data[responseBox.id] = ''
      }
    })
    return data
  },
  [questionType.GRAPH](item, testletResponseIds, testletResponses) {
    const { testletAdditionalMetadata } = item
    let additionalData = null
    try {
      additionalData = JSON.parse(testletAdditionalMetadata)
    } catch (error) {
      console.log('Invalid additional mapping data!')
      return null
    }

    if (isEmpty(additionalData)) {
      return null
    }
    const data = testletResponseIds.map((id) => {
      const value = testletResponses[id]
      const { elementType, points, labels } = additionalData[id] || {}
      if (elementType === 'point') {
        return getPoinstFromString(value, labels)
      }
      if (elementType === 'line') {
        return getLineFromExpression(value, points, labels)
      }
      return null
    })

    return flattenDeep(data.filter((d) => !!d))
  },
  [questionType.EXPRESSION_MULTIPART](
    item,
    testletResponseIds,
    testletResponses
  ) {
    const { responseIds: eduResponses, options: eduOptions } = item
    const data = {}
    keys(eduResponses).forEach((key) => {
      data[key] = {}
      eduResponses[key].forEach((op) => {
        let value = testletResponses[testletResponseIds[op.index]]
        if (key === 'dropDowns' && value) {
          const option = eduOptions[op.id]
          const opIndex = ALPHABET.indexOf(value)
          value = option[opIndex]
        }
        data[key][op.id] = { value, index: op.index }
      })
    })

    return data
  },
  [questionType.MULTIPLE_CHOICE](item, testletResponseIds, testletResponses) {
    const { options, testletAdditionalMetadata } = item
    let _alphabet = ALPHABET
    if (testletAdditionalMetadata) {
      _alphabet = testletAdditionalMetadata
    }

    const data = testletResponseIds.map((id) => {
      let value = testletResponses[id]
      if (!value) {
        return
      }
      if (isArray(value)) {
        // multiple response
        return value.map((v) => {
          const opIndex = _alphabet.indexOf(v.trim())
          return options[opIndex]?.value
        })
      }
      value = value.trim()
      // Radio type.
      const opIndex = _alphabet.indexOf(value)
      return options[opIndex]?.value
    })

    return compact(flatten(data))
  },
  [questionType.CLOZE_TEXT](item, testletResponseIds, testletResponses) {
    const { responseIds: eduResponses = [] } = item
    const data = eduResponses.map((eduRes) => {
      const value = testletResponses[testletResponseIds[eduRes.index]]
      return { ...eduRes, value }
    })
    return data
  },
  [questionType.CLOZE_DROP_DOWN](item, testletResponseIds, testletResponses) {
    const { responseIds: eduResponses = [], options } = item
    const data = eduResponses.map((eduRes) => {
      const value = testletResponses[testletResponseIds[eduRes.index]]
      const opIndex = ALPHABET.indexOf(value)
      const optionValue = value ? options[eduRes.id][opIndex] : ''
      return { ...eduRes, value: optionValue }
    })
    return data
  },
  [questionType.MATH](item, testletResponseIds, testletResponses) {
    return getSimpleTextAnswer(testletResponseIds, testletResponses)
  },
  [questionType.ESSAY_RICH_TEXT](item, testletResponseIds, testletResponses) {
    return getSimpleTextAnswer(testletResponseIds, testletResponses)
  },
  [questionType.SHORT_TEXT](item, testletResponseIds, testletResponses) {
    return getSimpleTextAnswer(testletResponseIds, testletResponses)
  },
  [questionType.ESSAY_PLAIN_TEXT](item, testletResponseIds, testletResponses) {
    return getSimpleTextAnswer(testletResponseIds, testletResponses)
  },
  [questionType.TOKEN_HIGHLIGHT](item, testletResponseIds, testletResponses) {
    const tokens = get(item, 'templeWithTokens', []).map((x, i) => ({
      ...x,
      index: i,
    }))

    const data = testletResponseIds
      .map((responseId) => {
        const value = testletResponses[responseId]
        const selections = isArray(value)
          ? value.map((v) => ALPHABET.indexOf(v))
          : [ALPHABET.indexOf(value)]
        const userSelections = {}
        tokens
          .filter((x) => x.active)
          .map((x, i) => {
            userSelections[x.index] = selections.includes(i)
          })

        return tokens.map((x, i) => ({
          index: i,
          value: x.value,
          selected: !!userSelections[i],
        }))
      })
      .filter((d) => !!d)
    return last(data)
  },
  [questionType.CHOICE_MATRIX](item, testletResponseIds, testletResponses) {
    const { responseIds } = item
    const data = {}
    data.value = {}
    testletResponseIds.map((responseId) => {
      let value = testletResponses[responseId]
      if (value) {
        value = value.split(',')
        value.map((v) => {
          const num = v.match(/[0-9]+/)
          const alpha = v.match(/[a-z]+/)
          if (num && alpha) {
            const col = ALPHABET.indexOf(alpha[0])
            const row = num[0] - 1
            if (responseIds[row] && responseIds[row][col]) {
              data.value[responseIds[row][col]] = true
            }
          }
        })
      }
    })
    return data
  },
  [questionType.CLASSIFICATION](item, testletResponseIds, testletResponses) {
    const { possibleResponses, classifications } = item
    const data = {}
    testletResponseIds.forEach((responseId, index) => {
      const value = testletResponses[responseId]
      const classification = classifications[index]
      if (classification) {
        data[classification.id] = []
        const responses = convertStrToArr(value)
        responses.forEach((response) => {
          const opIndex = ALPHABET.indexOf(response)
          if (possibleResponses[opIndex] && response) {
            data[classification.id].push(possibleResponses[opIndex].id)
          }
        })
      }
    })
    return data
  },
  [questionType.CLASSIFICATION](item, testletResponseIds, testletResponses) {
    const { possibleResponses, classifications } = item
    const data = {}
    testletResponseIds.forEach((responseId, index) => {
      const value = testletResponses[responseId]
      const classification = classifications[index]
      if (classification) {
        data[classification.id] = []
        const responses = convertStrToArr(value)
        responses.forEach((response) => {
          const opIndex = ALPHABET.indexOf(response)
          if (possibleResponses[opIndex] && response) {
            data[classification.id].push(possibleResponses[opIndex].id)
          }
        })
      }
    })
    return data
  },
  [questionType.HOTSPOT](item, testletResponseIds, testletResponses) {
    // TODO: need to improve logic if the response ids are greater than 2.
    const data = testletResponseIds.map((id) => {
      const value = testletResponses[id]
      if (isEmpty(value)) {
        return []
      }
      return value.map((v) => ALPHABET.indexOf(v))
    })
    return flatten(data)
  },
}

/**
 * @param   {object} item is an edualstic question
 * @param   {object} responses is the user responses from testlet
 * @returns {any} returns user response
 */
const getUserResponse = (item, responses) => {
  if (generateAnswers[item.type]) {
    const testletResponseIds = convertStrToArr(item.testletResponseIds)
    const scoringIds = convertStrToArr(item.testletQuestionId)
    if (isEmpty(testletResponseIds) || isEmpty(scoringIds)) {
      return null
    }
    let testletResponses = {}
    scoringIds.forEach((scoringId) => {
      testletResponses = {
        ...testletResponses,
        ...(responses[scoringId] || {}),
      }
    })

    return generateAnswers[item.type](
      item,
      testletResponseIds,
      testletResponses
    )
  }
  return null
}

export default getUserResponse

export const getExtDataForQuestion = (item, responses) => {
  const responseIds = convertStrToArr(item.testletResponseIds)
  const questionExtData = {}
  responseIds.forEach((id) => {
    if (responses[id]) {
      questionExtData[id] = responses[id]
    }
  })

  return questionExtData
}
