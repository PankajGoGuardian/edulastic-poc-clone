import * as StyledComponents from './src/components/StyledComponents'
import * as Effects from './src/effects'
import * as FireBaseService from './src/Firebase'

export { FireBaseService }
export { default as MainHeader } from './src/components/MainHeader'
export { default as Paper } from './src/components/Paper'
export { default as Select } from './src/components/Select'
export { default as QuestionNumberLabel } from './src/components/QuestionNumberLabel'
export { default as QuestionSubLabel } from './src/components/QuestionSubLabel'
export { default as Progress } from './src/components/Progress'
export { default as Pagination } from './src/components/Pagination'
export { default as FlexContainer } from './src/components/FlexContainer'
export { default as PaddingDiv } from './src/components/PaddingDiv'
export { default as TestTypeIcon } from './src/components/TestTypeIcon'
export { default as TextField } from './src/components/TextField'
export { default as AutoExpandInput } from './src/components/AutoExpandInput'
export { default as Button } from './src/components/Button'
export { default as EduButton } from './src/components/EduButton'
export { default as Checkbox } from './src/components/Checkbox'
export { default as SpinLoader } from './src/components/Spinner'
export {
  default as CheckboxLabel,
  CheckBoxGrp,
} from './src/components/CheckboxLabel'
export { default as Legends, LegendContainer } from './src/components/Legends'
export { default as CustomModalStyled } from './src/components/CustomModalStyled'
export {
  TextInputStyled,
  SearchInputStyled,
  SelectInputStyled,
  NumberInputStyled,
  DatePickerStyled,
  TimePickerStyled,
  TextAreaInputStyled,
  FieldLabel,
} from './src/components/InputStyles'
export { default as BackTop } from './src/components/BackTop'
export { EduTableStyled } from './src/components/EduTableStyled'
export { LikeIconStyled } from './src/components/LikeIconStyled'
export { EduSwitchStyled } from './src/components/EduSwitchStyled'
export {
  OnWhiteBgLogo,
  OnDarkBgLogo,
  WhiteLogo,
  DarkLogo,
} from './src/components/EduLogo'
export { default as Card } from './src/components/Card'
export { default as MainContentWrapper } from './src/components/MainContentWrapper'
export { default as HeaderTabs } from './src/components/HeaderTabs'
export { default as CustomQuillComponent } from './src/components/CustomQuillComponent'
export { default as CorrectAnswersContainer } from './src/components/CorrectAnswersContainer'
export { default as MathKeyboard } from './src/components/MathKeyboard'
export { default as Keyboard } from './src/components/Keyboard'
export { default as MathInput } from './src/components/MathInput'
export { default as StaticMath } from './src/components/MathInput/StaticMath'
export { default as MathDisplay } from './src/components/MathInput/MathDisplay'
export { default as MathFormulaDisplay } from './src/components/MathFormulaDisplay'
export { default as MathSpan } from './src/components/MathSpan'
export { default as Stimulus } from './src/components/Stimulus'
export { default as InstructorStimulus } from './src/components/InstructorStimulus'
export { default as Subtitle } from './src/components/Subtitle'
export { default as CorItem } from './src/components/CorItem'
export { default as CenteredText } from './src/components/CenteredText'
export { default as Image } from './src/components/Image'
export { default as PreWrapper } from './src/components/PreWrapper'
export { default as FroalaEditor } from './src/components/FroalaEditor'
export { default as Tabs } from './src/components/Tabs'
export { default as Tab } from './src/components/Tabs/Tab'
export { default as TabContainer } from './src/components/Tabs/TabContainer'
export { default as MathModal } from './src/components/MathModal'
export { StyledComponents }
export { Effects }
export { default as TypeToConfirmModal } from './src/components/TypeToConfirmModal'
export { default as PremiumTag } from './src/components/PremiumTag/PremiumTag'
export { default as Hints } from './src/components/Hints'
export { default as ErrorHandler } from './src/components/ErrorHandler'
export { default as OfflineNotifier } from './src/components/OfflineNotifier'
export { default as Ellipsis } from './src/components/Ellipsis'
export { default as FontPicker } from './src/components/FontPicker'
export { default as QuestionLabelWrapper } from './src/components/QuestionLabelWrapper'
export { default as QuestionContentWrapper } from './src/components/QuestionContentWrapper'
export { default as ProgressBar } from './src/components/ProgressBar'
export { RadioBtn, RadioGrp } from './src/components/RadioButton'
export { default as Label } from './src/components/Label'
export { default as CustomPrompt } from './src/components/CustomPrompt'
export { default as notification } from './src/components/Notification'
export { default as DragDropInnerContainer } from './src/components/DragDrop/DragDropInnerContainer'
export { default as PremiumLabel } from './src/components/PremiumLabel'
export { default as HelperIcon } from './src/components/HelperIconWithPopover'
export { default as HelpTooltipLabel } from './src/components/HelpTooltipLabel'
export { default as SelectSearch } from './src/components/SelectSearch'
export { default as CustomKeyLabel } from './src/components/CustomKeyLabel'
export { default as PortalSpinner } from './src/components/PortalSpinner'
export { default as FileIcon } from './src/components/FileIcon'
export { default as CopyRight } from './src/components/CopyRight'
export { EduIf } from './src/components/ControlStatement/EduIf'
export { EduElse } from './src/components/ControlStatement/EduElse'
export { EduThen } from './src/components/ControlStatement/EduThen'
export { default as ComposeQuestion } from './src/components/ComposeQuestion'

