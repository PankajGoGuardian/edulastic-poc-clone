import {
  IconAdminDashboardAddOn,
  IconAttendanceAddOn,
  IconBehaviourReportAddOn,
  IconCPM,
  IconDataStudioSubscription,
  IconEarlyWarningAddOn,
  IconEfficacyAddOn,
  IconGaolsAndInterventionsAddOn,
  IconOpenBook,
  IconPerformanceTrendAddOn,
  IconPurchasedAlert,
  IconPuzzel,
  IconSchool,
  IconSparkBooks,
  IconSparkCS,
  IconSparkMath,
  IconSparkPhonics,
  IconSparkScience,
  IconSparkWriting,
  IconSpecs,
  IconStemCross,
  IconSurveyInsightsAddOn,
  IconWholeLearnerReportAddOn,
} from '@edulastic/icons'
import React from 'react'
import DATA_STUDIO from '../static/data-studio-bg.png'
import ENTERPRISEIMG from '../static/enterprise-bg.png'
import FREEIMG from '../static/free-forever-bg.png'
import PREMIUMIMG from '../static/premium-teacher-bg.png'
import { ExpiryMsg } from '../components/SubscriptionMain/styled'

const expiryMessage = ({ subscribed, expiryDate }) => (
  <>
    {subscribed && (
      <ExpiryMsg data-cy="enterpriseAlertMsg">
        <IconPurchasedAlert />
        <span>
          purchased
          {expiryDate ? `- EXPIRES ${new Date(expiryDate).toDateString()}` : ``}
        </span>
      </ExpiryMsg>
    )}
  </>
)

