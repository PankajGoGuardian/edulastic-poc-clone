export const ACCOMMODATION_CONFIG = {
  ALLOW_ALL: 'ALLOW_ALL',
  ONLY_FOR_TEST: 'ONLY_FOR_TEST',
  NOT_ALLOWED: 'NOT_ALLOWED',
}
export const editTeachersAccommodationOptions = [
  {
    title: 'ALL TESTS',
    value: ACCOMMODATION_CONFIG.ALLOW_ALL,
  },
  {
    title: 'ONLY ON TEST THEY ASSIGN',
    value: ACCOMMODATION_CONFIG.ONLY_FOR_TEST,
  },
  {
    title: 'DO NOT ALLOW',
    value: ACCOMMODATION_CONFIG.NOT_ALLOWED,
    helperText:
      'District accommodation configuration will be used. If none have been set by the district, all accommodations will be OFF.',
  },
]

export const isEditAllowed = ({ testSettings, type = 'setting' }) => {
  if (type === 'manageClass') {
    return (
      ACCOMMODATION_CONFIG.ALLOW_ALL === testSettings?.editTeacherAccommodation
    )
  }

  return (
    ACCOMMODATION_CONFIG.NOT_ALLOWED !== testSettings?.editTeacherAccommodation
  )
}
