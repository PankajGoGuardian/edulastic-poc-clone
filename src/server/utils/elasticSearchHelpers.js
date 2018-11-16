export const createSearchByFieldsRequest = (data) => {
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
};

export const prepareResult = data => (data.hits.hits.map(el => el._source));
