import { testItemsApi } from '@edulastic/api';

export const getTest = async id => {
 return yield testItemsApi.getAll();
};
