export const getTestAuthorName = item => {
  const { createdBy = {}, collectionName = "", authors = [] } = item;
  if (collectionName) return collectionName;
  if (createdBy._id) {
    const author = authors.find(item => item._id === createdBy._id) || {};
    return author.name || authors[0].name;
  }
  return authors.length && authors[0].name;
};

export const getTestItemAuthorName = item => {
  const { owner = "", collectionName = "", authors = [] } = item;
  if (collectionName) return collectionName;
  if (owner) {
    const author = authors.find(item => item._id === owner) || {};
    return author.name || authors[0].name;
  }
  return authors.length && authors[0].name;
};

export const getPlaylistAuthorName = item => {
  const {
    _source: {
      createdBy: { name }
    }
  } = item;
  return `${name}`;
};
