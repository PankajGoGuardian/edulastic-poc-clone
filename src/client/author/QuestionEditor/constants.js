import React from 'react'
import {
  IconLayout,
  IconMath,
  IconNewList,
  IconSelection,
  IconTarget,
  IconWrite,
} from '@edulastic/icons'
import { questionType } from '@edulastic/constants'

const {
  ESSAY_PLAIN_TEXT,
  ESSAY_RICH_TEXT,
  EXPRESSION_MULTIPART,
  MULTIPART,
  HIGHLIGHT_IMAGE,
  CLASSIFICATION,
  CLOZE_TEXT,
  CLOZE_IMAGE_TEXT,
  CLOZE_DRAG_DROP,
  CLOZE_IMAGE_DRAG_DROP,
  CLOZE_DROP_DOWN,
  CLOZE_IMAGE_DROP_DOWN,
} = questionType

export const defaultWidgets = {
  rows: [
    {
      tabs: [],
      dimension: '100%',
      widgets: [],
      flowLayout: false,
      content: '',
    },
  ],
}

export const ChangeQTypeOptions = [
  {
    key: MULTIPART,
    title: 'Multipart',
    icon: <IconNewList />,
  },
  {
    key: EXPRESSION_MULTIPART,
    title: 'Math, Text & Dropdown',
    icon: <IconMath />,
  },
  {
    key: ESSAY_RICH_TEXT,
    title: 'Essay Rich Text',
    icon: <IconWrite height="12px" width="12px" />,
  },
  {
    key: ESSAY_PLAIN_TEXT,
    title: 'Essay Plain Text',
    icon: <IconWrite height="12px" width="12px" />,
  },
  {
    key: HIGHLIGHT_IMAGE,
    title: 'Drawing Response',
    icon: <IconTarget />,
  },
  {
    key: CLASSIFICATION,
    title: 'Classification',
    icon: <IconLayout />,
  },
  {
    key: CLOZE_TEXT,
    title: 'Text Entry',
    icon: <IconSelection />,
  },
  {
    key: CLOZE_IMAGE_TEXT,
    title: 'Text Entry - Label With Image',
    icon: <IconSelection />,
  },
  {
    key: CLOZE_DRAG_DROP,
    title: 'Drag & Drop',
    icon: <IconSelection />,
  },
  {
    key: CLOZE_IMAGE_DRAG_DROP,
    title: 'Drag & Drop - Label With Image',
    icon: <IconSelection />,
  },
  {
    key: CLOZE_DROP_DOWN,
    title: 'Dropdown',
    icon: <IconSelection />,
  },
  {
    key: CLOZE_IMAGE_DROP_DOWN,
    title: 'Dropdown - Label With Image',
    icon: <IconSelection />,
  },
]
