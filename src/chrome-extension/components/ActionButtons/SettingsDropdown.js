import React from "react";
import SkinToneSelector from "./SkinToneSelector";
import { EMOJI } from "../../constants";
import { Dropdown } from "./styled";

const Reaction = ({ emoji, label }) => (
  <div classNameName="dropdown-outer" role="button">
    <div classNameName="dropdown-item" title={label}>
      {EMOJI[emoji]}
    </div>
  </div>
    );

const SettingsDropdown = () => (
  <Dropdown>
    <SkinToneSelector />
  </Dropdown>
    );

export default SettingsDropdown;

