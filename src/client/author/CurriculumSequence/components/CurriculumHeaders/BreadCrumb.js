import React, { Fragment } from "react";
import styled from "styled-components";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { SecondHeader } from "../../../TestPage/components/Summary/components/Container/styled";

const CurriculumBreadCrumb = ({ mode }) => {
  const playlistBreadcrumbData = [
    {
      title: "PLAYLIST",
      to: "/author/playlists"
    },
    {
      title: "REVIEW",
      to: ""
    }
  ];

  const isPlaylistDetailsPage = window.location?.hash === "#review";

  if (isPlaylistDetailsPage || mode === "embedded") {
    return (
      <ReviewBreadCrumbWrapper isPlaylistDetailsPage={isPlaylistDetailsPage}>
        <SecondHeader>
          <BreadCrumb data={playlistBreadcrumbData} style={{ position: "unset" }} />
        </SecondHeader>
      </ReviewBreadCrumbWrapper>
    );
  }

  return <Fragment />;
};

export default CurriculumBreadCrumb;

const ReviewBreadCrumbWrapper = styled.div`
  padding: ${({ isPlaylistDetailsPage }) => (isPlaylistDetailsPage ? "0px 0px 15px" : "15px 0px 15px")};
  width: 100%;
`;
