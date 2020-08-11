import React from 'react'
import { SkinToneWrapper } from "./styled";

const SkinToneSelector = props => {

    const setTone = id => localStorage.setItem("edu-skinTone", id);

    return (
      <SkinToneWrapper role="button">
        <div className="dropdown-item">
          <div className="tone-picker tone-picker-0" onClick={() => setTone(0)} title="Set default skin tone" role="button" />
          <div className="tone-picker tone-picker-1" onClick={() => setTone(1)} title="Set light skin tone" role="button" />
          <div className="tone-picker tone-picker-2" onClick={() => setTone(2)} title="Set medium-light skin tone" role="button" />
          <div className="tone-picker tone-picker-3" onClick={() => setTone(3)} title="Set medium skin tone" role="button" />
          <div className="tone-picker tone-picker-4" onClick={() => setTone(4)} title="Set medium-dark skin tone" role="button" />
          <div className="tone-picker tone-picker-5" onClick={() => setTone(5)} title="Set dark skin tone" role="button" />
        </div>
      </SkinToneWrapper>
    );
};

export default SkinToneSelector;