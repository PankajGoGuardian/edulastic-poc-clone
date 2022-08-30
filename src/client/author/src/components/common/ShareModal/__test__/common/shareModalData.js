export const shareTypeKeys = [
  'Everyone',
  'District',
  'School',
  'Individuals',
  'Link Sharing',
]

export const permissions = {
  EDIT: `All Actions (edit, duplicate, assign)`,
  VIEW: 'Limited Actions (duplicate, assign)',
  ASSIGN: 'Only View and Assign',
}

export const props = {
  isVisible: true,
  isPublished: true,
  testVersionId: '123456789',
  onClose: () => {},
}

export const storeData = {
  tests: {},
  authorUserList: {
    usersList: [],
  },
  user: {
    user: {
      orgData: {},
      features: {
        editPermissionOnTestSharing: true,
      },
    },
  },
}

export const schoolOptionsStoreData = {
  tests: {},
  authorUserList: {
    usersList: [],
  },
  user: {
    user: {
      districtIds: ['610cbe1dede76a0009baf8ef'],
      orgData: {
        districts: [
          {
            districtId: '610cbe1dede76a0009baf8ef',
            districtName: 'Unit-Test',
          },
        ],
        schools: [
          {
            _id: '610cbe1dede76a0009baf8f6',
            name: 'Unit Testing Academy',
            districtId: '610cbe1dede76a0009baf8ef',
          },
        ],
      },
      features: {
        editPermissionOnTestSharing: true,
      },
    },
  },
}

export const districtOptionsStoreData = {
  tests: {},
  authorUserList: {
    usersList: [],
  },
  user: {
    user: {
      districtIds: ['610cbe1dede76a0009baf8ef'],
      orgData: {
        districts: [
          {
            districtId: '610cbe1dede76a0009baf8ef',
            districtName: 'Unit-Test',
          },
        ],
      },
      features: {
        editPermissionOnTestSharing: true,
      },
    },
  },
}

export const coAuthorsStoreData = {
  tests: {
    sendEmailNotification: true,
    sharedUsersList: [
      {
        permission: 'EDIT',
        sharedWith: [
          {
            _id: '61de324ff9402',
            name: 'Dummy User',
            email: 'dummy.user@unit.testing',
          },
        ],
        sharedType: 'INDIVIDUAL',
        sharedId: '638763fa3ce62b9231',
      },
    ],
  },
  authorUserList: {
    usersList: [],
  },
  user: {
    user: {
      districtIds: ['610cbe1dede76a0009baf8ef'],
      orgData: {
        districts: [
          {
            districtId: '610cbe1dede76a0009baf8ef',
            districtName: 'Unit-Test',
          },
        ],
        schools: [
          {
            _id: '610cbe1dede76a0009baf8f6',
            stopSync: false,
            name: 'Unit Testing Academy',
            districtId: '610cbe1dede76a0009baf8ef',
          },
        ],
      },
      features: {
        editPermissionOnTestSharing: true,
      },
    },
  },
}

export const daStoreData = {
  tests: {},
  authorUserList: {
    usersList: [],
  },
  user: {
    user: {
      role: 'district-admin',
      districtIds: ['610cbe1dede76a0009baf8ef'],
      orgData: {
        districts: [
          {
            districtId: '610cbe1dede76a0009baf8ef',
            districtName: 'Unit-Test',
          },
        ],
        schools: [
          {
            _id: '610cbe1dede76a0009baf8f6',
            stopSync: false,
            name: 'Unit Testing Academy',
            districtId: '610cbe1dede76a0009baf8ef',
          },
        ],
      },
      features: {
        editPermissionOnTestSharing: true,
      },
    },
  },
}

export const sharedWithDistrict = {
  sharedUsersList: [
    {
      permission: 'ASSIGN',
      sharedWith: [
        {
          _id: '610cbe1dede76a0009baf8ef',
          name: 'DHY-Test',
        },
      ],
      sharedType: 'DISTRICT',
      sharedId: '62988cb4fb2326e7b1018a',
    },
  ],
}

export const sharedWithSchool = {
  sharedUsersList: [
    {
      permission: 'VIEW',
      sharedWith: [
        {
          _id: '610cbe1dede76a0009baf8f6',
          name: 'Unit testing School',
        },
      ],
      sharedType: 'SCHOOL',
      sharedId: '62989655a16ddd0009b101ca',
    },
  ],
}

export const sharedWithEveryone = {
  sharedUsersList: [
    {
      permission: 'VIEW',
      sharedWith: [],
      sharedType: 'PUBLIC',
      sharedId: '6298b76cb0b2d9000977d3ae',
    },
  ],
}
