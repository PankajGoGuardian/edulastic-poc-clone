import React, { useEffect, useRef } from "react";
import { Icon } from "antd";
import SubTypeTag from "../SubTypeTag";

export const getDate = () => {
  const currentDate = new Date();
  const oneYearDate = new Date(new Date().setFullYear(currentDate.getFullYear() + 1));
  return {
    currentDate: currentDate.getTime(),
    oneYearDate: oneYearDate.getTime()
  };
};

// a custom effect which does not run after the initial render, but runs on every subsequent render
export function useUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

export function renderSubscriptionType(subscription = {}) {
  const { subType = "free", updatedSubTypeSuccess } = subscription;
  return (
    <>
      <SubTypeTag style={{ marginRight: "5px" }}>{subType}</SubTypeTag>
      {typeof updatedSubTypeSuccess === "undefined" ? null : (
        <Icon
          title={`Update ${updatedSubTypeSuccess ? "success" : "failed"}`}
          type={updatedSubTypeSuccess ? "check-circle" : "warning"}
        />
      )}
    </>
  );
}
