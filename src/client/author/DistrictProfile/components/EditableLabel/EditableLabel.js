import { FieldLabel } from '@edulastic/common'
import React from 'react'
import { EditableLabelDiv, StyledFormItem, StyledInput } from './styled'
class EditableLabel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validateStatus: 'success',
      validateMsg: '',
    }

    this.inputRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value: nextProps.value,
    }
  }

  componentDidUpdate(prevProps) {
    const {
      form,
      valueName,
      value,
      requiredStatus,
      isInputEnabled,
    } = this.props
    if (value !== form.getFieldValue(valueName)) {
      form.setFieldsValue({ [valueName]: value })
    }
    if (
      requiredStatus &&
      isInputEnabled !== prevProps.isInputEnabled &&
      !isInputEnabled
    ) {
      this.setState({ validateStatus: 'success', validateMsg: '' })
    }
  }

  setRequiredStatus = () => {
    const { value } = this.props
    const { requiredStatus, valueName } = this.props
    if ((!value || value.length == 0) && requiredStatus) {
      this.setState({
        validateStatus: 'error',
        validateMsg: `Please input your ${valueName}`,
      })
    }
  }

  validateFields = (rule, value, callback) => {
    const { requiredStatus, valueName, maxLength, type } = this.props
    const isnum = /^(?=.*\d)[\d ]+$/.test(value)
    if (requiredStatus && !value) {
      this.setState({
        validateStatus: 'error',
        validateMsg: `Please input your ${valueName}`,
      })
    } else if (value.length > maxLength) {
      this.setState({
        validateStatus: 'error',
        validateMsg: `${valueName} should be less than ${maxLength}`,
      })
    } else if (type === 'number' && !isnum) {
      this.setState({
        validateStatus: 'error',
        validateMsg: 'Please input number',
      })
    } else {
      this.setState({
        validateStatus: 'success',
        validateMsg: ``,
      })
    }
    callback()
  }

  onInputBlur = () => {
    const { value, validateStatus } = this.props
    const {
      requiredStatus,
      valueName,
      setProfileValue,
      isSpaceEnable,
    } = this.props

    if (validateStatus === 'error') return
    if ((!value || value.length == 0) && requiredStatus) {
      this.setState({
        validateStatus: 'error',
        validateMsg: `Please input your ${valueName}`,
      })
      return
    }

    if (typeof value === 'string') {
      if (isSpaceEnable)
        setProfileValue(
          valueName,
          value.toString().replace(/\s\s+/g, ' ').trim()
        )
      else setProfileValue(valueName, value.toString().replace(/\s/g, ''))
    }
  }

  handleChange = (e) => {
    const { valueName, isSpaceEnable, setProfileValue } = this.props

    if (typeof e.target.value === 'string') {
      if (isSpaceEnable)
        setProfileValue(
          valueName,
          e.target.value.toString().replace(/\s\s+/g, ' ')
        )
      else
        setProfileValue(valueName, e.target.value.toString().replace(/\s/g, ''))
    }
  }

  render() {
    const { validateStatus, validateMsg } = this.state
    const {
      valueName,
      requiredStatus,
      isInputEnabled,
      flexGrow = '',
      value,
      form,
    } = this.props
    const { getFieldDecorator } = form

    return (
      <EditableLabelDiv flexGrow={flexGrow}>
        <FieldLabel fs="10px" marginBottom="4px">
          {valueName}
        </FieldLabel>
        <StyledFormItem
          validateStatus={validateStatus}
          help={validateMsg}
          formLayout="horizontal"
        >
          {getFieldDecorator(valueName, {
            initialValue: value,
            rules: [
              {
                required: requiredStatus,
                message: `Please input your ${valueName}`,
              },
              {
                validator: this.validateFields,
              },
            ],
          })(
            <StyledInput
              onBlur={isInputEnabled ? this.onInputBlur : null} // edit state
              readOnly={!isInputEnabled} // edit state
              className={!isInputEnabled ? 'not-editing-input' : null} // edit state
              disabled={!isInputEnabled} // edit state
              onChange={this.handleChange}
              placeholder={valueName}
              ref={this.inputRef}
            />
          )}
        </StyledFormItem>
      </EditableLabelDiv>
    )
  }
}

export default EditableLabel
