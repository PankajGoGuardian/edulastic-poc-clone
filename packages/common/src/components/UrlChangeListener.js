import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom';

function UrlChangeListener({location}){
    const path = location.pathname;
    useEffect(()=>{
        if(window?.analytics?.page){
            window.analytics.page();
        }
    },[path])
    return null;
}

export default withRouter(UrlChangeListener);