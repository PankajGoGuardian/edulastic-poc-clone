import API from "./utils/API";

const api = new API();
const prefix = "/subscription";

const upgradeUsingLicenseKey = licenseKey =>
  api
    .callApi({
      url: `${prefix}/license/use`,
      method: "put",
      data: { license: licenseKey }
    })
    .then(result => result.data.result);

export default {
  upgradeUsingLicenseKey
};
