import { get, isEmpty, groupBy } from 'lodash'

/**
 * Function to get filtered standards data
 * @param {Object} skillInfo - skill info api response containing standards info
 * @param {Object} filters - contains popup / page level filter details
 * @returns {Object[]} skillInfoMetrics
 */
export const getSkillInfoMetrics = (skillInfo, filters) => {
  let skillInfoMetrics = get(skillInfo, 'data.result.skillInfo', [])
    .filter((o) => `${o.curriculumId}` === `${filters.curriculumId}`)
    .filter((o) =>
      filters.standardGrade && filters.standardGrade !== 'All'
        ? o.grades.includes(filters.standardGrade)
        : true
    )

  let _domainIds = !isEmpty(filters.domainIds) ? filters.domainIds : ''
  _domainIds = Array.isArray(_domainIds) ? _domainIds.join(',') : _domainIds

  const groupedByDomainIds = groupBy(skillInfoMetrics, (o) => `${o.domainId}`)
  const allDomainIds = Object.keys(groupedByDomainIds).sort(
    (a, b) => Number(a) - Number(b)
  )
  const domainsList = allDomainIds.map((domainId) => ({
    key: `${domainId}`,
    title: groupedByDomainIds[domainId][0].domain,
  }))
  const selectedDomains = (domainsList || []).filter((o) =>
    _domainIds.includes(o.key)
  )
  const selectedDomainIds = selectedDomains.map((o) => o.key)

  skillInfoMetrics = skillInfoMetrics.filter(
    (o) =>
      isEmpty(selectedDomainIds) || selectedDomainIds.includes(`${o.domainId}`)
  )

  // sorting required as filters show standard sorted in the following fashion
  // ref. https://github.com/snapwiz/edulastic-poc/blob/edulasticv2-e35.0.0/src/client/author/Reports/subPages/standardsMasteryReport/common/components/Filters.js#L181
  const sortedSkillInfoMetrics = skillInfoMetrics.sort(
    (a, b) => a.domainId - b.domainId || a.standardId - b.standardId
  )
  return {
    allDomainIds,
    domainsList,
    selectedDomains,
    selectedDomainIds,
    skillInfoMetrics: sortedSkillInfoMetrics,
  }
}

/**
 * Function to get selected standard id / first standard in skillinfo for initial load for the standards progress report.
 * @param {Object} skillInfoMetrics - contains standards info.
 * @param {Object} filters - contains popup / page level filter details.
 * @returns {string} standard id
 */
export const getSelectedStandardId = (skillInfoMetrics, filters) => {
  const standard =
    skillInfoMetrics.find(
      (o) => `${o.standardId}` === `${filters.standardId}`
    ) || skillInfoMetrics[0]
  return get(standard, 'standardId', '')
}
