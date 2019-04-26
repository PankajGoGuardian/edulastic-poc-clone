import styled from "styled-components";
import { Player as MediaPlayer } from "react-media-player";
import { fadedBlack } from "@edulastic/colors";

export const Player = styled(MediaPlayer)`
  background-color: ${fadedBlack};
`;
