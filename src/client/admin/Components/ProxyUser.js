// @ts-check
import React from "react";
import { Card, Input, Button, Layout } from "antd";
import { notification } from "@edulastic/common";
import styled from "styled-components";
import { proxyUser } from "../../author/authUtils";

const ProxyUser = () => {
  const [email, setEmail] = React.useState("");
  const [userId, setUserId] = React.useState("");

  const proxy = React.useCallback(
    (_email = undefined, _userId = undefined) => {
      const data = {};
      if (userId) {
        data.userId = _userId;
      } else if (email) {
        data.email = _email;
      } else {
        notification({ messageKey: "imageSizeError" });
        return;
      }

      proxyUser(data);
    },
    [email, userId]
  );

  return (
    <Layout.Content>
      <Card title="proxy user">
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <P>Or</P>
        <Input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User Id" />
        <StyledButton
          onClick={() => {
            proxy(email?.trim(), userId?.trim());
          }}
        >
          submit
        </StyledButton>
      </Card>
    </Layout.Content>
  );
};

// @ts-ignore
const StyledButton = styled(Button)`
  margin-top: 10px;
`;

const P = styled.p`
  text-align: center;
  font-weight: bold;
  padding: 8px;
`;

export default ProxyUser;
