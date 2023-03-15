import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useApiQuery } from '@edulastic/common'
import { schoolApi } from '@edulastic/api'
import { connect } from 'react-redux'
import useFormDependencies from '../FilterForm/hooks/useFormDependencies'
import useValueWithLabel from '../FilterForm/hooks/useValueWithLabel'
import Autocomplete from '../FilterForm/fields/Autocomplete'
import FormItem from '../FilterForm/components/FormLayout/FormItem'
import { getUserOrgId } from '../../../../src/selectors/user'

const searchSchoolOptions = async ({
  terms = [],
  schoolIds = [],
  districtId,
} = {}) => {
  const searchQuery = {}
  if (terms.length) {
    searchQuery.search = {
      name: terms.map((value) => ({ type: 'cont', value })),
    }
  }
  if (schoolIds.length) {
    searchQuery.schoolIds = schoolIds
  }
  const response = await schoolApi.getSchools({
    districtId,
    limit: 25,
    page: 1,
    ...searchQuery,
  })
  const options = response.data.map((school) => ({
    key: school._id,
    title: school._source.name,
  }))
  console.log(options)
  return options
}

function School(props) {
  const { config, terms, form, districtId, ...restProps } = props
  const { title = 'School', key } = config
  const [isLoading, setIsLoading] = useState(false)
  const searchOptions = useCallback(async (term) => {
    setIsLoading(true)
    const options = await searchSchoolOptions({
      districtId,
      terms: [term],
    }).finally(() => setIsLoading(false))
    return options
  }, [])

  useValueWithLabel(form, config, {
    getValue: async (ids) => {
      setIsLoading(true)
      const options = await searchSchoolOptions({
        districtId,
        schoolIds: ids,
      }).finally(() => setIsLoading(false))

      return options[0]
    },
  })
  useFormDependencies(form, config)

  return (
    <FormItem key={key} label={title}>
      {form.getFieldDecorator(key, {
        rules: [],
        // initialValue: {key: "63b3dc4f95806c0008e196cc"}
      })(
        <Autocomplete
          mode="multiple"
          clearSearchOnBlur={false}
          searchOptions={searchOptions}
          loading={isLoading}
          {...restProps}
        />
      )}
    </FormItem>
  )
}

School.propTypes = {}
School.defaultProps = {}

export default connect(
  (state) => ({
    districtId: getUserOrgId(state),
  }),
  null
)(School)
