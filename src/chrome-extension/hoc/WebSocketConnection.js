import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import { connect } from 'react-redux';
import {EVENTS} from "../constants";
import { addUserDataAction, addMessageAction, addHandAction, removeMessageAction, updateRoomDataAction } from '../reducers/ducks/messages';

let socket;

const destroyWSSConnection =  ({meetingID, clientId}) =>  {
  window.addEventListener("beforeunload", async (event) => {
  // wait for meet to relay call ended message
    while (document.querySelector("[data-call-ended='true']") == null) {
      await new Promise(r => setTimeout(r, 200));
    }

      socket.emit( EVENTS.DISCONNECT ,{meetingID, clientId}, data => {
      console.log("Successfully Disconnected...",data);
    });

    socket.disconnect(true);
    delete window['edu-meet'];
  });
}

const WebSocketConnection = ({ host, extension, children, userData = {}, user = {}, addMessage, removeMessage, addHand, updateRoomData}) => {

    useEffect(() => {
        socket = io(host);
        window['edu-meet'] = socket;
        socket.on( EVENTS.CONNECT, () => console.log("Socket Connection Successful..."));
        // socket.on('connect_error', err => console.log("Web Socket Connection Failed !"));
      },[host]);

    useEffect(() => {
        if(Object.keys(userData).length && Object.keys(user).length){
          console.log("---->", user, userData);
          if(socket.connected) {
            socket.emit( EVENTS.JOIN , {
              user: {
                ...userData, 
                userId: user._id, 
                role: user.role, 
                classId: user?.orgData?.defaultClass
              }}, 
              err => {
                if(err) console.error("Connection Failed...",err);
                else console.log("Joined Room Successfully...");
            });
         }
      }
    },[Object.keys(user).length, Object.keys(userData).length]);

    useEffect(() => {
      
      const runtimePort = chrome.runtime.connect(extension);
      
      if(runtimePort){
        runtimePort.onMessage.addListener((request) => {
          if (request.type === 'TAB_ACTIVITY') {
            socket.emit(EVENTS.ACTIVITY, { 
              meetingID: userData.meetingID, 
              userId: user._id,  
              classId: user.orgData.defaultClass, 
              activity: request
            });
          }
          return true;
        });
      }
      
      socket.on( EVENTS.REACTION , message => {
          console.log("message - ", message);
          if(message.type === 'QUEUE'){
            addMessage(message);
            setTimeout(() => removeMessage(message.msgId),2000);
          }else if(message.type === 'HAND'){
            addHand(message);
          }
      });

      return () => destroyWSSConnection(userData);
    }, []);

    return <div>{children}</div>;
};

export default connect(
  state => ({
    userData: state.meetingsReducer.userData,
    user: state.edulasticReducer.user
  }),
  {
    setUsers: addUserDataAction,
    addMessage: addMessageAction,
    removeMessage: removeMessageAction,
    addHand: addHandAction,
    updateRoomData: updateRoomDataAction
  }
)(WebSocketConnection);