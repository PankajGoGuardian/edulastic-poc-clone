import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import {
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  SpinLoader,
  notification,
} from '@edulastic/common'
import { black } from '@edulastic/colors'
import DashboardTableFilters from './TableFilters'
import DashboardTable from './Table'
import {
  academicSummaryFiltersTypes,
  districtAvgDimension,
  getTableApiQuery,
  tableFilterTypes,
} from '../../utils'
import AddToGroupModal from '../../../../../common/components/Popups/AddToGroupModal'
import FeaturesSwitch from '../../../../../../../features/components/FeaturesSwitch'
import { isAddToStudentGroupEnabled } from '../../../common/utils'
import AverageAnalysis from './AverageAnalysis'
import { TableContainer } from '../common/styledComponents'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  StyledEmptyContainer,
  StyledText,
} from '../../../common/components/styledComponents'
import BackendPagination from '../../../../../common/components/BackendPagination'
import { isPearOrEdulasticText } from '../../../../../../../common/utils/helpers'

function TableSection({
  tableFilters,
  setTableFilters,
  pageFilters,
  setPageFilters,
  updateTableFiltersCB,
  onTableHeaderCellClick,
  getTableDrillDownUrl,
  compareByOptions,
  performanceBandsList,
  isCsvDownloading,
  settings,
  academicSummaryFilters,
  setAcademicSummaryFilters,
  fetchDashboardTableDataRequest,
  districtAveragesData,
  tableData,
  loadingTableDataWithFilters,
  loadingTableData,
  tableDataRequestError,
  isSharedReport = false,
  availableTestTypes,
}) {
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])
  const [districtAveragesRequired, setDistrictAveragesRequired] = useState(
    false
  )
  const [loadTableDataWithFilters, setLoadTableDataWithFilters] = useState(
    false
  )

  const selectedPerformanceBandOption =
    performanceBandsList.find(
      (pb) =>
        pb.key ===
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]
          ?.key
    ) || performanceBandsList[0]

  const selectedPerformanceBand = selectedPerformanceBandOption?.performanceBand
  const profileId = selectedPerformanceBandOption?.key
  const academicTestType =
    academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key
  const q = getTableApiQuery(
    settings,
    tableFilters,
    profileId,
    academicTestType
  )

  useEffect(() => {
    if ((q.termId || q.reportId) && profileId) {
      setDistrictAveragesRequired(true)
      setLoadTableDataWithFilters(true)
      setPageFilters({ ...pageFilters, [tableFilterTypes.PAGE]: 1 })
    }
  }, [
    settings.requestFilters,
    tableFilters[tableFilterTypes.COMPARE_BY]?.key,
    selectedPerformanceBandOption?.key,
  ])

  useEffect(() => {
    if (
      (q.termId || q.reportId) &&
      profileId &&
      !isEmpty(districtAveragesData) &&
      pageFilters[tableFilterTypes.PAGE]
    ) {
      setPageFilters({ ...pageFilters, [tableFilterTypes.PAGE]: 1 })
    }
  }, [
    tableFilters[tableFilterTypes.SORT_KEY],
    tableFilters[tableFilterTypes.SORT_ORDER],
    tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG],
    tableFilters[tableFilterTypes.BELOW_AVG],
  ])

  useEffect(() => {
    if (
      (q.termId || q.reportId) &&
      profileId &&
      pageFilters[tableFilterTypes.PAGE] &&
      !isEmpty(districtAveragesData) &&
      tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG] !==
        tableFilters[tableFilterTypes.BELOW_AVG]
    ) {
      setLoadTableDataWithFilters(true)
      setPageFilters({ ...pageFilters, [tableFilterTypes.PAGE]: 1 })
    }
  }, [academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key])

  useEffect(() => {
    if (pageFilters[tableFilterTypes.PAGE]) {
      fetchDashboardTableDataRequest({
        ...q,
        ...pageFilters,
        districtAveragesRequired,
        loadingTableDataWithFilters: loadTableDataWithFilters,
      })
      setDistrictAveragesRequired(false)
      setLoadTableDataWithFilters(false)
    }
  }, [pageFilters])

  const { metricInfo: districtAveragesMetricInfo } = districtAveragesData

  // handle add student to group
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ dimension }) => {
      return setCheckedStudents(
        checkedStudents.includes(dimension._id)
          ? checkedStudents.filter((i) => i !== dimension._id)
          : [...checkedStudents, dimension._id]
      )
    },
    onSelectAll: (flag) =>
      setCheckedStudents(
        flag ? tableData.metricInfo.map((d) => d.dimension._id) : []
      ),
    getCheckboxProps: ({ dimension }) => ({
      disabled: dimension === districtAvgDimension,
      name: dimension.name,
    }),
  }

  const { metricInfo = [] } = tableData

  const checkedStudentsForModal = metricInfo
    .filter(({ dimension }) => checkedStudents.includes(dimension._id))
    .map(({ dimension, username }) => {
      const name = dimension.name.split(',')
      return {
        _id: dimension._id,
        firstName: name[0],
        lastName: name?.[1],
        username,
      }
    })

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    tableFilters[tableFilterTypes.COMPARE_BY]?.key
  )

  const _rowSelection = showAddToStudentGroupBtn ? rowSelection : null

  const hasDistrictAveragesContent =
    !tableDataRequestError && !isEmpty(districtAveragesData?.metricInfo)
  const hasTableContent =
    !tableDataRequestError && !isEmpty(tableData?.metricInfo)

  const errorMsg = 'Error fetching data, please try again later'
  const emptyContainerDesc = tableDataRequestError
    ? errorMsg
    : 'No Data Available'

  return (
    <>
      <FeaturesSwitch
        inputFeatures="studentGroups"
        actionOnInaccessible="hidden"
      >
        <AddToGroupModal
          groupType="custom"
          visible={showAddToGroupModal}
          onCancel={() => setShowAddToGroupModal(false)}
          checkedStudents={checkedStudentsForModal}
        />
      </FeaturesSwitch>
      <DashboardTableFilters
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        handleAddToGroupClick={handleAddToGroupClick}
        showAddToStudentGroupBtn={showAddToStudentGroupBtn}
        compareByOptions={compareByOptions}
      />
      <AverageAnalysis
        loading={loadingTableDataWithFilters}
        hasDistrictAveragesContent={hasDistrictAveragesContent}
        onTableHeaderCellClick={onTableHeaderCellClick}
        districtAveragesMetricInfo={districtAveragesMetricInfo}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        academicSummaryFilters={academicSummaryFilters}
        setAcademicSummaryFilters={setAcademicSummaryFilters}
        availableTestTypes={availableTestTypes}
        academicTestType={academicTestType}
      />
      <TableContainer>
        <FlexContainer
          alignItems="center"
          justifyContent="space-between"
          marginBottom="25px"
        >
          <StyledText fontSize="16px" color={black}>
            Performance Drilldown
          </StyledText>
          <FlexContainer alignItems="center">
            <StyledText
              fontWeight={600}
              fontSize="14px"
              color={black}
              margin="0 10px 0 0"
            >
              Performance Band ({isPearOrEdulasticText})
            </StyledText>
            <ControlDropDown
              height="35px"
              buttonWidth="224px"
              by={
                academicSummaryFilters[
                  academicSummaryFiltersTypes.PERFORMANCE_BAND
                ]
              }
              selectCB={(e, selected, comData) =>
                setAcademicSummaryFilters({
                  ...academicSummaryFilters,
                  [comData]: selected,
                })
              }
              data={performanceBandsList}
              comData={academicSummaryFiltersTypes.PERFORMANCE_BAND}
              prefix="Test Type"
              showPrefixOnSelected={false}
              containerClassName="based-on-test-type"
            />
          </FlexContainer>
        </FlexContainer>
        <EduIf condition={loadingTableData}>
          <EduThen>
            <SpinLoader
              tip="Loading Table Data"
              height="250px"
              position="relative"
            />
          </EduThen>
          <EduElse>
            <EduIf condition={hasTableContent}>
              <EduThen>
                <DashboardTable
                  tableFilters={tableFilters}
                  setTableFilters={setTableFilters}
                  getTableDrillDownUrl={getTableDrillDownUrl}
                  districtAveragesData={districtAveragesData}
                  tableData={tableData}
                  selectedPerformanceBand={selectedPerformanceBand}
                  rowSelection={_rowSelection}
                  isCsvDownloading={isCsvDownloading}
                  availableTestTypes={availableTestTypes}
                />
                <BackendPagination
                  itemsCount={tableData.dimensionCount}
                  backendPagination={pageFilters}
                  setBackendPagination={setPageFilters}
                />
              </EduThen>
              <EduElse>
                <StyledEmptyContainer description={emptyContainerDesc} />
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
      </TableContainer>
    </>
  )
}

export default TableSection
