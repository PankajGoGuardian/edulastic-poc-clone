import { get } from 'lodash'

// Doc based test
export const isSubmitButton = (ev) => {
  if (ev) {
    return [
      get(ev, 'relatedTarget.id', ''),
      get(ev, 'relatedTarget.parentElement.id', ''),
    ].includes('submitTestButton')
  }
  return false
}
