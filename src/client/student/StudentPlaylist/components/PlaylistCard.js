import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { Button } from "antd";
import { FlexContainer } from "@edulastic/common";
import { themeColor, white } from "@edulastic/colors";

const PlaylistCard = props => {

    const { history, data = {} } = props;

    const handleViewPlaylist = () => history?.push?.(`/home/playlist/${data?.playlistId}`);

    return (
      <ListContainer>
        <FlexContainer width="100%" alignItems="flex-start">
          <FlexContainer width="210px" justifyContent="center">
            <img width="150" height="100" src="https://cdn2.edulastic.com/default/default-test-1.jpg" />
          </FlexContainer>

          <FlexContainer flexDirection="column" width="100%" marginBottom="20px" justifyContent="flex-start" padding="2px 2px 2px 15px">
            <Link to={`/home/playlist/${data?.playlistId}`}><Title title="Playlist Title">{data?.title}</Title></Link>
            <Description>{data?.description}</Description>
          </FlexContainer>

          <FlexContainer width="200px">
            <ViewPlaylist onClick={handleViewPlaylist}>
              <i className="fa fa-eye" />View
            </ViewPlaylist>
          </FlexContainer>

        </FlexContainer>
      </ListContainer>
    );
};

export default withRouter(PlaylistCard);

const ListContainer = styled.div`
    width: 100%;
    min-height: 110px;
    border-bottom: 1px solid #e3e3e3;
    margin: 20px 10px;
    padding: 20px 10px;

    a{
        width: 100%;
    }

    img{
        border-radius: 8px;
        padding: 4px;
    }

    i{
        font-size: 18px;
        padding: 2px 12px 2px 2px;
        color: ${white};
    }
`;

const Title = styled.div`
    width: 100%;
    font-weight: 600;
    color: ${themeColor};
    font-size: 16px;
    margin: 4px 0;
`;

const Description = styled.div`
    width: 100%;
    margin: 2px 0;

`;

const ViewPlaylist = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${themeColor};
  border-color: ${themeColor};
  text-transform: uppercase;
  color: ${white};
  font-weight: 600;
  margin-top: 15px;

  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;
