import React, { Suspense, lazy, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {userApi, classApi} from "../api";
import {updateUserAction ,updateClassDataAction} from "../reducers/ducks/edulastic";

const ReactionTray = lazy(() => import('./ReactionTray'));
const MessageWrapper = lazy(() => import('./MessageWrapper'));

const Loading = msg => <h6>{msg}</h6>;

const MainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100000;
`;

const App = ({authToken, updateUser, updateClassData}) => {

    useEffect(() => {
        if(authToken){
            (async () => {
                const user = await userApi.fetchUser();
                const {_id: classId} = user.orgData?.classList?.[0];
                const districtId = user.districtIds[0];

                if(!classId) console.log("Could not derive classId...");

                const students = await classApi.fechClassData(districtId,classId);
                
                if(user) updateUser({...user, classId});
                if(students) updateClassData({classId,students});
            })();
        }
    }, [authToken])

    return (
      <MainContainer>
        <Suspense fallback={() => <Loading message="Loading Reaction Tray..." />}>
          <ReactionTray />
        </Suspense>
        <Suspense fallback={() => <Loading message="Loading Message Wrapper..." />}>
          <MessageWrapper />
        </Suspense>
      </MainContainer>
    );
};

export default connect(
    state => ({
        authToken: state.edulasticReducer.authToken
    }),
    {
        updateUser: updateUserAction,
        updateClassData: updateClassDataAction
    }
)(App);