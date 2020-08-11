import React from 'react'
import {TeacherTrayButton} from './styled';

const TrayActionButton = ({active, icon, callback}) => (
  <TeacherTrayButton onClick={callback} active={active}>
    {icon}
  </TeacherTrayButton>
);

export default TrayActionButton;