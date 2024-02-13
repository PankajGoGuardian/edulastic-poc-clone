import { map } from 'lodash'

export const getTermOptions = (terms = []) =>
  map(terms, ({ name, _id, startDate, endDate }) => ({
    title: name,
    key: _id,
    startDate,
    endDate,
  }))

export const getDistrictOptions = (districts = []) =>
  map(districts, ({ _id, name }) => ({ key: _id, title: name }))
