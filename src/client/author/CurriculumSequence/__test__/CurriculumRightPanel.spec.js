import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import CurriculumRightPanel from '../components/CurriculumRightPanel'

describe('CurriculumRightPanel', () => {
  test('test visibiltiy of summaryblock component ', async () => {
    const props = {
      showRightPanel: true,
      activeRightPanel: true,
      isStudent: false,
      urlHasUseThis: true,
      hideRightpanel: () => {},
      isManageContentActive: false,
      isNotStudentOrParent: true,
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
          title:
            'Place Value, Rounding, and Algorithms for Addition and Subtraction',
          value: NaN,
        },
      ],
      destinationCurriculumSequence: {
        active: 1,
        bgColor: '#1AB394',
        clonedCollections: [],
        collections: [],
        createdBy: { _id: '61de8ced39aece0160f3cf49', name: 'name' },
        createdDate: 1591960246022,
        customize: true,
        derivedFrom: {
          _id: '60199b4453e3edad44a67453',
          name: 'Elementary Math - Grade 4',
        },
        description:
          '<p><strong>Elementary Math - Grade 4: Mathematics Curriculum</strong></p><p>Fourth grade mathematics is about (1) developing understanding and fluency with multi-digit multiplication, and developing understanding of dividing to find quotients involving multi-digit dividends; (2) developing an understanding of fraction equivalence, addition and subtraction of fractions with like denominators, and multiplication of fractions by whole numbers; and (3) understanding that geometric figures can be analyzed and classified based on their properties, such as having parallel sides, perpendicular sides, particular angle measures, and symmetry</p>',
        grades: ['4'],
        isAuthor: true,
        modules: [],
        originalAuthor: {
          _id: '5e3273dc5f78c300083420c1',
          name: 'SparkMath Author1',
        },
        skin: 'PUBLISHER',
        status: 'draft',
        subjects: ['Mathematics'],
        textColor: '#fff',
        thumbnail:
          'https://cdn2.edulastic.com/default/7665ca19-13f5-49b9-95c4-9cc16a953ad6.png',
        title: 'Elementary Math - Grade 4',
        type: 'content',
        updatedDate: 1654408710845,
        usedCount: 0,
        version: 12,
        versionId: '62509d02cbae2d000922ee33',
        _id: '62509d02cbae2d000922ee33',
      },
      shouldHidCustomizeButton: false,
    }
    render(<CurriculumRightPanel {...props} />)
    const SummaryTitle = screen.getByText('Summary')
    expect(SummaryTitle).toBeInTheDocument()
    const SubTitle = screen.getByText('Most Time Spent')
    expect(SubTitle).toBeInTheDocument()
    const SummarySubTitle = screen.getByText('Module Proficiency')
    expect(SummarySubTitle).toBeInTheDocument()
    const moduleTitle = screen.getByTestId('moduleTitle')
    expect(moduleTitle).toBeInTheDocument()
    const progressBar = screen.getByTestId('progressBar')
    expect(progressBar).toBeInTheDocument()
  })
})
