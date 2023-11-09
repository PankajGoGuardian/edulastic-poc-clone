import { map } from 'lodash'

export const getTermOptions = (terms = []) =>
  map(terms, ({ name, _id, startDate, endDate }) => ({
    title: name,
    key: _id,
    startDate,
    endDate,
  }))
