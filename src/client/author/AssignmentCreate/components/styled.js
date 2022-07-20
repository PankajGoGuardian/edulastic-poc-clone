import { black, greyLight1 } from '@edulastic/colors'
import styled from 'styled-components'

export const StyledDiv1 = styled.div`
  padding: 40px 40px 30px 40px;
  background: linear-gradient(
    239.38deg,
    rgba(83, 176, 149, 0.27) 0%,
    rgba(83, 176, 149, 0.45) 167.33%
  );
  border-radius: 10px;
  box-shadow: 0px 1px 1px 0 rgba(0, 0, 0, 0.1);
`
export const StyledDiv2 = styled.div`
  padding: 30px 40px;
  background: linear-gradient(237.24deg, #ffffff 8.65%, #f2f2f2 106.68%);
  border-radius: 10px;
  box-shadow: 0px 1px 1px 0 rgba(0, 0, 0, 0.1);
`

export const Title = styled.div`
  font-size: ${({ fs }) => fs || '20px'};
  font-weight: 800;
  line-height: 26px;
  color: ${black};
  margin-bottom: ${({ mB }) => mB || '20px'};
`

export const InfoText = styled.div`
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  color: ${black};
`

export const DottedLine = styled.div`
  width: ${({ width }) => `${width || '10%'}`};
  border: ${({ border }) => border || '3px solid white'};
  margin: ${({ margin }) => margin || 'auto 30px'};
  height: 0px;
`

export const PartitionDiv = styled.div`
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  line-height: 22px;
  letter-spacing: 0.1em;
  color: ${greyLight1};
  padding: 5px;
  margin: 5px;
`

export const Img = styled.img`
  margin-left: ${(props) => props.mL || '0px'};
  margin-bottom: ${(props) => props.mB || '0px'};
`
