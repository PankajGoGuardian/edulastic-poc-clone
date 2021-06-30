import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withTheme } from 'styled-components'
import produce from 'immer'
import { cloneDeep } from 'lodash'
import uuid from 'uuid/v4'
import { arrayMove } from 'react-sortable-hoc'
import { Icon } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { PaddingDiv } from '@edulastic/common'

import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import QuillSortableList from '../../components/QuillSortableList/index'

import { updateVariables } from '../../utils/variables'
import { Subtitle } from '../../styled/Subtitle'
import { TextInputStyled } from '../../styled/InputStyles'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'
import { Label } from '../../styled/WidgetOptions/Label'
import { Row } from '../../styled/WidgetOptions/Row'
import { Col } from '../../styled/WidgetOptions/Col'
import { CustomStyleBtn } from '../../styled/ButtonStyles'
import { ActionWrapper } from './styled/ActionWrapper'
import { CheckContainer } from './styled/CheckContainer'

class GroupResponses extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    cleanSections: PropTypes.func,
    fillSections: PropTypes.func,
  }

  static defaultProps = {
    cleanSections: () => null,
    fillSections: () => null,
  }

  constructor(props) {
    super(props)

    this.containerRef = React.createRef()
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.options = arrayMove(draft.options, oldIndex, newIndex)
      })
    )
  }

  remove = (index, optionId) => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.options.splice(index, 1)

        // remove deleted option from valid and alternate answers
        let validAnswers = draft.validation.validResponse.value
        if (validAnswers?.length > 0) {
          validAnswers.forEach((answer, pos) => {
            if (answer === optionId) {
              validAnswers[pos] = null
            }
          })
        }

        let alternateAnswers = draft.validation.altResponses
        if (alternateAnswers?.length > 0) {
          alternateAnswers.forEach((alternateAnswer) => {
            ;(alternateAnswer?.value || []).forEach((answer, pos) => {
              if (answer === optionId) {
                alternateAnswer.value[pos] = null
              }
            })
          })
        }
        updateVariables(draft)
      })
    )
  }

  editOptions = (index, value) => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.options[index].label = value
        const maxLength = 0
        // draft.options.forEach(option => {
        //   maxLength = Math.max(maxLength, option ? option.label.length : 0);
        // });

        /**
         * causes issues while re rendering after coming back from preview
         * always defaulting width to 140 because of below logic
         */

        // const finalWidth = 40 + maxLength * 7;
        // draft.uiStyle.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        updateVariables(draft)
      })
    )
  }

  addNewChoiceBtn = () => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.options.push({ value: uuid(), label: '' })
      })
    )
  }

  groupResponsesHandler = (e) => {
    const { item, setQuestionData } = this.props
    const { groupResponses = [], options = [] } = item
    const hasGroupResponses = e.target.checked
    const newGroupResponses = []
    const newOptions = []

    if (hasGroupResponses) {
      newGroupResponses.push({ title: '', options: [...options] })
    } else {
      groupResponses.forEach((group) => {
        const opts = group.options.filter(
          (o) => !newOptions.some((no) => no.value === o.value)
        )
        newOptions.push(...opts)
      })
    }

    setQuestionData(
      produce(item, (draft) => {
        draft.hasGroupResponses = hasGroupResponses
        draft.groupResponses = newGroupResponses
        draft.options = newOptions
        updateVariables(draft)
      })
    )
  }

  addGroup = () => {
    const {
      item: { groupResponses = [] },
    } = this.props

    groupResponses.push({ title: '', options: [{ value: uuid(), label: '' }] })
    const newGroupResponses = groupResponses.slice()

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses
        updateVariables(draft)
      })
    )
  }

  removeGroup = (index) => {
    const {
      item: { groupResponses = [] },
    } = this.props
    const newGroupResponses = cloneDeep(groupResponses) // deepclone to avoid changes in original item
    newGroupResponses.splice(index, 1)

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses

        let validAnswers = draft.validation.validResponse.value
        if (validAnswers?.length > 0) {
          validAnswers.forEach((answer, pos) => {
            if (answer?.group == index) {
              validAnswers[pos] = null
            }
          })
        }

        let alternateAnswers = draft.validation.altResponses
        if (alternateAnswers?.length > 0) {
          alternateAnswers.forEach((alternateAnswer) => {
            ;(alternateAnswer?.value || []).forEach((answer, pos) => {
              if (answer?.group == index) {
                alternateAnswer.value[pos] = null
              }
            })
          })
        }
        updateVariables(draft)
      })
    )
  }

  changeGroupRespTitle = (index, e) => {
    const {
      item: { groupResponses = [] },
    } = this.props
    const newGroupResponses = groupResponses.slice()
    newGroupResponses[index].title = e.target.value

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses
        updateVariables(draft)
      })
    )
  }

  addNewGroupOption = (index) => {
    const {
      item: { groupResponses = [] },
    } = this.props
    const newGroupResponses = groupResponses.slice()
    newGroupResponses[index].options.push({ value: uuid(), label: '' })

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses
        updateVariables(draft)
      })
    )
  }

  editGroupOptions = (index, itemIndex, val) => {
    const {
      item: { groupResponses = [] },
    } = this.props

    const newGroupResponses = groupResponses.slice()
    newGroupResponses[index].options[itemIndex].label = val

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses
        updateVariables(draft)
      })
    )
  }

  removeGroupOptions = (index, itemIndex, optionId) => {
    const {
      item: { groupResponses = [] },
    } = this.props
    const newGroupResponses = cloneDeep(groupResponses) // deepclone to avoid changes in original item
    newGroupResponses[index].options.splice(itemIndex, 1)

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses

        let validAnswers = draft.validation.validResponse.value
        if (validAnswers?.length > 0) {
          validAnswers.forEach((answer, pos) => {
            if (answer?.group == index && answer?.data === optionId) {
              validAnswers[pos] = null
            }
          })
        }

        let alternateAnswers = draft.validation.altResponses
        if (alternateAnswers?.length > 0) {
          alternateAnswers.forEach((alternateAnswer) => {
            ;(alternateAnswer?.value || []).forEach((answer, pos) => {
              if (answer?.group == index && answer?.data === optionId) {
                alternateAnswer.value[pos] = null
              }
            })
          })
        }
        updateVariables(draft)
      })
    )
  }

  onSortEndGroupOptions = (groupIndex, params) => {
    const { oldIndex, newIndex } = params
    const {
      item: { groupResponses = [] },
    } = this.props
    const newGroupResponses = groupResponses.slice()
    const responseToMove = newGroupResponses[groupIndex].options.splice(
      oldIndex,
      1
    )[0]
    newGroupResponses[groupIndex].options.splice(newIndex, 0, responseToMove)

    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.groupResponses = newGroupResponses
        updateVariables(draft)
      })
    )
  }

  groupResponseOption = () => {
    const { t, item } = this.props
    return (
      <CheckContainer>
        <CheckboxLabel
          data-cy="drag-drop-aria-check"
          checked={item.hasGroupResponses}
          onChange={(e) => this.groupResponsesHandler(e)}
        >
          {t('component.cloze.dragDrop.grouppossibleresponses')}
        </CheckboxLabel>
      </CheckContainer>
    )
  }

  render() {
    const { t, item, theme } = this.props
    return (
      <div ref={this.containerRef}>
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.cloze.dragDrop.choicesforresponse')}`
          )}
        >
          {t('component.cloze.dragDrop.choicesforresponse')}
        </Subtitle>

        {!item.hasGroupResponses && (
          <PaddingDiv>
            <QuillSortableList
              items={item.options.map((o) => ({ value: o.label, id: o.value }))}
              onSortEnd={this.onSortEnd}
              useDragHandle
              onRemove={this.remove}
              onChange={this.editOptions}
            />
            <ActionWrapper>
              <CustomStyleBtn onClick={this.addNewChoiceBtn}>
                {t('component.cloze.dragDrop.addnewchoice')}
              </CustomStyleBtn>
              {this.groupResponseOption()}
            </ActionWrapper>
          </PaddingDiv>
        )}
        {item.hasGroupResponses &&
          item.groupResponses &&
          item.groupResponses.length > 0 &&
          item.groupResponses.map((group, index) => (
            <Row key={index}>
              <fieldset
                style={{
                  borderColor:
                    theme.widgets.clozeDragDrop
                      .groupResponseFieldsetBorderColor,
                  borderRadius: 2,
                  padding: '0 20px',
                  marginBottom: 15,
                  border: 'solid 1px',
                }}
              >
                <legend style={{ padding: '0 20px', width: 'auto' }}>
                  {t('component.cloze.dragDrop.group')} {index + 1}
                </legend>
                <div style={{ float: 'right' }}>
                  <CustomStyleBtn
                    width="40px"
                    margin="0px"
                    padding="0px"
                    height="30px"
                    onClick={() => this.removeGroup(index)}
                    size="small"
                    type="button"
                  >
                    <Icon type="close" />
                  </CustomStyleBtn>
                </div>
                <Col span={24}>
                  <Label>{t('component.cloze.dragDrop.title')}</Label>
                  <TextInputStyled
                    size="large"
                    onChange={(e) => this.changeGroupRespTitle(index, e)}
                    value={group.title}
                  />
                </Col>
                <Col span={24}>
                  <Label>
                    {t('component.cloze.dragDrop.choicesforresponse')}
                  </Label>
                  {group.options.length > 0 && (
                    <QuillSortableList
                      prefix={`group_${index}`}
                      items={group.options.map((o) => ({
                        value: o.label,
                        id: o.value,
                      }))}
                      onSortEnd={(params) =>
                        this.onSortEndGroupOptions(index, params)
                      }
                      useDragHandle
                      onRemove={(itemIndex, optionId) =>
                        this.removeGroupOptions(index, itemIndex, optionId)
                      }
                      onChange={(itemIndex, e) =>
                        this.editGroupOptions(index, itemIndex, e)
                      }
                    />
                  )}
                </Col>
                <Col span={24}>
                  <CustomStyleBtn onClick={() => this.addNewGroupOption(index)}>
                    {t('component.cloze.dragDrop.addnewchoice')}
                  </CustomStyleBtn>
                </Col>
              </fieldset>
            </Row>
          ))}
        {item.hasGroupResponses && (
          <ActionWrapper>
            <CustomStyleBtn onClick={this.addGroup}>
              {t('component.cloze.dragDrop.addgroup')}
            </CustomStyleBtn>
            {this.groupResponseOption()}
          </ActionWrapper>
        )}
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  withTheme,
  connect(null, { setQuestionData: setQuestionDataAction })
)

export default enhance(GroupResponses)
