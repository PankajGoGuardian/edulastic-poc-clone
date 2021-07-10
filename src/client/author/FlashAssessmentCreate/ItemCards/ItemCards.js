import { cardBg, secondaryTextColor } from '@edulastic/colors'
import { FroalaEditor, Paper, Card } from '@edulastic/common'
import { Button } from 'antd'
import { render } from 'less'
import uuid from 'uuid/v4'
import styled from 'styled-components'
import QuestionTextArea from '../../../assessment/components/QuestionTextArea'
import ItemCard from './ItemCard'
import { cloneDeep } from 'lodash'

class Container extends React.Component {
  constructor(props) {
    super(props)
  }

  handleRemoveCard = (id) => {
    const rId = uuid()
    const { questions, updateQuestion } = this.props
    const question = cloneDeep(questions[0])
    question.possibleResponses = question.possibleResponses.filter(
      (el) => el.value !== id
    )
    question.list = question.list.filter((el) => el.value !== id)
    delete question?.validation?.validResponse.value[id]
    updateQuestion(question)
  }

  handleAddCard = () => {
    const rId = uuid()
    const { questions, updateQuestion } = this.props
    const newItem = {
      item: {
        label: 'Front',
        value: rId,
      },
      response: {
        label: 'Back',
        value: rId,
      },
    }
    const question = cloneDeep(questions[0])
    question?.possibleResponses?.push(newItem.response)
    question?.list?.push(newItem.item)
    question.validation.validResponse.value[rId] = rId
    updateQuestion(question)
  }

  handleUpdate = (id, prop, value) => {
    const { questions, updateQuestion } = this.props
    const question = cloneDeep(questions[0])
    if (prop === 'front') {
      const item = question.list.find((el) => el.value === id)
      item.label = value
    } else if (prop === 'back') {
      const item = question.possibleResponses.find((el) => el.value === id)
      item.label = value
    }
    updateQuestion(question)
  }

  render() {
    const { questions } = this.props
    const { possibleResponses = [], list = [] } = questions?.[0] || {}
    return (
      <Wrapper>
        {list.map((item, index) => (
          <ItemCard
            deleteEnable={list.length > 1}
            remove={this.handleRemoveCard}
            data={item}
            response={possibleResponses.find((el) => el.value === item.value)}
            update={this.handleUpdate}
            index={index}
          />
        ))}
        {list.length < 10 && (
          <AddCardButton onClick={this.handleAddCard}>
            {' '}
            + Add Item
          </AddCardButton>
        )}
      </Wrapper>
    )
  }
}

const Wrapper = styled(Paper)`
  margin: 5%;
  width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

export const AddCardButton = styled(Button)`
  padding: 10px 25px;
  height: auto;
  border-radius: 8px;
  margin: auto;
  width: 50%;
  background-color: ${cardBg};
  color: ${secondaryTextColor};
  font-size: 13px;
  &:hover {
    color: ${secondaryTextColor};
  }
`

export default Container
