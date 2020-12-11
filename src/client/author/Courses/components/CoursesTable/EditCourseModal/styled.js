import styled from 'styled-components'
import Spin from "antd/es/Spin";

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
