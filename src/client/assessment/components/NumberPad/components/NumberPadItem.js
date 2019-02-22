import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";

import { withNamespaces } from "@edulastic/localization";

import CharacterMap from "./CharacterMap";
import NumberPadButton from "./NumberPadButton";

const NumberPadItem = ({ item, onSelect, t }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      content={<CharacterMap onClick={onSelect} />}
      title={t("component.options.characterMap")}
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={() => setVisible(!visible)}
    >
      <NumberPadButton onClick={() => setVisible(!visible)}>{item.label}</NumberPadButton>
    </Popover>
  );
};

NumberPadItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(NumberPadItem);