export const subscription = {
  enterprise: ({ subscribed, expiryDate }) => ({
    title: 'Edulastic Enterprise & Add-ons to supercharge instruction.',
    description: (
      <>
        Upgrade your subscription to Teacher Premium or school or district
        Enterprise for additional features, and add on subject-specific <br />
        content bundles that you will love.
      </>
    ),
    header: {
      title: (
        <>
          Enterprise for Districts or Schools{' '}
          {expiryMessage({ subscribed, expiryDate })}
        </>
      ),
      icon: <IconSchool />,
      description: (
        <>
          Get in-depth insights into schoolwide and districtwide progress with
          Edulastic Enterprise. Deliver common assessments, analyze the instant
          student data, and manage everything in one place. Enterprise includes
          Premium and its collaboration, accommodation, and security tools.
        </>
      ),
    },
    addOn: {
      title: 'Premium add-ons to make it even better',
      description: (
        <>
          Add on modules make it easier to deliver differentiated instruction
          and pull all of your data into <br /> one place for a holistic view of
          student understanding and growth.
        </>
      ),
      data: [
        {
          icon: <IconSparkMath />,
          title: 'SparkMath',
          description:
            'Pre-built assessments and differentiated Math practice for each student',
        },
        {
          icon: <IconOpenBook />,
          title: 'Book Buddies',
          description: 'Assessments and prompts on your favorite books',
        },
        {
          icon: <IconStemCross />,
          title: 'STEM Cross-curricular',
          description: 'Science passages with reading and science questions',
        },
        {
          icon: <IconPuzzel />,
          title: 'Phonics Practice',
          description:
            'Full year of practice assignments to help all students master each sound',
        },
        {
          icon: <IconSpecs />,
          title: 'Reading Comprehension Practice',
          description: 'Fiction and nonfiction to practice close reading',
        },
        {
          icon: <IconSparkScience />,
          title: 'SparkScience',
          description:
            'NGSS-aligned pre-built assessments and item banks for grades K-12',
        },
        {
          icon: <IconSparkCS />,
          title: 'SparkCS',
          description:
            'Full year of practice assignments to help all students master each sound',
        },
        {
          icon: <IconCPM />,
          title: 'CPM',
          description:
            'Pre-built, customizable assessments for each chapter of your course, from core Connections, Course 1 through Algebra 2 and Integrated 1-3',
        },
        {
          icon: <IconSparkWriting />,
          title: 'SparkWriting',
          description:
            'Practice activities for grammar, conventions, usage, and mechanics for grade 2-12',
        },
        {
          icon: <IconSparkBooks />,
          title: 'SparkBooks',
          description: 'Quizzes and activities for the books you teach',
        },
        {
          icon: <IconSparkPhonics />,
          title: 'SparkPhonics',
          description:
            'Diagnostics and weekly practice exercises to strengthen phonemic awareness for early readers',
        },
      ],
    },
  }),
  dataStudio: ({ subscribed, expiryDate }) => ({
    isNew: true,
    links: [
      {
        label: 'LEARN MORE',
        url: 'https://edulastic.com/data-studio/',
      },
      {
        label: 'VIEW PRESS RELEASE',
        url:
          'https://www.prnewswire.com/news-releases/edulastic-data-studio-gives-educators-an-accessible-view-of-learning-to-shape-data-driven-strategies-for-student-success-301815434.html',
      },
    ],
    title: 'Data Studio',
    description: (
      <>
        Visualize progress and drive outcomes with data-driven strategies for
        student success.
      </>
    ),
    header: {
      icon: <IconDataStudioSubscription />,
      title: (
        <>
          Data Studio for Districts {expiryMessage({ subscribed, expiryDate })}
        </>
      ),
      description: (
        <>
          Edulastic Data Studio gives educators a holistic view of learning to
          shape data-driven strategies for student success. See Edulastic
          reporting alongside third-party sources to inform MTSS planning at the
          district, school, and student level.
        </>
      ),
    },
    addOn: {
      title: 'Gain critical insight for continuous improvement',
      description: (
        <>
          Analyzing complex data from all of your sources has never been more
          straightforward, with easy-to-read visuals and graphs to help you
          glean critical information at a <br /> glance. See how students are
          moving toward mastery and how your assessments lead to student
          achievements with data available by district, school, class, grade,
          subject, student groups, demographics and many more.
        </>
      ),
      data: [
        {
          icon: <IconAdminDashboardAddOn />,
          title: 'Admin Dashboard',
          description:
            'Get a bird’s eye view of key academic and non-academic performance and risk indicators— all in one easily accessible dashboard.',
        },
        {
          icon: <IconEarlyWarningAddOn />,
          title: 'Early Warning',
          description: `View students at risk based on their academic and attendance performance and plan interventions.`,
        },
        {
          icon: <IconWholeLearnerReportAddOn />,
          title: 'Whole Learner Report',
          description: `Get a complete picture of a student's learning journey with the Whole Learner Report. View academic and non academic indicators so you can provide proactive support to students who need it.`,
        },
        {
          icon: <IconAttendanceAddOn />,
          title: 'Attendance',
          description: `Monitor attendance and tardies, identify students at risk of chronic absenteeism, and intervene.`,
        },
        {
          icon: <IconGaolsAndInterventionsAddOn />,
          title: 'Goals / Interventions Management',
          description: `Set SMART Goals and Interventions and track improvement.`,
        },
        {
          icon: <IconEfficacyAddOn />,
          title: 'Efficacy',
          description: `Compare student performance across tests pre and post-intervention.`,
        },
        {
          icon: <IconPerformanceTrendAddOn />,
          title: 'Performance Trends',
          description: `Proactively identify the strengths and needs of all students by viewing Edulastic data alongside third-party assessments over time.`,
        },
        {
          icon: <IconBehaviourReportAddOn />,
          comingSoon: true,
          title: 'Behavior',
          description: `Understand student behavior trends, reduce suspensions, referrals etc. and support the whole student.`,
        },
        {
          icon: <IconSurveyInsightsAddOn />,
          comingSoon: true,
          title: 'Survey Insights',
          description: `Get insights from responses in Skill Surveys and build a positive school culture.`,
        },
      ],
    },
  }),
}

