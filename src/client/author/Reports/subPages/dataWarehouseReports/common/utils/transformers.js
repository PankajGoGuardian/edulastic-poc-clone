import { map } from 'lodash'

export const getTermOptions = (terms = []) =>
  map(terms, (term) => ({
    title: term.name,
    key: term._id,
  }))
