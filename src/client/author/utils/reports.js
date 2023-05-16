import { map } from 'lodash'

export const getTermOptions = (terms = []) =>
  map(terms, ({ name, _id, endDate }) => ({
    title: name,
    key: _id,
    endDate,
  }))
