import React, { useEffect } from "react";

// this component only checks whether user is a keyboard user or not
export default function CheckKeyboardUser() {
  // here keyCodes refer to tab,enter,space,left arrow,up arrow,right arrow,down arrow
  const keyCodes = [9, 13, 32, 37, 38, 39, 40];

  useEffect(() => {
    document.body.addEventListener("keydown", checkUser);
    function checkUser({ which: keycode }) {
      const isKeyboardUser = keyCodes.indexOf(keycode) !== -1;
      if (isKeyboardUser) {
        document.body.className += " isKeyboardUser";
        cleanUp();
      }
    }
    function cleanUp() {
      document.body.removeEventListener("keydown", checkUser);
    }
    return cleanUp;
  }, []);

  return null;
}
