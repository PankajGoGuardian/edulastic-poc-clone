import React from "react";
import { Link } from "react-router-dom";
import {
  ClassCreateContainer,
  ButtonsContainer,
  CreateClassBtn,
  SyncClassDiv,
  SyncImg,
  IconEdit,
  IconQuestion
} from "./styled";
import GoogleClassRoomImg from "../../../Dashboard/assets/images/google-classroom.png";
import { Icon } from "antd";
const ClassCreatePage = ({ filterClass }) => {
  return (
    <>
      <ClassCreateContainer>
        {filterClass === "Archive Classes" ? (
          <span>-No archive classes yet-</span>
        ) : (
          <>
            <p>
              No Active classes yet. You are currently a teacher in{" "}
              <span>
                Bangalore International
                <IconEdit type="edit" />
              </span>
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
          </>
        )}
      </ClassCreateContainer>
      <div style={{ textAlign: "center", fontStyle: "italic" }}>
        <IconQuestion type="question-circle" />
        Learn more about <Link to={"/author/manageClass"}>class creation</Link> in our Help Center
      </div>
    </>
  );
};
export default ClassCreatePage;
