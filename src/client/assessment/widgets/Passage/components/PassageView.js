import React, { useEffect, useMemo } from 'react'
import { get, set } from 'lodash'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { EduIf, WithResources } from '@edulastic/common'

import { InstructorStimulus } from '../styled/InstructorStimulus'
import { Heading } from '../styled/Heading'
import { QuestionTitleWrapper } from '../styled/QuestionNumber'
import { PassageTitleWrapper } from '../styled/PassageTitleWrapper'
import AppConfig from '../../../../../app-config'
import { CLEAR } from '../../../constants/constantsForQuestions'

import { PassageTitle } from '../../../../author/ItemList/components/Item/styled'
import { PassageContent } from './PassageContent'

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
  isStudentAttempt,
}) => {
  const isAuthorPreviewMode = useMemo(() => {
    return (
      viewComponent === 'editQuestion' ||
      viewComponent === 'authorPreviewPopup' ||
      viewComponent === 'ItemDetail'
    )
  }, [viewComponent])

  const highlightedContent = useMemo(() => {
    return isAuthorPreviewMode
      ? get(userWork, `resourceId[${widgetIndex || 0}][${authLanguage}]`, '')
      : get(highlights, `[${widgetIndex}]`, '')
  }, [])

  const saveHistory = (updatedContent) => {
    if (setHighlights) {
      const newHighlights = highlights || {}
      // this is available only at student side
      setHighlights({ ...newHighlights, [widgetIndex]: updatedContent })
    } else {
      // saving the highlights at author side
      // setHighlights is not available at author side
      const newUserWork = set(
        userWork || {},
        `resourceId[${widgetIndex || 0}][${authLanguage}]`,
        updatedContent
      )

      saveUserWork({
        [item.id]: newUserWork,
      })
    }
  }

  useEffect(() => {
    if (!setHighlights && previewTab === CLEAR) {
      clearUserWork() // clearing the userWork at author side.
    }
  }, [previewTab])

  return (
    <WithResources
      resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
      fallBack={<div />}
    >
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
          onChangeContent={saveHistory}
        />
      </EduIf>
      <EduIf
        condition={
          item.paginated_content &&
          item.pages &&
          !!item.pages.length &&
          !flowLayout
        }
      >
        {() => (
          <div data-cy="content" className="paginatedPassageContent">
            <PassageContent
              disableResponse={disableResponse}
              highlightedContent={highlightedContent}
              itemId={item.id}
              isStudentAttempt={isStudentAttempt}
              passageContent={item.pages[page - 1]}
              previewTab={previewTab}
              onChangeContent={saveHistory}
            />

            <Pagination
              style={{ justifyContent: 'center' }}
              pageSize={1}
              hideOnSinglePage
              onChange={(pageNum) => setPage(pageNum)}
              current={page}
              total={item.pages.length}
            />
          </div>
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
