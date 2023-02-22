import { getProficiencyBand } from '@edulastic/constants/reportUtils/common'

export const bandInfo = [
  {
    _id: '6322e2b799978a000a298469',
    orgType: 'district',
    orgId: '6322e2b799978a000a298466',
    name: 'Standard Performance Band',
    performanceBand: [
      {
        color: '#60B14F',
        threshold: 70,
        aboveStandard: 1,
        name: 'Proficient',
      },
      {
        color: '#EBDD54',
        threshold: 50,
        aboveStandard: 1,
        name: 'Basic',
      },
      {
        color: '#EF9202',
        threshold: 0,
        aboveStandard: 0,
        name: 'Below Basic',
      },
    ],
  },
  {
    _id: '63296244dfe5d90009174d66',
    name:
      'Karthik Performance Band2 With Both bands selected for Above Standard',
    orgId: '6322e2b799978a000a298466',
    orgType: 'district',
    performanceBand: [
      {
        color: '#7c0a02',
        threshold: 81,
        aboveStandard: 1,
        name: 'Proficient',
      },
      {
        color: '#AFA515',
        threshold: 0,
        aboveStandard: 1,
        name: 'Below Basic',
      },
    ],
  },
  {
    _id: '63296348dfe5d90009174d67',
    name: 'Where We Are Today',
    orgId: '6322e2b799978a000a298466',
    orgType: 'district',
    performanceBand: [
      {
        color: '#576BA9',
        threshold: 82,
        aboveStandard: 1,
        name: 'Proficient Cyber Patriots Midnight Buzz Wonderland',
      },
      {
        color: '#A1C3EA',
        threshold: 45,
        aboveStandard: 1,
        name: 'Basic Western Front American Hustlers',
      },
      {
        color: '#F39300',
        threshold: 0,
        aboveStandard: 0,
        name: 'Below Basic Faster Than The Boys',
      },
    ],
  },
]

export const availableTestTypes = [
  {
    key: 'common assessment',
    title: 'Common Assessment',
  },
  {
    key: 'assessment',
    title: 'Class Assessment',
  },
  {
    key: 'practice',
    title: 'Practice Assessment',
  },
  {
    key: 'homework',
    title: 'Homework',
  },
  {
    key: 'quiz',
    title: 'Quiz',
  },
  {
    key: 'CAASPP',
    title: 'CAASPP',
  },
  {
    key: 'NWEA',
    title: 'NWEA',
  },
  {
    key: 'iReady_ELA',
    title: 'iReady (ELA)',
  },
  {
    key: 'iReady_Math',
    title: 'iReady (MATH)',
  },
]

export const selectedTestType = 'common assessment'

export const PieChartData = [
  {
    fill: '#60B14F',
    value: 35,
    name: 'Proficient',
  },
  {
    fill: '#EBDD54',
    value: 45,
    name: 'Basic',
  },
  {
    fill: '#EF9202',
    value: 20,
    name: 'Below Basic',
  },
]

export const getCellColor = (value, selectedPerformanceBand) => {
  const band = getProficiencyBand(value, selectedPerformanceBand)
  return band.color
}
