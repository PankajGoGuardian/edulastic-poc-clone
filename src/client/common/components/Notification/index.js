import { notification } from "antd";
import { EduButton } from "@edulastic/common";

export const notificationMessage = ({
  title = "",
  message = "",
  showButton = false,
  buttonLink = "",
  buttonText = "",
  notificationPosition = "bottomRight",
  notificationKey = "",
  onCloseNotification,
  onButtonClick
}) => {
  notification.open({
    key: notificationKey,
    message: title,
    description: (
      <div>
        <p style={{ "margin-top": "10px" }}>{message}</p>
        {showButton && (
          <EduButton
            height="30px"
            width="150px"
            href={buttonLink}
            target="_blank"
            style={{
              "margin-top": "20px",
              "margin-left": "0px"
            }}
          >
            {buttonText}
          </EduButton>
        )}
      </div>
    ),
    placement: notificationPosition,
    top: 70,
    duration: 0,
    onClose: () => onCloseNotification(),
    onClick: () => onButtonClick()
  });
};
