import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import connect from 'react-redux/es/connect/connect'
import { ThemeProvider } from 'styled-components'
import _ from 'lodash'
import { questionType } from '@edulastic/constants'
import { withMathFormula } from '@edulastic/common/src/HOC/withMathFormula'
import { Subtitle } from '../../styled/Subtitle'
import { themes } from '../../../theme'
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
  removeExistedAlignmentAction,
  updateDictAlignmentAction,
} from '../../../author/src/actions/dictionaries'
import {
  setQuestionAlignmentAddRowAction,
  setQuestionAlignmentRemoveRowAction,
  setQuestionDataAction,
  getQuestionDataSelector,
} from '../../../author/QuestionEditor/ducks'

import {
  getCollectionsSelector,
  setCollectionsAction,
  getHighlightCollectionSelector,
  isDerivedFromPremiumBankSelector,
} from '../../../author/ItemDetail/ducks'

import {
  getCurriculumsListSelector,
  getStandardsListSelector,
  standardsSelector,
  getDictionariesAlignmentsSelector,
  getRecentCollectionsListSelector,
} from '../../../author/src/selectors/dictionaries'

import { Container } from './styled/Container'
import { ShowAlignmentRowsContainer } from './styled/ShowAlignmentRowsContainer'
import SecondBlock from './SecondBlock'
import AlignmentRow from './AlignmentRow'
import {
  getOrgDataSelector,
  getUserFeatures,
  getCollectionsToAddContent,
} from '../../../author/src/selectors/user'
import {
  getAllTagsAction,
  getAllTagsSelector,
  addNewTagAction,
} from '../../../author/TestPage/ducks'
import { getAuthorQuestionStatus } from '../../../author/sharedDucks/questions'
import { convertCollectionOptionsToArray } from '../../../author/src/utils/util'

const QuestionMetadata = ({
  t,
  alignment,
  questionData,
  setQuestionData,
  curriculumStandards,
  getCurriculumStandards,
  curriculums,
  getAllTags,
  allTagsData,
  addNewTag,
  getCurriculums,
  removeAlignment,
  editAlignment,
  curriculumStandardsLoading,
  setCollections,
  collections,
  orgData,
  userFeatures,
  highlightCollection,
  recentCollectionsList,
  authorQuestionStatus = false,
  collectionsToShow,
  isDerivedFromPremiumBank,
}) => {
  const [searchProps, setSearchProps] = useState({
    id: '',
    grades: [],
    searchStr: '',
  })
  const { id: qId, type } = questionData

  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums()
    }
    getAllTags({ type: 'testitem' })
  }, [])

  const handleDelete = (curriculumId) => () => {
    removeAlignment(curriculumId)
  }

  const handleChangeTags = (tags) => {
    const newQuestionData = {
      ...questionData,
      tags,
    }
    setQuestionData(newQuestionData)
  }

  const handleQuestionDataSelect = (fieldName) => (value) => {
    const newQuestionData = {
      ...questionData,
      [fieldName]: value,
    }
    if (
      (fieldName === 'authorDifficulty' || fieldName === 'depthOfKnowledge') &&
      value === ''
    ) {
      delete newQuestionData[fieldName]
    }
    setQuestionData(newQuestionData)
  }

  const handleCollectionsSelect = (val, options) => {
    const collectionArray = convertCollectionOptionsToArray(options)

    const orgCollectionIds = collectionsToShow.map((o) => o._id)

    /** **** here were extracting out the collection which are not of current user district (if any) so that 
          while saving, collections array contains these extra collections also ***** */
    const extraCollections = collections.filter(
      (c) => !orgCollectionIds.includes(c._id)
    )
    setCollections([...collectionArray, ...extraCollections])
  }

  const handleRecentCollectionsSelect = (collectionItem) => {
    let _collections = collections.map((o) => ({ ...o }))
    _collections = [..._collections, collectionItem]
    setCollections(_collections)
  }

  const handleUpdateQuestionAlignment = (index, _alignment, updated = true) => {
    const newAlignments = (questionData.alignment || [])
      .filter((el) => !el.isEquivalentStandard)
      .map((c, i) => (i === index ? _alignment : c))
    if (!newAlignments.length) {
      newAlignments.push(_alignment)
    }
    const newQuestionData = {
      ...questionData,
      alignment: newAlignments,
    }
    setQuestionData({ ...newQuestionData, updated })
  }

  const searchCurriculumStandards = (searchObject) => {
    if (!_.isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject)
      getCurriculumStandards(
        searchObject.id,
        searchObject.grades,
        searchObject.searchStr
      )
    }
  }

  const createUniqGradeAndSubjects = (grades, subject) => {
    const uniqGrades = _.uniq([...grades]).filter((item) => !!item)
    const uniqSubjects = [subject].filter((item) => !!item)
    setQuestionData({
      ...questionData,
      grades: uniqGrades,
      subjects: uniqSubjects,
    })
  }

  const handleChangeExternalData = (key) => (e) => {
    const newQuestionData = {
      ...questionData,
      [key]: e.target.value,
    }
    setQuestionData(newQuestionData)
  }

  return (
    <ThemeProvider theme={themes.default}>
      <div>
        <Container padding="20px">
          <Subtitle margin="0px">
            {t('component.options.addSkillsForQuestion')}
          </Subtitle>

          <ShowAlignmentRowsContainer>
            {alignment.map((el, index) => (
              <AlignmentRow
                key={index}
                t={t}
                qId={qId}
                alignmentIndex={index}
                handleUpdateQuestionAlignment={handleUpdateQuestionAlignment}
                alignment={el}
                curriculums={curriculums}
                getCurriculumStandards={searchCurriculumStandards}
                onDelete={handleDelete}
                curriculumStandardsELO={curriculumStandards.elo}
                curriculumStandardsTLO={curriculumStandards.tlo}
                curriculumStandardsLoading={curriculumStandardsLoading}
                editAlignment={editAlignment}
                createUniqGradeAndSubjects={createUniqGradeAndSubjects}
                authorQuestionStatus={authorQuestionStatus}
              />
            ))}
          </ShowAlignmentRowsContainer>
        </Container>

        <SecondBlock
          t={t}
          depthOfKnowledge={questionData.depthOfKnowledge}
          authorDifficulty={questionData.authorDifficulty}
          tags={questionData.tags}
          allTagsData={allTagsData}
          addNewTag={addNewTag}
          onChangeTags={handleChangeTags}
          onQuestionDataSelect={handleQuestionDataSelect}
          onChangeExternalData={handleChangeExternalData}
          handleCollectionsSelect={handleCollectionsSelect}
          handleRecentCollectionsSelect={handleRecentCollectionsSelect}
          collections={collections}
          orgData={orgData}
          userFeatures={userFeatures}
          highlightCollection={highlightCollection}
          recentCollectionsList={recentCollectionsList}
          bloomsTaxonomy={questionData.bloomsTaxonomy}
          collectionsToShow={collectionsToShow}
          testletQuestionId={questionData.testletQuestionId}
          testletResponseIds={questionData.testletResponseIds}
          testletAdditionalMetadata={questionData.testletAdditionalMetadata}
          showAdditionalMeta={
            type === questionType.GRAPH || type === questionType.MULTIPLE_CHOICE
          }
          isDerivedFromPremiumBank={isDerivedFromPremiumBank}
        />
      </div>
    </ThemeProvider>
  )
}

