import { withNamespaces } from '@edulastic/localization'
import { Row, Col } from 'antd'
import produce from 'immer'
import React from 'react'
import { EduButton, FlexContainer } from '@edulastic/common'
import uuid from 'uuid/v4'
import { IconTrash } from '@edulastic/icons'
import { greyThemeDark2 } from '@edulastic/colors'
import { Subtitle } from '../../../styled/Subtitle'

import { TextInputStyled } from '../../../styled/InputStyles'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'

const Classifications = ({
  t,
  item,
  setQuestionData,
  handleItemChangeChange,
}) => {
  const { classifications, showClassName } = item

  const addNew = () => {
    setQuestionData(
      produce(item, (draft) => {
        // todo
        draft.classifications.push({
          id: uuid(),
          name: `enter class name ${classifications.length + 1}`,
        })
      })
    )
  }

  const onDelete = (_id) => {
    setQuestionData(
      produce(item, (draft) => {
        // todo
        draft.classifications = draft.classifications.filter(
          ({ id }) => id !== _id
        )
      })
    )
  }

  const onInputChange = (index, inputName) => (e) => {
    setQuestionData(
      produce(item, (draft) => {
        // todo
        draft.classifications[index][inputName] = e.target.value
      })
    )
  }

  const rowStyle = { padding: '0px 0px 20px 0px' }

  const Classification = ({ name, id }, index) => {
    return (
      <>
        <Row style={rowStyle} key={id} gutter={16}>
          <Col span="8">
            <TextInputStyled
              defaultValue={name}
              onChange={onInputChange(index, 'name')}
            />
          </Col>
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            width="32px"
            height="32px"
          >
            <IconTrash onClick={() => onDelete(id)} color={greyThemeDark2} />
          </FlexContainer>
        </Row>
      </>
    )
  }

  return (
    <>
      <Subtitle>Classifications</Subtitle>
      {classifications.map((classification, index) =>
        Classification(classification, index)
      )}
      <Row style={rowStyle}>
        <EduButton onClick={addNew}>Add New</EduButton>
      </Row>
      <Row style={rowStyle}>
        <CheckboxLabel
          className="additional-options"
          onChange={() =>
            handleItemChangeChange('showClassName', !showClassName)
          }
          checked={!!showClassName}
          mb="20px"
          data-cy="showClassName"
        >
          {t('component.pictograph.showClassName')}
        </CheckboxLabel>
      </Row>
    </>
  )
}

export default withNamespaces('assessment')(Classifications)
