import React from "react";
import { Modal, Button } from "antd";

const WarningModal = ({ visible = false, proceedPublish }) => {
  const Footer = () => (
    <div>
      <Button onClick={() => proceedPublish(false)}> Cancel </Button>
      <Button onClick={() => proceedPublish(true)}> Proceed </Button>
    </div>
  );

  return (
    <Modal visible={visible} footer={<Footer />}>
      Item is not associated with any standard. Would you like to continue?
    </Modal>
  );
};

export default WarningModal;
