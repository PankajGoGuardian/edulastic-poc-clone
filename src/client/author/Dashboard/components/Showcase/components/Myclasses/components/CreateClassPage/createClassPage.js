import React from "react";
import { Icon } from "antd";
import GoogleClassRoomImg from "../../../../../../assets/images/google-classroom.png";
import { CreateCardBox, CreateClassButton, SyncClassDiv, SyncImg } from "./styled";
const CreateClassPage = () => {
  const createClassHandler = () => {
    console.log("Navigate to create class page after manage class routing is complete");
  };

  return (
    <CreateCardBox>
      <CreateClassButton onClick={createClassHandler}>
        <Icon type="plus" />
        <p>create class</p>
      </CreateClassButton>
      <p>or</p>
      <SyncClassDiv>
        <SyncImg src={GoogleClassRoomImg} width={35} />
        <p>Sync with google classroom</p>
      </SyncClassDiv>
    </CreateCardBox>
  );
};
export default CreateClassPage;
