import { reportsApi } from '@edulastic/api'
import { useEffect, useState } from 'react'
import { sortOrderMap } from '../constants'

const tableData = [
  {
    dimension: {
      _id: '1',
      name: 'Class 1',
    },
    avgAttendance: 85,
    tardyEventCount: 2,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 75,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 10,
      },
      {
        _id: 'l',
        name: 'Late',
        color: '#ffff00',
        value: 10,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
    ],
  },
  {
    dimension: {
      _id: '2',
      name: 'Class 2',
    },
    avgAttendance: 90,
    tardyEventCount: 1,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 85,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 5,
      },
      {
        _id: 'l',
        name: 'Late',
        color: '#ffff00',
        value: 5,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
    ],
  },
  {
    dimension: {
      _id: '3',
      name: 'Class 3',
    },
    avgAttendance: 75,
    tardyEventCount: 3,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 60,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 10,
      },
      {
        _id: 'l',
        name: 'Late',
        color: '#ffff00',
        value: 5,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
      {
        _id: 't',
        name: 'Tardy',
        color: '#ff8800',
        value: 20,
      },
    ],
  },
  {
    dimension: {
      _id: '4',
      name: 'Class 4',
    },
    avgAttendance: 95,
    tardyEventCount: 0,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 95,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 0,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
    ],
  },
]

const hardCodedData = [
  {
    week: 1,
    year: 2023,
    minDate: 1672617600000,
    totalEvents: 5,
    attendanceRatio: 4.5,
    presentEvents: 4,
    tardyEvents: 1,
    absentEvents: 0,
    weekFromTermStart: 6,
  },
  {
    week: 2,
    year: 2023,
    minDate: 1673222400000,
    totalEvents: 5,
    attendanceRatio: 2.5,
    presentEvents: 2,
    tardyEvents: 1,
    absentEvents: 2,
    weekFromTermStart: 7,
  },
  {
    week: 3,
    year: 2023,
    minDate: 1673827200000,
    totalEvents: 5,
    attendanceRatio: 2.5,
    presentEvents: 2,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: 8,
  },
  {
    week: 4,
    year: 2023,
    minDate: 1674432000000,
    totalEvents: 5,
    attendanceRatio: 2.5,
    presentEvents: 2,
    tardyEvents: 1,
    absentEvents: 2,
    weekFromTermStart: 9,
  },
  {
    week: 5,
    year: 2023,
    minDate: 1675036800000,
    totalEvents: 4,
    attendanceRatio: 2,
    presentEvents: 1,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: 10,
  },
  {
    week: 28,
    year: 2022,
    minDate: 1657756800000,
    totalEvents: 2,
    attendanceRatio: 1.5,
    presentEvents: 1,
    tardyEvents: 1,
    absentEvents: 0,
    weekFromTermStart: -19,
  },
  {
    week: 29,
    year: 2022,
    minDate: 1658102400000,
    totalEvents: 5,
    attendanceRatio: 2,
    presentEvents: 3,
    tardyEvents: 1,
    absentEvents: 1,
    weekFromTermStart: -18,
  },
  {
    week: 30,
    year: 2022,
    minDate: 1658707200000,
    totalEvents: 5,
    attendanceRatio: 4.5,
    presentEvents: 4,
    tardyEvents: 1,
    absentEvents: 0,
    weekFromTermStart: -17,
  },
  {
    week: 31,
    year: 2022,
    minDate: 1659312000000,
    totalEvents: 7,
    attendanceRatio: 4,
    presentEvents: 3,
    tardyEvents: 2,
    absentEvents: 2,
    weekFromTermStart: -16,
  },
  {
    week: 32,
    year: 2022,
    minDate: 1659916800000,
    totalEvents: 7,
    attendanceRatio: 5,
    presentEvents: 4,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: -15,
  },
  {
    week: 33,
    year: 2022,
    minDate: 1660521600000,
    totalEvents: 5,
    attendanceRatio: 2.5,
    presentEvents: 1,
    tardyEvents: 3,
    absentEvents: 1,
    weekFromTermStart: -14,
  },
  {
    week: 34,
    year: 2022,
    minDate: 1661212800000,
    totalEvents: 4,
    attendanceRatio: 3.5,
    presentEvents: 3,
    tardyEvents: 1,
    absentEvents: 0,
    weekFromTermStart: -13,
  },
  {
    week: 35,
    year: 2022,
    minDate: 1661731200000,
    totalEvents: 5,
    attendanceRatio: 3,
    presentEvents: 2,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: -12,
  },
  {
    week: 36,
    year: 2022,
    minDate: 1662336000000,
    totalEvents: 5,
    attendanceRatio: 3,
    presentEvents: 1,
    tardyEvents: 2,
    absentEvents: 2,
    weekFromTermStart: -11,
  },
  {
    week: 37,
    year: 2022,
    minDate: 1662940800000,
    totalEvents: 5,
    attendanceRatio: 4.5,
    presentEvents: 5,
    tardyEvents: 0,
    absentEvents: 0,
    weekFromTermStart: -10,
  },
  {
    week: 38,
    year: 2022,
    minDate: 1663545600000,
    totalEvents: 5,
    attendanceRatio: 3.5,
    presentEvents: 3,
    tardyEvents: 1,
    absentEvents: 1,
    weekFromTermStart: -9,
  },
  {
    week: 39,
    year: 2022,
    minDate: 1664150400000,
    totalEvents: 5,
    attendanceRatio: 3.5,
    presentEvents: 3,
    tardyEvents: 2,
    absentEvents: 0,
    weekFromTermStart: -8,
  },
  {
    week: 40,
    year: 2022,
    minDate: 1664755200000,
    totalEvents: 5,
    attendanceRatio: 3.5,
    presentEvents: 1,
    tardyEvents: 3,
    absentEvents: 1,
    weekFromTermStart: -7,
  },
  {
    week: 41,
    year: 2022,
    minDate: 1665360000000,
    totalEvents: 5,
    attendanceRatio: 2.5,
    presentEvents: 2,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: -6,
  },
  {
    week: 42,
    year: 2022,
    minDate: 1665964800000,
    totalEvents: 5,
    attendanceRatio: 3.5,
    presentEvents: 2,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: -5,
  },
  {
    week: 43,
    year: 2022,
    minDate: 1666569600000,
    totalEvents: 5,
    attendanceRatio: 3,
    presentEvents: 3,
    tardyEvents: 1,
    absentEvents: 1,
    weekFromTermStart: -4,
  },
  {
    week: 44,
    year: 2022,
    minDate: 1667174400000,
    totalEvents: 5,
    attendanceRatio: 4,
    presentEvents: 3,
    tardyEvents: 2,
    absentEvents: 0,
    weekFromTermStart: -3,
  },
  {
    week: 45,
    year: 2022,
    minDate: 1667779200000,
    totalEvents: 5,
    attendanceRatio: 5,
    presentEvents: 4,
    tardyEvents: 1,
    absentEvents: 0,
    weekFromTermStart: -2,
  },
  {
    week: 46,
    year: 2022,
    minDate: 1668384000000,
    totalEvents: 5,
    attendanceRatio: 3.5,
    presentEvents: 3,
    tardyEvents: 1,
    absentEvents: 1,
    weekFromTermStart: -1,
  },
  {
    week: 47,
    year: 2022,
    minDate: 1668988800000,
    totalEvents: 5,
    attendanceRatio: 4,
    presentEvents: 3,
    tardyEvents: 2,
    absentEvents: 0,
    weekFromTermStart: 0,
  },
  {
    week: 48,
    year: 2022,
    minDate: 1669593600000,
    totalEvents: 5,
    attendanceRatio: 2.5,
    presentEvents: 1,
    tardyEvents: 3,
    absentEvents: 1,
    weekFromTermStart: 1,
  },
  {
    week: 49,
    year: 2022,
    minDate: 1670198400000,
    totalEvents: 5,
    attendanceRatio: 3,
    presentEvents: 2,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: 2,
  },
  {
    week: 50,
    year: 2022,
    minDate: 1670803200000,
    totalEvents: 5,
    attendanceRatio: 3,
    presentEvents: 2,
    tardyEvents: 2,
    absentEvents: 1,
    weekFromTermStart: 3,
  },
  {
    week: 51,
    year: 2022,
    minDate: 1671408000000,
    totalEvents: 5,
    attendanceRatio: 3.5,
    presentEvents: 3,
    tardyEvents: 1,
    absentEvents: 1,
    weekFromTermStart: 4,
  },
  {
    week: 52,
    year: 2022,
    minDate: 1672012800000,
    totalEvents: 5,
    attendanceRatio: 4,
    presentEvents: 3,
    tardyEvents: 2,
    absentEvents: 0,
    weekFromTermStart: 5,
  },
]

