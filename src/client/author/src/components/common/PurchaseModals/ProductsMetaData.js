import React from 'react'
import {
  IconCalc,
  IconReading,
  IconSchool,
  IconScience,
  IconRobot,
  IconWord,
  IconCPM,
  IconSparkWriting,
  IconSparkBooks,
  IconSparkPhonics,
  IconVideoAISuite,
} from '@edulastic/icons'

export const productsMetaData = {
  'Teacher Premium': {
    icon: <IconSchool />,
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/teacher-premium',
    filters: 'ALL SUBJECTS',
  },
  'Video Quiz and AI Suite': {
    icon: <IconVideoAISuite />,
    grades: 'Grades K-12',
    learnMoreLinks:
      'https://edulastic.com/blog/introducing-video-quiz-elevate-your-classroom-engagement-and-assessment-game',
    filters: 'ALL SUBJECTS',
  },
  SparkMath: {
    icon: <IconCalc />,
    subject: 'math & cs',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-math',
    filters: 'MATHEMATICS',
  },
  SparkScience: {
    icon: <IconScience />,
    subject: 'science',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-science',
    filters: 'SCIENCE',
  },
  SparkReading: {
    icon: <IconReading />,
    subject: 'ela',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    filters: 'ELA',
  },
  SparkWords: {
    icon: <IconWord />,
    subject: 'ela',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-words',
    filters: 'ELA',
  },
  SparkCS: {
    icon: <IconRobot />,
    subject: 'math & cs',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-cs',
    filters: 'COMPUTER SCIENCE',
  },
  CPM: {
    icon: <IconCPM />,
    subject: 'math & cs',
    grades: 'Grades 6-12',
    learnMoreLinks: 'https://edulastic.com/CPM',
    filters: 'MATHEMATICS',
  },
  SparkWriting: {
    icon: <IconSparkWriting />,
    subject: 'ela',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-words',
    filters: 'ELA',
  },
  SparkBooks: {
    icon: <IconSparkBooks />,
    subject: 'ela',
    grades: 'Grades 6-12',
    learnMoreLinks: 'https://edulastic.com/spark-books',
    filters: 'ELA',
  },
  SparkPhonics: {
    icon: <IconSparkPhonics />,
    subject: 'ela',
    grades: 'Grades K-3',
    learnMoreLinks: 'https://edulastic.com/spark-phonics',
    filters: 'ELA',
  },
}
