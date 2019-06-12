import { createSelector } from "reselect";
import { uniqBy, groupBy } from "lodash";
import { getInterestedCurriculumsSelector } from "../selectors/user";

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
  const interestedCurriculums = getInterestedCurriculumsSelector(state);
  const interestedCurriculumsBySubject = interestedCurriculums.filter(item =>
    !subject ? true : item.subject === subject
  );
  const allCurriculums = getCurriculumsListSelector(state);
  const allCurriculumsBySubject = allCurriculums.filter(item => (!subject ? true : item.subject === subject));
  const interestedCurriculumByOrgType = groupBy(interestedCurriculumsBySubject, curriculum => curriculum.orgType);
  // return if teacher has selected curriculums
  if (interestedCurriculumByOrgType.teacher) {
    return interestedCurriculumByOrgType.teacher.map(item => ({ value: item._id, text: item.name }));
  }
  // break line only if interested curriculums are selected by admins and create uniq curriculums
  const uniqCurriculums = interestedCurriculumsBySubject.length
    ? uniqBy(
        [
          ...interestedCurriculumsBySubject,
          { _id: "----------", name: "----------", disabled: true },
          ...allCurriculumsBySubject
        ],
        "_id"
      )
    : allCurriculumsBySubject;

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
    elo: state.elo,
    tlo: state.tlo
  })
);
export const getRecentStandardsListSelector = createSelector(
  stateSelector,
  state => state.recentStandardsList
);
