import { get, without, countBy } from "lodash";
import { createHmac } from "crypto-browserify";
import AppConfig from "../../../app-config";

const allowedRoles = ["teacher", "school-admin", "district-admin"];
const minFeatures = 5;

const getUserDetails = ({
  email,
  userName: username,
  role,
  orgData,
  districtId,
  clever = false,
  clever_district = false,
  gm = false,
  orgData: { districtName: district = "", districtState: state = "" }
}) => ({
  domain: window.document.domain,
  email,
  username,
  role,
  clever,
  clever_district,
  gm,
  groupId: districtId,
  schoolId: get(orgData, "schools[0]._id", ""),
  school: get(orgData, "schools[0].name", ""),
  districtId,
  district,
  state
});

const analyticsIdentify = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return;
  }
  if (user) {
    const {
      role = "",
      _id: userId,
      features = { premiumUser: false },
      firstName,
      lastName,
      orgData: { defaultGrades: [grade = "", ,] = [], defaultSubjects: [subject = "", ,] = [] }
    } = user;
    if (allowedRoles.includes(role) && window.analytics) {
      // Passing user_hash to have secure communication
      window.analytics.identify(
        userId,
        {
          ...getUserDetails(user),
          isV2User: true,
          grade,
          subject,
          name: without([firstName, lastName], undefined, null, "").join(" "),
          premium_user: (countBy(Object.values(features), Boolean).true || 0) > minFeatures
        },
        {
          Intercom: {
            hideDefaultLauncher: false,
            // Keep your secret key safe! Never commit it directly to your repository,
            // client-side code, or anywhere a third party can find it.
            // send it from backend ???
            user_hash: createHmac("sha256", AppConfig.segmentHashSecret)
              .update(userId)
              .digest("hex")
          }
        }
      );
    }
  }
};

const unloadIntercom = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return;
  }
  if (user) {
    const { role = "", _id: userId } = user;
    if (allowedRoles.includes(role) && window.analytics) {
      window.analytics.identify(
        userId,
        {},
        {
          Intercom: {
            hideDefaultLauncher: true,
            // Keep your secret key safe! Never commit it directly to your repository,
            // client-side code, or anywhere a third party can find it.
            // send it from backend ???
            user_hash: createHmac("sha256", AppConfig.segmentHashSecret)
              .update(userId)
              .digest("hex")
          }
        }
      );
    }
  }
};

export default {
  unloadIntercom,
  analyticsIdentify
};
