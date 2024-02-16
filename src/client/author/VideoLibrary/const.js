import selectsData from '../TestPage/components/common/selectsData'

const vqTabs = {
  COMMUNITY: 'community',
  MY_CONTENT: 'myContent',
  YOUTUBE: 'youtube',
}
export const vqConst = {
  reduxNamespaceKey: 'videoQuizReducer',
  defaultTab: 'community',
  ytLinkPrefix: 'https://www.youtube.com/watch?v=',
  resultLimit: 20,
  vqTabs,
  sort: {
    [vqTabs.COMMUNITY]: {
      sortBy: 'popularity',
      sortDir: 'desc',
    },
    [vqTabs.MY_CONTENT]: {
      sortBy: 'recency',
      sortDir: 'desc',
    },
  },
}

const { allGrades, allSubjects, allStatus } = selectsData

export const filterDetails = {
  grades: {
    filterHeader: 'Grades',
    filterKey: 'grades',
    placeholder: 'All Grades',
    options: allGrades,
    mode: 'multiple',
  },
  subjects: {
    filterHeader: 'Subjects',
    filterKey: 'subject',
    placeholder: 'All Subjects',
    options: allSubjects,
    mode: 'multiple',
  },
  status: {
    filterHeader: 'All Status',
    filterKey: 'status',
    placeholder: 'All Status',
    options: allStatus,
    mode: 'single',
  },
}
