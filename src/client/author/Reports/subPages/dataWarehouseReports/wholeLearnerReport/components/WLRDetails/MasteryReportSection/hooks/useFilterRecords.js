import { useMemo } from 'react'

const useFilterRecords = (records, domain, grade, subject, curriculumId) =>
  // Note: record.domainId could be integer or string
  useMemo(
    () =>
      records?.filter(
        (record) =>
          (domain === 'All' || String(record.domainId) === String(domain)) &&
          (grade === 'All' || record.grades.includes(grade)) &&
          (subject === 'All' || record.subject === subject) &&
          (curriculumId === 'All' || `${record.curriculumId}` === curriculumId)
      ),
    [records, domain, grade, subject, curriculumId]
  )

export default useFilterRecords
