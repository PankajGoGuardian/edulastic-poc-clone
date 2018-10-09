import React, { Component } from "react";
import PropTypes from "prop-types";

import { OrderList } from "../OrderList";
import { MultipleChoice } from "../MultipleChoice";

export default class QuestionWrapper extends Component {
  render() {
    const { type, view, isNew, data, saveClicked } = this.props;
    console.log(data);
    return (
      <React.Fragment>
        {type === "orderList" &&
          data && (
            <OrderList
              view={view}
              saveClicked={saveClicked}
              smallSize={data.smallSize}
              initialData={data}
            />
          )}
        {type === "mcq" && (
          <MultipleChoice
            view={view}
            isNew={isNew}
            item={data}
            saveClicked={saveClicked}
            smallSize={data.smallSize}
          />
        )}
      </React.Fragment>
    );
  }
}

QuestionWrapper.propTypes = {
  type: PropTypes.oneOf(["orderList", "mcq"]),
  view: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  data: PropTypes.object,
  saveClicked: PropTypes.bool
};

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
  data: {},
  saveClicked: false
};
