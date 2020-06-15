import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { Stimulus } from "@edulastic/common";
import React from "react";
import PropTypes from "prop-types";
import { Subtitle } from "../../styled/Subtitle";

const TextContentPreview = ({ item, showQuestionNumber }) => (
  <div>
    <div>
      {showQuestionNumber && <div>{item.qLabel}:</div>}
      {item.heading && (
        <Subtitle
          titleStyle={{ maxWidth: "100%", margin: "0 0 20px" }}
          showIcon={false}
          id={getFormattedAttrId(`${item?.title}-${item.heading}`)}
        >
          {item.heading}
        </Subtitle>
      )}
      {item.content && (
        <Stimulus style={{ padding: "0 0px 0 20px" }} dangerouslySetInnerHTML={{ __html: item.content }} />
      )}
    </div>
  </div>
);

TextContentPreview.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  showQuestionNumber: PropTypes.bool
};

TextContentPreview.defaultProps = {
  showQuestionNumber: false
};

export default TextContentPreview;
