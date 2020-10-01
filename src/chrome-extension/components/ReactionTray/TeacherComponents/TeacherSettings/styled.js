import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 6px auto;
  min-height: 442px;
`

export const SettingsRow = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
`

export const Label = styled.div`
  min-width: 200px;
  text-align: left;
  color: #5b5b5b;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  margin-left: 20px;
  user-select: none;
`

export const Wrapper = styled.div`
  display: flex;
  width: 280px;
  cursor: ${({ clickable }) => clickable && 'pointer'};

  svg,
  path {
    fill: #5b5b5b !important;
  }
`
