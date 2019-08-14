import { themeColor, themeColorLighter, themeColorLight, themeColorBreadcrumb, title } from "@edulastic/colors";
import edulasticDefaultLogo from "./assets/logo.svg";

export const themes = {
  default: {
    themeColor,
    themeColorLight,
    logo: edulasticDefaultLogo,
    logoBorderBottomColor: "#d9d6d6",
    headerBgColor: themeColor,
    headerClassTitleColor: "white",
    headerClassTitleFontSize: "13px",
    headerTitleTextColor: "white",
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
      attemptsRowReviewLinkColor: themeColorLight
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
      skillReportTitleColor: title,
      skillReportTitleFontSize: "22px",
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
      tableHeaderBgColor: "transparent",
      tableHeaderTextColor: "#AAAFB5",
      tableHeaderHoverBgColor: "transparent",
      tableHeaderHoverTextColor: "#434b5d",
      tableHeaderTextSize: "12px",
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
  }
};
