import { useEffect } from 'react'

const useValueWithLabel = (
  form,
  config,
  { titlePath = 'title', getValue } = {}
) => {
  const formValue = form.getFieldValue(config.key)
  const values = Array.isArray(formValue)
    ? formValue
    : typeof formValue !== 'undefined'
    ? [formValue]
    : []
  const valueKeys = values.map((value) => value?.key)
  const titleTypes = values.map((value) => typeof value?.[titlePath])
  useEffect(() => {
    if (titleTypes.every((t) => t === 'string')) return

    const refreshValue = async () => {
      const newValues = await getValue(valueKeys)
      form.setFieldsValue({ [config.key]: newValues })
    }
    refreshValue()
  }, [`${valueKeys}`, `${titleTypes}`])
}

export default useValueWithLabel
