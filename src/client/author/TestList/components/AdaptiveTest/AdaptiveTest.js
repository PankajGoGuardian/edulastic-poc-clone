import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import StandardsSearchModal from '../../../ItemList/components/Search/StandardsSearchModal'
import { getFormattedCurriculumsSelector } from '../../../src/selectors/dictionaries'

const AdaptiveTest = ({
  setStandardSearchModalVisible,
  standardSearchModalVisible,
  search,
  formattedCuriculums,
}) => {
  const selectedCurriculam = formattedCuriculums?.find(
    ({ value }) => value === search?.curriculumId
  )

  console.log({ search })
  console.log({ formattedCuriculums })
  return (
    <StandardsSearchModal
      setShowModal={setStandardSearchModalVisible}
      showModal={standardSearchModalVisible}
      standardIds={search.standardIds?.map((item) => item._id)}
      standards={search.standardIds}
      handleApply={() => console.log('Applied')}
      selectedCurriculam={selectedCurriculam}
      grades={search.grades}
      btnText="Launch Adaptive Practice Test"
    />
  )
}

const enhance = compose(
  connect((state, { search = {} }) => ({
    search,
    formattedCuriculums: getFormattedCurriculumsSelector(state, search),
  }))
)
export default enhance(AdaptiveTest)
