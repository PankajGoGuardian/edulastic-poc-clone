import { createSelector } from "reselect";
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

export const getAvailableCurriculumsSelector = (state, props) => {
  const { subject = "" } = props;
  const curriculums = getCurriculumsListSelector(state);
  const interestedCurriculums = getInterestedCurriculumsSelector(state);
  if (!interestedCurriculums.length) return curriculums.filter(c => (!subject ? true : c.subject === subject));
  if (subject) {
    let availCurriculums = interestedCurriculums.filter(item => item.subject === subject);
    availCurriculums = availCurriculums.length ? availCurriculums : curriculums.filter(c => c.subject === subject);
    return availCurriculums;
  }
  return interestedCurriculums;
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
