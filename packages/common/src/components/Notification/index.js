import React, { Fragment } from "react";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import i18n from "@edulastic/localization";
import { notification as antNotification } from "antd";
import "./notification.scss";

const defaultConf = {
  key: "",
  className: "customized-notifiction",
  message: "",
  description: "",
  type: "error",
  buttonLink: "",
  buttonText: "",
  showButton: false,
  onClose: () => null,
  onClick: () => null,
  placement: "bottomLeft",
  style: {
    width: "fit-content",
    minWidth: 120
  }
};

/**
 * @see https://ant.design/components/notification/
 * type is notification type.
 * messageKey is notification's message and description, we can get it from locales.
 * msg is custom message, if msg is passed, then will not use locales.
 * @param {{type?:String, messageKey: String, showButton?:boolean, msg?:String }} options
 */
const notification = options => {
  const { messageKey, msg, ...restOptions } = options;
  // get messages from localization
  const translatedMessage = msg || i18n.t(`notifications:${messageKey}.message`);
  const translatedDescription = msg ? "" : i18n.t(`notifications:${messageKey}.description`);

  const config = {
    ...defaultConf,
    ...restOptions,
    message: translatedMessage,
    description: translatedDescription
  };

  const { type, description, showButton, buttonLink, buttonText, ...rest } = config;

  const handlClickActionButton = () => {};

  const buttonProps = buttonLink
    ? {
        href: buttonLink,
        target: "_blank"
      }
    : {
        onClick: handlClickActionButton
      };
  if (antNotification[type]) {
    const messageTemplate = (
      <Fragment>
        {description ? <Description>{description}</Description> : <Fragment />}
        {showButton && <ActionButton {...buttonProps}>{buttonText}</ActionButton>}
      </Fragment>
    );
    antNotification[type]({
      description: messageTemplate,
      ...rest
    });
  }
};

const Description = styled.p`
  margin-top: 6px;
`;

const ActionButton = styled(EduButton)`
  height: 30px;
  width: 150px;
  margin-top: 20px;
  margin-left: 0px;
  padding: 0px;
`;

export default notification;
