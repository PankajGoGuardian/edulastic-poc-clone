import React, { useState } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import WidgetOptions from "../../../../containers/WidgetOptions";
import FontSizeSelect from "../../../../components/FontSizeSelect";
import OrientationSelect from "../../../../components/OrientationSelect";
import { Subtitle } from "../../../../styled/Subtitle";

import { FlexRow } from "./styled/FlexRow";
import { Flex } from "./styled/Flex";
import { Hr } from "./styled/Hr";

const AdvancedOptions = ({ t, onUiChange, item }) => {
  const [fontsize, setFontsize] = useState("normal");
  const [orientation, setOrientation] = useState("horizontal");

  return (
    <WidgetOptions item={item} title={t("common.options.title")}>
      <Hr />
      <Subtitle
        id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}
        style={{ padding: 0, marginBottom: 21 }}
      >
        {t("component.options.display")}
      </Subtitle>
      <FlexRow>
        <Flex flexDir="column">
          <FontSizeSelect
            data-cy="fontSize"
            value={fontsize}
            onChange={val => {
              onUiChange("fontsize", val);
              setFontsize(val);
            }}
          />
        </Flex>
        <Flex flexDir="column">
          <OrientationSelect
            data-cy="orientation"
            value={orientation}
            onChange={val => {
              onUiChange("orientation", val);
              setOrientation(val);
            }}
          />
        </Flex>
      </FlexRow>
    </WidgetOptions>
  );
};

AdvancedOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(AdvancedOptions);
