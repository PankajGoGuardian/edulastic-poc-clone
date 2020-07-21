//@ts-check
import { userApi, TokenStorage } from "@edulastic/api";
import { message } from "antd";
import { FlexContainer,notification } from "@edulastic/common";

export async function proxyUser({ userId, email, groupId, currentUser = {} }) {
  const result = await userApi.getProxyUser({ userId, email, groupId });
  if (result.result?._id && result.result?.role) {
    TokenStorage.storeAccessToken(result.result.token, result.result._id, result.result.role);
    TokenStorage.storeInLocalStorage("proxyParent", JSON.stringify(currentUser));
    window.open(
      `${location.protocol}//${location.host}/?userId=${result.result._id}&role=${result.result.role}`,
      "_blank"
    );
  } else {
    notification({ messageKey:"someErrorOccuredDuringProxying" });
  }
}

export async function switchRole(role) {
  const result = await userApi.getSwitchedToken(role);
  console.log("switch role user", result);
  if (result.result) {
    TokenStorage.storeAccessToken(result.result.token, result.result.userId, result.result.role);
    window.open(
      `${location.protocol}//${location.host}/?userId=${result.result.userId}&role=${result.result.role}`,
      "_blank"
    );
  } else {
    notification({ messageKey:"someErrorOccuredDuringSwitchingRole"});
  }
}

export async function switchUser(switchToId, personId) {
  const result = await userApi.getSwitchUser(switchToId, personId);
  if (result.result) {
    TokenStorage.storeAccessToken(result.result.token, result.result._id, result.result.role);
    window.open(
      `${location.protocol}//${location.host}/?userId=${result.result._id}&role=${result.result.role}`,
      "_blank"
    );
  } else {
    notification({ messageKey:"ErrorOccuredSwicthingRole"});
  }
}

window["proxyUser"] = proxyUser;
window["switchRole"] = switchRole;
window["switchUser"] = switchUser;