// HOC
export { default as withWindowSizes } from './src/HOC/withWindowSizes'
export { default as withWindowScroll } from './src/HOC/withWindowScroll'
export { WithResources, useResources } from './src/HOC/withResources'
export { withMathFormula as WithMathFormula } from './src/HOC/withMathFormula'
export { default as withKeyboard } from './src/HOC/withKeyboard'
export { scrollTo, offset, isDOMElement } from './src/utils/DomUtils'
export {
  default as helpers,
  isMobileDevice,
  beforeUpload,
  uploadToS3,
  getSelection,
  clearSelection,
  highlightSelectedText,
  decodeHTML,
  hexToRGB,
  getAlpha,
  rgbToHex,
  formatBytes,
  measureText,
  templateHasImage,
  getImageDimensions,
  getImageUrl,
  getSelectionRect,
  getFormattedAttrId,
  toggleChatDisplay,
  sanitizeString,
  getSanitizedProps,
  isSEB,
  captureSentryException,
  handleChromeOsSEB,
  useLayoutEffectDebounced,
  getRangeAtFirst,
  replaceLatexTemplate,
  hasMediaDevice,
  isValidUpdate,
  removeTokenFromHtml,
  getYoutubeId,
  formatFileSize,
  triggerEvent,
} from './src/helpers'

// contexts
export { default as AnswerContext } from './src/contexts/AnswerContext'
export { default as LanguageContext } from './src/contexts/LanguageContext'
export { default as ScratchPadContext } from './src/contexts/ScratchPadContext'
export { default as ScrollContext } from './src/contexts/ScrollContext'
export { default as LCBScrollContext } from './src/contexts/LCBScrollContext'
export { default as HorizontalScrollContext } from './src/contexts/HorizontalScrollContext'
export { default as RefContext } from './src/contexts/RefContext'
export { default as PointBlockContext } from './src/contexts/PointBlockContext'
export { default as AssessmentPlayerContext } from './src/contexts/AssessmentPlayerContext'
export {
  default as QuestionContext,
  QuestionContextProvider,
} from './src/contexts/QuestionContext'

// custom hook
export { default as useRealtimeV2 } from './src/customHooks/useRealtimeV2'
export { default as useDisableDragScroll } from './src/customHooks/useDisableDragScroll'
export { default as measureTextWithImage } from './src/customHooks/measureTextWithImage'
export { default as useDropdownData } from './src/customHooks/useDropDownData'
export { default as useOfflinePagination } from './src/customHooks/useOfflinePagination'

// Mobile
export { MenuIcon } from './src/components/MenuIcon'

// Math Utils
export {
  getInnerValuesForStatic,
  reformatMathInputLatex,
  getMathHtml,
  removeLeadingAndTrailingNewlineChars,
} from './src/utils/mathUtils'

export {
  isValidDesmosState,
  getDesmosConfig,
  getStateName,
} from './src/utils/DesmosConfig'

export {
  default as ItemDetailContext,
  COMPACT,
  DEFAULT,
} from './src/contexts/ItemDetailContext'
export { default as questionTheme } from './src/themes/questionTheme'

// DragDrop includes DragItem, DropContainer, and DragPreview
export { default as DragDrop } from './src/components/DragDrop'
export { default as SimpleConfirmModal } from './src/components/SimpleConfirmModal'
export { default as PrintActionWrapper } from './src/components/PrintActionWrapper'
export { default as PremiumItemBanner } from './src/components/Banner/PremiumItemBanner'
export { default as showBlockerPopup } from './src/components/BlockerPopup'
