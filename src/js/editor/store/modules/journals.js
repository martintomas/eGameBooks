import Vue from 'vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification} from 'editor/services/defaults.js'

export default {
    state: {
        workspace: {'local':{}},
    },
    mutations: {
        [mutationTypes.ADD_WORKSPACES](state, modulesWorkspace) {
            if('journal' in modulesWorkspace) {
                for(let i=0;i<modulesWorkspace.journal.length;i++) {
                    Vue.set(state.workspace,modulesWorkspace.journal[i],{})
                }
                editorNotification.newInternalInfo('Workspace for journal module have been actualized',true)
            }
        },
        [mutationTypes.MODULES_PROCESS_LOCAL_DATA](state, initData) {
            if('journal' in initData.modules) {
                for(let i=0;i<initData.modules.journal.length;i++) {
                    Vue.set(state.workspace.local,initData.modules.journal[i].id,initData.modules.journal[i])
                }
                editorNotification.newInternalInfo('Initial data for journal module have been processed',true)
            }
        }
    }
}