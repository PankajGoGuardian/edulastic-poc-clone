import API from "./utils/API";
import _ from "lodash";

const api = new API();

const receiveCurriculums = () => api.callApi({ url: "/curriculum" }).then(result => result.data.result);

const receiveStandards = ({ curriculumId, grades = [], search }) => {
  const data = { curriculumId, grades, search };
  return api
    .callApi({
      method: "post",
      url: "/search/browseStandards",
      data
    })
    .then(result => {
      const mappedRes = result.data.result;
      const elo = mappedRes.filter(item => item.level === "ELO");
      const tlo = _.uniqBy(
        mappedRes.map(item => ({
          identifier: item.tloIdentifier,
          description: item.tloDescription,
          _id: item.tloId
        })),
        "_id"
      );

      return {
        elo,
        tlo
      };
    });
};

export default {
  receiveCurriculums,
  receiveStandards
};
