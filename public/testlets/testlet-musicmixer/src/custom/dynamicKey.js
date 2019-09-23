var dynamic_key1, dynamic_key2, dynamic_key3;

function updateDynamicKey() {
  let flag = false;
  if (
    itemResponse["gtc-d001"] !== undefined &&
    itemResponse["gtc-d001"]["d001-ne-r2"] !== undefined &&
    itemResponse["gtc-d001"]["d001-ne-r3"] !== undefined &&
    itemResponse["gtc-d001"]["d001-ne-r4"] !== undefined
  ) {
    if (dynamic_key1 != itemResponse["gtc-d001"]["d001-ne-r2"]) {
      itemResponse["gtc-d001"]["d001-ne-r2"] = "(4," + itemResponse["gtc-d001"]["d001-ne-r2"] + ")";
      dynamic_key1 = itemResponse["gtc-d001"]["d001-ne-r2"];
      flag = true;
    }
    if (dynamic_key2 != itemResponse["gtc-d001"]["d001-ne-r3"]) {
      itemResponse["gtc-d001"]["d001-ne-r3"] = "(5," + itemResponse["gtc-d001"]["d001-ne-r3"] + ")";
      dynamic_key2 = itemResponse["gtc-d001"]["d001-ne-r3"];
      flag = true;
    }
    if (dynamic_key3 != itemResponse["gtc-d001"]["d001-ne-r4"]) {
      itemResponse["gtc-d001"]["d001-ne-r4"] = "(6," + itemResponse["gtc-d001"]["d001-ne-r4"] + ")";
      dynamic_key3 = itemResponse["gtc-d001"]["d001-ne-r4"];
      flag = true;
    }
  }
  if (flag) {
    messageController.sendResponse(itemResponse);
  }
}
