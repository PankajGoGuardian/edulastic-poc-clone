import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { fetchGroupsAction } from '../../../../../../sharedDucks/groups'
import GITable from '../../common/components/GITable'
import { getDataSourceForGI } from '../../common/utils'
import { GOAL } from '../../constants/form'
import { actions } from '../../ducks'
import {
  goalsList,
  groupList,
  isGoalsDataLoading,
  isGroupLoading,
  isFormDataSaving,
} from '../../ducks/selectors'

const GoalList = ({
  goalsData,
  goalsDataLoading,
  fetchGoalsList,
  _getGroupList,
  _groupList,
  _isGroupLoading,
  noDataContent,
  onEdit,
  updateGIData,
  isSaveInProgress,
}) => {
  useEffect(() => {
    if ((goalsData || []).length === 0) fetchGoalsList()
    if ((_groupList || []).length === 0) _getGroupList()
  }, [])

  const loading = goalsDataLoading || _isGroupLoading
  const dataSource = getDataSourceForGI(goalsData, _groupList)

  return (
    <EduIf condition={loading}>
      <EduThen>
        <SpinLoader />
      </EduThen>
      <EduElse>
        <>
          <EduIf condition={dataSource.length > 0}>
            <GITable
              groupList={_groupList}
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
    _groupList: groupList(state),
    _isGroupLoading: isGroupLoading(state),
    goalsData: goalsList(state),
    goalsDataLoading: isGoalsDataLoading(state),
    isSaveInProgress: isFormDataSaving(state),
  }),
  {
    _getGroupList: fetchGroupsAction,
    fetchGoalsList: actions.getGoalsList,
    updateGIData: actions.updateGIDataRequest,
  }
)(GoalList)
