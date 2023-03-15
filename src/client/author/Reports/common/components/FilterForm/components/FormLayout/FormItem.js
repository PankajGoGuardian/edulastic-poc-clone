import React from 'react'

import PropTypes from 'prop-types'
import { Form } from 'antd'
import styled from 'styled-components'

const FormItem = styled(Form.Item)`
  padding: 0;
  margin: 0;
  & .ant-form-item-label {
    padding: 0;
  }
  & label {
    font-size: 10px;
    line-height: 1.38;
    text-align: left;

    white-space: nowrap;
    font-weight: ${(props) => props.theme.widgetOptions?.labelFontWeight};
    font-style: ${(props) => props.theme.widgetOptions?.labelFontStyle};
    font-stretch: ${(props) => props.theme.widgetOptions?.labelFontStretch};
    color: ${(props) => props.color || props.theme.widgetOptions?.labelColor};
    display: ${(props) => (props.display ? props.display : 'block')};
    text-transform: uppercase;
    margin: 0 0 7px 0;
    padding: 0;
  }
`

FormItem.propTypes = {}
FormItem.defaultProps = {}

export default FormItem
