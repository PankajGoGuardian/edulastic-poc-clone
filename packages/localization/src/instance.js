/* eslint-disable global-require */
import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

const browserLocale = navigator.language || navigator.browserLanguage || (navigator.languages || ["en-us"])[0];
const locale = browserLocale.toLowerCase();

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    lng: locale,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    ns: ["default", "author", "student", "assessment", "common", "notifications"],
    defaultNS: "default",
    react: {
      wait: false,
      bindI18n: "languageChanged loaded",
      bindStore: "added removed",
      nsMode: "default"
    },
    resources: {
      en: {
        default: require("./locales/default/en"),
        author: require("./locales/author/en"),
        student: require("./locales/student/en"),
        assessment: require("./locales/assessment/en"),
        common: require("./locales/common/en"),
        profile: require("./locales/profile/en"),
        login: require("./locales/login/en"),
        header: require("./locales/header/en"),
        assignmentCard: require("./locales/assignmentCard/en"),
        sidemenu: require("./locales/sidemenu/en"),
        reports: require("./locales/reports/en"),
        manageClass: require("./locales/manageClass/en"),
        summary: require("./locales/summary/en"),
        classBoard: require("./locales/classboard/en"),
        manageDistrict: require("./locales/manageDistrict/en"),
        subscription: require("./locales/subscription/en"),
        customReports: require("./locales/customReport/en"),
        qtiimport: require("./locales/qtiImport/en"),
        notifications: require("./locales/notifications/en")
      }
    }
  });

export default i18n;
