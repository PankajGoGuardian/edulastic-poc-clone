function parseLineAndPoint(response, type) {
  let str = "";
  // let res = String(response).split(",");
  if (type == "LineAndPoint3") {
    str = response[0];
    let n = str.indexOf(")");
    str = str.slice(0, n + 1);
  }

  return str;
}
