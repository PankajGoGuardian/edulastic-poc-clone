import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form } from 'antd'
import { notification } from '@edulastic/common'
import Field from './Field'
import { FirstDiv, H2, OuterDiv } from '../../Common/StyledComponents'

const ApiFormsMain = ({
  fields,
  name,
  handleOnSave,
  note = {},
  children,
  customSections,
  id,
  setFileUploadData,
  endPoint,
}) => {
  const [data, setData] = useState({})
  const [currentId, setCurrentId] = useState('')
  const [errors, setErrors] = useState([])
  const [standardImportSubject, setStandardImportSubject] = useState('')

  useEffect(() => {
    // Set deault field values on mount
    const defaultFields = (fields || []).filter((f) => f.defaultValue)
    const defaultData = {}
    defaultFields.forEach((_field) => {
      const { name: _name, defaultValue } = _field
      if (_name && defaultValue) {
        defaultData[_name] = defaultValue
      }
    })
    setData({ ...data, ...defaultData })
  }, [])

  const onChange = (value, type) => {
    if (id === 'upload-standard' && type === 'subject') {
      setStandardImportSubject(value)
    }
    if (type === 'upload') {
      if (value.status === 400) {
        notification({
          type: 'warning',
          msg: value.message,
        })
      }
      setFileUploadData({ data: value.data, subject: standardImportSubject })
      return
    }
    setData({ ...data, [type]: value })
  }

  const onCloseError = () => setErrors([])

  const formatData = useMemo(
    () =>
      Object.keys(data).reduce((acc, key) => {
        const field = (fields || []).find((f) => f.name === key)
        // assures only fields from selected category goes in API request
        if (field) {
          if (data[key] && field.formatter) {
            acc[key] = field.formatter(data[key])
          } else {
            acc[key] = data[key]
          }
        }
        return { ...acc }
      }, {}),
    [data]
  )

  const onSave = (sectionId) => {
    setCurrentId(sectionId)
    const requiredFields = customSections
      ? customSections
          .find((o) => o.id === sectionId)
          .fields.filter((f) => f.required)
      : fields.filter((f) => f.required)
    const errorFields = requiredFields
      .filter((rf) => !data[rf.name])
      .map((f) => f.displayName || f.name)
    if (errorFields.length) {
      return setErrors(errorFields)
    }
    onCloseError()
    handleOnSave(formatData, sectionId)
  }

  const { text, align, parentField } = note
  const hideSubmit = ['upload-standard', 'enable-feed-types']
  return (
    <FormMainWrapper style={{ marginTop: '15px' }}>
      {!customSections && (
        <OuterDiv>
          <H2>{name}</H2>
          <FirstDiv>
            <Form style={{ width: '100%' }}>
              {!!errors.length && (
                <Alert
                  message={`${errors.join(', ')} fields are required`}
                  type="error"
                  closable
                  onClose={onCloseError}
                />
              )}
              {fields.map((field) => (
                <Field
                  {...field}
                  onChange={onChange}
                  note={note}
                  endPoint={endPoint}
                />
              ))}
              <ActionWrapper>
                {!hideSubmit.includes(id) && (
                  <Button type="primary" htmlType="submit" onClick={onSave}>
                    Submit
                  </Button>
                )}
                {!!text && !parentField && (
                  <span
                    className="note"
                    style={
                      align === 'left' ? { justifyContent: 'flex-start' } : {}
                    }
                  >
                    {text}
                  </span>
                )}
              </ActionWrapper>
            </Form>
          </FirstDiv>
          {children}
        </OuterDiv>
      )}
      {(customSections || []).map((section) => (
        <OuterDiv>
          <H2>{section.name}</H2>
          <FirstDiv>
            <Form style={{ width: '100%' }}>
              {!!errors.length && currentId === section.id && (
                <Alert
                  message={`${errors?.join(', ')} ${
                    errors?.length > 1 ? 'fields are' : 'field is'
                  } required`}
                  type="error"
                  closable
                  onClose={onCloseError}
                />
              )}
              {(section.fields || []).map((field) => (
                <Field {...field} onChange={onChange} note={note} />
              ))}
              <ActionWrapper>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => onSave(section.id)}
                >
                  Submit
                </Button>
                {!!section.text && !section.parentField && (
                  <span
                    className="note"
                    style={
                      align === 'left' ? { justifyContent: 'flex-start' } : {}
                    }
                  >
                    {section.text}
                  </span>
                )}
              </ActionWrapper>
            </Form>
          </FirstDiv>
          {children}
        </OuterDiv>
      ))}
    </FormMainWrapper>
  )
}

const FormMainWrapper = styled.div`
  .note {
    color: red;
    font-size: 16px;
  }
`

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default ApiFormsMain
