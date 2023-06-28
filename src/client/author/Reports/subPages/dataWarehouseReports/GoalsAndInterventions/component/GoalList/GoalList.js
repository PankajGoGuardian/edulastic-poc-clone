import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import {
  fetchArchiveGroupsAction,
  fetchGroupsAction,
} from '../../../../../../sharedDucks/groups'
import GITable from '../../common/components/GITable'
import { getDataSourceForGI } from '../../common/utils'
import { GOAL } from '../../constants/form'
import { actions } from '../../ducks'
import {
  goalsList,
  isGoalsDataLoading,
  isGroupLoading,
  isFormDataSaving,
  allGroupsSelector,
} from '../../ducks/selectors'

const GoalList = ({
  goalsData,
  goalsDataLoading,
  fetchGoalsList,
  _getGroupList,
  allGroups,
  _isGroupLoading,
  noDataContent,
  onEdit,
  updateGIData,
  isSaveInProgress,
  fetchArchivedGroups,
}) => {
  useEffect(() => {
    if ((goalsData || []).length === 0) fetchGoalsList()
    _getGroupList()
    fetchArchivedGroups()
  }, [])

  const loading = goalsDataLoading || _isGroupLoading
  const dataSource = getDataSourceForGI(goalsData, allGroups)

  return (
    <EduIf condition={loading}>
      <EduThen>
        <SpinLoader />
      </EduThen>
      <EduElse>
        <>
          <EduIf condition={dataSource.length > 0}>
            <GITable
              groupList={allGroups}
              data={dataSource}
              type={GOAL}
              onEdit={onEdit}
              updateGIData={updateGIData}
              loading={isSaveInProgress}
            />
          </EduIf>
          <EduIf condition={dataSource.length === 0}>{noDataContent}</EduIf>
        </>
      </EduElse>
    </EduIf>
  )
}
export default connect(
  (state) => ({
    allGroups: allGroupsSelector(state, { GITable: true }),
    _isGroupLoading: isGroupLoading(state),
    goalsData: goalsList(state),
    goalsDataLoading: isGoalsDataLoading(state),
    isSaveInProgress: isFormDataSaving(state),
  }),
  {
    _getGroupList: fetchGroupsAction,
    fetchArchivedGroups: fetchArchiveGroupsAction,
    fetchGoalsList: actions.getGoalsList,
    updateGIData: actions.updateGIDataRequest,
  }
)(GoalList)
