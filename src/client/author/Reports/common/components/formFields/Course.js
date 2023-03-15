import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLatestRef } from '@edulastic/common'
import { courseApi } from '@edulastic/api'
import { connect } from 'react-redux'
import { roleuser } from '@edulastic/constants'
import useFormDependencies from '../FilterForm/hooks/useFormDependencies'
import useValueWithLabel from '../FilterForm/hooks/useValueWithLabel'
import Autocomplete from '../FilterForm/fields/Autocomplete'
import FormItem from '../FilterForm/components/FormLayout/FormItem'
import { getUserOrgId } from '../../../../src/selectors/user'

const searchCourseOptions = async ({
  name = undefined,
  courseIds = [],
  districtId,
  form,
} = {}) => {
  const searchQuery = {}
  if (typeof name === 'string') {
    searchQuery.search = {
      name,
    }
  }
  if (courseIds.length) {
    searchQuery.courseIds = courseIds
  }
  if (form) {
    const { schools, term } = form.getFieldsValue(['schools', 'term'])
    if (schools && schools.length) {
      searchQuery.institutionId = schools
        .map((school) => (typeof school === 'string' ? school : school.key))
        .join(',')
    }
    if (term) {
      searchQuery.termId = typeof term === 'string' ? term : term.key
    }
  }

  const response = await userApi.fetchUsers({
    districtId,
    limit: 25,
    page: 1,
    role: roleuser.TEACHER,
    ...searchQuery,
  })
  const options = response.result.map((course) => ({
    key: course._id,
    title: [course._source.firstName, course._source.lastName]
      .filter(Boolean)
      .join(' '),
  }))
  console.log(options)
  return options
}

function Course(props) {
  const { config, terms, form, districtId, ...restProps } = props
  const { title = 'Course', key } = config
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useLatestRef(form)
  const searchOptions = useCallback(
    async (name) => {
      setIsLoading(true)
      const options = await searchCourseOptions({
        districtId,
        name,
        form: formRef.current,
      }).finally(() => setIsLoading(false))
      return options
    },
    [formRef]
  )

  useValueWithLabel(form, config, {
    getValue: async (ids) => {
      setIsLoading(true)
      const options = await searchCourseOptions({
        districtId,
        courseIds: ids,
      }).finally(() => setIsLoading(false))

      return options
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
          allowClear
          searchOptions={searchOptions}
          loading={isLoading}
          {...restProps}
        />
      )}
    </FormItem>
  )
}

Course.propTypes = {}
Course.defaultProps = {}

export default connect(
  (state) => ({
    districtId: getUserOrgId(state),
  }),
  null
)(Course)
