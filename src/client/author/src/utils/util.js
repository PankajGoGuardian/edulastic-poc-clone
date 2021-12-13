import { get } from 'lodash'

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
