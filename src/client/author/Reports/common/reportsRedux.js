import { createAction } from 'redux-starter-kit'

export const RESET_ALL_REPORTS = '[reports] reset all reports'

export const resetAllReportsAction = createAction(RESET_ALL_REPORTS)
