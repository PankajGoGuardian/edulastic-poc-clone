export function createSearchByFieldsRequest(data) {
  const andSearchArr = data.andSearch.map(el => ({ match_phrase: el }));
  const orSearchArr = data.orSearch.map(el => ({ match_phrase: el }));
  return {
    query: {
      bool: {
        must: [
          ...andSearchArr,
          {
            bool: {
              should: orSearchArr
            }
          }
        ]
      }
    }
  };
}
