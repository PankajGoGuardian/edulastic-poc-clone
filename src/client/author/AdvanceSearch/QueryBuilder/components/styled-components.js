import Styled from 'styled-components'
import { Select } from 'antd'
import { EduButton, CustomModalStyled } from '@edulastic/common'
import { IconPlayButton, IconQuestionCircle } from '@edulastic/icons'
import { greyThemeDark1, lightGrey11 } from '@edulastic/colors'

export const ModalBody = Styled.div`
  .ant-select-selection {
    border: 1px solid #b9b9b9;
    border-radius: 0;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .ant-select-dropdown-menu-item {
    font-size: 12px;
  }
`

export const ButtonsContainer = Styled.div`
  flex:1;
  display:flex;
  justify-content: flex-end;
  align-self:end;
  margin-top:10px;
`

export const StyledSelect = Styled(Select)`
min-width: 100px;
max-width: 65%;
  color:#6A737F;
  .ant-select-selection{
    border-radius: 2px;
    border: 1px solid #B9B9B9;
    background-color:#F8F8F8;
    margin:0;
    overflow: auto;
  }
`

export const StyledButton = Styled(EduButton)`
  border: 1px solid #3F85E5;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
  font-size:10px;
  width:100px;
`

export const RuleButton = Styled(StyledButton)`
  background-color:white;
  color: #3f85e5;
`

export const GroupButton = Styled(StyledButton)`
  background-color:#3f85e5;
  color: white;
`
export const AdvanceSearchModel = Styled(CustomModalStyled)`
min-height: 750px;
max-height:750px;
height: 100%;
top: 35%;
padding-bottom:80px;
.ant-modal-content{
  max-height: 750px;
  height:100%;
}
.ant-modal-body{
  max-height: 550px;
  min-height: 550px;
  overflow-y: scroll;
}
`
export const HelpArticleWrapper = Styled.div`
justify-content: space-between;
max-width: 250px;
align-items: center;
display:flex;
`
export const StyledIframe = Styled.iframe`
height: 550px;
`
export const StyledIconPlayButton = Styled(IconPlayButton)`
cursor:pointer;
path{
fill:${greyThemeDark1};
};
`
export const StyledIconQuestionCircle = Styled(IconQuestionCircle)`
path{
fill:${greyThemeDark1};
};
`

export const NoResultWrapper = Styled.div`
position: absolute;
bottom: 40%;
text-align: center;
width: 95%;
h1{
  font-size:20px;
  font-weight: bold;
};
p{
  color:${lightGrey11};
}
`
