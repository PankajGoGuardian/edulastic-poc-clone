import { black, darkGrey2, grey, greyThemeLighter } from '@edulastic/colors'
import styled from 'styled-components'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import { CircularDiv } from '../../../ClassBoard/components/DisneyCardContainer/styled'

const STUDENT_LIST_HEADING_LINE_HEIGHT = 24
const STUDENT_LIST_HEADING_MARGIN = 8

const STUDENT_LIST_SUB_HEADING_LINE_HEIGHT = 20

const TABLE_HEADER_HEIGHT = 60

export const TABLE_HEADING_HEIGHT =
  TABLE_HEADER_HEIGHT +
  STUDENT_LIST_SUB_HEADING_LINE_HEIGHT +
  STUDENT_LIST_HEADING_MARGIN +
  STUDENT_LIST_HEADING_LINE_HEIGHT

export const StudentListContainer = styled.div`
  position: relative;
`

export const StudentListHeading = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: ${STUDENT_LIST_HEADING_LINE_HEIGHT}px;
  color: ${black};
  margin-bottom: ${STUDENT_LIST_HEADING_MARGIN}px;
`

export const StudentListSubHeading = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: ${STUDENT_LIST_SUB_HEADING_LINE_HEIGHT}px;
  color: #555555;
`

export const StyledNoDataNotification = styled(NoDataNotification)`
  position: absolute;
  height: 0px;
  min-height: 0px;
  top: 50%;
`

export const StyledCircularDiv = styled(CircularDiv)`
  margin-right: 10px;
  font-size: 16px;
  height: 40px;
  width: 40px;
`

export const TableStudentName = styled.div`
  flex: 3;
  display: flex;
  flex-direction: horizontal;
  align-items: center;
  margin: 0 0 0 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StudentFullName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TableStudentMastery = styled.div`
  flex: 2;
  display: flex;
  flex-direction: horizontal;
  align-items: center;
`

export const TableStudentStandards = styled.div`
  flex: 5;
  display: flex;
  flex-direction: horizontal;
  align-items: center;
`

export const RowContainer = styled.div`
  display: flex;
  flex-direction: horizontal;
  width: 100%;
  gap: 10px;
  font-weight: bold;
  border: 1px solid ${grey};
  border-width: 0 1px 1px 1px;
`

export const TableHeaderContainer = styled.div`
  display: flex;
  flex-direction: horizontal;
  width: 100%;
  gap: 10px;
  margin: 20px 0 0 0;
  background-color: ${greyThemeLighter};
  height: ${TABLE_HEADER_HEIGHT}px;
  border-radius: 5px 5px 0 0;
  border: 1px solid ${grey};
  border-width: 1px 1px 0px 1px;
  align-items: center;
`

export const TableHeaderName = styled.div`
  flex: 3;
  margin: 0 0 0 15px;
  font-weight: 600;
  color: ${darkGrey2};
`

export const TableHeaderMastery = styled.div`
  flex: 2;
  font-weight: 600;
  color: ${darkGrey2};
  display: flex;
  flex-direction: horizontal;
  align-items: center;
  gap: 2px;
`

export const TableHeaderStandards = styled.div`
  flex: 5;
  font-weight: 600;
  color: ${darkGrey2};
  display: flex;
  flex-direction: horizontal;
  align-items: center;
  gap: 2px;
`

export const StandardTag = styled.span`
  background-color: ${grey};
  margin: 0px 3px;
  border-radius: 5px;
  padding: 5px;
`

export const StandardTotal = styled.span`
  font-size: 22px;
  margin: 0 10px 0 0;
`
