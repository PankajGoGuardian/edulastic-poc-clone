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

const { fetchAttendanceReportDetails } = reportsApi

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
