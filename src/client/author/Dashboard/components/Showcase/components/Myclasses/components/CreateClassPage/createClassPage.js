import React from "react";
import { Icon } from "antd";

import { CreateCardBox, CreateClassButton, SyncClassDiv, SyncImg } from "./styled";
const CreateClassPage = () => {
  const createClassHandler = () => {
    console.log("create class");
  };

  return (
    <CreateCardBox>
      <CreateClassButton onClick={createClassHandler}>
        <Icon type="plus" />
        <p>create class</p>
      </CreateClassButton>
      <p>or</p>
      <SyncClassDiv>
        <SyncImg src="https://app.edulastic.com/webresources/images/google-classroom.png" width={35} />
        <p>Sync with google classroom</p>
      </SyncClassDiv>
    </CreateCardBox>
  );
};
export default CreateClassPage;
