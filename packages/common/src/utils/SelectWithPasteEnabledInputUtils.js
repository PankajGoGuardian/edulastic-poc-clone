export const getInputIdList = (input = '') => {
  const commaSeparatedRegex = /^[\da-fA-F]{24}((,|, )[\da-fA-F]{24})*$/
  const spaceSeparatedRegex = /^[\da-fA-F]{24}( [\da-fA-F]{24})*$/
  const tabSeparatedRegex = /^[\da-fA-F]{24}((\t)[\da-fA-F]{24})*$/
  const isCommaSeparatedIds = commaSeparatedRegex.test(input)
  let idList = []
  if (isCommaSeparatedIds) {
    idList = input?.split(',') || []
  }
  const isSpaceSeparatedIds = spaceSeparatedRegex.test(input)
  if (isSpaceSeparatedIds) {
    idList = input?.split(' ') || []
  }
  const isTabSeparatedIds = tabSeparatedRegex.test(input)
  if (isTabSeparatedIds) {
    idList = input?.split('\t') || []
  }
  if (Array.isArray(idList)) {
    return idList.map((id) => id?.trim() || '')
  }
  return idList
}
