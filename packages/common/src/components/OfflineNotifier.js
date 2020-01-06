import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const OfflineNotifier = () => {
  const [isOffline, setOffline] = useState(false);
  const [isBackOnline, setIsBackOnline] = useState(false);

  useEffect(() => {
    window.addEventListener("offline", () => setOffline(true));
    window.addEventListener("online", () => {
      setIsBackOnline(true);
      setTimeout(() => {
        setOffline(false);
        setIsBackOnline(false);
      }, 2000);
    });
  }, []);

  return isOffline ? (
    isBackOnline ? (
      <ConnectedAlert>Connected</ConnectedAlert>
    ) : (
      <NoInternetAlert>
        <div>No Internet Connection</div>
        <Spinner>
          {[...new Array(12)].map(o => (
            <div />
          ))}
        </Spinner>
      </NoInternetAlert>
    )
  ) : null;
};

export default OfflineNotifier;

const keyFrameExampleOne = keyframes`
  0% {
    top:0;
  }
  100% {
    top: 10px;
  }
`;

const NoInternetAlert = styled.div`
  position: fixed;
  background-color: #ffcaca;
  top: 10px;
  z-index: 99999;
  color: red;
  text-align: center;
  font-size: 12px;
  width: 330px;
  border-radius: 6px;
  transform: translateX(-50%);
  left: 50%;
  padding: 5px;
  box-shadow: 1px 3px 6px 2px rgba(249, 106, 106, 0.5);
  animation: ${keyFrameExampleOne} 0.25s ease-in-out 0s;
`;

const ConnectedAlert = styled(NoInternetAlert)`
  background: #28c134;
  color: white;
  width: 180px;
  box-shadow: 0px 4px 8px 2px rgba(0, 128, 0, 0.3);
`;

const Spinner = styled.div`
  display: inline-block;
  position: absolute;
  right: 120px;
  top: -26px;
  div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
  }
  div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 30px;
    left: 40px;
    width: 1px;
    height: 6px;
    border-radius: 20%;
    background: red;
  }
  div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
