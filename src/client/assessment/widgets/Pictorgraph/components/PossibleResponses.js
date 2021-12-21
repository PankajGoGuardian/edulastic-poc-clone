import { Upload, Col, Row, Select } from 'antd'
import uuid from 'uuid/v4'
import produce from 'immer'
import React from 'react'

import {
  EduButton,
  uploadToS3,
  MathSpan,
  FlexContainer,
  SelectInputStyled,
} from '@edulastic/common'
import { IconTrash } from '@edulastic/icons'
import { greyThemeDark2 } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'

import { Subtitle } from '../../../styled/Subtitle'
import { TextInputStyled } from '../../../styled/InputStyles'
import { SelectWrapper } from '../../../components/Graph/common/styled_components'
import { Label } from '../../../styled/WidgetOptions/Label'

const PossibleResponses = ({
  t,
  item,
  setQuestionData,
  getInitalAnswerMap,
}) => {
  const uploadFinished = (index, uri) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.possibleResponses[index] = {
          id: uuid(),
          image: `<img width=60 height=60 class="pictograph-preview-image" src=${uri}>`,
        }
      })
    )
  }

  const beforeUpload = (index) => async (file) => {
    try {
      const uri = await uploadToS3(file, 'default')
      uploadFinished(index, uri)
    } catch (error) {
      console.log(error)
    }
  }

  const addNew = () => {
    setQuestionData(
      produce(item, (draft) => {
        draft.possibleResponses.push({
          id: uuid(),
          count: '',
          unit: '',
        })
      })
    )
  }

  const onDelete = (_id) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.possibleResponses = draft.possibleResponses.filter(
          ({ id }) => id !== _id
        )
      })
    )
  }

  const handleInputChange = (inputName, index) => (e) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.possibleResponses[index] = {
          ...draft.possibleResponses[index],
          [inputName]: e.target.value,
        }
      })
    )
  }

  const rowStyle = { padding: '0px 0px 20px 0px' }

  const PossibleResponse = ({ id = uuid(), image, count, unit }, index) => {
    return (
      <>
        <Row style={rowStyle} key={id} gutter={16} align="middle">
          {!image && (
            <Col span="4">
              <Upload
                listType="picture"
                beforeUpload={beforeUpload(index)}
                showUploadList={{ showRemoveIcon: false }}
              >
                <EduButton ml="0px">Upload Image</EduButton>
              </Upload>
            </Col>
          )}
          {image && (
            <Col span="3">
              <MathSpan dangerouslySetInnerHTML={{ __html: image }} />
            </Col>
          )}
          {image && (
            <Col span="4">
              <TextInputStyled
                onChange={handleInputChange('count', index)}
                defaultValue={count}
                type="number"
              />
            </Col>
          )}
          {image && (
            <Col span="4">
              <TextInputStyled
                onChange={handleInputChange('unit', index)}
                defaultValue={unit}
              />
            </Col>
          )}
          <Col span="4">
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              width="32px"
              height="32px"
            >
              <IconTrash onClick={() => onDelete(id)} color={greyThemeDark2} />
            </FlexContainer>
          </Col>
        </Row>
      </>
    )
  }

  const { answeringStyle, elementContainers } = item

  const handleOptionChange = (option) => (val) =>
    setQuestionData(
      produce(item, (draft) => {
        draft[option] = val
        draft.validation.validResponse.value = getInitalAnswerMap()

        draft.validation.altResponses.forEach((ite) => {
          ite.value = getInitalAnswerMap()
        })
      })
    )

  return (
    <>
      <Subtitle>{t('component.pictograph.enterElements')}</Subtitle>
      {item.possibleResponses.map((possibleResponse, index) => {
        return PossibleResponse(possibleResponse, index)
      })}

      <Row style={rowStyle}>
        <EduButton onClick={addNew}>Add new</EduButton>
      </Row>

      <Row gutter={24} marginTop={16}>
        {/* <Col span={24} marginBottom="0px">
          <CheckboxLabel
            className="additional-options"
            onChange={() => onUiChange('showDragHandle')(!showDragHandle)}
            checked={!!showDragHandle}
            mb="20px"
            data-cy="showDragHandle"
          >
            {t('component.cloze.imageDragDrop.showdraghandle')}
          </CheckboxLabel>
          <CheckboxLabel
            className="additional-options"
            onChange={() =>
              handleItemChangeChange('duplicateResponses', !duplicateResponses)
            }
            checked={!!duplicateResponses}
            mb="20px"
            data-cy="duplicateResponses"
          >
            {t('component.cloze.imageDragDrop.duplicatedresponses')}
          </CheckboxLabel>
          <CheckboxLabel
            className="additional-options"
            onChange={() =>
              handleItemChangeChange('shuffleOptions', !shuffleOptions)
            }
            checked={!!shuffleOptions}
            mb="20px"
            data-cy="shuffleOptions"
          >
            {t('component.cloze.imageDragDrop.shuffleoptions')}
          </CheckboxLabel>
          <CheckboxLabel
            className="additional-options"
            onChange={() =>
              handleItemChangeChange(
                'transparentPossibleResponses',
                !transparentPossibleResponses
              )
            }
            checked={!!transparentPossibleResponses}
            mb="20px"
          >
            {t('component.cloze.imageDragDrop.transparentpossibleresponses')}
          </CheckboxLabel>
          <CheckboxLabel
            className="additional-options"
            onChange={() =>
              handleItemChangeChange(
                'transparentBackgroundImage',
                !transparentBackgroundImage
              )
            }
            checked={!!transparentBackgroundImage}
            mb="20px"
          >
            {t('component.cloze.imageDragDrop.transparentbackgroundimage')}
          </CheckboxLabel>
        </Col>
       */}
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Label>{t('component.pictograph.answeringStyle')}</Label>
          <SelectWrapper>
            <SelectInputStyled
              size="large"
              onChange={(value) => handleOptionChange('answeringStyle')(value)}
              value={answeringStyle || 'dragAndDrop'}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value="dragAndDrop">Drag and drop</Select.Option>
              <Select.Option value="clickToSelect">
                Click to select
              </Select.Option>
            </SelectInputStyled>
          </SelectWrapper>
        </Col>
        {answeringStyle === 'clickToSelect' && (
          <Col span={6}>
            <Label>{t('component.pictograph.elementContainers')}</Label>
            <TextInputStyled
              onChange={(event) =>
                handleOptionChange('elementContainers')(+event.target.value)
              }
              defaultValue={elementContainers}
              type="number"
              min={1}
            />
          </Col>
        )}
      </Row>
    </>
  )
}

PossibleResponses.propTypes = {}

PossibleResponses.defaultProps = {
  uiStyle: {},
}

export default withNamespaces('assessment')(PossibleResponses)
