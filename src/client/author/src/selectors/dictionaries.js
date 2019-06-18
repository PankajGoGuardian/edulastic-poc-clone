import { createSelector } from "reselect";
import { uniqBy, groupBy } from "lodash";
import selectData from "../../TestPage/components/common/selectsData";
import { getInterestedCurriculumsSelector } from "../selectors/user";
const { defaultStandards } = selectData;
export const stateSelector = state => state.dictionaries;
export const curriculumsSelector = createSelector(
  stateSelector,
  state => state.curriculums
);
export const getCurriculumsListSelector = createSelector(
  curriculumsSelector,
  state => state.curriculums
);

export const getFormattedCurriculumsSelector = (state, props) => {
  const { subject = "" } = props;
  let defaultStandard = {};
  const interestedCurriculums = getInterestedCurriculumsSelector(state);
  const interestedCurriculumsBySubject = interestedCurriculums
    .filter(item => (!subject ? true : item.subject === subject))
    .sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1));
  const allCurriculums = getCurriculumsListSelector(state);
  const allCurriculumsBySubject = allCurriculums
    .filter(item => {
      if (!subject) return true;
      /** Getting the default standard from curriculums while filtering based on subject.
       * User should be able to see the default standard at the top of the standard set list
       *  */
      if (item.curriculum === defaultStandards[subject]) {
        defaultStandard = item;
        return false;
      }
      return item.subject === subject;
    })
    .sort((a, b) => (a.curriculum.toUpperCase() > b.curriculum.toUpperCase() ? 1 : -1));
  const interestedCurriculumByOrgType = groupBy(interestedCurriculumsBySubject, curriculum => curriculum.orgType);
  // return if teacher has selected curriculums
  if (interestedCurriculumByOrgType.teacher && interestedCurriculumByOrgType.teacher.length) {
    return interestedCurriculumByOrgType.teacher.map(item => ({ value: item._id, text: item.name }));
  }
  // break line only if interested curriculums are selected by admins and create uniq curriculums
  const uniqCurriculums = interestedCurriculumsBySubject.length
    ? uniqBy(
        [
          defaultStandard,
          ...interestedCurriculumsBySubject,
          { _id: "----------", name: "----------", disabled: true },
          ...allCurriculumsBySubject
        ],
        "_id"
      )
    : [defaultStandard, ...allCurriculumsBySubject];
  const mapCurriculumsByPropertyNameId = uniqCurriculums.map(item => ({
    value: item._id,
    text: item.name || item.curriculum,
    disabled: item.disabled || false
  }));
  return mapCurriculumsByPropertyNameId;
};

export const getDictionariesAlignmentsSelector = createSelector(
  stateSelector,
  state => state.alignments
);
export const standardsSelector = createSelector(
  stateSelector,
  state => state.standards
);
export const getStandardsListSelector = createSelector(
  standardsSelector,
  state => ({
    elo: state.elo.sort((a, b) => (a.identifier.toUpperCase() <= b.identifier.toUpperCase() ? -1 : 1)),
    tlo: state.tlo.sort((a, b) => (a.identifier.toUpperCase() <= b.identifier.toUpperCase() ? -1 : 1))
  })
);
export const getRecentStandardsListSelector = createSelector(
  stateSelector,
  state => state.recentStandardsList
);