QuestionMetadata.propTypes = {
  getCurriculums: PropTypes.func.isRequired,
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired,
    })
  ).isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  curriculumStandardsLoading: PropTypes.bool.isRequired,
  alignment: PropTypes.arrayOf(
    PropTypes.shape({
      curriculumId: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      standards: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          level: PropTypes.string.isRequired,
          identifier: PropTypes.string.isRequired,
          tloId: PropTypes.string,
          eloId: PropTypes.string,
          subEloId: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  questionData: PropTypes.shape({
    depthOfKnowledge: PropTypes.string,
    authorDifficulty: PropTypes.string,
  }).isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  removeAlignment: PropTypes.func.isRequired,
  editAlignment: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      curriculums: getCurriculumsListSelector(state),
      curriculumStandardsLoading: standardsSelector(state).loading,
      curriculumStandards: getStandardsListSelector(state),
      questionData: getQuestionDataSelector(state),
      allTagsData: getAllTagsSelector(state, 'testitem'),
      alignment: getDictionariesAlignmentsSelector(state),
      collections: getCollectionsSelector(state),
      orgData: getOrgDataSelector(state),
      userFeatures: getUserFeatures(state),
      highlightCollection: getHighlightCollectionSelector(state),
      recentCollectionsList: getRecentCollectionsListSelector(state),
      collectionsToShow: getCollectionsToAddContent(state),
      authorQuestionStatus: getAuthorQuestionStatus(state),
      isDerivedFromPremiumBank: isDerivedFromPremiumBankSelector(state),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      setQuestionAlignmentAddRow: setQuestionAlignmentAddRowAction,
      setQuestionAlignmentRemoveRow: setQuestionAlignmentRemoveRowAction,
      setQuestionData: setQuestionDataAction,
      removeAlignment: removeExistedAlignmentAction,
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      editAlignment: updateDictAlignmentAction,
      setCollections: setCollectionsAction,
    }
  )
)

export default enhance(withMathFormula(QuestionMetadata))
