import styled from "styled-components";
import { inputBorder, backgrounds, white } from "@edulastic/colors";
import { IconMinusRounded, IconPlusRounded } from "@edulastic/icons";

export const FroalaInput = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  border: 1px solid ${inputBorder};
  height: 40px;
  display: flex;
  padding: 5px 8px 0;
  background: ${backgrounds.primary};
  .fr-box {
    width: 100%;
  }
  [class^="fr-"] {
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Content = styled.div`
  position: relative;
  background: ${white};
  border-radius: 6px;
  font-size: 14px;
`;

export const IconMinus = styled(IconMinusRounded)`
  width: 16px;
  height: 16px;
`;

export const IconPlus = styled(IconPlusRounded)`
  width: 16px;
  height: 16px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const Popup = styled.div`
  position: absolute;
  left: ${props => (props.right ? "calc(100% + 20px)" : "unset")};
  right: ${props => (props.left ? "calc(100% + 20px)" : "unset")};
  top: 0;
  box-shadow: 2px 2px 8px #939495bf;
  border-radius: 6px;
  cursor: default;
  z-index: 10;

  :before {
    content: "";
    position: absolute;
    transform: rotate(45deg);
    border-radius: 4px;
    height: 20px;
    width: 20px;
    top: 10px;
    left: ${props => (props.right ? "-2px" : "calc(100% - 18px)")};
    background: ${white};
    box-shadow: 2px -1px 5px #939495bf;
  }
`;

export const ToolButton = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  box-shadow: 0px 2px 4px #c9d0dbd9;
  background-color: ${props => (props.selected ? "#878a91" : white)};
  color: ${props => (props.selected ? white : "#878a91")};
  cursor: pointer;
  font-size: 18px;
  font-weight: bolder;

  :active {
    background-color: #878a91;
    color: ${props => (props.selected ? white : "#878a91")};

    > svg {
      fill: ${white};
      :hover {
        fill: ${white};
      }
    }
  }

  > svg {
    fill: ${props => (props.selected ? white : "#878a91")};
    :hover {
      fill: ${props => (props.selected ? white : "#878a91")};
    }
  }
`;

export const Wrapper = styled.div`
  top: 20px;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 30;
  ${({ side }) => (side === "left" ? "left: 20px" : "right: 20px")};
`;
