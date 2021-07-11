import { lightGrey4, deleteRed, lightGrey3 } from '@edulastic/colors'
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
        <strong>{`FlashCard - ${index + 1}`}</strong>
        {deleteEnable && (
          <Button onClick={handleDelete}>
            <IconTrash width={16} height={16} />
          </Button>
        )}
      </UtilWrapper>
      <Divider type="horizontal" />
      <div>
        <Label mb="10px">Front View</Label>
        <Front
          value={data.label}
          placeholder="Title"
          onChange={(value) => handleChange('front', value)}
          border="border"
          toolbarInline
          toolbarId={`t-front-${index}`}
        />
      </div>

      <br />
      <div>
        <Label>Back View</Label>
        <Back
          value={response.label}
          placeholder="Description"
          onChange={(value) => handleChange('back', value)}
          border="border"
          toolbarInline
          toolbarId={`t-back-${index}`}
        />
      </div>
    </Item>
  )
}
const Item = styled(Card)`
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid ${lightGrey4};
  margin-bottom: 10px;
  padding-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
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
  align-items: center;
  justify-content: space-between;
  border: none;

  strong {
    font-size: 20px;
  }

  button {
    outline: none;
    border: none;
    width: 36px;
    height: 36px;
    padding: 10px 0 0 0;

    svg {
      fill: ${deleteRed};

      &:hover {
        fill: ${deleteRed};
      }
    }

    &:hover {
      background: ${lightGrey3};
      border-radius: 100px;
    }
  }
`

const Label = styled.h3`
  font-weight: 600;
  margin-bottom: ${({ mb }) => mb || 0};
`

export default ItemCard
