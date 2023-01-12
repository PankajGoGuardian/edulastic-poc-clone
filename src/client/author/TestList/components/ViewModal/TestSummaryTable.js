import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { test as testConstants } from '@edulastic/constants'
import { EduIf } from '@edulastic/common'

import Tags from '../../../src/components/common/Tags'
import {
  GroupName,
  GroupSummaryCard,
  GroupSummaryCardValue,
  SummaryMark,
  SummaryCardContainer,
  SummaryCardLabel,
  SummaryTable,
  SummaryTableHeaderCell,
  SummaryTableCell,
} from './styled'

const { testCategoryTypes } = testConstants

export const TestSummaryListTable = ({
  itemGroups,
  summary,
  standards,
  testCategory,
}) => {
  return (
    <PerfectScrollbar>
      <EduIf condition={testCategory === testCategoryTypes.DYNAMIC_TEST}>
        {summary?.groupSummary?.map((group, i) => (
          <>
            <GroupName>{itemGroups[i]?.groupName}</GroupName>
            <SummaryCardContainer>
              <GroupSummaryCard>
                <GroupSummaryCardValue>
                  {group.totalItems}
                </GroupSummaryCardValue>
                <SummaryCardLabel>Items</SummaryCardLabel>
              </GroupSummaryCard>
              <GroupSummaryCard>
                <Tags tags={standards} key="standards" show={2} isStandards />
              </GroupSummaryCard>
            </SummaryCardContainer>
          </>
        ))}
      </EduIf>
      <EduIf condition={testCategory !== testCategoryTypes.DYNAMIC_TEST}>
        <SummaryTable>
          <thead>
            <tr>
              <SummaryTableHeaderCell scope="col">
                SUMMARY
              </SummaryTableHeaderCell>
              <SummaryTableHeaderCell scope="col">Qs</SummaryTableHeaderCell>
              <SummaryTableHeaderCell scope="col">
                POINTS
              </SummaryTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {summary?.standards?.map((data) => (
              <EduIf
                condition={standards.includes(data.identifier)}
                key={data.identifier}
              >
                <tr data-cy={data.identifier}>
                  <SummaryTableCell>
                    <SummaryMark>{data.identifier}</SummaryMark>
                  </SummaryTableCell>
                  <SummaryTableCell>{data.totalQuestions}</SummaryTableCell>
                  <SummaryTableCell>{data.totalPoints}</SummaryTableCell>
                </tr>
              </EduIf>
            ))}
            <EduIf condition={summary?.noStandards?.totalQuestions > 0}>
              <tr>
                <SummaryTableCell>
                  <SummaryMark>No Standard</SummaryMark>
                </SummaryTableCell>
                <SummaryTableCell>
                  {summary.noStandards.totalQuestions}
                </SummaryTableCell>
                <SummaryTableCell>
                  {summary.noStandards.totalPoints}
                </SummaryTableCell>
              </tr>
            </EduIf>
          </tbody>
        </SummaryTable>
      </EduIf>
    </PerfectScrollbar>
  )
}
