
import styled from "styled-components";

export const TrayButtonOuter = styled.div`
  &:focus {
    ${TrayButton}{
    background-color: rgba(2, 191, 165, 0.15);
    }
  }
`;

export const TrayButton = styled.a`
  display: flex;
  overflow: visible !important;
  padding: 0 10px;
  cursor: pointer;
  user-select: none ;
  text-decoration: none;
  -webkit-box-align: center;
  box-align: center;
  align-items: center;
  box-pack: center;
  -webkit-box-pack: center;
  justify-content: center;
  border-radius: 0;
  color: #5f6368;
  height: 100%;
  min-width: 60px;

  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-font-smoothing: antialiased;
  -webkit-user-select: none;
  transition: background 0.2s 0.1s;
  border: 0;
  cursor: pointer;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 36px;
  text-decoration: none;
  text-transform: none;
  outline: none;
  position: relative;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
  z-index: 0;
`;

export const TrayButtonBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00796b;
  opacity: 0;
`;


export const Dropdown = styled.div`
    animation: fade 0.2s;
    position: fixed;
    top: 55px;
    left: 0;
    background-color: white;
    border-radius:  8px 8px;
    width: 264px;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302), 0 4px 4px 2px rgba(60, 64, 67, 0.149);
    padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    box-sizing: border-box;
    max-height: 256px;
    overflow: auto;

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: #fff;
    }

    ::-webkit-scrollbar-thumb {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .dropdown-outer {
        display: flex;
        margin: 2px;
        justify-content: space-evenly;
        border-radius: 100px;
        a{
            text-decoration: none;
            color: black;
        }
        &:focus > .dropdown-item {
            background-color: rgba(2, 191, 165, 0.15);
        }
        
        &:hover {
            background-color: #00796b0d;
        }
    }

    .dropdown-item {
        padding: 12px;
        font-size: 18px;
        display: flex;
        align-items: center;
        position: relative;
        justify-content: center;
        border-radius: 8px;
        margin: 4px;
        cursor: pointer;
    }

    .faded {
      opacity: 0.3;
      cursor: default;
      &:hover {
          background-color: white;
      }
    }

    .emoji {
      width: 100%;
    }

`;

export const SkinToneWrapper = styled.div`
    margin-left: -10px;

    .dropdown-outer {
        &:focus > .dropdown-item {
         background-color: rgba(2, 191, 165, 0.15);
        outline: 4px solid rgb(2, 191, 165);
    }
}

.dropdown-item {
  padding: 10px 10px 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tone-picker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0 2px;
  border: 3px solid white;
  &:hover {
    border: 3px solid lightseagreen;
  }

  &-0 {
    background-color: #f8cc5c;
  }
  &-1 {
    background-color: #f7dbb8;
  }
  &-2 {
    background-color: #deb793;
  }
  &-3 {
    background-color: #d2a16a;
  }
  &-4 {
    background-color: #bb9065;
  }
  &-5 {
    background-color: #80654d;
  }
}
`;

export const TonePicker = styled.div`
    width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0 2px;
  border: 3px solid white;
  background: ${({ color }) => color || '#f8cc5c'};
`;

