import React from "react";
import { connect } from 'react-redux';
import { generateUUID } from '../../utils';
import { TONES, DEFAULT_SKIN_TONE, EMOJI_BY_TONE ,EVENTS} from "../../constants";
import { addHandAction } from '../../reducers/ducks/messages';
import ReactionsDropdown from "./ReactionsDropdown";
import SettingsDropdown from "./SettingsDropdown";
import ThumbsUp from './icons/thumbs-up.png';
import RaisedHand from './icons/raised-hand.png';

import {
    TrayButtonOuter,
    TrayButton,
    TrayButtonBg,
    TonePicker
} from "./styled";

export const ReactionsButton = ({ visible = false, callback, activeToneId }) => (
  <TrayButtonOuter onClick={callback}>
    <TrayButton title="Select an Emoji" role="button">
      <TrayButtonBg />
      <img src="chrome-extension://pgooajioclnllipfkmblccohmcphpnkc/img/thumbs-up.png" />
    </TrayButton>
    {visible && <ReactionsDropdown />}
  </TrayButtonOuter>
    );

export const SettingsButton = ({ visible = false, callback, activeToneId }) => (
  <TrayButtonOuter onClick={callback}>
    <TrayButton title="Select a skin tone" role="button">
      <TrayButtonBg />
      <TonePicker color={TONES[activeToneId]} />
    </TrayButton>
    {visible && <SettingsDropdown />}
  </TrayButtonOuter>
    );

const HandUpButtonComponent = ({ activeToneId, userData, addHand , toneId, hands}) => {

    const socket = window['edu-meet'];

    const raiseHand = () => {

        const isNew = !hands.find(h => userData.clientId === h.clientId);

        const {meetingID, classId, userId, fullname, avatar} = userData;

        if(socket.connected && isNew){
            const msgId = generateUUID();
            const msgData = {
                meetingID,
                userId,
                classId,
                reaction: {
                    msgId,
                    emoji: "raise_hands",
                    timestamp: Date.now(),
                    type: 'HAND'
                },
                metadata: {
                    fullname,
                    avatar,
                    toneId: toneId || localStorage.getItem('edu-skinTone') || 0
                }
            };
            socket.send(msgData);
            addHand({...msgData.reaction,...msgData.metadata});
        }
    }

    return (
      <TrayButtonOuter>
        <TrayButton title="Raise your hand" role="button" onClick={raiseHand}>
          <TrayButtonBg />
          <img src="chrome-extension://pgooajioclnllipfkmblccohmcphpnkc/img/raised-hand.png" />

        </TrayButton>
      </TrayButtonOuter>
    );
};

export const HandUpButton = connect(
    state => ({
        userData: state.meetingsReducer.userData,
        toneId: state.meetingsReducer.toneId,
        hands: state.meetingsReducer.hands
      }),
      {
        addHand: addHandAction
      }
)(HandUpButtonComponent);

