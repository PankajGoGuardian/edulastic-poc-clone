import React from "react";
import ToolsIcons from "./static/AnnotationIcons";

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
  Videoicon
} = ToolsIcons;

export const ANNOTATION_TOOLS = [
  {
    key: "thumbnails",
    title: "PDF Thumbnails",
    icon: <LayoutIcon />
  },
  {
    key: "list",
    title: "List",
    icon: <ListIcon />
  },
  {
    key: "cursor",
    title: "Cursor",
    icon: <CursorIcon />
  },
  {
    key: "drag",
    title: "Drag",
    icon: <MoveIcon />
  },
  {
    key: "undo",
    title: "Undo",
    icon: <PreviousIcon />
  },
  {
    key: "redo",
    title: "Redo",
    icon: <NextIcon />
  },
  {
    key: "area",
    title: "Rectangle",
    icon: <BoxIcon />,
    showColorPicker: true
  },
  {
    key: "mask",
    title: "White mask",
    icon: <CleanIcon />
  },
  {
    key: "highlight",
    title: "Highlight",
    icon: <CleanIcon />,
    showColorPicker: true
  },
  {
    key: "strikeout",
    title: "Strikeout",
    icon: <TextLineIcon />,
    showColorPicker: true
  },
  {
    key: "text",
    title: "Text Tool",
    icon: <TextIcon />,
    showColorPicker: true,
    showSizeSelection: true
  },
  {
    key: "draw",
    title: "Pen Tool",
    icon: <EditIcon />,
    showColorPicker: true,
    showSizeSelection: true
  },
  {
    key: "video",
    title: "Add Video",
    icon: <Videoicon />
  },
  {
    key: "image",
    title: "Add Image",
    icon: <ImageIcon />
  },
  {
    key: "point",
    title: "Comment",
    icon: <MessageIcon />
  }
];
