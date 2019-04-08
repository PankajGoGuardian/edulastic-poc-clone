/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFilter = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path d="M20 36h8v-4h-8v4zm-14-24v4h36v-4h-36zm6 14h24v-4h-24v4z" />
    <path d="M0 0h48v48h-48z" fill="none" />
  </SVG>
);

export default withIconStyles(IconFilter);
