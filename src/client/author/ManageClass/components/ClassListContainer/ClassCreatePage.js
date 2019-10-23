import React from "react";
import { Link } from "react-router-dom";
import { ClassCreateContainer, ButtonsContainer, ThemeButton, SyncImg } from "./styled";
import { IconGoogleClassroom } from "@edulastic/icons";
import NoClassNotification from "../NoClassNotification";
const ClassCreatePage = ({ filterClass, recentInstitute = {} }) => {
  const { name } = recentInstitute;
  return (
    <>
      <ClassCreateContainer>
        {filterClass === "Archive Classes" ? (
          <NoClassNotification heading={"No archived classes"} description={"You have no archive classes available"} />
        ) : (
          <>
            <NoClassNotification
              heading={"No active classes"}
              description={`No active classes yet.You are currently a teacher in`}
              data={name}
            />
            <ButtonsContainer>
              <Link to={"/author/manageClass/createClass"}>
                <ThemeButton>create new class</ThemeButton>
              </Link>
              <ThemeButton>
                <IconGoogleClassroom width={20} height={20} />
                <span>Sync with google classroom</span>
              </ThemeButton>
            </ButtonsContainer>
          </>
        )}
      </ClassCreateContainer>
    </>
  );
};
export default ClassCreatePage;
