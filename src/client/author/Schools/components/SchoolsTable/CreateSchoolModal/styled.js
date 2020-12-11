import styled from 'styled-components'
import Spin from "antd/es/Spin";
import Select from "antd/es/Select";

export const StyledDescription = styled.p`
  text-align: center;
  margin-bottom: 10px;
`

export const StyledSpinContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${(props) => (props.loading === 'true' ? 'none' : 'auto')};
`

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
`

export const StyledSelect = styled(Select)`
  width: 100%;
`
