import React, { useMemo } from 'react'
import next from 'immer'

import { Row, Col } from 'antd'
import { EduButton } from '@edulastic/common'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  StyledH3,
  ColoredCell,
  StyledDropDownContainer,
} from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import TableTooltipRow from '../../../../../common/components/tooltip/TableTooltipRow'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { GradebookTable as StyledTable } from '../../../standardsGradebook/components/table/standardsGradebookTable'

import { downloadCSV } from '../../../../../common/util'
import {
  getTableData,
  getMasteryScoreColor,
  getColValue,
  getOverallColSorter,
  getOverallValue,
} from '../../utils/transformers'
import { getAnalyseByTitle } from '../../../standardsPerformance/utils/transformers'

const StandardsProgressTable = ({
  data: rawTableData = [],
  testInfo,
  masteryScale,
  tableFilters,
  setTableFilters,
  tableFilterOptions,
  isCsvDownloading,
  backendPagination,
  setBackendPagination,
}) => {
  const { analyseByData, compareByData } = tableFilterOptions

  const [tableData, testInfoEnhanced] = useMemo(
    () =>
      getTableData(
        rawTableData,
        testInfo,
        masteryScale,
        tableFilters.compareBy.key
      ),
    [rawTableData, tableFilters]
  )

  const getTestCols = () =>
    testInfoEnhanced.map((test) => ({
      title: (
        <>
          <span>{test.testName}</span>
          <br />
          <span>
            {test[tableFilters.analyseBy.key]}
            {tableFilters.analyseBy.key === 'score' ? ' %' : ''}
          </span>
        </>
      ),
      align: 'center',
      dataIndex: test.reportKey,
      key: test.reportKey,
      render: (_, record) => {
        const _test = record.records.find((o) => o.reportKey === test.reportKey)
        const colValue = getColValue(
          _test,
          tableFilters.analyseBy.key,
          masteryScale
        )
        const bgColor =
          (tableFilters.analyseBy.key === 'masteryLevel' ||
            tableFilters.analyseBy.key === 'masteryScore') &&
          getMasteryScoreColor(_test, masteryScale)
        const toolTipText = (
          <div>
            <TableTooltipRow
              title={`${tableFilters.compareBy.title}: `}
              value={record.name || '-'}
            />
            <TableTooltipRow title="Test: " value={test.testName} />
            <TableTooltipRow
              title={`${getAnalyseByTitle(tableFilters.analyseBy.key)}: `}
              value={colValue}
            />
          </div>
        )
        return (
          <CustomTableTooltip
            placement="top"
            title={toolTipText}
            getCellContents={() =>
              colValue === 'N/A' ? (
                colValue
              ) : (
                <ColoredCell bgColor={bgColor}>{colValue}</ColoredCell>
              )
            }
          />
        )
      },
    }))

  const columns = [
    {
      title: tableFilters.compareBy.title,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      render: (data) => data || '-',
    },
    {
      title: 'Overall',
      dataIndex: 'overall',
      key: 'overall',
      sorter: getOverallColSorter(tableFilters.analyseBy.key, masteryScale),
      render: (_, record) =>
        getOverallValue(record, tableFilters.analyseBy.key, masteryScale),
    },
    ...getTestCols(),
    {
      title: 'SIS ID',
      dataIndex: 'sisId',
      key: 'sisId',
      visibleOn: ['csv'],
      render: (_, record) => record.rowInfo.sisId || '',
    },
  ]

  const onChangeTableFilters = (prefix, options, selectedPayload) => {
    const modifiedState = next(tableFilters, (draft) => {
      draft[prefix] =
        options.find((option) => option.key === selectedPayload.key) ||
        options[0]
    })
    setTableFilters(modifiedState)
  }

  const bindOnChange = (prefix, options) => (props) =>
    onChangeTableFilters(prefix, options, props)

  const onCsvConvert = (data) =>
    downloadCSV(`Standard Mastery Over Time.csv`, data)

  return (
    <>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={8} lg={8} xl={12}>
          <StyledH3>
            Standard Mastery Over Time by {tableFilters.compareBy.title}
          </StyledH3>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={12}>
          <Row className="control-dropdown-row">
            <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
              <ControlDropDown
                prefix="Compare by "
                data={compareByData}
                by={tableFilters.compareBy}
                selectCB={bindOnChange('compareBy', compareByData)}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
              <ControlDropDown
                prefix="Analyze by "
                data={analyseByData}
                by={tableFilters.analyseBy}
                selectCB={bindOnChange('analyseBy', analyseByData)}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={24} md={4} lg={4} xl={4}>
              <EduButton
                block
                height="32px"
                onClick={() =>
                  setBackendPagination({
                    ...backendPagination,
                    page: backendPagination.page - 1,
                  })
                }
                disabled={backendPagination.page <= 1}
              >
                PREV
              </EduButton>
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={24} md={4} lg={4} xl={4}>
              <EduButton
                block
                height="32px"
                onClick={() =>
                  setBackendPagination({
                    ...backendPagination,
                    page: backendPagination.page + 1,
                  })
                }
                disabled={
                  !backendPagination.page ||
                  !backendPagination.pageCount ||
                  backendPagination.page === backendPagination.pageCount
                }
              >
                NEXT
              </EduButton>
            </StyledDropDownContainer>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <CsvTable
            dataSource={tableData}
            columns={columns}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            tableToRender={StyledTable}
            scroll={{ x: '100%' }}
          />
        </Col>
      </Row>
    </>
  )
}

export default StandardsProgressTable
