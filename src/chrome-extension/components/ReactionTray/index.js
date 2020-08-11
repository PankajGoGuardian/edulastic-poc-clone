import React, { useState } from "react";
import { connect } from "react-redux";
import TrayActionButton from './TrayActionButton';
import {setDropdownTabAction} from '../../reducers/ducks/edulastic';

import EduLogo from "./Icons/Logo";
import AttendanceIcon from "./Icons/Attendance";
import EngagementIcon from "./Icons/Engagement";
import ChecklistIcon from "./Icons/Checklist";
import Settings from "./Icons/Settings";
import { ReactionsButton, HandUpButton, SettingsButton } from "../ActionButtons";
import {
    MainTray,
    WrapperContainer,
    LoginBtn
} from "./styled";
import CommonDropdown from "./TeacherComponents/CommonDropdown";

const TeacherComponent = ({dropdownTab, setDropdownTab}) => (
  <div style={{display: 'flex', background: 'white'}}>
    <TrayActionButton active={dropdownTab === 'attendance'} text="Attendance" icon={<AttendanceIcon />} callback={() => setDropdownTab("attendance")} />
    <TrayActionButton active={dropdownTab === 'engagement'} text="Engagement" icon={<EngagementIcon />} callback={() => setDropdownTab("engagement")} />
    <TrayActionButton active={dropdownTab === 'checklist'} text="CheckList" icon={<ChecklistIcon />} callback={() => setDropdownTab("checklist")} />
    <TrayActionButton active={dropdownTab === 'teachersettings'} text="TeacherSettings" icon={<Settings />} callback={() => setDropdownTab("teachersettings")} />
  </div>
    )

const StudentComponent = ({authToken, isUserLoaded, activeToneId = 0, dropdownTab, isReactionsVisible, setDropdownTab, setReactionsDropdown}) => (
  <div style={{display: 'flex', background: 'white'}}>
    <ReactionsButton activeToneId={activeToneId} visible={isReactionsVisible} callback={() => setReactionsDropdown(x => !x)} />
    <HandUpButton activeToneId={activeToneId} />
    {
            authToken ?
            ( isUserLoaded && <>
              <TrayActionButton active={dropdownTab === 'studentChat'} text="StudentChat" icon={<Settings />} callback={() => setDropdownTab("studentChat")} />
              <TrayActionButton active={dropdownTab === 'studentsettings'} text="StudentSettings" icon={<Settings />} callback={() => setDropdownTab("studentsettings")} />
                              </> || null
            ) :
            (<LoginBtn style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><a href="http://edulastic-poc.snapwiz.net/login#login" target="_blank">Log In</a></LoginBtn>)
        }
  </div>
    );


const ReactionTray = ({isUserLoaded, authToken, userRole, dropdownTab, setDropdownTab}) => {

    const [isReactionsVisible, setReactionsDropdown] = useState(false);
    const [isSettingsVisible, setSettingsDropdown] = useState(false);

    const activeToneId = parseInt(localStorage.getItem("edu-skinTone")) || 0;

    const isTeacher = ['teacher','admin'].includes(userRole);

    const userProps = {
        isReactionsVisible,
        activeToneId,
        isSettingsVisible,
        setReactionsDropdown,
        setSettingsDropdown,
        dropdownTab,
        setDropdownTab
    };
    
    return (
      <WrapperContainer>
        <MainTray>
          <EduLogo />
          { 
                     userRole &&
                     isTeacher ? <TeacherComponent {...userProps} /> : <StudentComponent authToken={authToken} isUserLoaded={isUserLoaded} {...userProps} />}
        </MainTray>
        {dropdownTab && <CommonDropdown isTeacher={isTeacher} />}
      </WrapperContainer>
    );
};

export default connect(
    state => ({
        authToken: state.edulasticReducer.authToken,
        userRole: state.edulasticReducer.user?.role,
        isUserLoaded: Object.keys(state.edulasticReducer.user).length,
        dropdownTab: state.edulasticReducer.dropdownTab
    }),
    {
    setDropdownTab: setDropdownTabAction
    }
)(ReactionTray);