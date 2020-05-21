import React, { Fragment } from "react";
import styled from "styled-components";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { SecondHeader } from "../../../TestPage/components/Summary/components/Container/styled";

const CurriculumBreadCrumb = () => {
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

  if (isPlaylistDetailsPage) {
    return (
      <ReviewBreadCrumbWrapper>
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
  padding: 0px 0px 15px;
  width: 100%;
`;
