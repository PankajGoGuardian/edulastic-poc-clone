import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { Redirect } from "react-router-dom";
import { StyledH3 } from "../author/Reports/common/styled";
import { ConfirmationModal as KidModal } from "../author/src/components/common/ConfirmationModal";
import { getFromSessionStorage } from "../../../packages/api/src/utils/Storage";

const Kid = ({ redirectPath, location }) => {
  const [textCopied, setTextCopied] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // tokenKey is stored in the form => user:<user_id>:role:<role>
  let items = getFromSessionStorage("tokenKey");
  items = items ? items.split(":") : [];

  // set data to be displayed
  const displayData = {
    tid: getFromSessionStorage("tid") || "",
    kid: getFromSessionStorage("kid") || "",
    user: items.length > 0 && items[0] === "user" ? items[1] : "",
    role: items.length > 2 && items[2] === "role" ? items[3] : ""
  };

  const onCancelHandler = () => {
    setCancelled(true);
  };

  const copyToClipboard = containerId => {
    if (document.selection) {
      let range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(containerId));
      range.select().createTextRange();
      document.execCommand("copy");
      document.selection.empty();
    } else if (window.getSelection) {
      let range = document.createRange();
      range.selectNode(document.getElementById(containerId));
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      setTextCopied(true);
    }
  };

  const footer = [
    <Button onClick={() => copyToClipboard("debugData")}>Copy</Button>,
    textCopied ? <StyledAlert> Copied! </StyledAlert> : null
  ];

  return cancelled ? (
    <Redirect to={{ pathname: redirectPath, state: { from: location } }} />
  ) : (
    <KidModal
      textAlign="left"
      width="700px"
      modalWidth="250px"
      visible={true}
      footer={footer}
      onCancel={onCancelHandler}
    >
      <p id="debugData">
        <b>
          <pre>
            {[
              `{`,
              `  tid:\t"${displayData.tid}",`,
              `  kid:\t"${displayData.kid}",`,
              `  user:\t"${displayData.user}",`,
              `  role:\t"${displayData.role}"`,
              `}`
            ].join("\n")}
          </pre>
        </b>
      </p>
    </KidModal>
  );
};

export default Kid;

const StyledAlert = styled(StyledH3)`
  margin: 9px 20px 0px 20px;
`;
