import React from "react";
import { Link } from "react-router-dom";
import { ClassCreateContainer, ButtonsContainer, CreateClassBtn, SyncClassDiv, SyncImg } from "./styled";
import GoogleClassRoomImg from "../../../Dashboard/assets/images/google-classroom.png";
import { Icon } from "antd";
const ClassCreatePage = () => {
  return (
    <>
      <ClassCreateContainer>
        <p>
          No classes yet. You are currently a teacher in <span>Bangalore International </span>
        </p>
        <ButtonsContainer>
          <Link to={"/author/manageClass/createClass"}>
            <CreateClassBtn>
              <Icon type="plus" />
              <p>Create new class</p>
            </CreateClassBtn>
          </Link>
          <p>or</p>
          <SyncClassDiv>
            <SyncImg src={GoogleClassRoomImg} width={35} />
            <p>Sync with google classroom</p>
          </SyncClassDiv>
        </ButtonsContainer>
      </ClassCreateContainer>
      <div style={{ textAlign: "center", fontStyle: "italic" }}>
        Learn more about <Link to={"/author/manageClass"}>class creation</Link> in our Help Center
      </div>
    </>
  );
};
export default ClassCreatePage;
