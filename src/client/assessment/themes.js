import { themeColor, themeColorLight } from "@edulastic/colors";

export const themes = {
  default: {
    themeColor,
    themeColorLight,
    default: {
      // this default is required for Doc based asseeements
      headerBgColor: themeColor,
      sideToolbarBgColor: themeColor,
      dropdownHoverBorderColor: "rgba(255, 255, 255, 0.3)",
      dropdownCaretIconColor: themeColor,
      headerButtonBgColor: "rgba(255, 255, 255, 0.15)",
      headerButtonActiveBgColor: "rgba(255, 255, 255, 0.3)",
      headerButtonBgHoverColor: "rgba(255, 255, 255, 0.5)",
      headerButtonIconColor: "rgba(255, 255, 255, 0.75)",
      headerButtonIconActiveColor: "#ffffff",
      headerButtonBorderColor: "#F3F3F3"
    },
    header: {
      headerBgColor: themeColor, // greenDark
      headerTitleTextColor: "white",
      headerTitleFontSize: "22px"
    },
    sideMenu: {
      sidebarBgColor: "#fbfafc",
      sidebarTextColor: "#434b5d",
      helpButtonBgColor: "#ffffff",
      helpButtonBgHoverColor: themeColor,
      helpButtonFontSize: "14px",
      helpButtonTextColor: "#5EB500",
      helpButtonTextHoverColor: "white",
      helpIconColor: "#5EB500",
      helpIconHoverColor: "white",
      dropdownIconColor: "#333333",
      userInfoButtonBgColor: "#ffffff",
      userInfoNameTextColor: "#444444",
      userInfoNameFontSize: "14px",
      userInfoRoleTextColor: "#444444",
      userInfoRoleFontSize: "12px",
      userInfoDropdownBgColor: themeColor,
      userInfoDropdownItemBgColor: themeColor,
      userInfoDropdownItemBgHoverColor: "#fff",
      userInfoDropdownItemTextColor: "#fff",
      userInfoDropdownItemTextHoverColor: themeColor,
      itemIconColor: "#425066",
      userInfoDropdownItemFontSize: "14px",
      userInfoDropdownItemIconSize: "20px",
      menuItemBgColor: "transparent",
      menuSelectedItemBgColor: themeColor,
      menuItemLinkColor: "#434b5d",
      menuSelectedItemLinkColor: "white",
      menuItemLinkHoverColor: themeColor
    },
    checkbox: {
      checkboxBorderColor: "#f3f3f3",
      checkboxCheckedColor: themeColor,
      checkboxIntermediateColor: themeColor,
      checkboxLabelColor: themeColor
    },
    common: {
      addNewChoiceButtonFontFamily: "Open Sans",
      addNewChoiceButtonFontSize: "11px",
      addNewChoiceButtonFontWeight: "600",
      addNewChoiceButtonFontStyle: "normal",
      addNewChoiceButtonFontStretch: "normal",
      addNewChoiceButtonBorderColor: "#12a6e8",
      addNewChoiceButtonColor: "#fff",
      addNewChoiceButtonBgHoverColor: themeColorLight,
      addNewChoiceButtonHoverColor: "#ffffff",
      addNewChoiceButtonBgActiveColor: "#59c7f9",
      addNewChoiceButtonActiveColor: "#eee",
      mathInputMathBorderColor: "#dfdfdf", // grey
      mathInputMathClearBgColor: "#fff", // white
      mathInputMathWrongBgColor: "#fbdfe7", // lightRed
      mathInputMathSuccessBgColor: "#e1fbf2", // lightGreen
      mathResponseEmbedFontSize: "10px",
      mathResponseEmbedCharBgColor: "#a3a0a0", // darkGrey
      mathResponseEmbedCharColor: "#fff", // white
      mathResponseEmbedCharBorderColor: "#dfdfdf", // grey
      mathResponseEmbedCharFontWeight: "700",
      mathResponseEmbedTextBgColor: "#fff", // white
      mathResponseEmbedTextBorderColor: "#dfdfdf", // grey
      mathResponseEmbedTextFontWeight: "900",
      pointBgColor: "#47525d",
      questionHeaderFontSize: "16px",
      questionHeaderSmallFontSize: "13px",
      questionHeaderColor: "#444444",
      subtitleFontSize: "20px",
      subtitleFontWeight: "700",
      subtitleFontStyle: "normal",
      subtitleFontStretch: "normal",
      subtitleColor: "#434B5D", // greenDark
      toolbarBgColor: "#f3f3f3", // mainBgColor
      toolbarBorderColor: "#e6e6e6", // dashBorderColor
      triangleBorderLeftColor: "transparent",
      triangleBorderRightColor: "transparent",
      triangleBorderBottomColor: "black"
    },
    dropZoneToolbar: {
      containerBgColor: "#e6e6e633", // dashBorderColorOpacity
      labelFontWeight: "600",
      labelFontSize: "13px",
      inputFontWeight: "400"
    },
    HOCwithPoints: {
      containerBgColor: "#f9f9f9" // lightGrey
    },
    keyboard: {
      buttonBgColor: "#91D8FF", // grey
      buttonBgActiveClassColor: "#b6bac1",
      buttonBgHoverColor: "#e6e6e6", // dashBorderColor
      buttonBgActiveColor: "#fff", // white
      buttonColor: "#738C9F", // mainTextColor
      buttonFontSize: "16px",
      buttonFontWeight: "700",
      buttonBorderColor: "#fff" // white
    },
    mathEssayInput: {
      inputLineWrapperBorderColor: "#dfdfdf", // grey
      inputLineButtonFontSize: "14px",
      inputLineButtonBorderColor: themeColorLight,
      inputLineButtonBgHoverActiveClassColor: themeColorLight,
      inputLineButtonHoverActiveClassColor: "#fff", // white
      inputLineLabelBgColor: themeColorLight,
      inputLineLabelColor: "#fff", // white
      inputLineLabelFontSize: "10px",
      inputWrapperBorderColor: "transparent",
      inputWrapperActiveClassBorderColor: themeColorLight,
      inputWrapperActiveClassBorderLeftColor: "transparent",
      inputWrapperActiveClassBorderRightColor: "transparent"
    },
    mathKeyboard: {
      keyboardBorderColor: "#b3b3b3",
      keyboardBgColor: "#fefefe",
      dropDownShadowColor: "rgba(219, 219, 219, 0.55)",
      dropDownBgColor: "#ffffff",
      dropDownColor: "#434b5d",
      dropDownFontFamily: "Open Sans",
      dropDownFontSize: "13px",
      dropDownFontWeight: "600",
      dropDownFontStyle: "normal",
      dropDownFontStretch: "normal",
      dropDownIconColor: "#51aef8",
      closeButtonBorderColor: "#d9d9d9",
      numBorderColor: "white",
      numFontFamily: "Open Sans",
      numFontSize: "16px",
      numFontWeight: "600",
      numFontStyle: "normal",
      numFontStretch: "normal",
      numColor: "#808080",
      numBgDisabledColor: "#fff", // white
      numBorderDisabledColor: "#fff", // white
      numBgActiveColor: "#fff", // white
      numBgHoverColor: "#dfdfdf", // grey
      numType1BgColor: "#e5e5e5",
      numType2BgColor: "#d1d1d1",
      numType3BgColor: "#d0edfd",
      numType3Color: "#808080",
      numType4BgColor: "#91D8FF",
      numType4Color: "#738C9F",
      numType5BgColor: "#0EB08D",
      numType5Color: "#fff",
      numType6BgColor: "#50B29D",
      numType6Color: "#fff"
    },
    numberPad: {
      itemBorderColor: "#dfdfdf", // grey
      itemColor: "#fff", // textColor
      itemBgColor: "#0EB08D", // lightGrey
      itemBgHoverColor: "#dfdfdf", // grey
      itemBgActiveColor: "#fff", // white
      itemFontWeight: "700"
    },
    sortableList: {
      iconTrashColor: themeColor, // greenDark
      iconTrashHoverColor: "#ee1658", // red
      iconTrashWrapperBgHoverColor: "#f9f9f9", // lightGrey
      itemContainerBorderColor: "#dfdfdf",
      dragIconColor: "#1fe3a1",
      dragIconFontSize: "16px",
      inputColor: "#7a7a7a",
      inputFontSize: "13px"
    },
    typedList: {
      iconTrashColor: themeColor, // greenDark
      iconTrashHoverColor: "#ee1658", // red
      itemContainerBorderColor: "#dfdfdf",
      dragIconColor: "#1fe3a1",
      dragIconFontSize: "16px"
    },
    styledDropZone: {
      loadingIconFontSize: "100",
      iconUploadColor: "#e6e6e6", // dashBorderColor
      iconUploadDragActiveColor: themeColorLight, // headerGreen
      containerColor: "#e6e6e6", // dashBorderColor
      containerDragActiveColor: themeColorLight, // headerGreen
      zoneTitleFontSize: "16px",
      zoneTitleCommentFontSize: "11px",
      zoneTitleFontWeight: "900",
      zoneTitleColor: "#e6e6e6", // dashBorderColor
      zoneTitleAltColor: "#b1b1b1", // dropZoneTitleColor
      underlinedColor: themeColorLight // headerGreen
    },
    testItemPreview: {
      itemColBorderColor: "#f3f3f3", // mainBgColor
      mobileLeftSideBgColor: themeColor,
      mobileRightSideBgColor: themeColor,
      iconArrowColor: "#fff" // white
    },
    wordLimitAndCount: {
      labelFontSize: "13px",
      labelFontWeight: "600",
      labelColor: "#434b5d" // secondaryTextColor
    },
    correctAnswers: {
      iconPlusColor: "#fff", // white
      iconCloseColor: themeColorLight,
      iconCloseHoverColor: "#ee1658" // red
    },
    correctAnswerBoxLayout: {
      titleFontSize: "16px"
    },
    dropContainer: {
      isOverBorderColor: "#1fe3a1", // green
      isNotOverBorderColor: "#e6e6e6", // dashBorderColor
      noBorderColor: "transparent"
    },
    dropArea: {
      iconTrashColor: "#4aac8b", // greenDark
      iconTrashHoverColor: "#ee1658", // red
      draggableDashedBorderColor: "rgba(0, 0, 0, 0.65)",
      draggableSolidBorderColor: "lightgray"
    },
    extras: {
      inputBorderColor: "rgb(223, 223, 223)",
      inputBgColor: "white"
    },
    questionMetadata: {
      antButtonCircleBgColor: "#1fe3a1", // green
      antButtonCircleShadowColor: "rgba(0, 0, 0, 0.16)",
      antSelectSelectionBgColor: "#fff",
      antSelectSelectionChoiceBorderColor: "#444444",
      textColor: "#434b5d",
      antSelectSelectionChoiceContentColor: "#434b5d",
      antSelectSelectionChoiceContentFontSize: "11px",
      antSelectSelectionChoiceContentFontWeight: "bold",
      antSelectSelectionSelectedValueFontSize: "13px",
      antSelectSelectionSelectedValueFontWeight: "600",
      antSelectSelectionSelectedValueColor: themeColorLight,
      antSelectSelectionSelectedValueBackground: "#d1e3fc",
      containerBackground: "#f8f8fb",
      antSelectArrowIconColor: themeColorLight,
      curruculumNameFontWeight: "bold",
      iconTrashColor: "#4aac8b",
      iconHoverTrashColor: "#ee1658",
      iconPencilEditColor: "#fff", // white
      selectSuffixIconColor: themeColor,
      selectSuffixIconFontSize: "16px"
    },
    widgetOptions: {
      titleFontWeight: "600",
      blockBorderColor: "#d9d6d6",
      headingFontSize: "14px",
      headingFontWeight: "600",
      headingFontStyle: "normal",
      headingFontStretch: "normal",
      headingColor: "#4aac8b", // greenDark
      sectionHeadingFontSize: "20px",
      sectionHeadingFontWeight: "bold",
      sectionHeadingFontStyle: "normal",
      sectionHeadingFontStretch: "normal",
      sectionHeadingColor: "#434b5d", // secondaryTextColor
      labelFontSize: "13px",
      labelFontWeight: "600",
      labelFontStyle: "normal",
      labelFontStretch: "normal",
      labelColor: "#434b5d",
      togglerBgColor: "#4aac8b", // greenDark
      togglerBgHoverColor: "#057750" // greenDarkSecondary
    },
    widgets: {
      classification: {
        subtitleFontSize: "13px",
        subtitleColor: "#434b5d", // secondaryTextColor
        previewSubtitleColor: "#4aac8b", // greenDark
        previewItemFontWeight: "600",
        separatorBorderColor: "#d6d0d0", // separatorColor
        boxBgColor: "#fff", // white
        boxBorderColor: "#dfdfdf", // grey
        indexBoxFontSize: "14px",
        indexBoxFontWeight: "600",
        indexBoxColor: "#fff", // white
        indexBoxBgColor: themeColorLight,
        indexBoxValidBgColor: "#1fe3a1", // green
        indexBoxNotValidBgColor: "#ee1658", // red
        dragItemBgColor: "#fff", // white
        dragItemValidBgColor: "#e1fbf2", // lightGreen
        dragItemNotValidBgColor: "#fbdfe7", // lightRed
        dragItemBorderColor: "#dfdfdf", // grey
        dragItemValidBorderColor: "#e1fbf2", // lightGreen
        dragItemNotValidBorderColor: "#fbdfe7", // lightRed
        dragItemFontWeight: "600",
        iconCheckColor: "#1fe3a1", // green
        iconCloseColor: "#ee1658", // red
        iconTrashColor: themeColor, // greenDark
        iconTrashHoverColor: "#ee1658", // red
        dropContainerBgColor: "#fff" // white
      },
      clozeDragDrop: {
        editViewBgColor: "white",
        previewTemplateBoxSmallFontSize: "14px",
        responseBoxBgColor: "lightgray",
        iconPlusColor: "#fff", // white
        groupResponseFieldsetBorderColor: "#eee",
        addGroupButtonBgColor: "#12a6e8",
        responseContainerSmallBorderColor: "#e6e6e6",
        responseContainerBorderColor: "black",
        groupDraggableBoxSmallFontSize: "10px",
        draggableIconFontSize: "12px",
        draggableBoxSmallFontSize: "11px",
        draggableBoxSmallFontWeight: "600",
        draggableBoxFontWeight: "300",
        deleteBgColor: "lightgray",
        rightIconColor: "#1fe3a1", // green
        wrongIconColor: "#ee1658" // red
      },
      clozeDropDown: {
        editViewBgColor: "white",
        previewTemplateBoxSmallFontSize: "14px",
        iconPlusColor: "#fff", // white
        deleteBgColor: "lightgray",
        rightIconColor: "#84cd36", // green
        wrongIconColor: "#dd2e44" // red
      },
      clozeImageDragDrop: {
        editViewBgColor: "white",
        previewTemplateBoxSmallFontSize: "10px",
        iconPlusColor: "#fff", // white
        dropContainerDashedBorderColor: "rgba(0, 0, 0, 0.65)",
        dropContainerSolidBorderColor: "lightgray",
        dragItemBorderColor: "lightgray",
        answerBorderColor: "lightgray",
        responseBoxBgColor: "lightgray",
        imageSettingsContainerBgColor: "#efefefc2",
        imageSettingsContainerFontSize: "13px",
        controlsBarBgColor: "#fbfafc",
        iconDrawResizeColor: "#4aac8b", // greenDark
        iconUploadColor: "#e6e6e6",
        colorBoxBgColor: "white",
        draggableBoxSmallFontSize: "10px",
        dragItemIconFontSize: "12px",
        correctAnswerBoxTitleColor: "#444",
        correctAnswerBoxSubtitleColor: "#878282",
        correctAnswerBoxTextContainerFontWeight: "bold",
        correctAnswerBoxTextContainerBgColor: "white",
        rightIconColor: "#1fe3a1", // green
        wrongIconColor: "#ee1658" // red
      },
      clozeImageDropDown: {
        responseContainerDashedBorderColor: "rgba(0, 0, 0, 0.65)",
        responseContainerSolidBorderColor: "lightgray",
        iconPlusColor: "#fff", // white
        controlBarContainerBgColor: "#fbfafc",
        iconDrawResizeColor: "#4aac8b", // greenDark
        iconUploadColor: "#e6e6e6",
        antUploadHintColor: "rgb(230, 230, 230)",
        antUploadTextColor: "rgb(177, 177, 177)",
        previewTemplateBoxSmallFontSize: "10px",
        customQuilBorderColor: "rgb(223, 223, 223)",
        pointsFontFamily: "Open Sans",
        pointsFontSize: "11px",
        pointsFontWeight: "600",
        pointsColor: "#434b5d",
        maxRespCountColor: "#434b5d",
        maxRespCountFontWeight: "600",
        imageWidthColor: "#434b5d",
        imageWidthFontWeight: "600",
        imageFlexViewBorderColor: "#e6e6e6",
        imageFlexViewBgColor: "white",
        formContainerBgColor: "#e6e6e63A",
        formContainerColor: "#434b5d",
        formContainerBorderColor: "#e6e6e6",
        formContainerFontSize: "13px",
        formContainerFontWeight: "600",
        editorContainerBgColor: "white",
        editorContainerShadowColor: "rgba(0, 0, 0, 0.1)",
        correctAnswerHeaderBgColor: "#fff",
        correctAnswerHeaderColor: "#434b5d",
        correctAnswerHeaderFontFamily: "Open Sans",
        correctAnswerHeaderFontSize: "13px",
        correctAnswerHeaderFontWeight: "600",
        controlButtonBgColor: "transparent",
        controlButtonColor: "#434b5d",
        controlButtonNotDisabledBgColor: "white",
        controlButtonNotDisabledShadowColor: "rgba(0, 0, 0, 0.06)",
        controlButtonFontFamily: "Open Sans",
        controlButtonFontSize: "14px",
        controlButtonFontWeight: "600",
        colorBoxBorderColor: "#e6e6e6",
        colorBoxBgColor: "white",
        rightIconColor: "#1fe3a1", // green
        wrongIconColor: "#ee1658", // red
        antSelectSelectionBgColor: "transparent",
        antSelectSelectionBorderColor: "transparent",
        antSelectSelectionFontSize: "13px",
        antSelectSelectionFontWeight: "600",
        antSelectSelectionColor: "#434b5d",
        antIconDownColor: themeColorLight,
        hrBorderColor: "#dfdfdf" // grey
      },
      clozeImageText: {
        responseContainerDashedBorderColor: "rgba(0, 0, 0, 0.65)",
        responseContainerSolidBorderColor: "lightgray",
        iconPlusColor: "#fff", // white
        controlBarContainerBgColor: "#fbfafc",
        iconDrawResizeColor: "#4aac8b", // greenDark
        iconUploadColor: "#e6e6e6",
        antUploadHintColor: "rgb(230, 230, 230)",
        antUploadTextColor: "rgb(177, 177, 177)",
        previewTemplateBoxSmallFontSize: "10px",
        customQuilBorderColor: "rgb(223, 223, 223)",
        pointsFontFamily: "Open Sans",
        pointsFontSize: "11px",
        pointsFontWeight: "600",
        pointsColor: "#434b5d",
        maxRespCountColor: "#434b5d",
        maxRespCountFontWeight: "600",
        imageWidthColor: "#434b5d",
        imageWidthFontWeight: "600",
        imageFlexViewBorderColor: "#e6e6e6",
        imageFlexViewBgColor: "white",
        formContainerBgColor: "#e6e6e63A",
        formContainerColor: "#434b5d",
        formContainerBorderColor: "#e6e6e6",
        formContainerFontSize: "13px",
        formContainerFontWeight: "600",
        editorContainerBgColor: "white",
        editorContainerShadowColor: "rgba(0, 0, 0, 0.1)",
        correctAnswerHeaderBgColor: "#fff",
        correctAnswerHeaderColor: "#434b5d",
        correctAnswerHeaderFontFamily: "Open Sans",
        correctAnswerHeaderFontSize: "13px",
        correctAnswerHeaderFontWeight: "600",
        controlButtonBgColor: "transparent",
        controlButtonColor: "#434b5d",
        controlButtonNotDisabledBgColor: "white",
        controlButtonNotDisabledShadowColor: "rgba(0, 0, 0, 0.06)",
        controlButtonFontFamily: "Open Sans",
        controlButtonFontSize: "14px",
        controlButtonFontWeight: "600",
        colorBoxBorderColor: "#e6e6e6",
        colorBoxBgColor: "white",
        rightIconColor: "#1fe3a1", // green
        wrongIconColor: "#ee1658" // red
      },
      clozeText: {
        editViewBgColor: "white",
        previewTemplateBoxSmallFontSize: "14px",
        iconPlusColor: "#fff", // white
        deleteBgColor: "lightgray",
        rightIconColor: "#1fe3a1", // green
        wrongIconColor: "#ee1658" // red
      },
      essayPlainText: {
        wordCountLimitedColor: "#ee1658", // red
        textInputBgColor: "transparent",
        textInputLimitedBgColor: "#fbdfe7", // lightRed
        toolbarItemBgHoverColor: "#e6e6e6", // dashBorderColor
        toolbarItemBgActiveColor: "#f9f9f9" // lightGrey
      },
      essayRichText: {
        wordCountLimitedColor: "#ee1658", // red
        quillBgColor: "transparent",
        quillLimitedBgColor: "#fbdfe7", // lightRed
        qlBlocksFontFamily: "Arial",
        qlBlocksBgColor: "#fff", // white
        qlBlocksBgActiveColor: themeColorLight,
        qlBlocksColor: "#000", // black
        qlBlocksActiveColor: "#fff", // white
        flexConBorderColor: "#e6e6e6", // dashBorderColor
        dragHandleFontSize: "14px",
        dragHandleColor: "#1fe3a1", // green
        sortableItemFontSize: "16px"
      },
      shortText: {
        subtitleFontSize: "13px",
        subtitleColor: "#434b5d", // secondaryTextColor
        correctInputBgColor: "#e1fbf2", // lightGreen
        incorrectInputBgColor: "#fbdfe7", // lightRed
        smallStimFontSize: "14px",
        smallStimFontWeight: "400",
        smallStimBoldFontWeight: "600"
      },
      formulaEssay: {
        instructorStimulusBgColor: "#93d8f7" // lightBlue
      },
      mathFormula: {
        inputColor: "#fff",
        inputCorrectColor: "#D3FEA6",
        inputCorrectBorderColor: "#9cc658",
        inputIncorrectColor: "#FCE0E8",
        inputIncorrectBorderColor: "#f796b2",
        iconTrashColor: themeColor,
        iconTrashHoverColor: "#ee1658", // red
        quillBorderColor: "#dfdfdf", // grey
        iconCheckColor: "#63B808", // green
        iconCloseColor: "#DF394E", // red
        iconWrapperBgColor: "transparent",
        answerMethodContainerBorderColor: "#dfdfdf", // grey
        answerWrapperBgColor: "#93d8f7", // lightBlue
        answerBgColor: "#f9f9f9" // lightGrey
      },
      highlightImage: {
        subtitleFontSize: "13px",
        subtitleColor: "#434b5d", // secondaryTextColor
        textFontSize: "14px",
        textFontWeight: "600",
        styledSelectBgColor: "transparent",
        containerBgColor: "#e6e6e633", // dashBorderColorOpacity
        containerBorderColor: "#e6e6e6", // dashBorderColor
        buttonBgColor: "transparent",
        buttonColor: "#434b5d", // secondaryTextColor
        buttonHoverColor: "#4aac8b", // greenDark
        buttonSvgColor: "#434b5d", // secondaryTextColor
        buttonHoverSvgColor: "#4aac8b", // greenDark
        iconTrashColor: "#4aac8b", // greenDark
        iconTrashHoverColor: "#ee1658" // red
      },
      shading: {
        subtitleFontSize: "13px",
        subtitleColor: "#434b5d", // secondaryTextColor
        liIconFontSize: "20px",
        liIconFontFamily: "FontAwesome",
        liIconColor: "#fff", // white
        liBorderColor: "rgba(0, 176, 255, 1)", // svgMapStrokeColor
        liBorderHoverColor: "#434b5d", // secondaryTextColor
        correctLiBgColor: "#1fe3a1", // green
        incorrectLiBgColor: "#ee1658", // red
        lockedLiBgColor: "rgba(0, 176, 255, 0.19)", // svgMapFillColor
        liBgColor: "rgba(0, 176, 255, 0.19)", // svgMapFillColor
        liBgHoverColor: "transparent"
      },
      hotspot: {
        subtitleFontSize: "13px",
        subtitleColor: "#434b5d", // secondaryTextColor
        svgMapFillColor: "rgba(0, 176, 255, 0.19)", // svgMapFillColor
        svgMapStrokeColor: "rgba(0, 176, 255, 1)", // svgMapStrokeColor
        svgMapRightFillColor: "rgba(31, 227, 161, 0.19)", // svgMapFillColor
        svgMapRightStrokeColor: "rgba(31, 227, 161, 1)", // svgMapStrokeColor
        intersectStrokeColor: "#ee1658", // red
        intersectFillColor: "#fbdfe750",
        iconPlusColor: "#fff", // white
        iconCloseColor: themeColorLight,
        iconCloseHoverColor: "#ee1658", // red
        iconDrawColor: "#4aac8b", // greenDark
        iconTrashColor: "#4aac8b", // greenDark
        textFontFamily: "sans-serif",
        textFontWeight: "600",
        textFontSize: "14px",
        textFillColor: "#fff", // white
        sideBarBgColor: "#e6e6e633", // dashBorderColorOpacity
        containerBgColor: "#e6e6e633", // dashBorderColorOpacity
        containerBorderColor: "#e6e6e6", // dashBorderColor
        withShadowButtonActiveBgColor: "#fff", // white
        withShadowButtonBgColor: "transparent",
        withShadowButtonShadowColor: "rgba(0, 0, 0, 0.06)",
        buttonBgColor: "transparent",
        buttonColor: "#434b5d", // secondaryTextColor
        buttonHoverColor: "#4aac8b", // greenDark
        buttonSvgColor: "#434b5d", // secondaryTextColor
        buttonHoverSvgColor: "#4aac8b", // greenDark
        areaTextFontWeight: "600",
        areaTextFontSize: "14px"
      },
      tokenHighlight: {
        previewSmallFontSize: "11px",
        previewFontSize: "14px",
        correctResultBgColor: "#e1fbf2", // lightGreen
        incorrectResultBgColor: "#fbdfe7", // lightRed
        correctResultBorderColor: "#1fe3a1", // green
        incorrectResultBorderColor: "#ee1658", // red
        modeButtonColor: "#fff", // white
        modeButtonBorderColor: themeColorLight,
        modeButtonActiveBorderColor: "#1fe3a1", // green
        modeButtonBgColor: themeColorLight,
        modeButtonActiveBgColor: "#1fe3a1", // green
        containerBgColor: "#f9f9f9" // lightGrey
      },
      matchList: {
        subtitleFontSize: "13px",
        subtitleColor: "#434b5d", // secondaryTextColor
        previewSubtitleColor: "#4aac8b", // greenDark
        dragItemBgColor: "#fff", // white
        dragItemCorrectBgColor: "#e1fbf2", // lightGreen
        dragItemIncorrectBgColor: "#fbdfe7", // lightRed
        dragItemBorderColor: "#e6e6e6", // dashBorderColor
        dragItemColor: "#444444", // mainTextColor
        dragItemFontWeight: "600",
        groupSeparatorBorderColor: "#d6d0d0", // separatorColor
        separatorBorderColor: "#434b5d", // secondaryTextColor
        separatorBgColor: "#434b5d", // secondaryTextColor
        listItemFontWeight: "600",
        listItemColor: "#444444", // mainTextColor
        listItemBorderColor: "#e6e6e6", // dashBorderColor
        indexCorrectBgColor: "#1fe3a1", // green
        indexIncorrectBgColor: "#ee1658", // red
        indexColor: "#fff", // white
        indexFontWeight: "600",
        indexFontSize: "14px",
        corTitleFontWeight: "600",
        iconTrashColor: themeColor, // greenDark
        iconTrashHoverColor: "#ee1658", // red
        iconCheckColor: "#1fe3a1", // green
        iconCloseColor: "#ee1658" // red
      },
      matrixChoice: {
        quillBorderColor: "rgb(223, 223, 223)",
        inlineLabelColor: "#4aac8b", // greenDark
        correctCellInputWrapperBgColor: "#e1fbf2", // lightGreen
        incorrectCellInputWrapperBgColor: "#fbdfe7", // lightRed
        tableStyledHeaderColor: themeColor, // greenDark
        styledTableBorderColor: "#e8e8e8",
        styledTableThBgColor: "#fff" // white
      },
      multipleChoice: {
        iconPlusColor: "#fff", // white
        multiChoiceContentFontSize: "13px",
        multiChoiceContentFontWeight: "600",
        labelBorderColor: "transparent",
        labelBorderHoverColor: "#277DF1",
        labelCheckedBorderColor: "#c3c055",
        labelCheckedBgColor: "#fcfbd4",
        labelRightBorderColor: "#1fe3a1", // green
        labelRightBgColor: "#1fe3a11e",
        labelWrongBorderColor: "#ee1658",
        labelWrongBgColor: "#ee16581e",
        labelIconFontSize: "18px",
        labelIconCheckColor: "#1fe3a1", // green
        labelIconTimesColor: "#ee1658",
        checkboxContainerBorderColor: themeColor,
        checkboxContainerBgColor: "transparent",
        checkboxContainerSmallFontSize: "15px",
        checkboxContainerFontSize: "20px",
        checkboxContainerFontWeight: "700",
        checkboxContainerColor: "#444444",
        checkboxContainerCheckedColor: "white",
        checkboxContainerCheckedBgColor: themeColor,
        iconCheckColor: "#1fe3a1", // green
        iconCloseColor: "#ee1658" // red
      },
      orderList: {
        correctAnswerTextColor: "#000",
        textBorderColor: "#dfdfdf", // grey
        textSmallFontSize: "13px",
        textFontSize: "16px",
        questionTextFontSize: "16px",
        questionTextColor: "#878282", // textColor
        indexFontSize: "26px",
        indexFontWeight: "600",
        indexColor: "#444444", // mainTextColor
        incorrectIndexColor: "#878282", // textColor
        iconWrapperFontSize: "24px",
        correctAnswerItemBgColor: "#fff",
        correctAnswerItemBorderColor: "#878282", // textColor
        correctContainerBgColor: "#e1fbf2", // lightGreen
        incorrectContainerBgColor: "#fbdfe7", // lightRed
        correctContainerBorderColor: "#1fe3a1", // green
        incorrectContainerBorderColor: "#ee1658", // red
        correctIconWrapperColor: "#1fe3a1", // green
        incorrectIconWrapperColor: "#ee1658", // red
        iconCheckColor: "#1fe3a1", // green
        iconCloseColor: "#ee1658", // red
        dragHandleBorderColor: "#dfdfdf", // grey
        dragHandleIconContainerColor: "#1fe3a1", // green
        dragHandleIconContainerHoverColor: "#4aac8b", // greenDark
        dragHandleIconContainerSmallFontSize: "14px",
        dragHandleIconContainerFontSize: "25px"
      },
      sortList: {
        titleFontWeight: "600",
        titleFontSize: "13px",
        titleColor: "#434b5d", // secondaryTextColor
        iconArrowColor: "#1fe3a1", // green
        iconArrowHoverColor: "#4aac8b", // greenDark
        iconArrowSmallFontSize: "10px",
        iconArrowFontSize: "20px",
        correctAnswersItemBgColor: "#fff", // white
        correctAnswersItemFontWeight: "600",
        correctAnswersIndexBgColor: themeColorLight, // headerGreen
        correctAnswersIndexColor: "#fff", // white
        dragItemActiveBgColor: "#dfdfdf", // grey
        dragItemBgColor: "transparent",
        dragItemWithIndexFontSize: "26px",
        dragItemWithIndexFontWeight: "600",
        dragItemTextEmptyFontSize: "16px",
        dragItemTextEmptySmallFontSize: "13px",
        dragItemCorrectTextBorderColor: "#1fe3a1", // green
        dragItemIncorrectTextBorderColor: "#ee1658", // red
        dragItemCorrectTextBgColor: "#e1fbf2", // lightGreen
        dragItemIncorrectTextBgColor: "#fbdfe7", // lightRed
        dragItemTextFontSize: "16px",
        dragItemTextSmallFontSize: "13px",
        dragItemContainerBorderColor: "#dfdfdf", // grey
        iconCheckColor: "#1fe3a1", // green
        iconCloseColor: "#ee1658", // red
        styledDragHandleBorderColor: "#dfdfdf", // grey
        flexCenterFontWeight: "600",
        dragHandleContainerColor: "#1fe3a1", // green
        dragHandleContainerHoverColor: "#4aac8b", // greenDark
        dragHandleContainerSmallFontSize: "14px",
        dragHandleContainerFontSize: "25px",
        hrBorderColor: "#dfdfdf" // grey
      },
      passage: {
        quillBorderColor: "#d9d9d9",
        instructorStimulusBgColor: "#93d8f7", // lightBlue
        headingFontSize: "22px",
        headingFontWeight: "700"
      },
      chart: {
        bgColor: "#fff",
        axisLabelFontWeight: "bold",
        labelStrokeColor: "#42d184"
      },
      fractionEditor: {
        wrongColor: "#fce0e8",
        correctColor: "#D3FEA6"
      },
      graphPlacement: {
        dragDropTitleFontWeight: "700",
        dragDropTitleFontSize: "12px"
      },
      quadrants: {
        dragDropTitleFontWeight: "700",
        dragDropTitleFontSize: "12px"
      },
      axisLabels: {
        responseBoxTitleFontWeight: "700",
        responseBoxTitleFontSize: "12px"
      }
    }
  }
};
