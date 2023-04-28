export const formatName = (name) => {
  const namesList = name.split('_')
  const correctedList = namesList.map(
    (w) => w.charAt(0).toUpperCase() + w.slice(1)
  )
  return correctedList.join(' ')
}