export const comparePlansData = [
  {
    cardTitle: 'Free Forever',
    subTitle: '$0 / MONTH',
    cardLabel: 'FREE FOREVER',
    color: '#5EB500',
    bgImg: FREEIMG,
    data: [
      {
        title: 'Unlimited Assesments',
        description: 'Create as many classes & students as you need.',
      },
      {
        title: '80K & Growing Item Bank',
        description: 'Edulastic CERTIFIED for Grades K-12.',
      },
      {
        title: '30+ Technology-Enhanced Question Types',
        description: 'Create your own or mix and match.',
      },
      {
        title: 'Immediate Perfomance Data',
        description: 'Real-time reports by student and class.',
      },
      {
        title: 'Standards Mastery Tracking',
        description: 'Reports by standard for students and classes.',
      },
      {
        title: 'Assessment Sharing',
        description: 'Share assessments or keep them private. Your choice.',
      },
      {
        title: 'Works with Google Apps',
        description: 'Google single sign-on and sync with Google Classroom.',
      },
    ],
  },
  {
    cardTitle: 'Premium Teacher',
    subTitle: '$100 / YEAR',
    cardLabel: 'PER TEACHER PRICING',
    color: '#4E95F3',
    bgImg: PREMIUMIMG,
    data: [
      {
        title: 'All Free Teacher Features, PLUS:',
        description: '',
      },
      {
        title: 'In-depth Reporting',
        description:
          'Show student growth over time. Analyze answer distractor. See complete student mastery profile.',
      },
      {
        title: 'Advanced Assessment Options',
        description:
          'Shuffle question order for each student. Show student scores but hide correct answers.',
      },
      {
        title: 'Read Aloud',
        description:
          'Choose students to have questions and answer choices read to them.',
      },
      {
        title: 'Rubric Scoring',
        description: 'Create and share rubrics school or district wide.',
      },
      {
        title: 'Collaboration',
        description: "Work on assessment as a team before they're published.",
      },
      {
        title: 'Presentation Mode',
        description:
          'Review answers and common mistakes with the class without showing names.',
      },
    ],
  },
  {
    cardTitle: 'Enterprise',
    subTitle: 'REQUEST A QUOTE',
    cardLabel: 'PER STUDENT PRICING',
    color: '#FFA200',
    bgImg: ENTERPRISEIMG,
    data: [
      {
        title: 'Premium Teacher for All Teachers, PLUS:',
        description: '',
      },
      {
        title: 'Common Assessment',
        description:
          'Administer common assessments and control access by teachers and students.',
      },
      {
        title: 'Immediate School or District-Wide Reports',
        description:
          'See performance, growth and standards mastery by building, grade, teacher and student.',
      },
      {
        title: 'SIS & LMS Integration',
        description:
          'Automatic roster sync and gradebook integration (where available).',
      },
      {
        title: 'Additional Item Banks',
        description:
          'Choose from third-party item banks, such as Inspect, Carnegie Learning or Progress Testing.',
      },
      {
        title: 'Expedited Technical Support',
        description: 'On-call support during assessment by phone or online.',
      },
      {
        title: 'Custom Professional Development',
        description:
          'Live or online workshops to get you and your teacher up and running.',
      },
    ],
  },
  {
    cardTitle: 'Data Studio',
    subTitle: 'REQUEST A QUOTE',
    cardLabel: 'PER STUDENT PRICING',
    color: '#FFA200',
    bgImg: DATA_STUDIO,
    data: [
      {
        title: 'Enhanced reporting with academic and non-academic data:',
        description: '',
      },
      {
        title: 'Admin Dashboard',
        description:
          'View key KPIs on students’ performance. Drill down to analyse and intervene.',
      },
      {
        title: 'Performance Trends',
        description:
          'View whether performance is improving over time and take necessary interventions.',
      },
      {
        title: 'Whole Learner',
        description:
          'Get a complete understanding of a learner’s academic and behavioral profiles.',
      },
      {
        title: 'Attendance',
        description:
          'Monitor attendance and tardies, identify students at risk of chronic absenteeism.',
      },
      {
        title: 'Behavior',
        description:
          'Understand student behavior trends, reduce suspensions, referrals etc.',
      },
      {
        title: 'Survey Insights',
        description:
          'Get insights from responses in Skill Surveys and build a positive school culture.',
      },
      {
        title: 'Goals/Interventions Management',
        description: 'Set SMART Goals and Interventions and track improvement.',
      },
      {
        title: 'Early Warning',
        description:
          'View students at risk based on their academic and attendance performance.',
      },
      {
        title: 'Efficacy',
        description:
          'Compare student performance across tests pre and post-intervention.',
      },
    ],
  },
]

export const licenseTypes = {
  ENTERPRISE: 'Enterprise',
  TEACHER_PREMIUM: 'Teacher Premium',
  DATA_STUDIO: 'Data Studio',
}

export const licenseTypeRadios = [
  {
    key: 'enterpriseRadio',
    label: licenseTypes.ENTERPRISE,
    value: licenseTypes.ENTERPRISE,
  },
  {
    key: 'teacherPremiumRadio',
    label: licenseTypes.TEACHER_PREMIUM,
    value: licenseTypes.TEACHER_PREMIUM,
  },
  {
    key: 'dataStudioRadio',
    label: licenseTypes.DATA_STUDIO,
    value: licenseTypes.DATA_STUDIO,
  },
]
