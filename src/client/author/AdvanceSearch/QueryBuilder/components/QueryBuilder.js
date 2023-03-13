import React, { useEffect, useState } from 'react'
import {
  notification,
  CustomModalStyled,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.css'
import './custom_style.css'
import { connect } from 'react-redux'
import { isArray, flattenDeep } from 'lodash'
import { segmentApi } from '@edulastic/api'
import { inNotInOp, combinators } from '../config/qb-config'
import { allowedFields } from '../config/allowedFields-config'
import ValueEditor from './ValueEditor'
import { CancelButton, OkButton } from '../../../../common/styled'
import {
  ModalBody,
  ButtonsContainer,
  AdvanceSearchModel,
  HelpArticleWrapper,
  StyledIconPlayButton,
  StyledIconQuestionCircle,
  NoResultWrapper,
} from './styled-components'
import {
  getAdvancedSearchFilterSelector,
  setAdvancedSearchFilterAction,
  setAdvancedSearchSchoolsAction,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchTagsAction,
  setIsAdvancedSearchSelectedAction,
  getAdvancedSearchSchoolsSelector,
  getAdvancedSearchClassesSelector,
  getAdvancedSearchTagsSelector,
  getAdvancedSearchCoursesSelector,
  advancedSearchRequestAction,
} from '../../ducks'
import {
  AddRule,
  AddRuleGroup,
  CombinatorSelector,
  FieldSelector,
  OperatorSelector,
  RemoveRuleAction,
} from '../config/control'
import { advancedSearchHelpArtical, advancedSearchHelpVideo } from './constants'

const getAllRules = (rules = []) => {
  const allRulesByRecur = []
  rules.forEach((rule) => {
    if (rule.rules) {
      allRulesByRecur.push(getAllRules(rule.rules))
    } else {
      allRulesByRecur.push(rule)
    }
  })
  return flattenDeep(allRulesByRecur)
}

const _QueryBuilder = ({
  showAdvanceSearch,
  setShowAdvanceSearchModal,
  setIsAdvancedSearchSelected,
  setAdvancedSearchFilter,
  defaultQuery,
  loadSchoolsData,
  loadClassListData,
  loadCourseListData,
  loadTagsListData,
  schoolData,
  classData,
  courseData,
  tagData,
  loadAdvancedSearchClasses,
}) => {
  const [query, setQuery] = useState(defaultQuery)
  const [showHelpVideo, setShowHelpVideo] = useState(false)
  const formattedQuery = formatQuery(query, 'json_without_ids')
  useEffect(() => {
    const searchString = ''
    loadSchoolsData({ searchString })
    loadClassListData({ searchString })
    loadCourseListData({ searchString })
    loadTagsListData({ searchString })
  }, [])

  const showNoResult = !(query.level || query.rules.length)
  const handleCancel = () => {
    setShowAdvanceSearchModal(false)
  }

  const handleQuickFilter = () => {
    const searchQuery = JSON.parse(formattedQuery)
    const allRulesArr = getAllRules(searchQuery?.rules)

    const isAllowed =
      allRulesArr.length &&
      allRulesArr.every((rule) => {
        if (rule.value) {
          if (isArray(rule.value)) return rule.value.length
          return true
        }
        return rule.operator === 'null' || rule.operator === 'notNull'
      })

    if (!isAllowed) {
      return notification({
        msg: 'Please provide atleast one value per filter',
      })
    }

    handleCancel()
    setIsAdvancedSearchSelected(true)
    setAdvancedSearchFilter(searchQuery)

    loadAdvancedSearchClasses({ query: searchQuery })
  }

  const footer = (
    <ButtonsContainer>
      <div style={{ display: 'flex', gap: '20px' }}>
        <CancelButton
          isGhost
          onClick={handleCancel}
          style={{ minWidth: '100px' }}
          data-cy="advancedSearchCancelButton"
        >
          Cancel
        </CancelButton>
        <OkButton
          onClick={() => {
            handleQuickFilter()
            segmentApi.genericEventTrack('findClassesInAdvSearch', {})
          }}
          style={{ minWidth: '100px' }}
          data-cy="findClassButton"
        >
          Find Classes
        </OkButton>
      </div>
    </ButtonsContainer>
  )

  const fields = allowedFields({ schoolData, classData, courseData, tagData })
  const closeModal = () => {
    setShowHelpVideo(false)
  }
  return (
    <AdvanceSearchModel
      width="70%"
      padding="32px"
      visible={showAdvanceSearch}
      title={
        <HelpArticleWrapper>
          <span>Advanced Search</span>
          <a href={advancedSearchHelpArtical} target="_blank" rel="noreferrer">
            <StyledIconQuestionCircle width="16px" height="16px" />
          </a>
          <StyledIconPlayButton
            onClick={() => {
              setShowHelpVideo((state) => !state)
            }}
            width="16px"
            height="16px"
          />
        </HelpArticleWrapper>
      }
      onCancel={handleCancel}
      footer={footer}
      destroyOnClose
      centered
    >
      <ModalBody>
        <EduIf condition={showHelpVideo}>
          <EduThen>
            <CustomModalStyled
              visible={showHelpVideo}
              onCancel={closeModal}
              title="Get Started with Advanced Search"
              footer={null}
              destroyOnClose
              width="768px"
            >
              <iframe
                title="AdvancedSearch"
                width="100%"
                height="400px"
                src={advancedSearchHelpVideo}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
                allowFullScreen
                scrolling="no"
              />
            </CustomModalStyled>
          </EduThen>
          <EduElse>
            <QueryBuilder
              fields={fields}
              query={query}
              onQueryChange={(q) => setQuery(q)}
              operators={inNotInOp}
              combinators={combinators}
              controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
              enableDragAndDropProp={false}
              resetOnFieldChange
              listsAsArrays
              controlElements={{
                valueEditor: ValueEditor,
                fieldSelector: FieldSelector,
                combinatorSelector: CombinatorSelector,
                operatorSelector: OperatorSelector,
                addRuleAction: AddRule,
                addGroupAction: AddRuleGroup,
                removeRuleAction: RemoveRuleAction,
                removeGroupAction: RemoveRuleAction,
              }}
            />
          </EduElse>
        </EduIf>
      </ModalBody>
      <EduIf condition={showNoResult}>
        <NoResultWrapper>
          <h1>No Result</h1>
          <p>
            Add rules to filter the classes based on defined rules and group
            multiple rules.
          </p>
          <p>
            <a
              onClick={() => {
                setShowHelpVideo((state) => !state)
              }}
            >
              WATCH QUICK TOUR
            </a>{' '}
            to learn more...
          </p>
        </NoResultWrapper>
      </EduIf>
    </AdvanceSearchModel>
  )
}

export default connect(
  (state) => ({
    defaultQuery: getAdvancedSearchFilterSelector(state),
    schoolData: getAdvancedSearchSchoolsSelector(state),
    classData: getAdvancedSearchClassesSelector(state),
    courseData: getAdvancedSearchCoursesSelector(state),
    tagData: getAdvancedSearchTagsSelector(state),
  }),
  {
    setIsAdvancedSearchSelected: setIsAdvancedSearchSelectedAction,
    setAdvancedSearchFilter: setAdvancedSearchFilterAction,
    loadSchoolsData: setAdvancedSearchSchoolsAction,
    loadClassListData: setAdvancedSearchClassesAction,
    loadCourseListData: setAdvancedSearchCoursesAction,
    loadTagsListData: setAdvancedSearchTagsAction,
    loadAdvancedSearchClasses: advancedSearchRequestAction,
  }
)(_QueryBuilder)
