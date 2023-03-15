import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useApiQuery, useLatestRef } from '@edulastic/common'
import { teacherApi, userApi } from '@edulastic/api'
import { connect } from 'react-redux'
import useFormDependencies from '../FilterForm/hooks/useFormDependencies'
import useValueWithLabel from '../FilterForm/hooks/useValueWithLabel'
import Autocomplete from '../FilterForm/fields/Autocomplete'
import FormItem from '../FilterForm/components/FormLayout/FormItem'
import { getUserOrgId } from '../../../../src/selectors/user'
import { roleuser } from '@edulastic/constants'

const searchTeacherOptions = async ({
  name = undefined,
  teacherIds = [],
  districtId,
  form,
} = {}) => {
  const searchQuery = {}
  if (typeof name === 'string') {
    searchQuery.search = {
      name,
    }
  }
  if (teacherIds.length) {
    searchQuery.teacherIds = teacherIds
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
  const options = response.result.map((teacher) => ({
    key: teacher._id,
    title: [teacher._source.firstName, teacher._source.lastName]
      .filter(Boolean)
      .join(' '),
  }))
  console.log(options)
  return options
}

function Teacher(props) {
  const { config, terms, form, districtId, ...restProps } = props
  const { title = 'Teacher', key } = config
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useLatestRef(form)
  const searchOptions = useCallback(
    async (name) => {
      setIsLoading(true)
      const options = await searchTeacherOptions({
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
      const options = await searchTeacherOptions({
        districtId,
        teacherIds: ids,
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
          searchOptions={searchOptions}
          loading={isLoading}
          {...restProps}
        />
      )}
    </FormItem>
  )
}

Teacher.propTypes = {}
Teacher.defaultProps = {}

export default connect(
  (state) => ({
    districtId: getUserOrgId(state),
  }),
  null
)(Teacher)
