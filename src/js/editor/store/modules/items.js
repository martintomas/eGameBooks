import Vue from 'vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification} from 'editor/services/defaults.js'

export default {
    state: {
        workspace: {'local':{}},
        reverseInfo: {},
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
                    Vue.set(state.workspace.local,initData.modules.item[i].localId,initData.modules.item[i])
                    Vue.set(state.reverseInfo,initData.modules.item[i].localId,[]) //prepare arrays for reverse informations
                }
                editorNotification.newInternalInfo('Initial data for item module have been processed',true)
            }
        },
        [mutationTypes.MODULES_BUILD_REVERSE_INFO](state,pages) {
            for(let key in pages) {
                if('item' in pages[key].actions) {
                    for(let i in pages[key].actions.item) {
                        if(pages[key].actions.item[i].ref != null) {
                            if(pages[key].actions.item[i].ref in state.reverseInfo) state.reverseInfo[pages[key].actions.item[i].ref].push(pages[key].data.id)
                            else Vue.set(state.reverseInfo,pages[key].actions.item[i].ref,[pages[key].data.id])
                        }
                    }
                }
            }
        }
    }
}