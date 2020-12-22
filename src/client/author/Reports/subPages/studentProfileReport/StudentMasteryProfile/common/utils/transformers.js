export const getDomainOptions = (domains, grade, subject) => {
  return [
    { key: 'All', title: 'All' },
    ...domains
      .filter(
        (domain) =>
          (grade === 'All' || domain.grades.includes(grade)) &&
          (subject === 'All' || domain.subject === subject)
      )
      .map((domain) => ({
        key: domain.domainId,
        title: domain.name,
      })),
  ]
}
