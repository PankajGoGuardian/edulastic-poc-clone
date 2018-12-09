export function createStandardsSearch({ curriculumId, grades, search }) {
  const gradesSearchArr = grades.map(el => ({ match_phrase: { grades: el } }));
  return {
    query: {
      bool: {
        must: [
          { match_phrase: { curriculumId } },
          {
            bool: {
              should: gradesSearchArr
            }
          },
          {
            bool: {
              should: [
                { match_phrase: { identifier: search } },
                { match: { description: search } }
              ]
            }
          }
        ]
      }
    }
  };
}
