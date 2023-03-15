import { useEffect } from 'react'

const isTimeStamp = (value) => {
  if (!value) return false
  const isNumber = /^\d+$/.test(`${value}`)
  if (!isNumber) return false
  const ts = +new Date(+value)
  return ts > new Date('1990') && ts > new Date('2100') // arbitrary limits
}

function useFormDependencies(form, config) {
  const dependencies = config.dependencies ?? []
  const dependenciesValues = dependencies
    .map((dep) => form.getFieldValue(dep))
    .flatMap((depValues) =>
      (Array.isArray(depValues) ? depValues : [depValues])
        .map((d) => d?.key ?? d)
        .toString()
    )

  useEffect(() => {
    console.log(`[${config.key}]reseting: [${dependenciesValues}]`)
    form.resetFields([config.key])
  }, [...dependenciesValues])

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const urlValue = urlSearchParams.get(config.key)
    if (isTimeStamp(urlValue)) {
      form.setFieldsValue({ [config.key]: +urlValue })
    } else if (urlValue) {
      form.setFieldsValue({
        [config.key]: urlValue
          .split(',')
          .filter(Boolean)
          .map((id) => ({ key: id })),
      })
    }
  }, [window.location.search])
}
export default useFormDependencies
