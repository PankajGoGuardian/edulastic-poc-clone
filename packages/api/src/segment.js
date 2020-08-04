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
  clever = false,
  clever_district = false,
  gm = false,
  orgData: { districts = [] }
}) => {
  // setting first district details for student other user role will have only one district
  const { districtId = "", districtName: district="", districtState: state="", v1Id} = districts?.[0] || {};
  const schoolId = get(orgData, "schools[0].v1Id", "") || get(orgData, "schools[0]._id", "");
  return {
    domain: window.document.domain,
    email,
    username,
    role,
    clever,
    clever_district,
    gm,
    // this is not Groups._id
    // https://segment.com/docs/connections/spec/group/
    // its districtId
    groupId: v1Id || districtId,
    schoolId,
    school: get(orgData, "schools[0].name", ""),
    districtId: v1Id || districtId,
    district,
    state
  }
};

const analyticsIdentify = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return;
  }
  if (user) {
    const {
      role = "",
      _id,
      v1Id,
      features = { premiumUser: false },
      firstName,
      lastName,
      orgData: { defaultGrades: [grade = "", ,] = [], defaultSubjects: [subject = "", ,] = [] }
    } = user;
    const userId = v1Id || _id;
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
              .update(userId.toString())
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
    const { role = "", _id, v1Id } = user;
    const userId = v1Id || _id;
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
              .update(userId.toString())
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
