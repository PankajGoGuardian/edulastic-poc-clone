import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";

import { withNamespaces } from "@edulastic/localization";

import CharacterMap from "./CharacterMap";
import NumberPadButton from "./NumberPadButton";
import { EmptyWrapper } from "../styled/EmptyWrapper";

const NumberPadItem = ({ item, onSelect, t, buttonStyle }) => {
  const [visible, setVisible] = useState(false);

  const isEmpty = label => label === "empty";

  return (
    <Popover
      content={<CharacterMap onClick={onSelect} buttonStyle={buttonStyle} />}
      title={t("component.options.characterMap")}
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      onVisibleChange={() => setVisible(!visible)}
      getPopupContainer={triggerNode => triggerNode.parentNode}
    >
      <NumberPadButton buttonStyle={buttonStyle} onClick={() => setVisible(!visible)}>
        {isEmpty(item.label) ? <EmptyWrapper>{item.label}</EmptyWrapper> : item.label}
      </NumberPadButton>
    </Popover>
  );
};

NumberPadItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(NumberPadItem);
