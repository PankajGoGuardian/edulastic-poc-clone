import React from 'react'
import PropTypes from 'prop-types'
import SelectDropdown from '../FilterForm/fields/SelectDropdown'
import useValueWithLabel from '../FilterForm/hooks/useValueWithLabel'
import useFormDependencies from '../FilterForm/hooks/useFormDependencies'
import FormItem from '../FilterForm/components/FormLayout/FormItem'

function FormSelectDropdown(props) {
  const {
    config,
    terms,
    form,
    options,
    decoratorOptions = {},
    ...restProps
  } = props
  const { title, key } = config

  useValueWithLabel(form, config, {
    getValue: (keys) => options.find((opt) => keys.includes(opt.key)),
  })

  useFormDependencies(form, config)

  return (
    <FormItem data-cy={key} label={title}>
      {form.getFieldDecorator(key, {
        ...decoratorOptions,
      })(
        <SelectDropdown
          mode="multiple"
          labelInValue
          options={options}
          {...restProps}
        />
      )}
    </FormItem>
  )
}

FormSelectDropdown.propTypes = {}
FormSelectDropdown.defaultProps = {}

export default FormSelectDropdown
