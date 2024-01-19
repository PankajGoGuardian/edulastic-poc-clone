import styled from 'styled-components'
import { IconLock } from '@edulastic/icons'

export const FlexBox = styled.div`
  display: flex;
`
export const MainContainer = styled(FlexBox)`
  justify-content: center;
  ${(props) => props.isTestPreviewModal && 'height: 100vh; width: 100vw;'}
`

export const ContentArea = styled(FlexBox)`
  padding: 100px 20px 20px 20px;
  flex-direction: column;
  width: 40%;
  @media (max-width: 1400px) {
    width: 60%;
  }
  @media (max-width: 994px) {
    width: 80%;
  }
`

export const TestTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
`

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
`

export const SectionTotalItems = styled.p`
  font-size: 12px;
  margin-top: 10px;
`

export const TestSections = styled.div`
  border: 1px solid #d8d8d8;
  padding: 20px;
  border-radius: 10px;
`

export const Section = styled(FlexBox)`
  ${(props) => (props.noBorder ? '' : `border-bottom: 1px solid #d8d8d8`)};
  padding: 15px 0;
  justify-content: space-between;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'initial')};
`

export const TestInstruction = styled(FlexBox)`
  span {
    color: #777777;
  }
`

export const TestImage = styled.div`
  width: 114px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  img {
    width: 100%;
  }
`

export const Completed = styled(FlexBox)`
  align-items: center;
  svg {
    margin-right: 10px;
  }
`

export const SectionProgress = styled.div``

export const SectionContent = styled.div`
  h4 {
    font-weight: 600;
  }
`
export const IconLockStyled = styled(IconLock)`
  margin-right: 5px;
  margin-top: 5px;
`
