export function createSearchByFieldsRequest(data) {
  const andSearchArr = data.andSearch ? data.andSearch.map(el => ({ match_phrase: el })) : [];
  const orSearchArr = data.orSearch ? data.orSearch.map(el => ({ match_phrase: el })) : [];
  return {
    query: {
      bool: {
        must: [
          ...andSearchArr,
          {
            bool: {
              should: orSearchArr,
            },
          },
        ],
      },
    },
  };
}

export function prepareResult(data) {
  return data.hits.hits.map(el => el._source);
}
