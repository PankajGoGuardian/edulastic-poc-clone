import { get, isEmpty } from 'lodash'

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
  if (
    questions.length === 1 &&
    questions[0]?.rubrics?.name &&
    questions[0]?.rubrics?._id
  ) {
    rubricNames = [questions[0].rubrics]
  } else {
    rubricNames = questions
      .map((q, index) => {
        if (q?.rubrics?.name && q?.rubrics?._id) {
          return {
            name: `Q${index + 1}: ${q.rubrics.name}`,
            _id: q.rubrics._id,
          }
        }
        return {}
      })
      .filter((rubricData) => !isEmpty(rubricData))
  }
  return rubricNames.filter((name) => name)
}
