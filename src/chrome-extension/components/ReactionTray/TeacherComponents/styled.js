import styled from 'styled-components'

export const TrayButton = styled.button`
  background: white;
  width: 60px;
  display: flex;
  align-items: center;
  margin: 10px;
  justify-content: center;
  border-radius: 100px;
  cursor: pointer;
  border: none;
  outline: none;

  &:hover {
    background: #f9f9ff;
  }
`

export const Dropdown = styled.div`
  width: 100%;
  background: white;
  border-radius: 0 0 10px;
  transition: all 0.5s ease;
`

export const SubheaderWrapper = styled.div`
  width: 100%;
  height: 50px;
  background: white;
  border-top: 1px solid #dadae4;
  border-bottom: 1px solid #dadae4;
  margin-left: auto;
  text-align: left;
  font-size: 18px;
  text-transform: capitalize;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  svg {
    fill: #5b5b5b;
    cursor: pointer;
    padding: 0 32px;
  }
`

export const SubTabsWrapper = styled.div`
  width: 100%;
  background: white;
  border-bottom: 1px solid #dadae4;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`

export const TabContainer = styled.div`
  width: 100%;
  height: 80px;
  background: white;
  border-bottom: ${({ active }) => active && '1px solid #5DE4A5'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

export const Title = styled.div`
  font-size: 12px;
  color: #69727e;
  font-weight: 600;
  text-transform: uppercase;
  font-family: Arial, Helvetica, sans-serif;
  user-select: none;
`

export const Count = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: ${({ color }) => color};
  height: 40px;
  user-select: none;
`

export const ListContainer = styled.div`
  width: calc(100% - 10px);
  min-height: 300px;
  max-height: calc(100vh - 400px);
  margin: 10px 0;
  overflow: auto;
  transition: all 0.5s ease;

  ::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`

export const UserContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  margin: 6px auto;
`

export const Avatar = styled.div`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  background: url(${({ avatar }) => avatar});
  border-radius: 100px;
  display: flex;
  align-items: center;
  margin: auto;
  background-size: contain;
`

export const UserTitle = styled.div`
  width: 280px;
  color: #69727e;
  margin-left: auto;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
`

export const TabName = styled.div`
  min-width: 220px;
  text-align: left;
  color: #5b5b5b;
`

export const TextAvatar = styled.div`
  width: 30px;
  height: 30px;
  color: #ffffff;
  background: #434b5d;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
`
