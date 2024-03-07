export const ACCOMMODATION_CONFIG = {
  ALLOW_ALL: 'ALLOW_ALL',
  ONLY_FOR_TEST: 'ONLY_FOR_TEST',
  NOT_ALLOWED: 'NOT_ALLOWED',
}
export const editTeachersAccommodationOptions = [
  {
    title: 'ALL TESTS (INCLUDES ADMINISTRATORS TESTS)',
    value: ACCOMMODATION_CONFIG.ALLOW_ALL,
    helperText:
      'Teacher can configure Text to speech, Speech to text and Immersive readers settings at student level.',
  },
  {
    title: 'ONLY ON TEST THEY ASSIGN',
    value: ACCOMMODATION_CONFIG.ONLY_FOR_TEST,
    helperText:
      'Teacher can configure Text to speech, Speech to text and Immersive readers only for their tests.',
  },
  {
    title: 'DO NOT ALLOW',
    value: ACCOMMODATION_CONFIG.NOT_ALLOWED,
    helperText:
      'District set configuration will be used. If district has not set, all setting will be OFF.',
  },
]

export const isEditAllowed = ({ testSettings, type = 'setting' }) => {
  if (type === 'manageClass') {
    return (
      ACCOMMODATION_CONFIG.ALLOW_ALL === testSettings.editTeacherAccommodation
    )
  }

  return (
    ACCOMMODATION_CONFIG.NOT_ALLOWED !== testSettings.editTeacherAccommodation
  )
}
