import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import ModuleRow from '../components/CurriculumModuleRow'

jest.mock(
  '../../../../client/assessment/containers/QuestionAuditTrailLogs/index'
)

const mockStore = configureMockStore()

const curriculum = {
  active: 1,
  alignmentInfo: '',
  analytics: [],
  authors: [],
  bgColor: '#1AB394',
  clonedCollections: [],
  collections: [],
  createdBy: { _id: 'id', name: 'name' },
  createdDate: 1652698029919,
  customize: false,
  derivedFrom: { _id: 'id', name: 'name' },
  description: '',
  grades: ['2'],
  isAuthor: true,
  modules: [],
  originalAuthor: { _id: 'id', name: 'name' },
  skin: 'PUBLISHER',
  status: 'draft',
  subjects: ['ELA'],
  textColor: '#fff',
  thumbnail:
    'https://cdn.edulastic.com/images/assessmentThumbnails/ela/15891-9.gif',
  title: 'title',
  type: 'content',
  updatedDate: 1652780505905,
  usedCount: 0,
  version: 10,
  versionId: 'vid',
  _id: 'id',
}

const props = {
  isPreviewModalVisible: false,
  customizeInDraft: false,
  isPlaylistDetailsPage: false,
  isSparkMathPlaylist: false,
  userRole: 'teacher',
  isManageContentActive: false,
  showRightPanel: true,
  isDesktop: true,
  hasEditAccess: true,
  isStudent: false,
  moduleStatus: false,
  status: 'draft',
  padding: false,
  collapsed: true,
  module: {
    data: [
      {
        assignments: [],
        contentId: 'contentId',
        contentTitle: 'content title',
        contentType: 'test',
        contentVersionId: 'content version ID',
        hidden: false,
        standardIdentifiers: ['6.RP.A.1', '6.RP.A.3.a', '6.RP.A.3.b'],
        standards: [{}, {}, {}],
        status: 'published',
        testType: 'assessment',
      },
    ],
    description: '<p>description</p>',
    hidden: false,
    moduleGroupName: 'module group name',
    moduleId: 'id',
    title: 'title',
    _id: '62822c7a0d80dd00094776ee',
  },
  curriculum,
  summaryData: [
    {
      classes: '-',
      hidden: false,
      index: 0,
      maxScore: NaN,
      name: 'Module 1',
      scores: NaN,
      submitted: '-',
      tSpent: 0,
      timeSpent: '0 min',
      title: '3',
      value: NaN,
    },
  ],
}

describe('Playlist Tab', () => {
  test('test visibility of playlist tests section rendered from ModuleRow component  ', async () => {
    const store = mockStore({
      user: { user: {} },
      curriculumSequence: {
        checkedUnitItems: [],
        currentAssignmentIds: ['id'],
      },
      test: {
        isTestPreviewModalVisible: false,
      },
    })

    render(
      <Provider store={store}>
        <Router>
          <ModuleRow {...props} />
        </Router>
      </Provider>
    )
  })
})
