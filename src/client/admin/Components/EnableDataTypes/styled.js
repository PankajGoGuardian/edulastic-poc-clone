import { IconTrash } from '@edulastic/icons'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
`

export const TrashIcon = styled(IconTrash)`
  height: 35px;
  cursor: pointer;
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`
export const FeedTypeContainer = styled.div`
  margin-top: 20px;
  h3 {
    font-weight: 600;
    margin-bottom: 20px;
  }
  Button {
    justify-items: center;
  }
`
export const SelectContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
`
