export const getDataSource = (groupList, goalList, interventionList) => {
  const finalList = [...(groupList || [])]

  finalList.forEach((group) => {
    const { _id } = group
    const goals = goalList
      .filter(({ studentGroupIds }) => studentGroupIds?.includes(_id))
      .map(({ name }) => name)
      .join(', ')

    const interventions = interventionList
      .filter(({ studentGroupIds }) => studentGroupIds?.includes(_id))
      .map(({ name }) => name)
      .join(', ')

    if (goals) {
      group.goals = goals
    }

    if (interventions) {
      group.interventions = interventions
    }
  })

  return finalList
}
