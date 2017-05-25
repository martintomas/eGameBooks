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
                            if(pages[key].actions.item[i].ref in state.reverseInfo) {
                                state.reverseInfo[pages[key].actions.item[i].ref].push({'pageId':pages[key].data.id,'actionId':pages[key].actions.item[i].id})
                            } else {
                                Vue.set(state.reverseInfo,pages[key].actions.item[i].ref,[{'pageId':pages[key].data.id,'actionId':pages[key].actions.item[i].id}])
                            }
                        }
                    }
                }
            }
        },
        [mutationTypes.MODULES_UPDATE_REV](state,args) {
            //args should contain moduleName, localId and pages
            if('item' === args.moduleName) {
                for(let key in args.pages) {
                    if(args.moduleName in args.pages[key].actions) {
                        for(let i in args.pages[key].actions.item) {
                            if(args.pages[key].actions.item[i].ref === args.localId) {
                                if(args.pages[key].actions.item[i].ref in state.reverseInfo) {
                                    state.reverseInfo[args.pages[key].actions.item[i].ref].push({'pageId':args.pages[key].data.id,'actionId':args.pages[key].actions.item[i].id})
                                } else {
                                    Vue.set(state.reverseInfo,args.pages[key].actions.item[i].ref,[{'pageId':args.pages[key].data.id,'actionId':args.pages[key].actions.item[i].id}])
                                }
                            }
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
            if(state.selectedItem == localId) state.selectedItem = null
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
        },
        [mutationTypes.MODULES_PAGE_DELETED](state,page) {
            let i,j
            if('item' in page.actions) {
                for(i in page.actions.item) {
                    if(page.actions.item[i].ref != null) {
                        for(j=0;j<state.reverseInfo[page.actions.item[i].ref].length;j++) {
                            if(state.reverseInfo[page.actions.item[i].ref][j].pageId == page.data.id) {
                                Vue.delete(state.reverseInfo[page.actions.item[i].ref],j)
                            }
                        }
                    }
                }
            }
        },
        [mutationTypes.MODULES_PAGE_ADDED](state,page) {
            let i,j
            if('item' in page.actions) {
                for(i in page.actions.item) {
                    if(page.actions.item[i].ref != null) {
                        state.reverseInfo[page.actions.item[i].ref].push({'pageId':page.data.id,'actionId':page.actions.item[i].id})
                    }
                }
            }
        },
        [mutationTypes.MODULES_ACTION_DELETED](state,args) {
            //args should contain pos and action variables
            //action is copy of action
            //pos contains actionType, pageId and actionId values
            if('item' === args.pos.actionType && args.action.ref != null) { //check if item was deleted -> update rev info
                for(let i=0;i<state.reverseInfo[args.action.ref].length;i++) {
                    if(state.reverseInfo[args.action.ref][i].pageId == args.pos.pageId && state.reverseInfo[args.action.ref][i].actionId == args.pos.actionId) {
                        Vue.delete(state.reverseInfo[args.action.ref],i)
                    }
                }
            }
        },
        [mutationTypes.MODULES_ACTION_ADDED](state,args) {
            //args should contain pos and action variables
            //action is copy of action
            //pos contains actionType, pageId and actionId values
            if('item' === args.pos.actionType && args.action.ref != null) { //build reverse info
                state.reverseInfo[args.action.ref].push({'pageId':args.pos.pageId,'actionId':args.pos.actionId})
            }
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
                'runRedo':true
            })
        },
        deleteItemModule({ commit, dispatch, state }, localId) {
            let localData = {
                item: JSON.parse(JSON.stringify(state.workspace.local[localId])),
                reverseInfo: JSON.parse(JSON.stringify(state.reverseInfo[localId]))
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.ADD_NEW_ITEM,localData.item)
                    dispatch('moduleRefAdded',{
                        moduleName:'item',
                        rev:localData.reverseInfo,
                        localId:localData.item.localId,
                    }).then(() => {
                        editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localData.item.localId))
                    }).catch((reason) => {
                        console.log(reason)
                    })
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.DELETE_ITEM,localId)
                    dispatch('moduleRefDeleted',{
                        moduleName:'item',
                        rev:localData.reverseInfo
                    }).then(() => {
                        editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localData.item.localId))
                    }).catch((reason) => {
                        console.log(reason)
                    })
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })            
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
                'runRedo':true
            })       
        }
    }
}