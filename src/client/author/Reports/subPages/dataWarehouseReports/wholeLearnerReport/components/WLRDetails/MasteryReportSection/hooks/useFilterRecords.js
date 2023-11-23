import { useMemo } from 'react'

const useFilterRecords = (
  records,
  domain,
  grade,
  subject,
  curriculumId,
  checkedDomains
) => {
  /**
   * NOTE: domainId, curriculumId is integer for standard records and string for domain records
   */
  const filteredRecords = useMemo(() => {
    const _filteredRecords = records?.filter((record) => {
      const flags = [
        // flag to filter records by grade
        grade === 'All' || record.grades.includes(grade),
        // flag to filter records by subject
        subject === 'All' || record.subject === subject,
        // flag to filter records by standard set (curriculum)
        curriculumId === 'All' ||
          String(record.curriculumId) === String(curriculumId),
        // flag to filter by union of selected and checked domains
        domain === 'All' ||
          String(record.domainId) === String(domain) ||
          checkedDomains.includes(String(record.domainId)),
      ]
      return flags.every((f) => f)
    })
    return _filteredRecords
  }, [records, domain, checkedDomains, grade, subject, curriculumId])

  return filteredRecords
}

export default useFilterRecords
