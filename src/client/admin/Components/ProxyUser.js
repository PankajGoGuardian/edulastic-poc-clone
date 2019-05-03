//@ts-check
import React from "react";
import { Card, Input, Button, Layout, message } from "antd";
import styled from "styled-components";
import { proxyUser } from "../../author/authUtils";

const ProxyUser = () => {
  const [email, setEmail] = React.useState("");
  const [userId, setUserId] = React.useState("");

  const proxy = React.useCallback(
    (email = undefined, userId = undefined) => {
      let data = {};
      if (userId) {
        data.userId = userId;
      } else if (email) {
        data.email = email;
      } else {
        message.error("Either email or userId is needed to proxy");
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
            proxy(email, userId);
          }}
        >
          submit
        </StyledButton>
      </Card>
    </Layout.Content>
  );
};
//@ts-ignore
const StyledButton = styled(Button)`
  margin-top: 10px;
`;
const P = styled.p`
  text-align: center;
  font-weight: bold;
  padding: 8px;
`;

export default ProxyUser;
