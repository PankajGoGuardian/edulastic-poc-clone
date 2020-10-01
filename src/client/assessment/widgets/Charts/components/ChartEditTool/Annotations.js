import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import produce from 'immer'
import { v4 } from 'uuid'

import { withNamespaces } from '@edulastic/localization'
import { Button, FroalaEditor } from '@edulastic/common'
import { IconTrash } from '@edulastic/icons'
import { red, secondaryTextColor, white } from '@edulastic/colors'
import { FroalaInput } from './styled'

class Annotations extends Component {
  state = {
    newAnnotation: '',
  }

  handleAddAnnotation = () => {
    const { newAnnotation } = this.state
    const { item, setQuestionData } = this.props

    if (!newAnnotation) {
      return
    }
    this.setState({ newAnnotation: '' })

    setQuestionData(
      produce(item, (draft) => {
        if (!draft.annotations) {
          draft.annotations = []
        }
        draft.annotations.push({
          id: v4(),
          value: newAnnotation,
          position: { x: draft.annotations.length * 50, y: 0 },
          size: {
            width: 120,
            height: 80,
          },
        })
      })
    )
  }

  handleDeleteAnnotation = (index) => () => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.annotations.splice(index, 1)
      })
    )
  }

  handleInput = (value, index = null) => {
    const { item, setQuestionData } = this.props

    if (index === null) {
      this.setState({ newAnnotation: value })
    } else if (item.annotations && item.annotations[index]) {
      setQuestionData(
        produce(item, (draft) => {
          draft.annotations[index].value = value
        })
      )
    }
  }

  render() {
    const { t, item } = this.props
    const { newAnnotation } = this.state
    const { annotations = [] } = item
    const btnStyles = {
      height: '40px',
      minWidth: '40px',
      maxWidth: '40px',
      marginLeft: '5px',
      borderRadius: '4px',
      padding: '5px',
    }

    return (
      <Container>
        {annotations.map((an, index) => (
          <Wrapper
            key={`annotation-wrapper-${index}`}
            style={{ marginBottom: '7px' }}
          >
            <FroalaInput style={{ width: '205px' }}>
              <FroalaEditor
                value={an.value}
                onChange={(val) => this.handleInput(val, index)}
                toolbarInline
                toolbarVisibleWithoutSelection
                config={{ placeholder: '' }}
              />
            </FroalaInput>
            <Button
              key={`an-del-${index}`}
              style={{ ...btnStyles, backgroundColor: red }}
              onClick={this.handleDeleteAnnotation(index)}
            >
              <IconTrash color={white} />
            </Button>
          </Wrapper>
        ))}
        <Wrapper key="annotation-wrapper-add">
          <FroalaInput style={{ width: '160px' }}>
            <FroalaEditor
              value={newAnnotation}
              onChange={(val) => this.handleInput(val)}
              style={{ height: '40px', width: '160px' }}
              toolbarInline
              toolbarVisibleWithoutSelection
              config={{ placeholder: '' }}
            />
          </FroalaInput>
          <Button
            key="an-add"
            style={{ ...btnStyles, minWidth: '85px', maxWidth: '85px' }}
            onClick={this.handleAddAnnotation}
            color="primary"
          >
            {t('component.graphing.settingsPopup.addText')}
          </Button>
        </Wrapper>
      </Container>
    )
  }
}

Annotations.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}

export default withNamespaces('assessment')(Annotations)

const Container = styled.div`
  padding: 12px 17px;
  color: ${secondaryTextColor};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`
