import { separatorColor } from '@edulastic/colors';

export const themes = {
  default: {
    common: {
      addNewChoiceButtonFontFamily: 'Open Sans',
      addNewChoiceButtonFontSize: '11px',
      addNewChoiceButtonFontWeight: '600',
      addNewChoiceButtonFontStyle: 'normal',
      addNewChoiceButtonFontStretch: 'normal',
      addNewChoiceButtonBorderColor: '#12a6e8',
      addNewChoiceButtonColor: '#00b0ff',
      addNewChoiceButtonBgHoverColor: '#00b0ff',
      addNewChoiceButtonHoverColor: '#ffffff',
      addNewChoiceButtonBgActiveColor: '#59c7f9',
      addNewChoiceButtonActiveColor: '#eee',
      mathInputMathBorderColor: '#dfdfdf', // grey
      mathInputMathClearBgColor: '#fff', // white
      mathInputMathWrongBgColor: '#fbdfe7', // lightRed
      mathInputMathSuccessBgColor: '#e1fbf2', // lightGreen
      mathResponseEmbedFontSize: '10px',
      mathResponseEmbedCharBgColor: '#a3a0a0', // darkGrey
      mathResponseEmbedCharColor: '#fff', // white
      mathResponseEmbedCharBorderColor: '#dfdfdf', // grey
      mathResponseEmbedCharFontWeight: '700',
      mathResponseEmbedTextBgColor: '#fff', // white
      mathResponseEmbedTextBorderColor: '#dfdfdf', // grey
      mathResponseEmbedTextFontWeight: '900',
      pointBgColor: '#47525d',
      questionHeaderFontSize: '16px',
      questionHeaderSmallFontSize: '13px',
      questionHeaderColor: '#444444',
      subtitleFontSize: '14px',
      subtitleFontWeight: '600',
      subtitleFontStyle: 'normal',
      subtitleFontStretch: 'normal',
      subtitleColor: '#4aac8b', // greenDark
      toolbarBgColor: '#f3f3f3', // mainBgColor
      toolbarBorderColor: '#e6e6e6', // dashBorderColor
      triangleBorderLeftColor: 'transparent',
      triangleBorderRightColor: 'transparent',
      triangleBorderBottomColor: 'black'
    },
    dropZoneToolbar: {
      containerBgColor: '#e6e6e633', // dashBorderColorOpacity
      labelFontWeight: '600',
      labelFontSize: '13px',
      inputFontWeight: '400'
    },
    HOCwithPoints: {
      containerBgColor: '#f9f9f9' // lightGrey
    },
    keyboard: {
      buttonBgColor: '#dfdfdf', // grey
      buttonBgActiveClassColor: '#b6bac1',
      buttonBgHoverColor: '#e6e6e6', // dashBorderColor
      buttonBgActiveColor: '#fff', // white
      buttonColor: '#444444', // mainTextColor
      buttonFontSize: '16px',
      buttonFontWeight: '700',
      buttonBorderColor: '#fff' // white
    },
    mathEssayInput: {
      inputLineWrapperBorderColor: '#dfdfdf', // grey
      inputLineButtonFontSize: '14px',
      inputLineButtonBorderColor: '#12a6e8', // blue
      inputLineButtonBgHoverActiveClassColor: '#12a6e8', // blue
      inputLineButtonHoverActiveClassColor: '#fff', // white
      inputLineLabelBgColor: '#12a6e8', // blue
      inputLineLabelColor: '#fff', // white
      inputLineLabelFontSize: '10px',
      inputWrapperBorderColor: 'transparent',
      inputWrapperActiveClassBorderColor: '#12a6e8', // blue
      inputWrapperActiveClassBorderLeftColor: 'transparent',
      inputWrapperActiveClassBorderRightColor: 'transparent'
    },
    mathKeyboard: {
      keyboardBorderColor: '#b3b3b3',
      keyboardBgColor: '#fefefe',
      dropDownShadowColor: 'rgba(219, 219, 219, 0.55)',
      dropDownBgColor: '#ffffff',
      dropDownColor: '#434b5d',
      dropDownFontFamily: 'Open Sans',
      dropDownFontSize: '13px',
      dropDownFontWeight: '600',
      dropDownFontStyle: 'normal',
      dropDownFontStretch: 'normal',
      dropDownIconColor: '#51aef8',
      closeButtonBorderColor: '#d9d9d9',
      numBorderColor: 'white',
      numFontFamily: 'Open Sans',
      numFontSize: '16px',
      numFontWeight: '600',
      numFontStyle: 'normal',
      numFontStretch: 'normal',
      numColor: '#808080',
      numBgDisabledColor: '#fff', // white
      numBorderDisabledColor: '#fff', // white
      numBgActiveColor: '#fff', // white
      numBgHoverColor: '#dfdfdf', // grey
      numType1BgColor: '#e5e5e5',
      numType2BgColor: '#d1d1d1',
      numType3BgColor: '#d0edfd',
      numType3Color: '#808080'
    },
    numberPad: {
      itemBorderColor: '#dfdfdf', // grey
      itemColor: '#878282', // textColor
      itemBgColor: '#f9f9f9', // lightGrey
      itemBgHoverColor: '#dfdfdf', // grey
      itemBgActiveColor: '#fff', // white
      itemFontWeight: '700'
    },
    sortableList: {
      iconTrashColor: '#4aac8b', // greenDark
      iconTrashHoverColor: '#ee1658', // red
      iconTrashWrapperBgHoverColor: '#f9f9f9', // lightGrey
      itemContainerBorderColor: '#dfdfdf',
      dragIconColor: '#1fe3a1',
      dragIconFontSize: '16px',
      inputColor: '#7a7a7a',
      inputFontSize: '13px'
    },
    typedList: {
      iconTrashColor: '#4aac8b', // greenDark
      iconTrashHoverColor: '#ee1658', // red
      itemContainerBorderColor: '#dfdfdf',
      dragIconColor: '#1fe3a1',
      dragIconFontSize: '16px'
    },
    styledDropZone: {
      loadingIconFontSize: '100',
      iconUploadColor: '#e6e6e6', // dashBorderColor
      iconUploadDragActiveColor: '#00b0ff', // mainBlueColor
      containerColor: '#e6e6e6', // dashBorderColor
      containerDragActiveColor: '#00b0ff', // mainBlueColor
      zoneTitleFontSize: '16px',
      zoneTitleCommentFontSize: '11px',
      zoneTitleFontWeight: '900',
      zoneTitleColor: '#e6e6e6', // dashBorderColor
      zoneTitleAltColor: '#b1b1b1', // dropZoneTitleColor
      underlinedColor: '#00b0ff' // mainBlueColor
    },
    testItemPreview: {
      itemColBorderColor: '#f3f3f3', // mainBgColor
      mobileLeftSideBgColor: '#0288d1', // darkBlueSecondary
      mobileRightSideBgColor: '#0288d1', // darkBlueSecondary
      iconArrowColor: '#fff' // white
    },
    wordLimitAndCount: {
      labelFontSize: '13px',
      labelFontWeight: '600',
      labelColor: '#434b5d' // secondaryTextColor
    },
    correctAnswers: {
      iconPlusColor: '#fff', // white
      iconCloseColor: '#12a6e8', // blue
      iconCloseHoverColor: '#ee1658' // red
    },
    correctAnswerBoxLayout: {
      titleFontSize: '20px'
    },
    dropContainer: {
      isOverBorderColor: '#1fe3a1', // green
      isNotOverBorderColor: '#e6e6e6', // dashBorderColor
      noBorderColor: 'transparent'
    },
    dropArea: {
      iconTrashColor: '#4aac8b', // greenDark
      iconTrashHoverColor: '#ee1658', // red
      draggableDashedBorderColor: 'rgba(0, 0, 0, 0.65)',
      draggableSolidBorderColor: 'lightgray'
    },
    extras: {
      inputBorderColor: 'rgb(223, 223, 223)'
    },
    questionMetadata: {
      antButtonCircleBgColor: '#1fe3a1', // green
      antButtonCircleShadowColor: 'rgba(0, 0, 0, 0.16)',
      antSelectSelectionBgColor: 'transparent',
      antSelectSelectionChoiceBorderColor: '#444444',
      antSelectSelectionChoiceContentColor: '#434b5d',
      antSelectSelectionChoiceContentFontSize: '9px',
      antSelectSelectionChoiceContentFontWeight: 'bold',
      antSelectSelectionSelectedValueFontSize: '13px',
      antSelectSelectionSelectedValueFontWeight: '600',
      antSelectSelectionSelectedValueColor: '#434b5d',
      antSelectArrowIconColor: '#12a6e8', // blue
      curruculumNameFontWeight: 'bold',
      iconTrashColor: '#fff', // white
      iconPencilEditColor: '#fff', // white
      selectSuffixIconColor: '#12a6e8', // blue
      selectSuffixIconFontSize: '16px'
    },
    widgetOptions: {
      titleFontWeight: '600',
      blockBorderColor: '#d9d6d6',
      headingFontSize: '14px',
      headingFontWeight: '600',
      headingFontStyle: 'normal',
      headingFontStretch: 'normal',
      headingColor: '#4aac8b', // greenDark
      labelFontSize: '13px',
      labelFontWeight: '600',
      labelFontStyle: 'normal',
      labelFontStretch: 'normal',
      labelColor: '#434b5d',
      togglerBgColor: '#4aac8b', // greenDark
      togglerBgHoverColor: '#057750' // greenDarkSecondary
    },
    widgets: {
      classification: {
        subtitleFontSize: '13px',
        subtitleColor: '#434b5d', // secondaryTextColor
        previewSubtitleColor: '#4aac8b', // greenDark
        previewItemFontWeight: '600',
        separatorBorderColor: '#d6d0d0', // separatorColor
        boxBgColor: '#fff', // white
        boxBorderColor: '#dfdfdf', // grey
        indexBoxFontSize: '14px',
        indexBoxFontWeight: '600',
        indexBoxColor: '#fff', // white
        indexBoxBgColor: '#12a6e8', // blue
        indexBoxValidBgColor: '#1fe3a1', // green
        indexBoxNotValidBgColor: '#ee1658', // red
        dragItemBgColor: '#fff', // white
        dragItemValidBgColor: '#e1fbf2', // lightGreen
        dragItemNotValidBgColor: '#fbdfe7', // lightRed
        dragItemBorderColor: '#dfdfdf', // grey
        dragItemValidBorderColor: '#e1fbf2', // lightGreen
        dragItemNotValidBorderColor: '#fbdfe7', // lightRed
        dragItemFontWeight: '600',
        iconCheckColor: '#1fe3a1', // green
        iconCloseColor: '#ee1658', // red
        iconTrashColor: '#4aac8b', // greenDark
        iconTrashHoverColor: '#ee1658', // red
        dropContainerBgColor: '#fff' // white
      },
      clozeDragDrop: {
        editViewBgColor: 'white',
        previewTemplateBoxSmallFontSize: '14px',
        responseBoxBgColor: 'lightgray',
        iconPlusColor: '#fff', // white
        groupResponseFieldsetBorderColor: '#eee',
        addGroupButtonBgColor: '#12a6e8',
        responseContainerSmallBorderColor: '#e6e6e6',
        responseContainerBorderColor: 'black',
        groupDraggableBoxSmallFontSize: '10px',
        draggableIconFontSize: '12px',
        draggableBoxSmallFontSize: '11px',
        draggableBoxSmallFontWeight: '600',
        draggableBoxFontWeight: '300',
        deleteBgColor: 'lightgray',
        rightIconColor: '#1fe3a1', // green
        wrongIconColor: '#ee1658' // red
      },
      clozeDropDown: {
        editViewBgColor: 'white',
        previewTemplateBoxSmallFontSize: '14px',
        iconPlusColor: '#fff', // white
        deleteBgColor: 'lightgray',
        rightIconColor: '#1fe3a1', // green
        wrongIconColor: '#ee1658' // red
      },
      clozeImageDragDrop: {
        editViewBgColor: 'white',
        previewTemplateBoxSmallFontSize: '10px',
        iconPlusColor: '#fff', // white
        dropContainerDashedBorderColor: 'rgba(0, 0, 0, 0.65)',
        dropContainerSolidBorderColor: 'lightgray',
        dragItemBorderColor: 'lightgray',
        answerBorderColor: 'lightgray',
        responseBoxBgColor: 'lightgray',
        imageSettingsContainerBgColor: '#efefefc2',
        imageSettingsContainerFontSize: '13px',
        controlsBarBgColor: '#fbfafc',
        iconDrawResizeColor: '#4aac8b', // greenDark
        iconUploadColor: '#e6e6e6',
        colorBoxBgColor: 'white',
        draggableBoxSmallFontSize: '10px',
        dragItemIconFontSize: '12px',
        correctAnswerBoxTitleColor: '#444',
        correctAnswerBoxSubtitleColor: '#878282',
        correctAnswerBoxTextContainerFontWeight: 'bold',
        correctAnswerBoxTextContainerBgColor: 'white',
        rightIconColor: '#1fe3a1', // green
        wrongIconColor: '#ee1658' // red
      },
      clozeImageDropDown: {
        responseContainerDashedBorderColor: 'rgba(0, 0, 0, 0.65)',
        responseContainerSolidBorderColor: 'lightgray',
        iconPlusColor: '#fff', // white
        controlBarContainerBgColor: '#fbfafc',
        iconDrawResizeColor: '#4aac8b', // greenDark
        iconUploadColor: '#e6e6e6',
        antUploadHintColor: 'rgb(230, 230, 230)',
        antUploadTextColor: 'rgb(177, 177, 177)',
        previewTemplateBoxSmallFontSize: '10px',
        customQuilBorderColor: 'rgb(223, 223, 223)',
        pointsFontFamily: 'Open Sans',
        pointsFontSize: '11px',
        pointsFontWeight: '600',
        pointsColor: '#434b5d',
        maxRespCountColor: '#434b5d',
        maxRespCountFontWeight: '600',
        imageWidthColor: '#434b5d',
        imageWidthFontWeight: '600',
        imageFlexViewBorderColor: '#e6e6e6',
        imageFlexViewBgColor: 'white',
        formContainerBgColor: '#e6e6e63A',
        formContainerColor: '#434b5d',
        formContainerBorderColor: '#e6e6e6',
        formContainerFontSize: '13px',
        formContainerFontWeight: '600',
        editorContainerBgColor: 'white',
        editorContainerShadowColor: 'rgba(0, 0, 0, 0.1)',
        correctAnswerHeaderBgColor: '#e6e6e63A',
        correctAnswerHeaderColor: '#434b5d',
        correctAnswerHeaderFontFamily: 'Open Sans',
        correctAnswerHeaderFontSize: '13px',
        correctAnswerHeaderFontWeight: '600',
        controlButtonBgColor: 'transparent',
        controlButtonColor: '#434b5d',
        controlButtonNotDisabledBgColor: 'white',
        controlButtonNotDisabledShadowColor: 'rgba(0, 0, 0, 0.06)',
        controlButtonFontFamily: 'Open Sans',
        controlButtonFontSize: '14px',
        controlButtonFontWeight: '600',
        colorBoxBorderColor: '#e6e6e6',
        colorBoxBgColor: 'white',
        rightIconColor: '#1fe3a1', // green
        wrongIconColor: '#ee1658', // red
        antSelectSelectionBgColor: 'transparent',
        antSelectSelectionBorderColor: 'transparent',
        antSelectSelectionFontSize: '13px',
        antSelectSelectionFontWeight: '600',
        antSelectSelectionColor: '#434b5d',
        antIconDownColor: '#00b0ff',
        hrBorderColor: '#dfdfdf' // grey
      },
      clozeImageText: {
        responseContainerDashedBorderColor: 'rgba(0, 0, 0, 0.65)',
        responseContainerSolidBorderColor: 'lightgray',
        iconPlusColor: '#fff', // white
        controlBarContainerBgColor: '#fbfafc',
        iconDrawResizeColor: '#4aac8b', // greenDark
        iconUploadColor: '#e6e6e6',
        antUploadHintColor: 'rgb(230, 230, 230)',
        antUploadTextColor: 'rgb(177, 177, 177)',
        previewTemplateBoxSmallFontSize: '10px',
        customQuilBorderColor: 'rgb(223, 223, 223)',
        pointsFontFamily: 'Open Sans',
        pointsFontSize: '11px',
        pointsFontWeight: '600',
        pointsColor: '#434b5d',
        maxRespCountColor: '#434b5d',
        maxRespCountFontWeight: '600',
        imageWidthColor: '#434b5d',
        imageWidthFontWeight: '600',
        imageFlexViewBorderColor: '#e6e6e6',
        imageFlexViewBgColor: 'white',
        formContainerBgColor: '#e6e6e63A',
        formContainerColor: '#434b5d',
        formContainerBorderColor: '#e6e6e6',
        formContainerFontSize: '13px',
        formContainerFontWeight: '600',
        editorContainerBgColor: 'white',
        editorContainerShadowColor: 'rgba(0, 0, 0, 0.1)',
        correctAnswerHeaderBgColor: '#e6e6e63A',
        correctAnswerHeaderColor: '#434b5d',
        correctAnswerHeaderFontFamily: 'Open Sans',
        correctAnswerHeaderFontSize: '13px',
        correctAnswerHeaderFontWeight: '600',
        controlButtonBgColor: 'transparent',
        controlButtonColor: '#434b5d',
        controlButtonNotDisabledBgColor: 'white',
        controlButtonNotDisabledShadowColor: 'rgba(0, 0, 0, 0.06)',
        controlButtonFontFamily: 'Open Sans',
        controlButtonFontSize: '14px',
        controlButtonFontWeight: '600',
        colorBoxBorderColor: '#e6e6e6',
        colorBoxBgColor: 'white',
        rightIconColor: '#1fe3a1', // green
        wrongIconColor: '#ee1658' // red
      },
      clozeText: {
        editViewBgColor: 'white',
        previewTemplateBoxSmallFontSize: '14px',
        iconPlusColor: '#fff', // white
        deleteBgColor: 'lightgray',
        rightIconColor: '#1fe3a1', // green
        wrongIconColor: '#ee1658' // red
      },
      essayPlainText: {
        wordCountLimitedColor: '#ee1658', // red
        textInputBgColor: 'transparent',
        textInputLimitedBgColor: '#fbdfe7', // lightRed
        toolbarItemBgHoverColor: '#e6e6e6', // dashBorderColor
        toolbarItemBgActiveColor: '#f9f9f9' // lightGrey
      },
      essayRichText: {
        wordCountLimitedColor: '#ee1658', // red
        quillBgColor: 'transparent',
        quillLimitedBgColor: '#fbdfe7', // lightRed
        qlBlocksBgColor: '#fff', // white
        qlBlocksBgActiveColor: '#12a6e8', // blue
        qlBlocksColor: '#000', // black
        qlBlocksActiveColor: '#fff', // white
        flexConBorderColor: '#e6e6e6', // dashBorderColor
        dragHandleFontSize: '14px',
        dragHandleColor: '#1fe3a1', // green
        sortableItemFontSize: '16px'
      },
      matchList: {
        subtitleFontSize: '13px',
        subtitleColor: '#434b5d', // secondaryTextColor
        previewSubtitleColor: '#4aac8b' // greenDark
      },
      highlightImage: {
        subtitleFontSize: '13px',
        subtitleColor: '#434b5d' // secondaryTextColor
      },
      shortText: {
        subtitleFontSize: '13px',
        subtitleColor: '#434b5d' // secondaryTextColor
      },
      shading: {
        subtitleFontSize: '13px',
        subtitleColor: '#434b5d' // secondaryTextColor
      },
      hotspot: {
        subtitleFontSize: '13px',
        subtitleColor: '#434b5d' // secondaryTextColor
      }
    }
  }
};
