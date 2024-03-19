import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { EduIf, WithResources } from '@edulastic/common'

import AppConfig from '../../../../../app-config'
import { CLEAR } from '../../../constants/constantsForQuestions'
import { PassageTitle } from '../../../../author/ItemList/components/Item/styled'
import { PassageContent } from './PassageContent'

import {
  Heading,
  InstructorStimulus,
  PassageTitleWrapper,
  PaginatedPassageContentWrapper,
  QuestionTitleWrapper,
} from './styled-components'
import { useSaveHighlights } from '../hooks/useSaveHighlights'

const ContentsTitle = Heading

const PassageView = ({
  item,
  flowLayout,
  setHighlights,
  highlights,
  disableResponse,
  userWork,
  saveUserWork,
  clearUserWork,
  previewTab,
  widgetIndex,
  viewComponent,
  page,
  setPage,
  authLanguage,
  currentLang,
  isStudentAttempt,
}) => {
  const { highlightedContent, saveHighlights } = useSaveHighlights({
    authLanguage,
    item,
    page,
    viewComponent,
    widgetIndex,
    userWork,
    highlights,
    setHighlights,
    saveUserWork,
    currentLang,
  })

  const showPaginateContent = useMemo(() => {
    return (
      item.paginated_content && item.pages && !!item.pages.length && !flowLayout
    )
  }, [item.paginated_content, item.pages, flowLayout])

  useEffect(() => {
    if (!setHighlights && previewTab === CLEAR) {
      clearUserWork() // clearing the userWork at author side.
    }
  }, [previewTab])

  return (
    <WithResources resources={[AppConfig.jqueryPath]} fallBack={<div />}>
      <EduIf condition={item.instructorStimulus && !flowLayout}>
        <InstructorStimulus
          dangerouslySetInnerHTML={{ __html: item.instructorStimulus }}
        />
      </EduIf>
      <EduIf condition={!flowLayout}>
        <QuestionTitleWrapper data-cy="heading">
          <EduIf condition={!!item.heading}>
            <Heading dangerouslySetInnerHTML={{ __html: item.heading }} />
          </EduIf>
        </QuestionTitleWrapper>
      </EduIf>
      <EduIf condition={!!item.contentsTitle && !flowLayout}>
        <EduIf condition={item?.type !== 'passage'}>
          <ContentsTitle
            dangerouslySetInnerHTML={{ __html: item.contentsTitle }}
          />
        </EduIf>
        <EduIf condition={item?.type === 'passage'}>
          <PassageTitleWrapper>
            <EduIf condition={!!item?.source}>
              <PassageTitle
                dangerouslySetInnerHTML={{ __html: item.contentsTitle }}
              />{' '}
              by{' '}
              <PassageTitle dangerouslySetInnerHTML={{ __html: item.source }} />
            </EduIf>
            <EduIf condition={!item?.source}>
              <PassageTitle
                dangerouslySetInnerHTML={{ __html: item.contentsTitle }}
              />
            </EduIf>
          </PassageTitleWrapper>
        </EduIf>
      </EduIf>
      <EduIf condition={!item.paginated_content && item.content}>
        <PassageContent
          disableResponse={disableResponse}
          highlightedContent={highlightedContent}
          itemId={item.id}
          isStudentAttempt={isStudentAttempt}
          passageContent={item.content}
          previewTab={previewTab}
          onChangeContent={saveHighlights}
        />
      </EduIf>
      <EduIf condition={showPaginateContent}>
        {() => (
          <PaginatedPassageContentWrapper
            data-cy="content"
            className="paginatedPassageContent"
          >
            <PassageContent
              disableResponse={disableResponse}
              highlightedContent={highlightedContent}
              itemId={item.id}
              isStudentAttempt={isStudentAttempt}
              passageContent={item.pages[page - 1]}
              previewTab={previewTab}
              onChangeContent={saveHighlights}
            />

            <Pagination
              pageSize={1}
              hideOnSinglePage
              onChange={setPage}
              current={page}
              total={item.pages.length}
            />
          </PaginatedPassageContentWrapper>
        )}
      </EduIf>
    </WithResources>
  )
}

PassageView.propTypes = {
  setHighlights: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  saveUserWork: PropTypes.func.isRequired,
  clearUserWork: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  highlights: PropTypes.array.isRequired,
  userWork: PropTypes.object.isRequired,
  flowLayout: PropTypes.bool,
}

PassageView.defaultProps = {
  flowLayout: false,
}

PassageView.formats = ['background']

export default PassageView
