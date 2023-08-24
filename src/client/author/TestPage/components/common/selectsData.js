import { allDepthOfKnowledgeMap } from '@edulastic/constants/const/question'
import {
  MULTIPLE_CHOICE,
  MULTIPLE_SELECTION,
  TRUE_OR_FALSE,
} from '@edulastic/constants/const/questionType'

// TK instead of PK for PreKindergarten is intentional
const allGrades = [
  { value: 'TK', text: 'PreKindergarten' },
  { value: 'K', text: 'Kindergarten' },
  { value: '1', text: 'Grade 1' },
  { value: '2', text: 'Grade 2' },
  { value: '3', text: 'Grade 3' },
  { value: '4', text: 'Grade 4' },
  { value: '5', text: 'Grade 5' },
  { value: '6', text: 'Grade 6' },
  { value: '7', text: 'Grade 7' },
  { value: '8', text: 'Grade 8' },
  { value: '9', text: 'Grade 9' },
  { value: '10', text: 'Grade 10' },
  { value: '11', text: 'Grade 11' },
  { value: '12', text: 'Grade 12' },
  { value: 'O', text: 'Other' },
]

const allSubjects = [
  { value: 'Mathematics', text: 'Mathematics' },
  { value: 'ELA', text: 'ELA' },
  { value: 'Science', text: 'Science' },
  { value: 'Social Studies', text: 'Social Studies' },
  { value: 'Computer Science', text: 'Computer Science' },
  { value: 'Other Subjects', text: 'Other Subjects' },
]

const allTags = [
  { value: 'tag1', text: 'Tag1' },
  { value: 'tag2', text: 'Tag2' },
]

const allCollections = [
  { value: 'Private', text: 'Private' },
  { value: 'Public', text: 'Public' },
  // { value: "edulastic_certified", text: "Edulastic Certified" }
]

const allDepthOfKnowledge = Object.values(allDepthOfKnowledgeMap)

// First value is the default value.
const allAuthorDifficulty = [
  { value: '', text: 'All Levels' },
  { value: 'Easy', text: 'Easy' },
  { value: 'Medium', text: 'Medium' },
  { value: 'Hard', text: 'Hard' },
]

const openPolicy = [
  { value: 'Automatically on Start Date', text: 'Automatically on Start Date' },
  { value: 'Open Manually in Class', text: 'Open Manually in Class' },
]

const openPolicyForAdmin = [
  { value: 'Automatically on Start Date', text: 'Automatically on Start Date' },
  { value: 'Open Manually by Teacher', text: 'Open Manually by Teacher' },
  { value: 'Open Manually by Admin', text: 'Open Manually by Admin' },
]

const closePolicy = [
  { value: 'Automatically on Due Date', text: 'Automatically on Close Date' },
  { value: 'Close Manually in Class', text: 'Close Manually in Class' },
]

const closePolicyForAdmin = [
  { value: 'Automatically on Due Date', text: 'Automatically on Close Date' },
  { value: 'Close Manually by Admin', text: 'Close Manually by Admin' },
]

const allStatus = [
  { value: '', text: 'All' },
  { value: 'published', text: 'Published' },
  { value: 'draft', text: 'Draft' },
]

const extraStatus = [
  { value: 'inreview', text: 'In Review' },
  { value: 'rejected', text: 'Rejected' },
]

const defaultStandards = {
  Mathematics: 'Math - Common Core',
  ELA: 'ELA - Common Core',
  Science: 'Science - NGSS',
  'Social Studies': 'Social Studies',
}

const allQuestionTypes = [
  { value: MULTIPLE_CHOICE, text: 'Multiple Choice question' },
  { value: TRUE_OR_FALSE, text: 'True or False' },
  { value: MULTIPLE_SELECTION, text: 'Multiple Select question' },
]

export default {
  allGrades,
  allSubjects,
  allTags,
  allCollections,
  allDepthOfKnowledge,
  allAuthorDifficulty,
  openPolicy,
  openPolicyForAdmin,
  closePolicy,
  closePolicyForAdmin,
  allStatus,
  defaultStandards,
  extraStatus,
  allQuestionTypes,
}
