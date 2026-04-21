import { Module } from 'vuex';
import { IVideoStudioState } from './models';
import actions from './actions';
import mutations from './mutations';
import state from './state';

export const videoStudio: Module<IVideoStudioState, any> = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default videoStudio;
