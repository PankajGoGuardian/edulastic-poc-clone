import styled from 'styled-components'
import { Card } from 'antd'

export const PrintPreviewBack = styled.div`
  width: 100%;
  background-color: #cccccc;
  display: block;
`

export const PrintPreviewContainer = styled.div`
  padding: 0;
  width: 210mm;
  height: ${(props) => props.height || '297mm'};
  margin: 0 auto;
  background-color: #fff;
  font-variant: normal !important;
  pointer-events: none;
  padding: 16px;
  * {
    font-variant: normal !important;
    -webkit-print-color-adjust: exact !important;
  }

  .ant-table-body {
    color: black;
  }
  .ant-table-thead > tr > th {
    font-weight: 700;
  }

  .ant-card-body {
    padding: 8px;
    border: 2px #b2b2b2 solid;
    height: 100%;
  }

  @media print {
    .sideBarwrapper {
      display: none;
    }
  }

  @page {
    size: A4;
    margin: 0;
  }
`

export const StyledTitle = styled.p`
  font-size: 30px;
  font-weight: normal;
  padding: 15px 25px;
  margin: 0px;
  text-align: ${({ align }) => align || 'right'};
  background: ${({ bgColor }) => bgColor || '#f3f3f4'};
`

export const Color = styled.span`
  color: #58b294;
`

export const ParagraphDiv = styled.div`
  margin: 8px 0px 16px;
`

export const BoldText = styled.span`
  font-weight: 600;
  color: black;
`

export const ClassInfo = styled.div`
  color: black;
  margin-bottom: 4px;
`

export const ClassCode = styled.span`
  color: #58b294;
  font-weight: 700;
  text-transform: uppercase;
`

export const ClassName = styled.span`
  color: #58b294;
  font-weight: 700;
`

export const Description = styled.div`
  margin-bottom: 8px;
`

export const CardContainer = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  @media print {
    page-break-before: always;
  }
`

export const StyledCard = styled(Card)`
  width: 50%;
  padding: 4px;
  border-radius: 0px;
  min-height: calc(100% / 3);
  max-height: calc(100% / 3);
`

export const ParaP = styled.p`
  text-align: center;
  padding: 4px;
  margin: 8px 0px;
`

export const UserInfo = styled.div`
  text-align: left;
  padding: 8px;
  background: #f0f8fa;
  margin: 16px 0px;

  div {
    padding: 4px 0px;
  }
`

export const StudnetName = styled.span`
  background: #f3f3f3;
  padding: 4px 8px;
  border-radius: 15px;
`
export const PrintLogoContainer = styled.div`
  display: flex;
  justify-content: ${({ align }) => align || 'flex-end'}; flex-end;
  align-items: center;
  padding: 15px 25px;
  background: ${({ bgColor }) => bgColor || '#f3f3f4'};
`
