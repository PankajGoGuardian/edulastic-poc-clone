import { questionType as questionTypes } from '@edulastic/constants'

// TK instead of PK for PreKindergarten is intentional
const filterData = [
  {
    mode: 'multiple',
    size: 'large',
    title: 'Grades',
    placeholder: 'All Grades',
    onChange: 'grades',
    data: [
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
    ],
  },
  {
    size: 'large',
    title: 'Subject',
    onChange: 'subject',
    placeholder: 'All Subjects',
    mode: 'multiple',
    data: [
      { value: 'Mathematics', text: 'Mathematics' },
      { value: 'ELA', text: 'ELA' },
      { value: 'Science', text: 'Science' },
      { value: 'Social Studies', text: 'Social Studies' },
      { value: 'Computer Science', text: 'Computer Science' },
      { value: 'Other Subjects', text: 'Other Subjects' },
    ],
  },
  {
    size: 'large',
    title: 'Question Types',
    onChange: 'questionType',
    data: questionTypes.selectsData,
  },
  {
    size: 'large',
    title: 'Knowledge',
    onChange: 'depthOfKnowledge',
    data: [
      { value: '', text: 'All Depth of Knowledge' },
      { value: 'Recall', text: '1 - Recall' },
      { value: 'Skill/Concept', text: '2- Skill/Concept' },
      { value: 'Strategic Thinking', text: '3 - Strategic Thinking' },
      { value: 'Extended Thinking', text: '4 - Extended Thinking' },
    ],
  },

  {
    size: 'large',
    title: 'Difficulties',
    onChange: 'authorDifficulty',
    data: [
      { value: '', text: 'All Levels' },
      { value: 'Easy', text: 'Easy' },
      { value: 'Medium', text: 'Medium' },
      { value: 'Hard', text: 'Hard' },
    ],
  },
  {
    size: 'large',
    title: 'Status',
    onChange: 'status',
    data: [
      { value: '', text: 'All' },
      { value: 'published', text: 'Published' },
      { value: 'draft', text: 'Draft' },
    ],
    publisherOptions: [
      { value: 'inreview', text: 'In Review' },
      { value: 'rejected', text: 'Rejected' },
    ],
  },
]

export default filterData
