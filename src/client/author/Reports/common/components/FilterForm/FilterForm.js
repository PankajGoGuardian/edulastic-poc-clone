import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Form, Row } from 'antd'
import { notification } from '@edulastic/common'
import { StyledEduButton } from '../../styled'
import FormLayout from './components/FormLayout'

/**
 * @typedef {{ title?: String; description?: String; }} FormDefinitionBase
 * @typedef { keyof<typeof formFieldKeyMap> } FormFieldKeys
 * @typedef { FormFieldKeys | { key: FormFieldKeys; label: String } | { label: String; element: import('react').ReactElement } } FormField
 * @typedef {{ title: String; fields: FormField[]; }} FormTab
 * @typedef {FormDefinitionBase & {tabs: FormTab[]}} FormDefinitionWithTabs
 * @typedef {FormDefinitionBase & {fields: FormField[]}} FormDefinitionWithFields
 * @typedef { FormDefinitionWithTabs | FormDefinitionWithFields } FormDefinition
 */

/**
 *
 * @param {import('antd/lib/form').FormComponentProps['form']} form
 */
function useInitialFilters(form) {
  useEffect(() => {
    const values = form.getFieldsValue()
    const urlSearchParams = new URLSearchParams(window.location.search)
    Object.keys(values).forEach((filterKey) => {
      const urlValue = urlSearchParams.get(filterKey)
      if (isTimeStamp(urlValue)) {
        form.setFieldsValue({ [filterKey]: +urlValue })
      } else if (urlValue) {
        form.setFieldsValue({
          [filterKey]: urlValue
            .split(',')
            .filter(Boolean)
            .map((id) => ({ key: id })),
        })
      }
    })
  }, [window.location.search])
}
/**
 * @param {import('antd/lib/form').FormComponentProps['form']} form
 */
function useFilterSubmit(form, onSubmit, scrollToField) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = useCallback((e) => {
    e?.preventDefault()
    setIsSubmitting(true)
    console.log('submit')
    form.validateFields(async (err, values) => {
      try {
        if (err) {
          scrollToField(Object.keys(err)[0])
          return
        }
        await onSubmit(values)
      } catch (error) {
        console.error(error)
        notification({
          type: 'error',
          msg: 'Error applying filters.\n',
        })
      } finally {
        setIsSubmitting(false)
      }
    })
  }, [])
  return { isSubmitting, handleSubmit }
}

function FormActionButton(props) {
  const { onClick, children, ...restProps } = props
  return (
    <StyledEduButton
      width="25%"
      height="40px"
      style={{ maxWidth: '200px' }}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </StyledEduButton>
  )
}

/**
 * @template T
 * @param {import('antd/lib/form').FormComponentProps & {formDefinition: FormDefinition; values: T; onSubmit: (T) => void}} props
 */
function FilterForm(props) {
  const { formDefinition, values, onSubmit, form, onCancel } = props
  // useInitialFilters(form)
  const scrollToField = (field) => {
    console.log('scroll to:', field)
  }
  const { isSubmitting, handleSubmit } = useFilterSubmit(
    form,
    onSubmit,
    scrollToField
  )

  const resetForm = useCallback(() => {
    form.resetFields()
  }, [form])

  const handleCancel = useCallback(() => {
    resetForm()
    onCancel()
  }, [resetForm, onCancel])

  const submitDisabled = isSubmitting || !form.isFieldsTouched()

  return (
    <Form
      onSubmit={handleSubmit}
      hideRequiredMark
      colon={false}
      layout="vertical"
    >
      <Row type="flex" gutter={[5, 10]}>
        <FormLayout layout={formDefinition} form={form} />
      </Row>
      <Row type="flex">
        <FormActionButton isGhost data-cy="cancelFilter" onClick={handleCancel}>
          Cancel
        </FormActionButton>
        <FormActionButton
          htmlType="submit"
          data-cy="applyFilter"
          disabled={submitDisabled}
        >
          Apply
        </FormActionButton>
      </Row>
    </Form>
  )
}

FilterForm.propTypes = {
  formDefinition: PropTypes.object.isRequired,
}
FilterForm.defaultProps = {}

const enhance = compose(Form.create())

export default enhance(FilterForm)
