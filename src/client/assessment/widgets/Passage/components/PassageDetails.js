import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { arrayMove } from 'react-sortable-hoc'
import produce from 'immer'
import { Select } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { EduIf } from '@edulastic/common'

import QuestionTextArea from '../../../components/QuestionTextArea'
import { updateVariables } from '../../../utils/variables'
import QuillSortableList from '../../../components/QuillSortableList'

import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'
import { WidgetFRInput } from '../../../styled/Widget'
import { Label } from '../../../styled/WidgetOptions/Label'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { TextInputStyled, SelectInputStyled } from '../../../styled/InputStyles'
import PassageSection from './PassageSection'

const Details = ({
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  t: translate,
}) => {
  const updated = useRef(false)
  const handleChange = (prop, value) => {
    const updatedByUser = updated.current

    const newItem = produce(item, (draft) => {
      if (prop === 'paginated_content' && value) {
        draft.pages = [draft.content]
        delete draft.content
      }
      if (prop === 'paginated_content' && !value) {
        if (draft.pages && draft.pages.length) {
          draft.content = draft.pages.join('')
        }

        delete draft.pages
      }

      draft[prop] = value
      updateVariables(draft)
    })
    setQuestionData({ ...newItem, updated: updatedByUser })

    // content is being set in passage type question
    // updating at the end of first run
    updated.current = true
  }

  const handleSortPagesEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.pages = arrayMove(draft.pages, oldIndex, newIndex)
      })
    )
  }

  const handleRemovePage = (index) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.pages.splice(index, 1)
        updateVariables(draft)
      })
    )
  }

  const handleChangePage = (index, value) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.pages[index] = value
        updateVariables(draft)
      })
    )
  }

  const handleAddPage = () => {
    setQuestionData(
      produce(item, (draft) => {
        draft.pages.push('')
      })
    )
  }

  const rendererOptions = useMemo(() => {
    return [
      { value: '', label: translate('component.passage.mathJax') },
      { value: 'mathquill', label: translate('component.passage.mathQuill') },
    ]
  }, [translate])

  return (
    <>
      <PassageSection
        title={item?.title}
        label={translate('component.passage.heading')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <WidgetFRInput data-cy="passageHeading">
          <QuestionTextArea
            onChange={(value) => handleChange('heading', value)}
            value={item.heading || ''}
            border="border"
            toolbarId="heading"
          />
        </WidgetFRInput>
      </PassageSection>
      <PassageSection
        title={item?.title}
        label={translate('component.passage.contentsTitle')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <WidgetFRInput data-cy="passageTitle">
          <QuestionTextArea
            placeholder={translate('component.passage.enterPassageTitleHere')}
            onChange={(value) => handleChange('contentsTitle', value)}
            value={item.contentsTitle || ''}
            border="border"
            toolbarId="contents_title"
          />
        </WidgetFRInput>
      </PassageSection>
      <PassageSection
        title={item?.title}
        label={translate('component.passage.source')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <WidgetFRInput data-cy="source">
          <QuestionTextArea
            placeholder={translate('component.passage.enterPassageSourceHere')}
            onChange={(value) => handleChange('source', value)}
            value={item.source || ''}
            border="border"
            toolbarId="source"
          />
        </WidgetFRInput>
      </PassageSection>
      <PassageSection
        title={item?.title}
        label={
          !item.paginated_content
            ? translate('component.passage.contents')
            : translate('component.passage.contentPages')
        }
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <div data-cy="passageContent">
          <EduIf condition={!item.paginated_content}>
            <QuestionTextArea
              placeholder={translate(
                'component.passage.enterPassageContentHere'
              )}
              onChange={(value) => handleChange('content', value)}
              value={item.content}
              additionalToolbarOptions={['paragraphNumber']}
              border="border"
              sanitizeClipboardHtml
              toolbarId="passage_content"
            />
          </EduIf>
          <EduIf condition={!!item.paginated_content}>
            <EduIf condition={!!item?.pages?.length}>
              <QuillSortableList
                items={item.pages}
                onSortEnd={handleSortPagesEnd}
                useDragHandle
                onRemove={handleRemovePage}
                onChange={handleChangePage}
              />
            </EduIf>
            <CustomStyleBtn onClick={handleAddPage} data-cy="contentAddBtn">
              {translate('component.passage.add')}
            </CustomStyleBtn>
          </EduIf>
        </div>
      </PassageSection>
      <PassageSection
        title={item?.title}
        label={translate('component.passage.details')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Label>{translate('component.passage.fleschKincaid')}</Label>
            <TextInputStyled
              size="large"
              value={item.flesch_kincaid || ''}
              onChange={(e) => handleChange('flesch_kincaid', e.target.value)}
              data-cy="fleschKincaid"
            />
          </Col>
          <Col span={12}>
            <Label>{translate('component.passage.lexile')}</Label>
            <TextInputStyled
              size="large"
              value={item.lexile || ''}
              onChange={(e) => handleChange('lexile', e.target.value)}
              data-cy="lexile"
            />
          </Col>
        </Row>
      </PassageSection>
      <PassageSection
        title={item?.title}
        label={translate('component.passage.instructorStimulus')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Row gutter={24}>
          <Col span={24}>
            <WidgetFRInput data-cy="instructorStimulus">
              <QuestionTextArea
                onChange={(value) => handleChange('instructorStimulus', value)}
                value={item.instructorStimulus || ''}
                border="border"
                toolbarId="instructor_stimulus"
              />
            </WidgetFRInput>
          </Col>
          <Col span={24}>
            <CheckboxLabel
              checked={item.paginated_content}
              onChange={(e) =>
                handleChange('paginated_content', e.target.checked)
              }
              tabIndex={0}
              data-cy="enablePaginatedContent"
            >
              {translate('component.passage.enablePaginatedContent')}
            </CheckboxLabel>
          </Col>
        </Row>
      </PassageSection>
      <EduIf condition={item.isMath}>
        <PassageSection
          title={item?.title}
          label={translate('component.passage.mathRenderer')}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <SelectInputStyled
            size="large"
            value={item.math_renderer}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleChange('math_renderer', value)}
            tabIndex={0}
          >
            {rendererOptions.map(({ value: val, label }) => (
              <Select.Option
                key={val}
                value={val}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {label}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </PassageSection>
      </EduIf>
    </>
  )
}

Details.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

Details.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(Details)
