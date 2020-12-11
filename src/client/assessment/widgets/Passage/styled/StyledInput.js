import React from 'react'
import styled from 'styled-components'
import Input from "antd/es/Input";

const StyledTabInput = (props) => <Input {...props} tabIndex={1} />

export const StyledInput = styled(StyledTabInput)`
  width: 100%;
`
