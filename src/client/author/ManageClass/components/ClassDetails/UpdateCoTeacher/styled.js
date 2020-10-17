import styled from 'styled-components'
import { Button } from 'antd'
import { linkColor } from '@edulastic/colors'
import { ConfirmationModal } from '../../../../src/components/common/ConfirmationModal'

export const StyledModal = styled(ConfirmationModal)`
.ant-modal-content
  .ant-modal-body {
    min-height: 150px;
    .ant-select {
      margin-top: 10px;
      min-width: 100%;
    }
  }
}
`

export const ActionButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border-radius: 25px;
  height: 32px;
  display: flex;
  align-items: center;
`

export const Title = styled.div`
  color: ${linkColor};
`

export const Description = styled.div`
  line-height: 2;
`
export const ListContainer = styled.ul`
  padding: 0px;
  margin: 15px 0px;
  list-style: none;
  max-height: 250px;
  overflow: auto;
`
export const List = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
  text-align: left;
`
export const Teachers = styled.div`
  padding: 0px 20px;
  width: calc(100% - 130px);
`
export const RadioCol = styled.div`
  width: 60px;
  text-align: center;
`
export const RemoveCol = styled(RadioCol)`
  width: 70px;
  padding-right: 10px;
`
