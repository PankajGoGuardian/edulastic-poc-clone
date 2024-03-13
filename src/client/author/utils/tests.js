import { DEFAULT_TEST_TITLE } from '../TestPage/utils'

export const checkInvalidTestTitle = (title) =>
  !title?.trim() ||
  title?.trim().toLowerCase() === DEFAULT_TEST_TITLE.toLowerCase()
