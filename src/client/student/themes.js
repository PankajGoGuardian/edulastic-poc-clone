import { themeColor, themeColorLighter, themeColorLight, themeColorBreadcrumb, title } from "@edulastic/colors";
import edulasticDefaultLogo from "./assets/logo.svg";

export const themeColorsMap = {
  MGLG: {
    themeColor: "#f1f1f1",
    themeSecondaryColor: "#969696",
    title: "Medium Gray on Light Gray"
  },
  BOR: {
    themeColor: "#ffd0ff",
    themeSecondaryColor: "#131313",
    title: "Black on Rose"
  },
  RCON: {
    themeColor: "#131313",
    themeSecondaryColor: "#ffffff",
    title: "Reverse Contrast"
  },
  YAB: {
    themeColor: "#003399",
    themeSecondaryColor: "#ffcc00",
    title: "Yello on Blue"
  }
};

const defaultTheme = {
  themeColor,
  themeColorLight,
  logo: edulasticDefaultLogo,
  logoBorderBottomColor: "#d9d6d6",
  headerBgColor: themeColor,
  headerClassTitleColor: "white",
  headerClassTitleFontSize: "13px",
  headerTitleTextColor: "white",
  headerBorderColor: "transparent",
  headerTitleFontSize: "22px",
  headerDropdownBgColor: "white",
  headerDropdownTextColor: "#444444",
  headerDropdownFontSize: "14px",
  filterButtonColor: themeColor,
  filterButtonActiveColor: "#ffffff",
  filterButtonBgColor: "#ffffff",
  filterButtonBgActiveColor: themeColor,
  filterButtonBorderColor: themeColor,
  filterButtonBorderActiveColor: themeColor,
  sectionBackgroundColor: "#f0f2f5",
  default: {
    confirmationPopupButtonBgColor: themeColor,
    confirmationPopupButtonBgHoverColor: "#ffffff",
    confirmationPopupButtonTextColor: themeColor,
    confirmationPopupButtonTextHoverColor: "#ffffff"
  },
  sideMenu: {
    logo: edulasticDefaultLogo,
    logoBorderBottomColor: "#d9d6d6",
    sidebarBgColor: "#fbfafc",
    sidebarTextColor: "#434b5d",
    helpButtonBgColor: "#ffffff",
    helpButtonBgHoverColor: themeColor,
    helpButtonFontSize: "14px",
    helpButtonTextColor: themeColorLighter,
    helpButtonTextHoverColor: "white",
    helpIconColor: themeColorLighter,
    helpIconHoverColor: "white",
    dropdownIconColor: "#333333",
    userInfoButtonBgColor: "#ffffff",
    userInfoNameTextColor: "#444444",
    userInfoNameFontSize: "14px",
    userInfoRoleTextColor: "#444444",
    userInfoRoleFontSize: "12px",
    userInfoDropdownBgColor: "#ffffff",
    userInfoDropdownItemBgColor: "#ffffff",
    userInfoDropdownItemBgHoverColor: "#f0f0f0",
    userInfoDropdownItemTextColor: "#444444",
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
  assignment: {
    cardContainerBgColor: "white",
    cardTitleColor: themeColor,
    cardTitleFontSize: "16px",
    cardTitleFontFamily: "Open Sans",
    cardTimeIconType: "clock-circle",
    cardTimeIconColor: "#ee1658",
    cardTimeTextFontSize: "13px",
    cardTimeTextColor: "#444444",
    cardSubmitLabelFontSize: "10px",
    cardSubmitLabelBgColor: "green",
    cardSubmitLabelTextColor: "#ffffff",
    cardInProgressLabelBorderColor: "#d2e2dd",
    cardInProgressLabelBgColor: "#daeee7",
    cardInProgressLabelTextColor: "#4aac8b",
    cardNotStartedLabelBorderColor: "#cbe5f0",
    cardNotStartedLabelBgColor: "#D1F9EB",
    cardNotStartedLabelTextColor: "#4AAC8B",
    cardSubmitedLabelBorderColor: "#dbcdf3",
    cardSubmitedLabelBgColor: "#eacbff",
    cardSubmitedLabelTextColor: "#7843a4",
    cardGradedLabelBgColor: "#a4d86b",
    cardGradedLabelTextColor: "#4b8211",
    cardGradedLabelBorderColor: "#4b8211",
    cardGradeHeldLabelBgColor: "#ffff66",
    cardGradeHeldLabelTextColor: "#000000",
    cardGradeHeldLabelBorderColor: "#000000",
    cardNotGradeLabelBgColor: "#ff6666",
    cardNotGradedLabelTextColor: "#ff0000",
    cardNotGradedLabelBorderColor: "#ff0000",
    cardMissedLabelBorderColor: "#d9d9d9",
    cardMissedLabelBgColor: "#efefef",
    cardMissedLabelTextColor: "#878282",

    cardAbsentLabelBorderColor: "#d9d9d9",
    cardAbsentLabelBgColor: "red",
    cardAbsentLabelTextColor: "white",

    cardDefaultBtnFontSize: "11px",
    cardDefaultBtnBgColor: "white",
    cardDefaultBtnBgHoverColor: themeColor,
    cardDefaultBtnTextColor: themeColor,
    cardDefaultBtnTextHoverColor: "white",
    cardAttemptLinkTextColor: themeColor,
    cardAttemptLinkFontSize: "12px",
    cardResponseBoxLabelsColor: "#434b5d",
    cardResponseBoxLabelsFontSize: "12px",
    cardAnswerAndScoreTextSize: "30px",
    cardAnswerAndScoreTextColor: "#434b5d",
    attemptsReviewRowBgColor: "#f8f8f8",
    attemptsReviewRowTextColor: "#9ca0a9",
    attemptsReviewRowFontSize: "12px",
    attemptsRowReviewLinkSize: "12px",
    attemptsRowReviewLinkColor: themeColorLight,
    helpTextColor: "#848993",
    helpHeadingTextColor: "#304050"
  },
  classboard: {
    headerContainerColor: themeColorLight,
    headerAnchorLink: themeColorLight,
    headerBarbgcolor: "lightgray",
    headerCheckboxColor: "#1890ffd9",
    headerButtonColor: themeColorLight,
    SwitchColorheaderListColor: "#037fc2",
    SortBarSelectionColor: "#434b5d",
    ScoreCardColor: "#565e6d",
    ScoreCardParaColor: "#57b495",
    ScoreParaColor: "#565e6d",
    ScoreProgressColor: "#565e6d",
    CardPageColor: "#1890ffd9",
    CardCircularColor: "#5cb497",
    CardSqurebgColor: "#1fe3a0",
    CardColor: "#e5e5e5",
    CardSqare: "#ee1b82",
    CardSquareDivColor: "#fdcc3a",
    CardDisneyColor: "#e1703e",
    SwitchColor: "#1fe3a0"
  },
  headerFilters: {
    headerFilterTextSize: "10px",
    headerFilterTextColor: themeColor,
    headerFilterBgColor: "#ffffff",
    headerFilterBgBorderColor: themeColor,
    headerFilterTextHoverColor: "#ffffff",
    headerFilterBgHoverColor: themeColor,
    headerFilterBgBorderHoverColor: themeColor,
    headerSelectedFilterTextColor: "white",
    headerSelectedFilterBgColor: themeColor,
    headerSelectedFilterBgBorderColor: themeColor
  },
  breadcrumbs: {
    breadcrumbTextColor: themeColorBreadcrumb,
    breadcrumbTextSize: "10px",
    breadcrumbLinkColor: themeColorLight
  },
  reportList: {
    reportListTitleColor: themeColor,
    reportListTitleTextSize: "16px",
    reportListBackButtonBgColor: "transparent",
    reportListBackButtonBgBorderColor: themeColorLight,
    reportListBackButtonTextColor: themeColorLight,
    reportListBackButtonBgHoverColor: themeColorLight,
    reportListBackButtonBgBorderHoverColor: "white",
    reportListBackButtonTextHoverColor: "white",
    reportListBackButtonTextSize: "0.7rem",
    reportListTotalScoreTextColor: "#434b5d",
    reportListTotalScoreTextSize: "1.5rem",
    reportListQuestionBorderColor: "#e61e54",
    reportListQuestionTextColor: "#444444",
    reportListQuestionTextSize: "14px",
    scoreBoxBorderBottomColor: "#434b5d",
    teacherFeedbarLabelColor: "#444444",
    teacherFeedbarLabelFontSize: "0.8rem",
    teacherFeedbarTextColor: "#878282",
    teacherFeedbarTextSize: "0.8rem",
    reportListAnswerLabelColor: "#444444",
    reportListAnswerLabelFontSize: "0.8rem"
  },
  skillReport: {
    skillReportTitleColor: "#4aac8b",
    skillReportTitleFontSize: "16px",
    RelationTitleColor: "#434b5d",
    RelationTitleFontSize: "14px",
    greenColor: "#1fe3a1",
    yellowColor: "#fdcc3b",
    redColor: "#ee1658",
    expandIconColor: "#4aac8b",
    collapseIconColor: "#4aac8b",
    gradeColumnTagBgColor: "#d7faee",
    gradeColumnTagColor: "#4aac8b",
    gradeColumnTagTextSize: "10px",
    tableHeaderBgColor: "#f5f9fe",
    tableHeaderTextColor: "#434b5d",
    tableHeaderHoverBgColor: "#f2f2f2",
    tableHeaderHoverTextColor: "#434b5d",
    tableHeaderTextSize: "13px",
    tableDataBgColor: "white",
    tableDataBgBorderColor: "#f8f8f8",
    tableDataTextColor: "rgba(0, 0, 0, 0.65)",
    tableDataFontSize: "13px"
  },
  manageClass: {
    manageClassBgColor: "#efefef",
    manageClassBgBorderColor: "#e9e9e9",
    NoDataArchiveTextColor: "#434b5d",
    NoDataArchiveTextSize: "17px",
    NoDataArchiveSubTextColor: "#434b5d",
    NoDataArchiveSubTextSize: "15px"
  },

  noData: {
    NoDataBgColor: "#efefef",
    NoDataBgBorderColor: "#e9e9e9",
    NoDataArchiveTextColor: "#434b5d",
    NoDataArchiveTextSize: "17px",
    NoDataArchiveSubTextColor: "#434b5d",
    NoDataArchiveSubTextSize: "15px"
  },
  classCard: {
    cardBg: "white",
    cardHeaderBorderColor: "#F1F1F1",
    cardTitleColor: themeColor,
    cardTitleTextSize: "14px",
    cardVisitClassBtnBgColor: "white",
    cardVisitClassBtnBgHoverColor: themeColor,
    cardVisitClassBtnTextColor: themeColor,
    cardVisitClassBtnTextHoverColor: "white",
    cardVisitClassBtnBorderColor: themeColor,
    cardVisitClassBtnTextSize: "11px",
    cardUserInfoLabelColor: "#AAAFB5",
    cardUserInfoLabelTextSize: "11px",
    cardUserInfoContentColor: "#4aac8b",
    cardActiveStatusBgColor: "rgba(0, 173, 80, .2)",
    cardActiveStatusTextColor: themeColor,
    cardActiveStatusTextSize: "10px",
    cardArchiveStatusBgColor: "rgba(0, 176, 255, 0.2)",
    cardArchiveStatusTextColor: "#0083be",
    cardArchiveStatusTextSize: "10px",
    cardInfoContentColor: title
  },
  profile: {
    userHeadingTextSize: "22px",
    userHeadingTextColor: title,
    userHeadingTextWeight: "bold",
    userSubTitleTextSize: "13px",
    userSubTitleTextColor: "#434b5d",
    uploadIconBgColor: "#1fe3a1",
    formInputLabelSize: "13px",
    formInputLabelColor: "rgba(0, 0, 0, 0.65)",
    saveButtonTextSize: "11px",
    saveButtonTextColor: "white",
    saveButtonBgColor: themeColor,
    saveButtonBorderColor: themeColor,
    cancelButtonTextColor: themeColor,
    cancelButtonBgColor: "white"
  },
  confirmation: {
    titleTextSize: "22px",
    titleColor: "#434b5d",
    descriptionTextSize: "13px",
    descriptionTextColor: "#434b5d",
    buttonTextSize: "11px",
    buttonBorderColor: themeColor,
    submitButtonTextColor: "#ffffff",
    submitButtonBgColor: themeColor,
    cancelButtonTextColor: themeColor,
    cancelButtonBgColor: "#ffffff"
  },
  attemptReview: {
    logoutIconColor: "#ffffff",
    logoutIconHoverColor: "#23e7ab",
    headingTextSize: "22px",
    headingColor: "#434b5d",
    titleDescriptionTextSize: "13px",
    titleDescriptionTextColor: "#434b5d",
    markedAnswerBoxColor: "#59abeb", // BlueColor
    markedSkippedBoxColor: "#b1b1b1", // GrayColor
    markedForReviewBoxColor: "#f8c165", // YellowColor
    descriptionTextSize: "12px",
    descriptionTextColor: "#878282",
    questiontextSize: "16px",
    questiontextColor: "#434b5d",
    shortDescriptionTextSize: "12px",
    shortDescriptionTextColor: "#1e1e1e",
    submitButtonTextSize: "11px",
    submitButtonBgColor: themeColor,
    submitButtonTextColor: "#ffffff"
  }
};

export const themes = {
  MGLG: {
    ...defaultTheme,
    themeColor: themeColorsMap.MGLG.themeColor,
    headerBgColor: themeColorsMap.MGLG.themeColor,
    headerClassTitleColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerTitleTextColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerBorderColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerTitleSecondaryTextColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerDropdownBgColor: themeColorsMap.MGLG.themeColor,
    headerDropdownTextColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerDropdownBorderColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerDropdownItemBgColor: themeColorsMap.MGLG.themeColor,
    headerDropdownItemBgHoverColor: "#e16c17",
    headerDropdownItemTextHoverColor: themeColorsMap.MGLG.themeSecondaryColor,
    headerDropdownItemBgSelectedColor: "#216e8b",
    headerDropdownItemTextSelectedColor: themeColorsMap.MGLG.themeSecondaryColor,
    sectionBackgroundColor: themeColorsMap.MGLG.themeColor,
    classCard: {
      ...defaultTheme.classCard,
      cardBg: themeColorsMap.MGLG.themeColor,
      cardTitleColor: themeColorsMap.MGLG.themeSecondaryColor,
      cardVisitClassBtnBgColor: themeColorsMap.MGLG.themeColor,
      cardVisitClassBtnBgHoverColor: themeColorsMap.MGLG.themeSecondaryColor,
      cardVisitClassBtnTextColor: themeColorsMap.MGLG.themeSecondaryColor,
      cardVisitClassBtnTextHoverColor: themeColorsMap.MGLG.themeColor,
      cardVisitClassBtnBorderColor: themeColorsMap.MGLG.themeColor,
      cardUserInfoLabelColor: themeColorsMap.MGLG.themeSecondaryColor,
      cardActiveStatusBgColor: themeColorsMap.MGLG.themeColor,
      cardActiveStatusTextColor: themeColorsMap.MGLG.themeSecondaryColor,
      cardArchiveStatusBgColor: themeColorsMap.MGLG.themeColor,
      cardInfoContentColor: themeColorsMap.MGLG.themeSecondaryColor
    },
    headerFilters: {
      ...defaultTheme.headerFilters,
      headerSelectedFilterBgColor: themeColorsMap.MGLG.themeSecondaryColor,
      headerFilterTextColor: themeColorsMap.MGLG.themeSecondaryColor,
      headerFilterBgBorderColor: themeColorsMap.MGLG.themeSecondaryColor,
      headerFilterBgHoverColor: themeColorsMap.MGLG.themeSecondaryColor,
      headerFilterBgBorderHoverColor: themeColorsMap.MGLG.themeSecondaryColor,
      headerFilterTextHoverColor: themeColorsMap.MGLG.themeColor,
      headerSelectedFilterTextColor: themeColorsMap.MGLG.themeColor
    },
    assignment: {
      ...defaultTheme.assignment,
      cardContainerBgColor: themeColorsMap.MGLG.themeColor,
      helpTextColor: themeColorsMap.MGLG.themeSecondaryColor,
      helpHeadingTextColor: themeColorsMap.MGLG.themeSecondaryColor
    },
    breadcrumbs: {
      ...defaultTheme.breadcrumbs,
      breadcrumbTextColor: themeColorsMap.MGLG.themeSecondaryColor,
      breadcrumbLinkColor: themeColorLight
    }
  },
  BOR: {
    ...defaultTheme,
    themeColor: themeColorsMap.BOR.themeColor,
    headerBgColor: themeColorsMap.BOR.themeColor,
    headerClassTitleColor: themeColorsMap.BOR.themeSecondaryColor,
    headerTitleTextColor: themeColorsMap.BOR.themeSecondaryColor,
    headerBorderColor: themeColorsMap.BOR.themeSecondaryColor,
    headerTitleSecondaryTextColor: themeColorsMap.BOR.themeSecondaryColor,
    headerDropdownBgColor: themeColorsMap.BOR.themeColor,
    headerDropdownTextColor: themeColorsMap.BOR.themeSecondaryColor,
    headerDropdownBorderColor: themeColorsMap.BOR.themeSecondaryColor,
    headerDropdownItemBgColor: themeColorsMap.BOR.themeColor,
    headerDropdownItemBgHoverColor: "#e16c17",
    headerDropdownItemTextHoverColor: themeColorsMap.BOR.themeSecondaryColor,
    headerDropdownItemBgSelectedColor: "#216e8b",
    headerDropdownItemTextSelectedColor: themeColorsMap.BOR.themeSecondaryColor,
    sectionBackgroundColor: themeColorsMap.BOR.themeColor,
    classCard: {
      ...defaultTheme.classCard,
      cardBg: themeColorsMap.BOR.themeColor,
      cardTitleColor: themeColorsMap.BOR.themeSecondaryColor,
      cardVisitClassBtnBgColor: themeColorsMap.BOR.themeColor,
      cardVisitClassBtnBgHoverColor: themeColorsMap.BOR.themeSecondaryColor,
      cardVisitClassBtnTextColor: themeColorsMap.BOR.themeSecondaryColor,
      cardVisitClassBtnTextHoverColor: themeColorsMap.BOR.themeColor,
      cardVisitClassBtnBorderColor: themeColorsMap.BOR.themeColor,
      cardUserInfoLabelColor: themeColorsMap.BOR.themeSecondaryColor,
      cardActiveStatusBgColor: themeColorsMap.BOR.themeColor,
      cardActiveStatusTextColor: themeColorsMap.BOR.themeSecondaryColor,
      cardArchiveStatusBgColor: themeColorsMap.BOR.themeColor,
      cardInfoContentColor: themeColorsMap.BOR.themeSecondaryColor
    },
    headerFilters: {
      ...defaultTheme.headerFilters,
      headerSelectedFilterBgColor: themeColorsMap.BOR.themeSecondaryColor,
      headerFilterTextColor: themeColorsMap.BOR.themeSecondaryColor,
      headerFilterBgBorderColor: themeColorsMap.BOR.themeSecondaryColor,
      headerFilterBgHoverColor: themeColorsMap.BOR.themeSecondaryColor,
      headerFilterBgBorderHoverColor: themeColorsMap.BOR.themeSecondaryColor,
      headerFilterTextHoverColor: themeColorsMap.BOR.themeColor,
      headerSelectedFilterTextColor: themeColorsMap.BOR.themeColor
    },
    assignment: {
      ...defaultTheme.assignment,
      cardContainerBgColor: themeColorsMap.BOR.themeColor,
      helpTextColor: themeColorsMap.BOR.themeSecondaryColor,
      helpHeadingTextColor: themeColorsMap.BOR.themeSecondaryColor
    },
    skillReport: {
      skillReportTitleColor: title,
      skillReportTitleFontSize: "22px",
      RelationTitleColor: "#434b5d",
      RelationTitleFontSize: "16px",
      greenColor: "#1fe3a1",
      yellowColor: "#fdcc3b",
      redColor: "#ee1658",
      expandIconColor: "#4aac8b",
      collapseIconColor: "#4aac8b",
      gradeColumnTagBgColor: "#d7faee",
      gradeColumnTagColor: "#4aac8b",
      gradeColumnTagTextSize: "10px",
      tableHeaderBgColor: "transparent",
      tableHeaderTextColor: "#AAAFB5",
      tableHeaderHoverBgColor: "transparent",
      tableHeaderHoverTextColor: "#434b5d",
      tableHeaderTextSize: "12px",
      tableDataBgColor: "#F8F8F8",
      tableDataBgBorderColor: "#f8f8f8",
      tableDataTextColor: title,
      tableDataFontSize: "13px"
    },
    breadcrumbs: {
      ...defaultTheme.breadcrumbs,
      breadcrumbTextColor: themeColorsMap.BOR.themeSecondaryColor,
      breadcrumbLinkColor: themeColorLight
    }
  },
  RCON: {
    ...defaultTheme,
    themeColor: themeColorsMap.RCON.themeColor,
    headerBgColor: themeColorsMap.RCON.themeColor,
    headerClassTitleColor: themeColorsMap.RCON.themeSecondaryColor,
    headerTitleTextColor: themeColorsMap.RCON.themeSecondaryColor,
    headerBorderColor: themeColorsMap.RCON.themeSecondaryColor,
    headerTitleSecondaryTextColor: themeColorsMap.RCON.themeSecondaryColor,
    headerDropdownBgColor: themeColorsMap.RCON.themeColor,
    headerDropdownTextColor: themeColorsMap.RCON.themeSecondaryColor,
    headerDropdownBorderColor: themeColorsMap.RCON.themeSecondaryColor,
    headerDropdownItemBgColor: themeColorsMap.RCON.themeColor,
    headerDropdownItemBgHoverColor: "#e16c17",
    headerDropdownItemTextHoverColor: themeColorsMap.RCON.themeSecondaryColor,
    headerDropdownItemBgSelectedColor: "#216e8b",
    headerDropdownItemTextSelectedColor: themeColorsMap.RCON.themeSecondaryColor,
    sectionBackgroundColor: themeColorsMap.RCON.themeColor,
    classCard: {
      ...defaultTheme.classCard,
      cardBg: themeColorsMap.RCON.themeColor,
      cardTitleColor: themeColorsMap.RCON.themeSecondaryColor,
      cardVisitClassBtnBgColor: themeColorsMap.RCON.themeColor,
      cardVisitClassBtnBgHoverColor: themeColorsMap.RCON.themeSecondaryColor,
      cardVisitClassBtnTextColor: themeColorsMap.RCON.themeSecondaryColor,
      cardVisitClassBtnTextHoverColor: themeColorsMap.RCON.themeColor,
      cardVisitClassBtnBorderColor: themeColorsMap.RCON.themeColor,
      cardUserInfoLabelColor: themeColorsMap.RCON.themeSecondaryColor,
      cardActiveStatusBgColor: themeColorsMap.RCON.themeColor,
      cardActiveStatusTextColor: themeColorsMap.RCON.themeSecondaryColor,
      cardArchiveStatusBgColor: themeColorsMap.RCON.themeColor,
      cardInfoContentColor: themeColorsMap.RCON.themeSecondaryColor
    },
    headerFilters: {
      ...defaultTheme.headerFilters,
      headerSelectedFilterBgColor: themeColorsMap.RCON.themeSecondaryColor,
      headerFilterTextColor: themeColorsMap.RCON.themeSecondaryColor,
      headerFilterBgBorderColor: themeColorsMap.RCON.themeSecondaryColor,
      headerFilterBgHoverColor: themeColorsMap.RCON.themeSecondaryColor,
      headerFilterBgBorderHoverColor: themeColorsMap.RCON.themeSecondaryColor,
      headerFilterTextHoverColor: themeColorsMap.RCON.themeColor,
      headerSelectedFilterTextColor: themeColorsMap.RCON.themeColor
    },
    assignment: {
      ...defaultTheme.assignment,
      cardContainerBgColor: themeColorsMap.RCON.themeColor,
      helpTextColor: themeColorsMap.RCON.themeSecondaryColor,
      helpHeadingTextColor: themeColorsMap.RCON.themeSecondaryColor
    },
    breadcrumbs: {
      ...defaultTheme.breadcrumbs,
      breadcrumbTextColor: themeColorsMap.RCON.themeSecondaryColor,
      breadcrumbLinkColor: themeColorLight
    }
  },
  YAB: {
    ...defaultTheme,
    themeColor: themeColorsMap.YAB.themeColor,
    headerBgColor: themeColorsMap.YAB.themeColor,
    headerClassTitleColor: themeColorsMap.YAB.themeSecondaryColor,
    headerTitleTextColor: themeColorsMap.YAB.themeSecondaryColor,
    headerBorderColor: themeColorsMap.YAB.themeSecondaryColor,
    headerTitleSecondaryTextColor: themeColorsMap.YAB.themeSecondaryColor,
    headerDropdownBgColor: themeColorsMap.YAB.themeColor,
    headerDropdownTextColor: themeColorsMap.YAB.themeSecondaryColor,
    headerDropdownBorderColor: themeColorsMap.YAB.themeSecondaryColor,
    headerDropdownItemBgColor: themeColorsMap.YAB.themeColor,
    headerDropdownItemBgHoverColor: "#e16c17",
    headerDropdownItemTextHoverColor: "#ffffff",
    headerDropdownItemBgSelectedColor: "#216e8b",
    headerDropdownItemTextSelectedColor: "#ffffff",
    sectionBackgroundColor: themeColorsMap.YAB.themeColor,
    classCard: {
      ...defaultTheme.classCard,
      cardBg: themeColorsMap.YAB.themeColor,
      cardTitleColor: themeColorsMap.YAB.themeSecondaryColor,
      cardVisitClassBtnBgColor: themeColorsMap.YAB.themeColor,
      cardVisitClassBtnBgHoverColor: themeColorsMap.YAB.themeSecondaryColor,
      cardVisitClassBtnTextColor: themeColorsMap.YAB.themeSecondaryColor,
      cardVisitClassBtnTextHoverColor: themeColorsMap.YAB.themeColor,
      cardVisitClassBtnBorderColor: themeColorsMap.YAB.themeColor,
      cardUserInfoLabelColor: themeColorsMap.YAB.themeSecondaryColor,
      cardActiveStatusBgColor: themeColorsMap.YAB.themeColor,
      cardActiveStatusTextColor: themeColorsMap.YAB.themeSecondaryColor,
      cardArchiveStatusBgColor: themeColorsMap.YAB.themeColor,
      cardInfoContentColor: themeColorsMap.YAB.themeSecondaryColor
    },
    headerFilters: {
      ...defaultTheme.headerFilters,
      headerSelectedFilterBgColor: themeColorsMap.YAB.themeSecondaryColor,
      headerFilterTextColor: themeColorsMap.YAB.themeSecondaryColor,
      headerFilterBgBorderColor: themeColorsMap.YAB.themeSecondaryColor,
      headerFilterBgHoverColor: themeColorsMap.YAB.themeSecondaryColor,
      headerFilterBgBorderHoverColor: themeColorsMap.YAB.themeSecondaryColor
    },
    assignment: {
      ...defaultTheme.assignment,
      cardContainerBgColor: "#003399",
      helpTextColor: themeColorsMap.YAB.themeSecondaryColor,
      helpHeadingTextColor: themeColorsMap.YAB.themeSecondaryColor
    },
    breadcrumbs: {
      ...defaultTheme.breadcrumbs,
      breadcrumbTextColor: themeColorsMap.YAB.themeSecondaryColor,
      breadcrumbLinkColor: themeColorLight
    }
  },
  default: defaultTheme
};
