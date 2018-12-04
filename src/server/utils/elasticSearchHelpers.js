export function createSearchByFieldsRequest(data) {
  const andSearchArr = data.andSearch.map(el => ({ match_phrase: el }));
  const andSearchSubstrArr = data.andSearchSubstr.map(el => ({ match: el }));
  const orSearchArr = data.orSearch.map(el => ({ match_phrase: el }));
  const orSearchSubstrArr = data.orSearchSubstr.map(el => ({ match: el }));
  return {
    query: {
      bool: {
        must: [
          ...andSearchArr,
          ...andSearchSubstrArr,
          {
            bool: {
              should: orSearchArr
            }
          },
          {
            bool: {
              should: orSearchSubstrArr
            }
          }
        ]
      }
    }
  };
}
