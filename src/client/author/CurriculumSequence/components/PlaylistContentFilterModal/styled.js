import styled from 'styled-components'
import { Checkbox } from 'antd'
import { title, themeColor } from '@edulastic/colors'
import { CustomModalStyled } from '@edulastic/common'

export const FilterContainer = styled.div`
  margin-bottom: 20px;
  height: ${({ urlHasUseThis }) =>
    urlHasUseThis ? 'calc(100vh - 255px)' : 'calc(100vh - 305px)'};
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
`

export const Title = styled.div`
  text-transform: uppercase;
  color: ${title};
  font-size: 12px;
  font-weight: 700;
  margin: 15px 0px 5px;
  user-select: none;
`
export const CustomModal = styled(CustomModalStyled)`
  .ant-modal-title {
    text-transform: capitalize;
  }
`

export const FlexRow = styled.div`
  width: 100%;
  margin-bottom: ${({ mb }) => mb || '15px'};
`

export const StyledCheckbox = styled(Checkbox)`
  margin: 8px 0 !important;
  color: ${title};
  font-size: 12px;
  font-weight: semi-bold;
  text-transform: uppercase;
  user-select: none;
`

export const Item = styled.div`
  user-select: none;
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  /* margin: 20px 0px; */
  font-size: 20px;
  color: ${({ active }) => (active ? themeColor : title)};
  border-left: ${({ active }) => active && `4px solid ${themeColor}`};
  cursor: pointer;
`

export const Label = styled.label`
  color: ${({ active }) => (active ? themeColor : title)};
  font-weight: 600;
  text-align: left;
  font-size: 11px;
  letter-spacing: 0;
  padding-left: 25px;
  cursor: inherit;
  text-transform: uppercase;
`
