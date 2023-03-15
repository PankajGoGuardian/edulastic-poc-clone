import React from 'react'
import PropTypes from 'prop-types'
import FormTabs from './FormTabs'
import FilterHeader from './FilterHeader'
import FormFields from './FormFields'

const defaultFieldDefinitions = {
  term: {},
}

function FormLayout(props) {
  const { layout, form } = props
  const { tabs, fields, title, description } = layout
  if (tabs) {
    return (
      <>
        <FilterHeader title={title} description={description} />
        <FormTabs config={tabs} form={form} />
      </>
    )
  }
  if (fields) {
    return (
      <>
        <FilterHeader title={title} description={description} />
        <FormFields config={fields} form={form} />
      </>
    )
  }
  return null
}

FormLayout.propTypes = {}
FormLayout.defaultProps = {}

export default FormLayout
