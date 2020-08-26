import React from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";

import { ToolbarItem } from "../styled/ToolbarItem";
import CharacterMap from "../../../components/CharacterMap";

const Character = ({ characters, onSelect }) => (
  <Popover
    placement="bottomLeft"
    trigger="click"
    content={<CharacterMap characters={characters} onSelect={onSelect} style={{ zIndex: 1000 }} />}
  >
    <ToolbarItem>á</ToolbarItem>
  </Popover>
);

Character.propTypes = {
  onSelect: PropTypes.func.isRequired,
  characters: PropTypes.array.isRequired
};

export default Character;
