/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconHangouts = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 297" {...props}>
    <path
      className="a"
      d="M127.683 0C57.166 0 0 55.79 0 124.612s57.166 124.613 127.683 124.613l.271 46.913c65.606-37.27 128-87.019 128-171.526C255.954 55.791 198.2 0 127.683 0z"
    />
    <path
      className="b"
      fill-opacity=".21"
      d="M58.318 168.56l109.037 112.724l144.54-105.666l-104.454-93.92l-22.334 38.273z"
    />
    <path
      className="b"
      d="M207.125 128.105V81.7l-33.66 33.587v-21.42c0-9.039-7.395-16.434-16.434-16.434H72.015c-9.04 0-16.435 7.395-16.435 16.435v34.238h151.545z"
    />
    <path
      className="b"
      transform="translate(0, 250) scale(1, -1)"
      d="M207.125 128.105V81.7l-33.66 33.587v-21.42c0-9.039-7.395-16.434-16.434-16.434H72.015c-9.04 0-16.435 7.395-16.435 16.435v34.238h151.545z"
    />
  </SVG>
);

export default withIconStyles(IconHangouts);
