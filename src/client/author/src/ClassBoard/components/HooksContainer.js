//@ts-check
import React from 'react';

import { connect } from 'react-redux';
import {realtimeGradebookActivityAddAction, realtimeGradebookTestItemAddAction} from '../../reducers/testActivity';
import useRealtimeUpdates from '../useRealtimeUpdates';

const Shell = ({addActivity,classId, assignmentId,addItem}) => {
    const client = useRealtimeUpdates(`gradebook:${classId}:${assignmentId}`,{addActivity,addItem});

    return (null);
};


export default connect(null,{addActivity:realtimeGradebookActivityAddAction,addItem:realtimeGradebookTestItemAddAction})(Shell);