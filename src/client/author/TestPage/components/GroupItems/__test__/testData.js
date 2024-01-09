import { PEAR_ASSESSMENT_CERTIFIED_NAME } from '@edulastic/constants/const/common'

export const newGroup = {
  deliveryType: 'ALL_RANDOM',
  difficulty: '',
  groupName: 'SECTION 1',
  index: 0,
  items: [],
  type: 'AUTOSELECT',
  _id: 'pQLuD1r8p3xRdv41GJmVG',
}

export const GroupWithCollection = {
  deliverItemsCount: 2,
  collectionDetails: {
    name: PEAR_ASSESSMENT_CERTIFIED_NAME,
    type: 'free',
    _id: '6564756c61737469635f6365',
  },
  standardDetails: {
    grades: ['2'],
    standards: [
      {
        curriculumId: 216,
        domainId: 41375,
        identifier: 'MGSE2.OA.2',
        standardId: 41476,
      },
      {
        curriculumId: 216,
        domainId: 41375,
        identifier: 'MGSE2.OA.3',
        standardId: 41477,
      },
    ],
    subject: 'Mathematics',
  },
  deliveryType: 'ALL_RANDOM',
  difficulty: '',
  groupName: 'SECTION 1',
  index: 0,
  items: [],
  type: 'AUTOSELECT',
  _id: 'pQLuD1r8p3xRdv41GJmVG',
}

export const entity = {
  title: 'TEST',
  itemGroups: [newGroup],
}

export const iconInfoTooltip =
  'Within each section, select specific instructions for what you want included. You can have one section or create multiple sections.'
