/* eslint-disable default-case */
import { CheckboxLabel } from '@edulastic/common'
import { Button, DatePicker, Input, Radio, Select, Table, Upload } from 'antd'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { doValidate, uploadFile } from './apis'

const Field = ({
  displayName,
  labelStyle,
  type,
  validate,
  onChange,
  message,
  note = {},
  setImageFile,
  imagePreview,
  setImagePreview,
  ...rest
}) => {
  const [response, setResponse] = useState()
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)

  const onDropdownVisibleChange = () => {
    const elm = document.querySelector(`.dropdown-custom-menu`)
    if (elm && !elm.style.zIndex) {
      elm.style.zIndex = 10000
    }

    return () => {
      document.removeEventListener('click', onDropdownVisibleChange)
    }
  }

  useEffect(() => {
    document.addEventListener('click', onDropdownVisibleChange)
  }, [])

  const handleValidation = () => {
    setResponse([])
    onChange({})
    doValidate(
      {
        [validate.validateField]:
          validate.paramsType === 'string'
            ? value
            : value.split(',').map((v) => v.trim()),
      },
      validate.endPoint,
      validate.method
    ).then((data) => {
      const res = get(data, validate.response.lodashDepth)
      if (res) {
        setResponse(validate.multiple ? res : [res])
        onChange(
          validate.multiple ? res.map((r) => r._id) : res.districtId,
          rest.name
        )
      } else {
        onChange(validate.multiple ? [] : '', rest.name)
      }
    })
  }

  const renderIfNeedsToValidate = () => {
    if (validate) {
      return (
        <Button onClick={handleValidation} type="primary">
          Validate
        </Button>
      )
    }
  }

  const onChangeCheckbox = (e) => onChange(e.target.checked, rest.name)
  const handleOnChange = (e) => {
    let _value
    if (typeof e === 'object') {
      _value = e.target.value
    } else {
      _value = e
    }
    onChange(_value, rest.name)
    setValue(_value)
  }

  const onChangeDate = (date) => onChange(date.toDate().getTime(), rest.name)

  const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async (info, endPoint) => {
    try {
      const { file } = info
      setLoading(true)
      if (
        endPoint === 'admin-tool/add-test-thumbnail' &&
        file.type.match(/image/g)
      ) {
        const imageUrl = await readImageFile(file)
        setImagePreview(imageUrl)
        setImageFile(file)
        setLoading(false)
      } else {
        uploadFile(file, endPoint).then((result) => {
          onChange(result, type)
          setLoading(false)
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const renderElement = () => {
    switch (type) {
      case 'string':
        return <Input {...rest} onChange={handleOnChange} />
      case 'textarea':
        return <Input.TextArea {...rest} onChange={handleOnChange} />
      case 'date':
        return <DatePicker onChange={onChangeDate} showToday />
      case 'dropdown':
        return (
          <Select
            {...rest}
            onChange={handleOnChange}
            dropdownClassName="dropdown-custom-menu"
          >
            {(rest.values || []).map((v, i) => (
              <Select.Option key={i} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        )
      case 'checkbox':
        return (
          <CheckboxLabel onChange={onChangeCheckbox}>
            {displayName}
          </CheckboxLabel>
        )
      case 'radiogroup':
        return (
          <Radio.Group {...rest} onChange={handleOnChange}>
            {(rest.values || []).map((v, i) => (
              <Radio key={i} value={v}>
                {v}
              </Radio>
            ))}
          </Radio.Group>
        )
      case 'p':
        return <p>{message}</p>
      case 'upload':
        return (
          <>
            <Upload
              accept={rest.accept}
              multiple={rest.multiple}
              disabled={loading}
              customRequest={(info) => handleUpload(info, rest.endPoint)}
            >
              <Button type="primary">Upload File</Button>
            </Upload>
            {imagePreview && (
              <div>
                <h2>Preview:</h2>
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  style={{ maxWidth: '50%' }}
                />
              </div>
            )}
          </>
        )
      default:
        return null
    }
  }

  const renderResponse = () => {
    if (response) {
      const display = validate?.response?.display || {}
      switch (display?.type) {
        case 'table':
          // eslint-disable-next-line no-case-declarations
          const columns = display.fields.map((field) => {
            return {
              title: field.name,
              dataIndex: field.field,
            }
          })
          return (
            <div>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {display.title}
              </span>
              <Table
                dataSource={response}
                columns={columns}
                pagination={false}
              />
            </div>
          )
        case 'json':
          return (
            <div>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {display.title}
              </span>
              <div>
                {JSON.stringify(response?.[0] || 'Please enter valid input')}
              </div>
            </div>
          )
      }
    }
  }

  const { text, parentField, position, style } = note

  return (
    <div
      style={{
        marginBottom: '15px',
      }}
    >
      <div
        style={
          labelStyle || {
            fontSize: '15px',
            fontWeight: 600,
            marginBottom: '5px',
          }
        }
      >
        {displayName}
      </div>
      {rest.name === parentField && position === 'top' && (
        <span className="note" style={style}>
          {text}
        </span>
      )}
      {renderElement()}
      {rest.name === parentField && position === 'bottom' && (
        <span className="note" style={style}>
          {text}
        </span>
      )}
      {renderIfNeedsToValidate()}
      {renderResponse()}
    </div>
  )
}

export default Field
