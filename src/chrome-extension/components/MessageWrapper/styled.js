import styled from "styled-components";

export const MessageContainer = styled.div`
  position: fixed;
  bottom: 100px;
  left: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h3{
      font-size: 16px;
      font-weight: normal;
      color: #555;
      font-family: "Google Sans", Roboto, Arial, sans-serif;
  }

  .hand{
    cursor: pointer;
  }

  .edu-message {
  opacity: 1;
  height: auto;
  background-color: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 5px 15px 5px 5px;
  margin-top: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1px 2px 10px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  flex-shrink: 1;
}
.edu-avatar {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: 10px;
}

.edu-emoji {
  width: 80%;
  max-width: 42px;
  font-size: 16px;
  margin: 10px;
}

.edu-emoji-wrapper {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: -20px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 4px;
  overflow: hidden;
}
`;