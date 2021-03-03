import React from 'react'
import ToolsIcons from './static/AnnotationIcons'

const {
  BoxIcon,
  CleanIcon,
  CursorIcon,
  EditIcon,
  ImageIcon,
  LayoutIcon,
  ListIcon,
  MessageIcon,
  MoveIcon,
  NextIcon,
  PreviousIcon,
  TextLineIcon,
  TextIcon,
  Videoicon,
  HighlightIcon,
} = ToolsIcons

export const ANNOTATION_TOOLS = [
  {
    key: 'thumbnails',
    title: 'PDF Thumbnails',
    icon: <LayoutIcon data-cy="thumbnails" />,
  },
  {
    key: 'list',
    title: 'List',
    icon: <ListIcon data-cy="list" />,
  },
  {
    key: 'cursor',
    title: 'Cursor',
    icon: <CursorIcon data-cy="cursor" />,
  },
  {
    key: 'drag',
    title: 'Drag',
    icon: <MoveIcon data-cy="drag" />,
  },
  {
    key: 'undo',
    title: 'Undo',
    icon: <PreviousIcon data-cy="undo" />,
  },
  {
    key: 'redo',
    title: 'Redo',
    icon: <NextIcon data-cy="redo" />,
  },
  {
    key: 'area',
    title: 'Rectangle',
    icon: <BoxIcon data-cy="area" />,
    showColorPicker: true,
  },
  {
    key: 'mask',
    title: 'White mask',
    icon: <CleanIcon data-cy="mask" />,
  },
  {
    key: 'highlight',
    title: 'Highlight',
    icon: <HighlightIcon data-cy="highlight" />,
    showColorPicker: true,
  },
  {
    key: 'strikeout',
    title: 'Strikeout',
    icon: <TextLineIcon data-cy="strikeout" />,
    showColorPicker: true,
  },
  {
    key: 'text',
    title: 'Text Tool',
    icon: <TextIcon data-cy="text" />,
    showColorPicker: true,
    showSizeSelection: true,
  },
  {
    key: 'draw',
    title: 'Pen Tool',
    icon: <EditIcon data-cy="drawWithPen" />,
    showColorPicker: true,
    showSizeSelection: true,
  },
  {
    key: 'video',
    title: 'Add Video',
    icon: <Videoicon data-cy="vedio" />,
  },
  {
    key: 'image',
    title: 'Add Image',
    icon: <ImageIcon data-cy="image" />,
  },
  {
    key: 'point',
    title: 'Comment',
    icon: <MessageIcon data-cy="point" />,
  },
]
