import API from './api';

const namespace = 'group';

export const fechClassData = (districtId,groupId) => API.post(`search/student`,{ districtId, groupIds:[groupId] }).then(res => res.data);
  
export default {
  fechClassData
}

  