export const attendanceDistribution = [
  {
    name: 'Satisfactory',
    value: 30,
    id: 1,
    color: '#73C578',
    textColor: '#2A7A2F',
  },
  {
    name: 'Extreme Chronic',
    value: 40,
    id: 2,
    color: '#FBBC04',
    textColor: '#9C7501',
  },
  {
    name: 'Moderate Chronic',
    value: 10,
    id: 3,
    color: '#FF6D01',
    textColor: '#9F4909',
  },
  { name: 'At-risk', value: 20, id: 4, color: '#EA4335', textColor: '#982B22' },
]

const {
  fetchAttendanceReportDetails,
  fetchAttendanceSummaryReport,
  fetchAttendanceDistributionReport,
} = reportsApi

const timeout_100ms = 100

export const useAttendanceDetailsFetch = ({
  filters,
  compareBy,
  sortOrder,
  sortKey,
  pageNo = 1,
  pageSize = 25,
}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true)
        const params = {
          ...filters,
          compareBy,
          [sortKey]: sortOrderMap[sortOrder],
          pageNo,
          pageSize,
        }
        fetchAttendanceReportDetails(params).then((response) => {
          setData(tableData)
          setLoading(false)
          response
        })
      } catch (e) {
        setError(e)
        setLoading(false)
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [filters, compareBy, pageNo, pageSize, sortKey, sortOrder])
  return [data, loading, error]
}

export const useAttendanceSummaryFetch = ({ filters }) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true)
        const params = {
          ...filters,
        }
        fetchAttendanceSummaryReport(params).then((response) => {
          setData(hardCodedData || {})
          setLoading(false)
          response
        })
      } catch (e) {
        setError(e)
        setLoading(false)
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [filters])

  return [data, loading, error]
}

export const useAttendanceDistributionFetch = ({ filters }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      const params = {
        ...filters,
      }
      fetchAttendanceDistributionReport(params)
        .then((response) => {
          setData(attendanceDistribution || [])
          setLoading(false)
          response
        })
        .catch((e) => {
          console.log(e, 'error')
          setError(e)
          setLoading(false)
        })
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [filters])

  return [data, loading, error]
}
