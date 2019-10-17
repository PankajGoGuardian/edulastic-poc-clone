import { get, without, countBy } from "lodash";
import { createHmac } from "crypto-browserify";

const allowedRoles = ["teacher", "school-admin", "district-admin"];
const minFeatures = 5;
const isSegmentEnabled = process.env.POI_APP_ENABLE_SEGMENT === "true";

const getUserDetails = ({
  email,
  userName: username,
  role,
  orgData,
  districtId,
  orgData: { districtName: district = "", districtState: state = "" }
}) => ({
  domain: window.document.domain,
  email,
  username,
  role,
  schoolId: get(orgData, "schools[0]._id", ""),
  school: get(orgData, "schools[0].name", ""),
  districtId,
  district,
  state
});

const analyticsIdentify = ({ user }) => {
  if (!isSegmentEnabled) {
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
            user_hash: createHmac("sha256", "fFVeUFIXqHL8U7snPw-Ds_Qe9v7qPKDgO-F1B36A")
              .update(userId)
              .digest("hex")
          }
        }
      );
    }
  }
};

const unloadIntercom = ({ user }) => {
  if (!isSegmentEnabled) {
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
            user_hash: createHmac("sha256", "fFVeUFIXqHL8U7snPw-Ds_Qe9v7qPKDgO-F1B36A")
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
