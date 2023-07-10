import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import {
  fetchArchiveGroupsAction,
  fetchGroupsAction,
} from '../../../../../../sharedDucks/groups'
import GITable from '../../common/components/GITable'
import { getDataSourceForGI } from '../../common/utils'
import { INTERVENTION } from '../../constants/form'
import { actions } from '../../ducks'
import {
  allGroupsSelector,
  interventionsList,
  isGroupLoading,
  isInterventionsDataLoading,
} from '../../ducks/selectors'

const InterventionList = ({
  interventionsData,
  interventionsDataLoading,
  fetchInterventionsList,
  _getGroupList,
  allGroups,
  _isGroupLoading,
  noDataContent,
  onEdit,
  updateGIData,
  fetchArchivedGroups,
}) => {
  useEffect(() => {
    if ((interventionsData || []).length === 0) fetchInterventionsList()
    _getGroupList()
    fetchArchivedGroups()
  }, [])

  const loading = interventionsDataLoading || _isGroupLoading
  const dataSource = getDataSourceForGI(interventionsData, allGroups)

  return (
    <EduIf condition={loading}>
      <EduThen>
        <SpinLoader />
      </EduThen>
      <EduElse>
        <>
          <EduIf condition={dataSource.length > 0}>
            <GITable
              data={dataSource}
              type={INTERVENTION}
              onEdit={onEdit}
              updateGIData={updateGIData}
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
    interventionsData: interventionsList(state),
    interventionsDataLoading: isInterventionsDataLoading(state),
  }),
  {
    _getGroupList: fetchGroupsAction,
    fetchInterventionsList: actions.getInterventionsList,
    updateGIData: actions.updateGIDataRequest,
    fetchArchivedGroups: fetchArchiveGroupsAction,
  }
)(InterventionList)
