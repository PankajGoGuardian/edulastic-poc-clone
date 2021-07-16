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
