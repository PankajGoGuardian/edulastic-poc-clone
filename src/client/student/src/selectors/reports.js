import { createSelector } from 'reselect';
import testActivity from '@edulastic/api';

const moduleName = 'reports';

export const stateSelector = state => state[moduleName];

// return list of reports
export const getReportListSelector = createSelector(
  stateSelector,
  state => state.reports
);

export const getReportSelector = testActivityId =>
  createSelector(
    getReportListSelector,
    state => state.filter(({ _id }) => _id === testActivityId)[0]
  );
