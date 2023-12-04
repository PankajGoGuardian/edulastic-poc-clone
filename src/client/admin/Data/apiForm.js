export const apiForms = [
  {
    id: 'configurereports',
    name: 'Configure Reports',
    endPoint: 'custom-report',
    method: 'post',
    fields: [
      {
        name: 'title',
        displayName: 'Report Name',
        placeholder: 'Enter Report Name',
        type: 'string',
        required: true,
      },
      {
        name: 'url',
        displayName: 'Tableau View Url',
        placeholder: 'Enter Tableau View Url',
        type: 'string',
        required: true,
      },
      {
        name: 'description',
        displayName: 'Report Description',
        placeholder: 'Enter Report Description',
        type: 'textarea',
        required: false,
      },
      {
        name: 'thumbnail',
        displayName: 'Report Thumbnail',
        placeholder: 'Enter Report Thumbnail',
        type: 'string',
        required: false,
      },
    ],
  },
  {
    id: 'custom-report-auth',
    name: 'Configure Report Authorization',
    endPoint: 'custom-report/user',
    method: 'post',
    fields: [
      {
        name: 'districtId',
        displayName: 'District',
        placeholder: 'Enter district id',
        type: 'string',
        required: true,
        validate: {
          endPoint: 'custom-report/user',
          method: 'get',
          paramsType: 'string',
          multiple: false,
          validateField: 'id',
          response: {
            lodashDepth: 'result',
            display: {
              type: 'json',
              title: 'Existing user of selected district ',
            },
          },
        },
      },
      {
        name: 'username',
        displayName: 'Username',
        placeholder: 'Enter tableau username',
        type: 'string',
        required: true,
      },
      {
        name: 'csManager',
        displayName: 'CS Manager',
        placeholder: 'Enter cs manager name',
        type: 'string',
        required: true,
      },
      {
        name: 'notes',
        displayName: 'Notes',
        placeholder: 'Enter notes',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'upgradeuser',
    name: 'Upgrade User',
    endPoint: 'subscription',
    method: 'post',
    fields: [
      {
        name: 'userIds',
        displayName: 'Users',
        placeholder: 'Enter comma separated Email IDs',
        type: 'textarea',
        required: true,
        validate: {
          endPoint: 'search/users/by-emails',
          multiple: true,
          validateField: 'emails',
          response: {
            lodashDepth: 'result.data',
            display: {
              type: 'table',
              title: 'List of valid Email-Ids',
              fields: [
                {
                  field: '_id',
                  name: 'Id',
                },
                {
                  field: 'subscription.subType',
                  name: 'Type',
                },
                {
                  field: '_source.email',
                  name: 'Email',
                },
                {
                  field: 'subscription.notes',
                  name: 'Notes',
                },
              ],
            },
          },
        },
      },
      {
        name: 'subStartDate',
        displayName: 'Subscription Start Date',
        placeholder: 'Enter start date',
        type: 'date',
        required: true,
      },
      {
        name: 'subEndDate',
        displayName: 'Subscription End Date',
        placeholder: 'Enter end date',
        type: 'date',
        required: true,
      },
      {
        name: 'notes',
        displayName: 'Notes',
        placeholder: 'Enter notes',
        type: 'textarea',
        required: true,
      },
      {
        name: 'subType',
        displayName: 'Subscription Type',
        placeholder: 'Enter type',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'delta-sync',
    name: 'Trigger Clever Sync',
    method: 'post',
    customSections: [
      {
        id: 'full-sync-for-class-section',
        name: 'Trigger full Sync for a Class Section',
        endPoint: 'clever/single-class-sync',
        method: 'post',
        fields: [
          {
            name: 'districtCleverId',
            displayName: 'District CleverId',
            placeholder: 'Enter District CleverId',
            type: 'string',
            required: true,
          },
          {
            name: 'groupCleverId',
            displayName: 'Clever ClassId',
            placeholder: 'Enter Clever ClassId',
            type: 'string',
            required: true,
          },
        ],
      },
      {
        id: 'clever-delta-sync-for-district',
        name: 'Trigger Clever Delta Sync for District',
        endPoint: 'clever/delta-sync-district',
        method: 'post',
        fields: [
          {
            name: 'cleverId',
            displayName: 'District CleverId',
            placeholder: 'Enter District CleverId',
            type: 'string',
            required: true,
          },
          {
            name: 'eventId',
            displayName: 'Clever EventId',
            placeholder: 'Enter Clever EventId',
            type: 'string',
            required: true,
          },
        ],
      },
      {
        id: 'clever-delta-sync',
        name: 'Trigger Clever Delta Sync for All',
        endPoint: 'clever/delta-sync',
        method: 'post',
        fields: [
          {
            name: 'caution',
            displayName: 'Caution',
            message:
              "Delta sync takes time to complete, so don't trigger it frequently.",
            placeholder: '',
            type: 'p',
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 'delta-sync-atlas',
    name: 'Trigger Edlink Delta Sync',
    endPoint: 'atlas/delta-sync',
    method: 'post',
    fields: [
      {
        name: 'caution',
        displayName: 'Caution',
        message:
          "Delta sync takes time to complete, so don't trigger it frequently.",
        placeholder: '',
        type: 'p',
        required: false,
      },
    ],
  },
  {
    id: 'power-tools',
    name: 'Enable Power Tools For Users',
    endPoint: 'user/power-teacher',
    method: 'post',
    note: {
      text: '**Power tools can be enabled for DA, SA and Teachers',
      parentField: 'usernames',
      position: 'bottom',
      style: {
        float: 'right',
      },
    },
    fields: [
      {
        name: 'usernames',
        displayName: 'Username/Email',
        placeholder: 'Enter teacher username or email in comma separated',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'enable',
        placeholder: 'Enable/Disable',
        type: 'radiogroup',
        values: ['enable', 'disable'],
        formatter: (value) => value === 'enable',
        required: true,
      },
    ],
  },
  {
    id: 'other1',
    name: 'Other 1',
    endPoint: 'other1',
    method: 'post',
    fields: [
      {
        name: 'field1',
        displayName: 'field1',
        placeholder: 'field1',
        type: 'date',
        required: true,
      },
      {
        name: 'field2',
        displayName: 'field2',
        placeholder: 'field2',
        type: 'checkbox',
        required: true,
      },
      {
        name: 'field3',
        placeholder: 'field3',
        type: 'radiogroup',
        values: ['option1', 'option2', 'option3', 'option4'],
        required: true,
      },
      {
        name: 'field4',
        displayName: 'field4',
        placeholder: 'field4',
        type: 'dropdown',
        required: true,
        values: ['option1', 'option2', 'option3', 'option4'],
      },
    ],
  },
  {
    id: 'invite-teacher',
    name: 'Invite Teachers',
    endPoint: '/bulk-invite-teachers',
    method: 'post',
    fields: [
      {
        name: 'districtId',
        displayName: 'District ID',
        placeholder: 'Enter districtId',
        type: 'string',
        required: true,
      },
      {
        key: 'email',
        name: 'userDetails',
        displayName: 'Teacher(s) Email Id',
        placeholder: 'Enter teacher username or email in comma separated',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
    ],
  },
  {
    id: 'create-admin',
    name: 'Create Admin for District/School',
    fields: [
      {
        name: 'districtId',
        displayName: 'District ID',
        placeholder: 'Enter districtId',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'archive-unarchive-classes',
    name: 'Archive / Unarchive Classes',
    fields: [
      {
        name: 'groupIds',
        displayName: 'Classes',
        placeholder: 'Enter comma separated Class Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        key: 'archive',
        name: 'archive',
        placeholder: 'Archive/Unarchive',
        type: 'radiogroup',
        values: ['Archive', 'Unarchive'],
        formatter: (value) => value === 'Archive',
        defaultValue: 'Archive',
        required: true,
      },
    ],
  },
  {
    id: 'connect-disconnect-user',
    name: 'Connect / Disconnect Users',
    endPoint: '/user/connect-disconnect-user',
    method: 'post',
    fields: [
      {
        name: 'userIds',
        displayName: 'User Ids',
        placeholder: 'Enter comma separated User Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        key: 'connect',
        name: 'connect',
        placeholder: 'Connect/Disconnect',
        type: 'radiogroup',
        values: ['Connect', 'Disconnect'],
        formatter: (value) => value === 'Connect',
        defaultValue: 'Connect',
        required: true,
      },
    ],
  },
  {
    id: 'enable-feed-types',
    name: 'Enable Feed Type',
    fields: [],
  },
  {
    id: 'merge-teacher',
    name: 'Merge Teacher',
    endPoint: 'admin-tool/merge-teacher',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'teacherIdsSource',
        displayName: 'Teacher Id(s)',
        placeholder: 'Enter comma separated teacher Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'teacherIdsDestination',
        displayName: 'Teacher Id Destination',
        placeholder: 'Enter Teacher Id Destination',
        type: 'string',
        required: true,
      },
      {
        name: 'districtId',
        displayName: 'District Id',
        placeholder: 'Enter District Id',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'move-teacher',
    name: 'Move Teacher',
    endPoint: 'admin-tool/move-teacher',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'teacherIds',
        displayName: 'Teacher Id(s)',
        placeholder: 'Enter comma separated Teacher Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'srcSchoolId',
        displayName: 'Source School Id',
        placeholder: 'Enter Source School Id',
        type: 'string',
        required: true,
      },
      {
        name: 'desSchoolId',
        displayName: 'Destination School Id',
        placeholder: 'Enter Destination School Id',
        type: 'string',
        required: true,
      },
      {
        name: 'srcDistrictId',
        displayName: 'Source District Id',
        placeholder: 'Enter Source District Id',
        type: 'string',
        required: true,
      },
      {
        name: 'desDistrictId',
        displayName: 'Destination District Id',
        placeholder: 'Enter Destination District Id',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'activate-deactivate-user',
    name: 'Activate/Deactivate User',
    endPoint: 'user/user-details',
    method: 'post',
    fields: [
      {
        key: 'activate',
        name: 'activate',
        placeholder: 'Activate/Deactivate',
        type: 'radiogroup',
        values: ['Activate', 'Deactivate'],
        defaultValue: 'Deactivate',
        formatter: (value) => value === 'Activate',
      },
      {
        key: 'username',
        name: 'username',
        displayName: 'Username',
        placeholder: 'Enter Username',
        type: 'string',
      },
      {
        key: 'Or',
        displayName: 'Or',
        labelStyle: {
          'text-align': 'center',
          'font-weight': 'bold',
          'font-size': '16px',
          'padding-top': '15px',
        },
      },
      {
        key: 'userId',
        name: 'userId',
        displayName: 'User Id',
        placeholder: 'Enter User Id',
        dataCy: 'enterUserId',
        type: 'string',
      },
    ],
  },
  {
    id: 'update-user',
    name: 'Update User',
    endPoint: 'user/user-details',
    method: 'post',
    note: {
      text: 'Note: Updating the username will reflect same in email',
      parentField: 'userId',
      position: 'bottom',
      style: {
        width: '100%',
        padding: '5px 0px',
        display: 'inline-block',
      },
    },
    fields: [
      {
        key: 'username',
        name: 'username',
        displayName: 'Username',
        placeholder: 'Enter Username',
        type: 'string',
      },
      {
        key: 'Or',
        displayName: 'Or',
        labelStyle: {
          'text-align': 'center',
          'font-weight': 'bold',
          'font-size': '16px',
          'padding-top': '15px',
        },
      },
      {
        key: 'userId',
        name: 'userId',
        displayName: 'User Id',
        placeholder: 'Enter User Id',
        dataCy: 'enterUserId',
        type: 'string',
      },
    ],
  },
  {
    id: 'reset-password-attempt',
    name: 'Reset Password Attempt',
    endPoint: 'admin-tool/reset-pass-attempts',
    method: 'post',
    fields: [
      {
        key: 'userId',
        name: 'userId',
        displayName: 'User Id',
        placeholder: 'Enter User Id',
        dataCy: 'enterUserId',
        type: 'string',
        formatter: (value) => value.trim(),
        required: true,
      },
    ],
  },
  {
    id: 'approve-school-district',
    name: 'Approve School/District',
    endPoint: 'school/district-School-Details',
    method: 'post',
    fields: [
      {
        key: 'type',
        name: 'type',
        placeholder: 'Type',
        type: 'radiogroup',
        displayName: 'Enter ID for',
        values: ['District', 'School'],
        defaultValue: 'School',
        formatter: (value) => (value === 'School' ? 'school' : 'district'),
      },
      {
        key: 'id',
        name: 'id',
        displayName: 'ID',
        placeholder: 'Enter District/School ID',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'tts',
    name: 'Text to speech',
    endPoint: 'test/tts',
    method: 'post',
    fields: [
      {
        key: 'testId',
        name: 'testId',
        placeholder: 'Test id',
        type: 'string',
        displayName: 'Enter test ID',
        required: true,
      },
      {
        displayName: 'Use LLM (AI)',
        name: 'useLLM',
        type: 'checkbox',
        required: false,
      },
      {
        displayName: 'Use TTS Text',
        name: 'useTTSText',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    id: 'manageClass',
    name: 'Manage Teacher in Class',
    endPoint: '',
    method: '',
    fields: [
      {
        key: 'classId',
        name: 'classId',
        placeholder: 'Class id',
        type: 'string',
        displayName: 'Enter Class ID',
        required: true,
      },
    ],
  },
  {
    id: 'restore-assignment',
    name: 'Restore Assignment',
    endPoint: 'admin-tool/restore-assignment',
    method: 'post',
    slowApi: true,
    fields: [
      {
        key: 'assignmentId',
        name: 'assignmentId',
        placeholder: 'Assignment Id',
        type: 'string',
        displayName: 'Enter Assignment ID',
        required: true,
      },
      {
        name: 'groupIds',
        displayName: 'Enter Class ID(s)',
        placeholder: 'Enter comma separated Class Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
    ],
  },
  {
    id: 'verify-email',
    name: 'Verify Email',
    endPoint: 'user/verify',
    method: 'post',
    slowApi: false,
    fields: [
      {
        key: 'userId',
        name: 'uid',
        placeholder: 'Enter User Id',
        dataCy: 'enterUserId',
        type: 'string',
        displayName: 'User ID',
        required: true,
      },
    ],
  },
  {
    id: 'move-assessment',
    name: 'Move Assessment',
    endPoint: 'admin-tool/move-assessment',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'teacherIdsSource',
        displayName: 'Source User Id(s)',
        placeholder: 'Enter comma separated Teacher Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'teacherIdsDestination',
        displayName: 'Destination User Id(s)',
        placeholder: 'Enter comma separated Teacher Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'srcSchoolId',
        displayName: 'Source School Id(s)',
        placeholder: 'Enter Source School Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: false,
      },
      {
        name: 'desSchoolId',
        displayName: 'Destination School Id(s)',
        placeholder: 'Enter Destination School Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: false,
      },
      {
        name: 'srcDistrictId',
        displayName: 'Source District Id(s)',
        placeholder: 'Enter Source District Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'desDistrictId',
        displayName: 'Destination District Id(s)',
        placeholder: 'Enter Destination District Ids',
        type: 'textarea',
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
        required: true,
      },
      {
        name: 'testId',
        displayName:
          'Test Id(s) (If test id is not passed it will move all the source user tests to destination user)',
        placeholder: 'Enter Test Ids',
        type: 'textarea',
        required: false,
        formatter: (value) =>
          value
            .split(',')
            ?.map((v) => v.trim())
            .toString(),
      },
    ],
  },
  {
    id: 'restore-student-count-in-groups',
    name: 'Student Count Update',
    endPoint: 'admin-tool/restore-student-count-in-groups',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'districtId',
        displayName: 'DistrictId',
        placeholder: 'Enter the districtId',
        type: 'string',
        required: true,
      },
      {
        name: 'groupIds',
        displayName: 'Group Id(s)',
        placeholder: 'Enter comma separated group Ids',
        type: 'textarea',
        required: false,
        formatter: (value) =>
          value
            .split(',')
            ?.map((v) => v.trim())
            .toString(),
      },
    ],
  },
  {
    id: 'evict-keys',
    name: 'Evict Keys',
    endPoint: 'admin-tool/evict-keys',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'cacheKeyName',
        displayName: 'cacheKeyName',
        type: 'dropdown',
        placeholder: 'select cache key',
        values: [
          'TEST',
          'TEST_ITEM',
          'STANDARDS',
          'ITEMBANK',
          'PLAYLIST_USAGES',
          'TEST_USAGES',
          'TESTITEM_USAGES',
          'TEST_LIKES',
          'TESTITEM_LIKES',
          'PLAYLIST_USAGES_SORTED_SET',
          'TESTITEM_USAGES_SORTED_SET',
          'TEST_USAGES_SORTED_SET',
          'TEST_LIKES_SORTED_SET',
          'TESTITEM_LIKES_SORTED_SET',
          'MONITOR_CHANGE_STREAM',
          'INTERESTED_STANDARDS',
          'MULTI_STANDARD_MAPPING',
          'USER_DETAILS_',
          'AUTHOR_TILE_VERSION',
          'SUBSCRIPTION_MAP',
        ],
        required: true,
      },
      {
        name: 'ids',
        displayName: 'Id(s)',
        placeholder: 'Enter comma separated Ids to be evicted',
        type: 'textarea',
        required: true,
        formatter: (value) =>
          value
            .split(',')
            ?.map((v) => v.trim())
            .toString(),
      },
    ],
  },
  {
    id: 'upload-standard',
    name: 'Upload standards',
    endPoint: 'admin-tool/standards-xls',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'subject',
        displayName: 'Subject',
        placeholder: 'Select Subject',
        type: 'dropdown',
        required: true,
        values: [
          'Mathematics',
          'ELA',
          'Social Studies',
          'Computer Science',
          'Other Subjects',
          'Science',
        ],
      },
      {
        name: 'path',
        type: 'upload',
        accept: '.xlsx',
        multiple: false,
        required: true,
      },
    ],
  },
  {
    id: 'assessment',
    name: 'Assessment Restore',
    endPoint: 'admin-tool/assessment',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'assessmentIds',
        displayName: 'Assessment Id(s)',
        placeholder: 'Enter comma separated assessment Ids',
        type: 'textarea',
        required: true,
        formatter: (value) => value.split(',')?.map((v) => v.trim()),
      },
    ],
  },
  {
    id: 'merge-school',
    name: 'School Merge',
    endPoint: 'admin-tool/merge-school',
    method: 'post',
    slowApi: true,
    note: {
      text:
        'Note: select this checkbox only if all the schools from the district getting merged.',
      parentField: 'deleteDistrict',
      position: 'bottom',
      style: {
        width: '100%',
        padding: '5px 0px',
        display: 'inline-block',
      },
    },
    fields: [
      {
        name: 'srcSchoolIds',
        displayName: 'Source School Id(s)',
        placeholder: 'Enter Source School Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
      {
        name: 'desSchoolIds',
        displayName: 'Destination School Id(s)',
        placeholder: 'Enter Destination School Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
      {
        name: 'deleteDistrict',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    id: 'unsync-teachers',
    name: 'Unsync Teacher',
    endPoint: 'admin-tool/unsync-teachers',
    method: 'post',
    slowApi: true,
    note: {
      text:
        'Note: select this checkbox if clever students must be unsynced and removed.',
      parentField: 'ssoType',
      position: 'bottom',
      style: {
        width: '100%',
        padding: '5px 0px',
        display: 'inline-block',
      },
    },
    fields: [
      {
        name: 'teacherIds',
        displayName: 'Teacher Id(s)',
        placeholder: 'Enter Teacher Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
      {
        name: 'ssoType',
        displayName: 'SsoType',
        placeholder: 'Select SSO',
        type: 'dropdown',
        required: true,
        values: [
          'atlas',
          'canvas',
          'clever',
          'cli',
          'google',
          'mso',
          'newsela',
        ],
      },
      {
        name: 'cleverStudentRemoval',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    id: 'merge-student',
    name: 'Student Merge',
    endPoint: 'admin-tool/merge-student',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'studentIdsSource',
        displayName: 'Source Student Id',
        placeholder: 'Enter Source Student Id',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
      {
        name: 'studentIdsDestination',
        displayName: 'Destination Student Id',
        placeholder: 'Enter Destination Student Id',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
    ],
  },
  {
    id: 'link-collection',
    name: 'Link Collection',
    endPoint: 'admin-tool/link-collection',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'contentType',
        displayName: 'contentType',
        placeholder: 'Select content type',
        type: 'dropdown',
        required: true,
        values: ['TESTITEM', 'TEST', 'PLAYLIST'],
      },
      {
        name: 'contentIds',
        displayName: 'Content Id(s)',
        placeholder: 'Enter Content Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
      {
        name: 'collectionId',
        displayName: 'Collection Id',
        placeholder: 'Enter Collection Id',
        type: 'string',
        required: true,
      },
      {
        name: 'bucketIds',
        displayName: 'Bucket Id(s)',
        placeholder: 'Enter Bucket Ids',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
    ],
  },
  {
    id: 're-evaluation',
    name: 'Re-Evaluate by Test Id',
    endPoint: 'admin-tool/reevaluate',
    method: 'post',
    fields: [
      {
        key: 'testId',
        name: 'testId',
        placeholder: 'Enter Test Id',
        type: 'string',
        displayName: 'Test Id',
        required: true,
      },
      {
        key: 'assignmentId',
        name: 'assignmentId',
        placeholder: 'Enter Assignment Id',
        type: 'string',
        displayName: 'Assignment Id',
      },
      {
        key: 'districtId',
        name: 'districtId',
        placeholder: 'Enter District Id',
        type: 'string',
        displayName: 'District Id',
        required: true,
      },
      {
        key: 'testItemId',
        name: 'testItemId',
        placeholder: 'Enter Test Item Id',
        type: 'string',
        displayName: 'Test Item Id',
        required: true,
      },
    ],
  },
  {
    id: 'refresh-data-studio-materialized-view',
    name: 'Refresh Data Studio Materialized View',
    endPoint: '/admin-tool/refresh-ds-materialized-view',
    method: 'post',
    fields: [],
  },
  {
    id: 'moveTTSFromOneTestToAnother',
    name: 'Move TTS From One Test To Another',
    endPoint: 'admin-tool/copy-tts-from-test',
    method: 'post',
    fields: [
      {
        name: 'sourceTestId',
        displayName: 'Source Test Id',
        placeholder: 'Enter Source Test Id',
        type: 'string',
        required: true,
      },
      {
        name: 'targetTestId',
        displayName: 'Target Test Id',
        placeholder: 'Enter Target Test Id',
        type: 'string',
        required: true,
      },
      {
        name: 'mappedQids',
        displayName: 'Mapped Qids JSON',
        placeholder: 'Paste Mapped Qids JSON',
        type: 'textarea',
        required: false,
      },
    ],
  },
  {
    id: 'assignment-response-copy',
    name: 'Assignment Response Copy',
    endPoint: 'admin-tool/assignment-response-copy',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'srcAssignmentId',
        displayName: 'Source Assignment Id',
        placeholder: 'Enter Source Assignment Id',
        type: 'string',
        required: true,
      },
      {
        name: 'srcGroupId',
        displayName: 'Source Group Id',
        placeholder: 'Enter Source Group Id',
        type: 'string',
        required: true,
      },
      {
        name: 'desAssignmentId',
        displayName: 'Destination Assignment Id',
        placeholder: 'Enter Destination Assignment Id',
        type: 'string',
        required: true,
      },
      {
        name: 'desGroupId',
        displayName: 'Destination Group Id',
        placeholder: 'Enter Destination Group Id',
        type: 'string',
        required: true,
      },
      {
        name: 'studentId',
        displayName: 'Enter the student Id',
        placeholder: 'Enter the student Id',
        type: 'string',
        required: false,
      },
    ],
  },
  {
    id: 'add-content-co-authors',
    name: 'Add content co-authors',
    endPoint: 'admin-tool/add-content-co-authors',
    method: 'post',
    slowApi: true,
    fields: [
      {
        name: 'collectionId',
        displayName: 'Collection Id',
        placeholder: 'Enter Collection Id',
        type: 'string',
        required: true,
      },
      {
        name: 'userIds',
        displayName: 'User Ids',
        placeholder: 'Enter userIds to be added as co-authors',
        type: 'textarea',
        formatter: (value) => value.split(',').map((v) => v.trim()),
        required: true,
      },
    ],
  },
]
