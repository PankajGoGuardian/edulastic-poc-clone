import { rgbToHex } from '@edulastic/common'

export const highlightTag = 'my-highlight'
const tableTagName = 'TD'
const relative = 'relative'

export const getPositionOfElement = (em) => {
  let deltaTop = 0
  let deltaLeft = 0
  if ($(em).parent().prop('tagName') === tableTagName) {
    $(em).css('position', relative)
  }

  $(em)
    .parents()
    .each((i, parent) => {
      if ($(parent).attr('id') === 'passage-wrapper') {
        return false
      }
      const p = $(parent).css('position')
      if (p === relative) {
        const offset = $(parent).position()
        deltaTop += offset.top
        deltaLeft += offset.left
      }
    })

  // top and left will be used to set position of color picker
  const top = em.offsetTop + deltaTop + em.offsetHeight - 70 // -70 is height of picker
  const left = $(em).width() / 2 + em.offsetLeft + deltaLeft - 106 // -106 is half of width of picker;

  const bg = rgbToHex($(em).css('backgroundColor'))
  return { top, left, bg }
}
