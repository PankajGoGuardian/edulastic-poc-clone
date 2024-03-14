import React from 'react'

import { questionType } from '@edulastic/constants'
import { OrderList } from '../widgets/OrderList'
import { SortList } from '../widgets/SortList'
import { MatchList } from '../widgets/MatchList'
import { Classification } from '../widgets/Classification'
import { MultipleChoice } from '../widgets/MultipleChoice'
import { ClozeDragDrop } from '../widgets/ClozeDragDrop'
import { ClozeImageDragDrop } from '../widgets/ClozeImageDragDrop'
import { ClozeImageDropDown } from '../widgets/ClozeImageDropDown'
import { ClozeImageText } from '../widgets/ClozeImageText'
import { ClozeEditingTask } from '../widgets/ClozeEditingTask'
import { ClozeDropDown } from '../widgets/ClozeDropDown'
import { ClozeText } from '../widgets/ClozeText'
import { ShortText } from '../widgets/ShortText'
import { TokenHighlight } from '../widgets/TokenHighlight'
import { Shading } from '../widgets/Shading'
import { Hotspot } from '../widgets/Hotspot'
import { HighlightImage } from '../widgets/HighlightImage'
import { EssayPlainText } from '../widgets/EssayPlainText'
import { EssayRichText } from '../widgets/EssayRichText'
import AudioResponse from '../widgets/AudioResponse'
import FractionEditor from '../widgets/FractionEditor'
import UploadFile from '../widgets/UploadFile'
import { MatrixChoice } from '../widgets/MatrixChoice'
import { Protractor } from '../widgets/Protractor'
import { Passage } from '../widgets/Passage'
import { Video } from '../widgets/Video'
import { Text } from '../widgets/Text'
import { MathFormula } from '../widgets/MathFormula'
import { FormulaEssay } from '../widgets/FormulaEssay'
import ClozeMath from '../widgets/ClozeMath'
import { Chart } from '../widgets/Charts'
import Pictograph from '../widgets/Pictorgraph'
import { Graph } from '../components/Graph'
import { Drawing } from '../components/Drawing'
import LikertScale from '../widgets/LikertScale'

const {
  LINE_PLOT,
  DOT_PLOT,
  HISTOGRAM,
  LINE_CHART,
  BAR_CHART,
  DRAWING,
  HIGHLIGHT_IMAGE,
  SHADING,
  HOTSPOT,
  TOKEN_HIGHLIGHT,
  SHORT_TEXT,
  ESSAY_PLAIN_TEXT,
  ESSAY_RICH_TEXT,
  MULTIPLE_CHOICE,
  CHOICE_MATRIX,
  SORT_LIST,
  CLASSIFICATION,
  MATCH_LIST,
  ORDER_LIST,
  CLOZE_DRAG_DROP,
  CLOZE_IMAGE_DRAG_DROP,
  PROTRACTOR,
  CLOZE_IMAGE_DROP_DOWN,
  CLOZE_IMAGE_TEXT,
  CLOZE_DROP_DOWN,
  CLOZE_TEXT,
  EDITING_TASK,
  PASSAGE,
  VIDEO,
  TEXT,
  MATH,
  FORMULA_ESSAY,
  CLOZE_MATH,
  EXPRESSION_MULTIPART,
  GRAPH,
  FRACTION_EDITOR,
  SECTION_LABEL,
  UPLOAD_FILE,
  PICTOGRAPH,
  AUDIO_RESPONSE,
  LIKERT_SCALE,
} = questionType

const DummyQuestion = () => <></>

export const questionTypeToComponent = {
  [LINE_PLOT]: Chart,
  [DOT_PLOT]: Chart,
  [HISTOGRAM]: Chart,
  [LINE_CHART]: Chart,
  [BAR_CHART]: Chart,
  [DRAWING]: Drawing,
  [HIGHLIGHT_IMAGE]: HighlightImage,
  [SHADING]: Shading,
  [HOTSPOT]: Hotspot,
  [TOKEN_HIGHLIGHT]: TokenHighlight,
  [SHORT_TEXT]: ShortText,
  [ESSAY_PLAIN_TEXT]: EssayPlainText,
  [ESSAY_RICH_TEXT]: EssayRichText,
  [MULTIPLE_CHOICE]: MultipleChoice,
  [CHOICE_MATRIX]: MatrixChoice,
  [SORT_LIST]: SortList,
  [CLASSIFICATION]: Classification,
  [MATCH_LIST]: MatchList,
  [ORDER_LIST]: OrderList,
  [CLOZE_DRAG_DROP]: ClozeDragDrop,
  [CLOZE_IMAGE_DRAG_DROP]: ClozeImageDragDrop,
  [PROTRACTOR]: Protractor,
  [CLOZE_IMAGE_DROP_DOWN]: ClozeImageDropDown,
  [CLOZE_IMAGE_TEXT]: ClozeImageText,
  [CLOZE_DROP_DOWN]: ClozeDropDown,
  [CLOZE_TEXT]: ClozeText,
  [EDITING_TASK]: ClozeEditingTask,
  [PASSAGE]: Passage,
  [VIDEO]: Video,
  [TEXT]: Text,
  [MATH]: MathFormula,
  [FORMULA_ESSAY]: FormulaEssay,
  [CLOZE_MATH]: ClozeMath,
  [EXPRESSION_MULTIPART]: ClozeMath,
  [GRAPH]: Graph,
  [FRACTION_EDITOR]: FractionEditor,
  [SECTION_LABEL]: DummyQuestion,
  [UPLOAD_FILE]: UploadFile,
  [PICTOGRAPH]: Pictograph,
  [AUDIO_RESPONSE]: AudioResponse,
  [LIKERT_SCALE]: LikertScale,
  default: () => null,
}
