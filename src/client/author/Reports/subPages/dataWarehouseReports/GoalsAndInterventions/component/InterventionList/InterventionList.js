import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { fetchGroupsAction } from '../../../../../../sharedDucks/groups'
import GITable from '../../common/components/GITable'
import { getDataSourceForGI } from '../../common/utils'
import { INTERVENTION } from '../../constants/form'
import { actions } from '../../ducks'
import {
  groupList,
  interventionsList,
  isGroupLoading,
  isInterventionsDataLoading,
} from '../../ducks/selectors'

const InterventionList = ({
  interventionsData,
  interventionsDataLoading,
  fetchInterventionsList,
  _getGroupList,
  _groupList,
  _isGroupLoading,
  noDataContent,
}) => {
  useEffect(() => {
    if ((interventionsData || []).length === 0) fetchInterventionsList()
    if ((_groupList || []).length === 0) _getGroupList()
  }, [])

  const loading = interventionsDataLoading || _isGroupLoading
  const dataSource = getDataSourceForGI(interventionsData, _groupList)

  return (
    <EduIf condition={loading}>
      <EduThen>
        <SpinLoader />
      </EduThen>
      <EduElse>
        <>
          <EduIf condition={dataSource.length > 0}>
            <GITable data={dataSource} type={INTERVENTION} />
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
    interventionsData: interventionsList(state),
    interventionsDataLoading: isInterventionsDataLoading(state),
  }),
  {
    _getGroupList: fetchGroupsAction,
    fetchInterventionsList: actions.getInterventionsList,
  }
)(InterventionList)
