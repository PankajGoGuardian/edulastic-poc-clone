import { Card, FroalaEditor } from '@edulastic/common'
import { IconTrash } from '@edulastic/icons'
import { Button, Divider, Input } from 'antd'
import styled from 'styled-components'
const ItemCard = ({ index, data, response, remove, update, deleteEnable }) => {
  const handleDelete = () => {
    remove(data.value)
  }

  const handleChange = (prop, value) => {
    update(data.value, prop, value)
  }

  return (
    <Item>
      <UtilWrapper>
        <strong>{`Flashcard - ${index + 1}`}</strong>
        {deleteEnable && (
          <Button onClick={handleDelete}>
            <IconTrash width={16} height={16} />
          </Button>
        )}
      </UtilWrapper>
      <Divider type="horizontal" />
      <Front
        value={data.label}
        placeholder="Enter front value"
        onChange={(value) => handleChange('front', value)}
        border="border"
        toolbarInline
        toolbarId={`t-front-${index}`}
      />
      <Back
        value={response.label}
        placeholder="Enter back value"
        onChange={(value) => handleChange('back', value)}
        border="border"
        toolbarInline
        toolbarId={`t-back-${index}`}
      />
    </Item>
  )
}
const Item = styled(Card)`
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid black;
  margin-bottom: 10px;
`
const Front = styled(FroalaEditor)`
  width: 100%;
`
const Back = styled(FroalaEditor)`
  top: 10px;
  width: 100%;
`
const UtilWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export default ItemCard
