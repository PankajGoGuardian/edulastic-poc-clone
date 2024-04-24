import { fadedBlack, themeColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'

export const TileContainer = styled.div`
  border-radius: 2px;
  width: ${({ $isModal }) => ($isModal ? '100%' : '70%')};
  max-width: 800px;
  padding: 0px;
  margin: ${({ isModal }) => (isModal ? '0px' : 'auto')};
  margin-bottom: 25px;
  border: 1px solid lightGrey;
`
export const TileUpperContainer = styled(FlexContainer)`
  padding: 25px 35px;
  border: none;
  justify-content: space-between;
  border-bottom: 2px solid lightGrey;
`
export const TileLowerContainer = styled(FlexContainer)`
  padding: 15px 35px;
  justify-content: space-between;
`

export const StyledImg = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 2px;
  object-fit: cover;
`

export const StyledName = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: black;
`

export const TeacherInfoContainer = styled.div`
  color: #555555;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 4px;
`
export const Separator = styled.div`
  display: inline-block;
  background: lightGrey;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  margin: 0px 10px;
`

export const ObservationTypeContainer = styled.div`
  color: white;
  border-radius: 2px;
  padding: 1px 5px 1px;
  text-transform: capitalize;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  width: fit-content;
  height: fit-content;
  background: #545b63;
`

export const InfoContainer = styled.div`
  display: flex;
  color: #555;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`

export const ActionButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${themeColor};
  gap: 3px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
`

export const NoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  padding-bottom: 80px;
  font-size: 22px;
  font-weight: 25px;
  color: ${fadedBlack};
`

export const StyledFeedbackText = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  overflow-wrap: break-word;
`
