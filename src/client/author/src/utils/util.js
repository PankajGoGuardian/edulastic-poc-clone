import { get, maxBy } from 'lodash'
import Color from 'color'

export const convertCollectionOptionsToArray = (options = []) => {
  const data = {}
  options.forEach((o) => {
    if (data[o.props._id]) {
      data[o.props._id].bucketIds.push(o.props.value)
    } else {
      data[o.props._id] = {
        _id: o.props._id,
        name: o.props.collectionName,
        type: o.props.type,
        bucketIds: [o.props.value],
      }
    }
  })

  return Object.values(data)
}

export const getAllRubricNames = (item = {}) => {
  const questions = get(item, 'data.questions', [])
  let rubricNames = []
  if (questions.length === 1 && questions[0]?.rubrics?.name) {
    rubricNames = [questions[0].rubrics.name]
  } else {
    rubricNames = questions.map((q, index) => {
      if (q?.rubrics?.name) {
        return `Q${index + 1}: ${q.rubrics.name}`
      }
      return ''
    })
  }
  return rubricNames.filter((name) => name)
}

/**
 * Get the foreground color which is most visible on the background color
 * @param {string} bgColorStr - Background color string. Could be hex, rgb, rgba, hsl, hsla or named color
 */
export function getFGColor(bgColorStr) {
  return Color(bgColorStr).isLight() ? '#000000' : '#FFFFFF'
}

/**
 * Get the most visible foreground color from the list of foreground colors on the background color
 * @template {string} T
 * @param {T[]} fgColorList list of foreground colors to choose from
 * @param {string} bgColorStr background color
 * @returns {T} most visible foreground color
 */
export function pickFGColor(fgColorList, bgColorStr) {
  const bgColor = Color(bgColorStr)
  const mostVisibleFGColor = maxBy(fgColorList, (fgColor) =>
    bgColor.contrast(Color(fgColor))
  )
  return mostVisibleFGColor
}
