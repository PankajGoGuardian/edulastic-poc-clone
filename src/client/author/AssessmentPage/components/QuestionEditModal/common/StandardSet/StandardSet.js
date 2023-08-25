import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { ThemeProvider } from 'styled-components'
import AlignmentRow from '../../../../../../assessment/containers/QuestionMetadata/AlignmentRow'
import { themes } from '../../../../../../theme'
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
} from '../../../../../src/actions/dictionaries'
import {
  getCurriculumsListSelector,
  getStandardsListSelector,
  standardsSelector,
} from '../../../../../src/selectors/dictionaries'

const defaultAlignment = {
  standards: [],
  grades: [],
  domains: [],
  subject: '',
  curriculumId: '',
  curriculum: '',
}

const StandardSet = ({
  t,
  alignment,
  qId,
  onUpdate,
  curriculums,
  getCurriculums,
  getCurriculumStandards,
  curriculumStandards,
  curriculumStandardsLoading,
  isDocBased,
  showIconBrowserBtn,
  hideLabel,
  gradesSubjectMandatory,
}) => {
  const [searchProps, setSearchProps] = useState({
    id: '',
    grades: [],
    searchStr: '',
  })

  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums()
    }
  }, [])

  const questionAlignment = alignment.length ? alignment[0] : defaultAlignment

  const searchCurriculumStandards = (searchObject) => {
    if (!isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject)
      getCurriculumStandards(
        searchObject.id,
        searchObject.grades,
        searchObject.searchStr
      )
    }
  }

  const handleEditAlignment = (index, standardSet) => {
    const oldAlignment = alignment.length ? alignment[0] : defaultAlignment

    onUpdate({
      alignment: [
        {
          ...oldAlignment,
          ...standardSet,
        },
      ],
    })
  }

  const handleDelete = (curriculumId) => () => {
    const filteredAlignment = alignment.filter(
      (item) => item.curriculumId !== curriculumId
    )

    onUpdate({
      alignment: filteredAlignment,
    })
  }

  const handleUpdateQuestionAlignment = (index, standardSet) => {
    const { domains } = standardSet

    if (!isEqual(questionAlignment.domains, domains)) {
      handleEditAlignment(index, { domains })
    }
  }

  const handleCreateGradeAndSubjects = () => {}

  return (
    <ThemeProvider theme={themes.default}>
      <AlignmentRow
        hideLabel={hideLabel}
        t={t}
        alignment={questionAlignment}
        alignmentIndex={0}
        qId={qId}
        curriculums={curriculums}
        curriculumStandardsELO={curriculumStandards.elo}
        curriculumStandardsTLO={curriculumStandards.tlo}
        curriculumStandardsLoading={curriculumStandardsLoading}
        handleUpdateQuestionAlignment={handleUpdateQuestionAlignment}
        onDelete={handleDelete}
        getCurriculumStandards={searchCurriculumStandards}
        editAlignment={handleEditAlignment}
        createUniqGradeAndSubjects={handleCreateGradeAndSubjects}
        isDocBased={isDocBased}
        showIconBrowserBtn={showIconBrowserBtn}
        gradesSubjectMandatory={gradesSubjectMandatory}
      />
    </ThemeProvider>
  )
}

StandardSet.propTypes = {
  t: PropTypes.func.isRequired,
  alignment: PropTypes.array,
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired,
    })
  ).isRequired,
  curriculumStandards: PropTypes.object.isRequired,
  curriculumStandardsLoading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  getCurriculums: PropTypes.func.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
}

StandardSet.defaultProps = {
  alignment: [],
}

const mapStateToProps = (state) => ({
  curriculums: getCurriculumsListSelector(state),
  curriculumStandardsLoading: standardsSelector(state).loading,
  curriculumStandards: getStandardsListSelector(state),
})

const mapDispatchToProps = {
  getCurriculums: getDictCurriculumsAction,
  getCurriculumStandards: getDictStandardsForCurriculumAction,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(StandardSet)
