import Vue from 'vue'
import * as api from 'editor/api'
import * as mutationTypes from 'editor/store/mutationTypes'
import {editorNotification,editorNotificationWrapper,editorConditionGraph} from 'editor/services/defaults.js'
import {getUniqueId} from 'defaults'
import {AllowedActions} from 'editor/constants'

export default {
    state: {
        workspace: {'local':{}},
        reverseInfo: {},
        selectedItem: null,
        possibleItemActions: ['add','remove'],
        maxItemLimit: 0,
        maxWorkspaceLimit: 0,
    },
    mutations: {
        [mutationTypes.ADD_WORKSPACES](state, modulesWorkspace) {
            if('item' in modulesWorkspace) {
                for(let i=0;i<modulesWorkspace.item.length;i++) {
                    if(!(modulesWorkspace.item[i] in state.workspace)) Vue.set(state.workspace,modulesWorkspace.item[i],null)
                }
                editorNotification.newInternalInfo('Workspace for item module have been actualized',true)
            }
        },
        [mutationTypes.MODULES_PROCESS_LOCAL_DATA](state, initData) {
            if('item' in initData.modules) {
                for(let i=0;i<initData.modules.item.length;i++) {
                    Vue.set(state.workspace.local,initData.modules.item[i].localId,initData.modules.item[i])
                    Vue.set(state.reverseInfo,initData.modules.item[i].localId,[]) //prepare arrays for reverse informations
                    editorConditionGraph.addCompexConnection(AllowedActions.ITEM,initData.modules.item[i].name) //actualize conditions
                }
                editorNotification.newInternalInfo('Initial data for item module have been processed',true)
            }
        },
        [mutationTypes.MODULES_PROCESS_WORKSPACE_DATA](state,args) {
            //args should contain moduleType, workspaceName and data
            if('item' === args.moduleType && args.workspaceName in state.workspace) {
                for(let i=0;i<args.data.length;i++) {
                    if(state.workspace[args.workspaceName] === null) state.workspace[args.workspaceName] = {}
                    Vue.set(state.workspace[args.workspaceName],args.data[i].id,args.data[i])
                }
                editorNotification.newInternalInfo('Data for workspace '+args.workspaceName+' has be updated.',true)
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
            editorConditionGraph.addCompexConnection(AllowedActions.ITEM,newItem.name) //actualize conditions

            editorNotification.newInternalInfo('New item with local id '+newItem.localId+' has been added',true)
        },
        [mutationTypes.DELETE_ITEM](state,localId) {
            if(state.selectedItem == localId) state.selectedItem = null
            editorConditionGraph.removeCompexConnection(AllowedActions.ITEM,state.workspace.local[localId].name) //actualize conditions

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
                                j--
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
                        i--
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
        },
        [mutationTypes.MODULES_ACTION_EDITED](state,args) {
            //args should contain pos, action and oldAction variables
            //action is copy of action
            //pos contains actionType, pageId and actionId values
            if('item' === args.pos.actionType && args.oldAction.ref != args.action.ref) { //delete old action rev
                if(args.oldAction.ref != null) {
                    for(let i=0;i<state.reverseInfo[args.oldAction.ref].length;i++) {
                        if(state.reverseInfo[args.oldAction.ref][i].pageId == args.pos.pageId && state.reverseInfo[args.oldAction.ref][i].actionId == args.pos.actionId) {
                            Vue.delete(state.reverseInfo[args.oldAction.ref],i)
                            i--
                        }
                    }
                }
                if(args.action.ref != null) {
                    state.reverseInfo[args.action.ref].push({'pageId':args.pos.pageId,'actionId':args.pos.actionId})
                }
            }
        },
        [mutationTypes.MODULES_CLEAR](state) {
            Vue.set(state.workspace,'local',{})
            Vue.set(state,'reverseInfo',{})
            Vue.set(state,'selectedItem',null)
            editorConditionGraph.clearComplexConnection(AllowedActions.ITEM)
        },
        [mutationTypes.SET_UP_LIMITS](state,limits) {
            if(limits.item) state.maxItemLimit = limits.item
            if(limits.workspace) state.maxWorkspaceLimit = limits.workspace
            
            editorNotification.newInternalInfo('Item module limits have been set up.',true)
        }
    },
    actions: {
        newItemModule({ commit, dispatch, state }, newItem) {
            let localData = JSON.parse(JSON.stringify(newItem))

            dispatch('undoRedoWrapper',{
                'name':String.doTranslationEditor('undo-new-item',localData.localId),
                'undoAction':function(localData) {
                    commit(mutationTypes.DELETE_ITEM,localData.localId)
                    commit(mutationTypes.CHANGE_AUTOMATIC_BOOK_SAVE,true)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localData.localId))
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.ADD_NEW_ITEM,localData)
                    commit(mutationTypes.CHANGE_AUTOMATIC_BOOK_SAVE,true)
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
                'name':String.doTranslationEditor('undo-item-deleted',localData.item.localId),
                'undoAction':function(localData) {
                    commit(mutationTypes.ADD_NEW_ITEM,localData.item)
                    dispatch('moduleRefAdded',{
                        moduleName:'item',
                        rev:localData.reverseInfo,
                        localId:localData.item.localId,
                    }).then(() => {
                        commit(mutationTypes.CHANGE_AUTOMATIC_BOOK_SAVE,true)
                        editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-item',localData.item.localId))
                    }).catch((reason) => {
                        console.log(reason)
                    })
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.DELETE_ITEM,localData.item.localId)
                    dispatch('moduleRefDeleted',{
                        moduleName:'item',
                        rev:localData.reverseInfo
                    }).then(() => {
                        commit(mutationTypes.CHANGE_AUTOMATIC_BOOK_SAVE,true)
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
                'name':String.doTranslationEditor('undo-item-edited',localData.localId),
                'undoAction':function(localData) {
                    commit(mutationTypes.EDIT_ITEM,localData)
                    commit(mutationTypes.CHANGE_AUTOMATIC_BOOK_SAVE,true)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edited-item'))
                },
                'undoArgs':localData,
                'redoAction':function(localDataEdit) {
                    commit(mutationTypes.EDIT_ITEM,localDataEdit)
                    commit(mutationTypes.CHANGE_AUTOMATIC_BOOK_SAVE,true)
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edited-item'))
                },
                'redoArgs':localDataEdit,
                'undo':true,
                'redo':false,
                'runRedo':true
            })       
        },
        newItemAction({ commit, dispatch, state}, args) {
            if(!args.actionData || !(args.actionData.ref in state.workspace.local)) {
                editorNotificationWrapper.newInternalInfo(commit,'Impossible to obtain appropriate item with local id: '+args.actionData.ref,false)
                return
            }

            let itemAction = {
                id:args.actionData.id,
                action: args.actionData.action,
                ref: args.actionData.ref,
                condition: args.actionData.condition,
                existsInText: false,
            }

            dispatch('newAction',{
                'actionType':AllowedActions.ITEM,
                'pageId':args.pageId,
                'action':itemAction
            })
        },
        saveModules({ commit, dispatch, state}, res) {
            let key,key2,i=0
            res.modules[AllowedActions.ITEM] = []
            for(key in state.workspace.local) {
                res.modules[AllowedActions.ITEM].push({})
                for(key2 in state.workspace.local[key]) {
                    res.modules[AllowedActions.ITEM][i][key2] = state.workspace.local[key][key2]
                }
                i++
            }
        },
        loadWorkspaceData({commit,dispatch,state},args) {
            //args shoudl contain moduleType and workspaceName
            return api.getWorkspaceItems().then((data) => {
                commit(mutationTypes.MODULES_PROCESS_WORKSPACE_DATA, {
                    moduleType:args.moduleType,
                    workspaceName:args.workspaceName,
                    data:data
                })
            }).catch((reason) => {
                editorNotificationWrapper.newInternalInfo(commit,'Error during obtaing data of workspace. Text of the error is: '+reason,false)
                throw reason
            })
        }
    }
}