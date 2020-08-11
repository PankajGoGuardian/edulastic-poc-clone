import React from "react";
import { connect } from 'react-redux';
import Message from './Message';
import Hand from './Hand';
import { MessageContainer } from "./styled";

const MessageWrapper = ({messages = [], hands = []}) => (
  <MessageContainer>
    {  messages.map(msg => <Message key={msg.msgId} {...msg} />) }
    {  hands.map(hand => <Hand key={hand.msgId} {...hand} />) }
  </MessageContainer>
    );

export default connect(
    state => ({
        messages: state.meetingsReducer.messages,
        hands: state.meetingsReducer.hands
      })
)(MessageWrapper);