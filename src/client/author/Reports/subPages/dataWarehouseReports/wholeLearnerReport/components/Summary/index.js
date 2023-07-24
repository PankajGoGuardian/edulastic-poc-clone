import React, { useMemo } from 'react'
import { dataWarehouseApi } from '@edulastic/api'
import {
  useApiQuery,
  EduIf,
  EduElse,
  EduThen,
  SpinLoader,
} from '@edulastic/common'
import { isEmpty, pick } from 'lodash'

import { SummaryWrapper, RightContentWrapper } from '../../common/styled'
import RiskSummary from './RiskSummary'
import Demographics from './Demographics'
import StudentDetails from './StudentDetails'
import useErrorNotification from '../../../../../common/hooks/useErrorNotification'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'
import { getStudentRiskData } from '../../utils'

const Summary = ({ studentInformation, studentClassData, settings }) => {
  const query = useMemo(() => {
    const payload = {
      ...settings.requestFilters,
      studentId: settings.selectedStudent.key,
    }
    return payload.reportId
      ? pick(payload, ['reportId'])
      : pick(payload, ['studentId', 'termId'])
  }, [settings.requestFilters, settings.selectedStudent.key])

  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getRiskMetrics,
    [query],
    {
      enabled:
        !isEmpty(settings.requestFilters) && !isEmpty(settings.selectedStudent),
      deDuplicate: false,
    }
  )

  const riskData = useMemo(() => getStudentRiskData(data), [data])

  const hasContent = !loading && !error && !isEmpty(riskData)
<<<<<<< HEAD
  const errorMsg = 'Error fetching Student Risk data.'
  const emptyContainerDesc = error ? errorMsg : 'No Student Risk Data Available'
=======
  const errorMsg =
    error?.response?.status === 400
      ? error?.message
      : 'Sorry, you have hit an unexpected error.'
  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
>>>>>>> edulasticv2-e34.1.0
  useErrorNotification(errorMsg, error)

  return (
    <SummaryWrapper>
      <StudentDetails
        studentInformation={studentInformation}
        studentClassData={studentClassData}
      />
      <RightContentWrapper>
        <EduIf condition={loading}>
          <EduThen>
            <SpinLoader
              tip="Loading Student Risk data"
              height="80%"
              position="relative"
            />
          </EduThen>
          <EduElse>
            <EduIf condition={hasContent}>
              <EduThen>
                <RiskSummary data={riskData} />
              </EduThen>
              <EduElse>
                <StyledEmptyContainer
                  margin="10px 0"
                  description={emptyContainerDesc}
                />
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
        <Demographics data={studentInformation} />
      </RightContentWrapper>
    </SummaryWrapper>
  )
}

export default Summary
