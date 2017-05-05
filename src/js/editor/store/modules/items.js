import Vue from 'vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification} from 'editor/services/defaults.js'

export default {
    state: {
        workspace: {'local':{}},
    },
    mutations: {
        [mutationTypes.ADD_WORKSPACES](state, modulesWorkspace) {
            if('item' in modulesWorkspace) {
                for(let i=0;i<modulesWorkspace.item.length;i++) {
                    Vue.set(state.workspace,modulesWorkspace.item[i],{})
                }
                editorNotification.newInternalInfo('Workspace for item module have been actualized',true)
            }
        },
        [mutationTypes.MODULES_PROCESS_LOCAL_DATA](state, initData) {
            if('item' in initData.modules) {
                for(let i=0;i<initData.modules.item.length;i++) {
                    Vue.set(state.workspace.local,initData.modules.item[i].id,initData.modules.item[i])
                }
                editorNotification.newInternalInfo('Initial data for item module have been processed',true)
            }
        }
    }
}