import { connect } from 'react-redux'
import {
  getAllFormattedCurriculumsSelector,
  getFormattedCurriculumsSelector,
} from '../../../../src/client/author/src/selectors/dictionaries'
import {
  getAllInterestedCurriculumsSelector,
  getInterestedCurriculumsSelector,
} from '../../../../src/client/author/src/selectors/user'

const mapStateToProps = (state, props) => {
  const interestedCurriculumsSelector = props.showAllInterestedCurriculums
    ? getAllInterestedCurriculumsSelector
    : getInterestedCurriculumsSelector

  const formattedCurriculumsSelector = props.showAllInterestedCurriculums
    ? getAllFormattedCurriculumsSelector
    : getFormattedCurriculumsSelector

  return {
    interestedCurriculums: interestedCurriculumsSelector(state),
    formattedCurriculums: formattedCurriculumsSelector(state, props),
  }
}

const withInterestedCurriculums = connect(mapStateToProps)

export default withInterestedCurriculums
