import '@testing-library/jest-dom'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ModuleRow from '../components/CurriculumModuleRow'
import configureStore from '../../../configureStore'

jest.mock('../components/PlaylistTestDetailsModal/index', () => () => (
  <div data-testid="PlaylistTestDetailsModal" />
))
jest.mock(
  '../../../../client/assessment/containers/QuestionAuditTrailLogs/index'
)
jest.mock('../../../../client/author/CurriculumSequence/util')

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
  urlHasUseThis: true,
  hasEditAccess: true,
  isStudent: false,
  moduleStatus: false,
  status: 'published',
  padding: false,
  collapsed: false,
  module: {
    data: [
      {
        assignments: [{ testId: 'id', class: [] }],
        contentId: 'contentId',
        contentTitle: 'content title',
        contentType: 'test',
        contentVersionId: 'content version ID',
        hidden: false,
        standardIdentifiers: ['6.RP.A.1', '6.RP.A.3.a', '6.RP.A.3.b'],
        standards: [{}, {}, {}],
        status: 'draft',
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
  moduleIndex: 0,
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

const Store = {
  user: { user: {} },
  curriculumSequence: {
    checkedUnitItems: [],
    currentAssignmentIds: ['id'],
    playlistTestDetailsModal: {
      isVisible: false,
    },
  },
  test: {
    isTestPreviewModalVisible: false,
  },
}

const { store } = configureStore(Store)

describe('Playlist Tab', () => {
  test('test visibility of playlist ModuleRow component  ', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ModuleRow {...props} />
        </Router>
      </Provider>
    )
    const moduleDataName = screen.getByTestId('moduleDataName')
    expect(moduleDataName).toBeInTheDocument()
  })
  test('test PlaylistTestDetailsModal visibility onclicking moduleRow ', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ModuleRow {...props} />
        </Router>
      </Provider>
    )

    const moduleDataName = screen.getByTestId('moduleDataName')
    expect(moduleDataName).toBeInTheDocument()
    fireEvent.click(moduleDataName)
    const playlistTestDeatils = screen.getByTestId('PlaylistTestDetailsModal')
    expect(playlistTestDeatils).toBeInTheDocument()
  })
})
