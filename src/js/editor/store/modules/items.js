import Vue from 'vue'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification,editorNotificationWrapper} from 'editor/services/defaults.js'
import {getUniqueId} from 'defaults'

export default {
    state: {
        workspace: {'local':{}},
        reverseInfo: {},
        selectedItem: null,
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
        },
        [mutationTypes.SELECTED_ITEM_CHANGED](state,itemId) {
            if(itemId in state.workspace.local || itemId === null) {
                state.selectedItem = itemId
                editorNotification.newInternalInfo('Selected item has been changed to '+itemId,true)

            }           
        },
        [mutationTypes.ADD_NEW_ITEM](state,newItem) {
            let item = {
                'id':null,
                'localId':newItem.localId,
                'name':newItem.name,
                'description':newItem.description
            }
            Vue.set(state.reverseInfo,newItem.localId,[]) //prepare reverse info --> it is empty at begging
            Vue.set(state.workspace.local,newItem.localId,item)
            state.selectedItem = newItem.localId //set new item as selected

            editorNotification.newInternalInfo('New item with local id '+newItem.localId+' has been added',true)
        },
        [mutationTypes.DELETE_ITEM](state,localId) {
            if(state.selectedItem === localId) state.selectedItem = null
            Vue.delete(state.workspace.local,localId)
            Vue.delete(state.reverseInfo,localId)

            editorNotification.newInternalInfo('New item with local id '+localId+' has been deleted',true)
        },
        [mutationTypes.EDIT_ITEM](state,itemValues) {
            let localData
            if(itemValues.localId && itemValues.localId in state.workspace.local) {
                localData = state.workspace.local[itemValues.localId]
            } else if(itemValues.workspace && itemValues.workspace in state.workspace && itemValues.id in state.workspace[itemValues.workspace]) {
                localData = state.workspace[itemValues.workspace][itemValues.id]
            } else {
                editorNotification.newInternalError('Imposible to find item with id: '+itemValues.id+' and localId: '+itemValues.localId,true)
                return
            }

            localData.name = itemValues.name
            localData.description = itemValues.description

            editorNotification.newInternalInfo('Item with id: '+itemValues.id+' and localId: '+itemValues.localId+' has been edited',true)
        }
    },
    actions: {
        newItemModule({ commit, dispatch, state }, newItem) {
            let localData = JSON.parse(JSON.stringify(newItem))

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.DELETE_ITEM,localData.localId)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localData.localId))
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.ADD_NEW_ITEM,localData)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-new-item',localData.localId))
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
            })
            
            commit(mutationTypes.ADD_NEW_ITEM,newItem)
            editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-new-item',newItem.localId))
        },
        deleteItemModule({ commit, dispatch, state }, localId) {
            let localData =  JSON.parse(JSON.stringify(state.workspace.local[localId]))

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.ADD_NEW_ITEM,localData)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-new-item',localData.localId))
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.DELETE_ITEM,localData.localId)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localData.localId))
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
            })
            
            commit(mutationTypes.DELETE_ITEM,localId)
            editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localId))
        },
        editItemModule({ commit, dispatch, state}, newValues) {
            let localDataEdit = JSON.parse(JSON.stringify(newValues))
            let localData
            if(newValues.localId && newValues.localId in state.workspace.local) {
                localData = state.workspace.local[newValues.localId]
            } else if(newValues.workspace && newValues.workspace in state.workspace && newValues.id in state.workspace[newValues.workspace]) {
                localData = state.workspace[newValues.workspace][newValues.id]
            } else {
                editorNotificationWrapper.newInternalError(commit,'Imposible to find item with id: '+newValues.id+' and localId: '+newValues.localId,true)
                editorNotificationWrapper.newExternalError(commit,String.doTranslationEditor('notification-missing-item',localData.localId))
                return
            }
            localData = JSON.parse(JSON.stringify(localData))

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.EDIT_ITEM,localData)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edited-item'))
                },
                'undoArgs':localData,
                'redoAction':function(localDataEdit) {
                    commit(mutationTypes.EDIT_ITEM,localDataEdit)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edited-item'))
                },
                'redoArgs':localDataEdit,
                'undo':true,
                'redo':false,
            })

            commit(mutationTypes.EDIT_ITEM,localDataEdit)    
            editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edited-item'))        
        }
    }
}