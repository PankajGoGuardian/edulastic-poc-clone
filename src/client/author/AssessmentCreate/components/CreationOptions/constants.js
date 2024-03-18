import React from 'react'
import {
  IconAITest,
  IconDefaultTest,
  IconGoogleFormTest,
  IconQTIUploadTest,
  IconSmartBuildTest,
  IconSnapQuizTest,
  IconSurveyTest,
  IconVideoQuizTest,
  IconWhiteLightBulb,
  IconPremiumStar,
  IconStar,
} from '@edulastic/icons'
import { navigationState } from '../../../src/constants/navigation'
import { AddOnIconWrapper, AddOnTextWrapper } from './Components/styled'

export const AccessType = {
  OR: 'OR',
  AND: 'AND',
}

export const TestKeys = {
  DEFAULT_TEST: 'default',
  DYNAMIC_TEST: 'dynamic',
  AI_TEST: 'ai',
  SNAP_QUIZ_TEST: 'snapquiz',
  VIDEO_QUIZ_TEST: 'videoquiz',
  GOOGLE_FORM_TEST: 'googleform',
  QTI_IMPORT_TEST: 'qtiimport',
  SURVEY_TEST: 'survey',
}

export const TestsNotAllowedForGcps = [
  TestKeys.VIDEO_QUIZ_TEST,
  TestKeys.SURVEY_TEST,
]

export const AccessNavigation = {
  PREMIUM: {
    key: 'premium',
    icon: <IconPremiumStar />,
    infoMessage: 'Buy Premium to unlock this feature.',
    navigation: {
      pathname: '/author/subscription',
    },
  },
  PREMIUM_AI_ADDON: {
    key: 'isVideoQuizAndAIEnabled',
    icon: <IconPremiumStar />,
    infoMessage: (
      <>
        <AddOnIconWrapper>
          <IconStar /> <AddOnTextWrapper>ADD-ON</AddOnTextWrapper>
        </AddOnIconWrapper>
        <div>Buy VideoQuiz and AI Suite to unlock this feature.</div>
      </>
    ),
    navigation: {
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.ADDON },
    },
  },
  DATA_WAREHOUSE_REPORTS: {
    key: 'dataWarehouseReports',
    icon: <IconWhiteLightBulb style={{ fill: 'transparent' }} />,
    infoMessage: 'Purchase Data Studio to use Surveys.',
    navigation: {
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.DATA_STUDIO },
    },
  },
}
export const TestSections = [
  {
    key: 'default-section',
    title: 'Build Your Own Test',
    tests: [
      {
        key: TestKeys.DEFAULT_TEST,
        icon: <IconDefaultTest />,
        heading: 'From Scratch',
        description: 'Choose from library or craft your own from 50+ questions',
        navigation: {
          pathname: '/author/tests/create',
        },
      },
      {
        key: TestKeys.DYNAMIC_TEST,
        icon: <IconSmartBuildTest />,
        heading: 'Smart Build',
        description:
          'Customize preferences to auto generate tests from item bank',
        quickTour: {
          title: 'Get Started with SmartBuild',
          infoMessage: 'Watch Quick Tour',
          url: '//fast.wistia.net/embed/iframe/mcobek8kl5',
        },
        segmentEvent: {
          name: 'DynamicTestCreateTestClick',
        },
        navigation: {
          pathname: '/author/tests/create',
          state: { isDynamicTest: true },
        },
      },
      {
        key: TestKeys.AI_TEST,
        icon: <IconAITest />,
        heading: 'Using AI',
        description: 'Use AI to create tests quickly',
        access: {
          type: AccessType.OR,
          features: [AccessNavigation.PREMIUM_AI_ADDON],
        },
      },
    ],
  },
  {
    key: 'import-section',
    title: 'Use External Content',
    tests: [
      {
        key: TestKeys.SNAP_QUIZ_TEST,
        icon: <IconSnapQuizTest />,
        heading: 'Snap Quiz',
        description: 'Import PDF to build a interactive PDF quiz',
        navigation: {
          pathname: '/author/tests/snapquiz',
        },
      },
      {
        key: TestKeys.VIDEO_QUIZ_TEST,
        icon: <IconVideoQuizTest />,
        heading: 'Video Quiz',
        description:
          'Convert a video from YouTube, Vimeo, Wistia to interactive test',
        quickTour: {
          title: 'Get Started with VideoQuiz',
          infoMessage: 'Watch Quick Tour',
          url: '//fast.wistia.net/embed/iframe/jd8y6sdt1m',
        },
        segmentEvent: {
          name: 'VideoQuizCreateTestClick',
          data: {
            source: 'Test Library',
          },
        },
        navigation: {
          pathname: '/author/tests/videoquiz',
        },
        access: {
          type: AccessType.OR,
          features: [AccessNavigation.PREMIUM],
        },
      },
      {
        key: TestKeys.GOOGLE_FORM_TEST,
        icon: <IconGoogleFormTest />,
        heading: 'Google Form',
        description: 'Import Google forms to build a pear assessment test',
        access: {
          type: AccessType.OR,
          features: [AccessNavigation.PREMIUM],
        },
        isNew: new Date() <= new Date('2024-04-14'),
      },
      {
        key: TestKeys.QTI_IMPORT_TEST,
        icon: <IconQTIUploadTest />,
        heading: 'Import Items to Test',
        description: 'Import Items from WebCT or QTI package and create a test',
        navigation: {
          pathname: '/author/import-test',
        },
      },
    ],
  },
  {
    id: 'survey-section',
    title: 'Surveys',
    tests: [
      {
        key: TestKeys.SURVEY_TEST,
        icon: <IconSurveyTest />,
        heading: 'Surveys',
        description: 'Build quick polls / surveys',
        access: {
          type: AccessType.OR,
          features: [AccessNavigation.DATA_WAREHOUSE_REPORTS],
        },
        navigation: {
          pathname: '/author/tests/create',
          search: 'testType=survey',
        },
      },
    ],
  },
]
