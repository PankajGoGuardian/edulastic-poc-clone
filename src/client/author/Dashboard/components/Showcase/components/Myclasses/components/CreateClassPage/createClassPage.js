import React from "react";
import { Icon } from "antd";
import { Link } from "react-router-dom";
import GoogleClassRoomImg from "../../../../../../assets/images/google-classroom.png";
import { CreateCardBox, CreateClassButton, SyncClassDiv, SyncImg } from "./styled";
const CreateClassPage = () => {
  return (
    <CreateCardBox>
      <Link to={"/author/manageClass/createClass"}>
        <CreateClassButton>
          <Icon type="plus" />
          <p>create class</p>
        </CreateClassButton>
      </Link>
      <p>or</p>
      <SyncClassDiv>
        <SyncImg src={GoogleClassRoomImg} width={35} />
        <p>Sync with google classroom</p>
      </SyncClassDiv>
    </CreateCardBox>
  );
};
export default CreateClassPage;
