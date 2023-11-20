import { useMemo } from 'react'

const useFilterRecords = (
  records,
  domain,
  grade,
  subject,
  curriculumId,
  checkedDomains
) =>
  // Note: record.domainId could be integer or string
  useMemo(
    () =>
      records?.filter(
        (record) =>
          domain === 'All' ||
          String(record.domainId) === String(domain) ||
          (checkedDomains.includes(String(record.domainId)) &&
            (grade === 'All' || record.grades.includes(grade)) &&
            (subject === 'All' || record.subject === subject) &&
            (curriculumId === 'All' ||
              `${record.curriculumId}` === curriculumId))
      ),
    [records, domain, checkedDomains, grade, subject, curriculumId]
  )

export default useFilterRecords
