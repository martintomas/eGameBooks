import * as mutationTypes from 'editor/store/mutationTypes'
import * as api from 'editor/api'
import { MarkdownComp } from 'editor/services/markdown-it/markdownComp.js'
import Vue from 'vue' //use Vue.set for manipulation with dict/array --> it is reactive

import {editorNotification,editorNotificationWrapper,editorLoaderWrapper} from 'editor/services/defaults.js'
import {buildRenderInfo} from 'editor/services/bookFuncs'
import {isPageCorrect} from 'editor/services/validators'
import {AllowedActions,ErrorImportance} from 'editor/constants'

/*
Structure of one page (state.pages)
data: {
    id:
    pageNumber:
    text:
    renderedText:
    ...
},
actions: {
    link: {id:{
        id:
        pageId:
        condition:
        existsInText: //appropriate text exists
    },...},
    ...
},
renderInfo: {
    link: {id:{ //id corrrespond to action id
        id:
        exist: //apropriate action exists
    },...},
    ...
},
reverseLink: [{
    pageId:
    actionId:    
},...]
*/

function processActions(actionInfo) { //set up by default for all actions that they are missing in text
    let res = {}
    for (let key in actionInfo) {
        res[key] = {}
        for (let i = 0; i < actionInfo[key].length; i++) {
            actionInfo[key][i]['existsInText'] = false
            Vue.set(res[key],actionInfo[key][i].id,actionInfo[key][i])
        }
    }
    return res
}

var markdownItAllowedActions = []
for(let key in AllowedActions) markdownItAllowedActions.push(AllowedActions[key]) //provide array of allowed actions

var markdownItAnalysis = {}
markdownItAnalysis[AllowedActions.LINK] = []
markdownItAnalysis[AllowedActions.ITEM] = []

export default {
    state: {
        markdownCompDefault: new MarkdownComp(markdownItAllowedActions),
        mainInfo: {},
        pages: {},
        pagesOrder: [], //array that describes which pages exists
        startPage: 1, //page that is first one
        pagesSevereError: {}, //page can have severe and minor error --> can be at both arrays
        pagesMinorError:{},
        selectedPage: null,
        editedPage: null
    },
    mutations: {
        [mutationTypes.LOAD_BOOK_DATA](state, initData) {
            //console.log('STORE: loading initial data')
            editorNotification.newInternalInfo('Starting processing initial pages of book',true)

            for(let key in initData.main) Vue.set(state.mainInfo,key,initData.main[key]) //load main info

            //prepare page data
            initData.pages.forEach(page => {
                if (!(page.id in state.pages)) Vue.set(state.pages, page.id, { 'data': null, 'actions': null, 'renderInfo': null, 'reverseLink': [] }) //create emty dict if it is not existing
                Vue.set(state.pages[page.id], 'data', {
                    'id': page.id,
                    'pageNumber': page.pageNumber,
                    'pageType':'text',
                    'pageTittle':page.pageTittle,
                    'text': page.text,
                    'renderedText': ''
                })

                let analysis = JSON.parse(JSON.stringify(markdownItAnalysis)) //deep copy of markdownItAnalysis
                Vue.set(state.pages[page.id].data, 'renderedText', state.markdownCompDefault.render(page.text, { 'analysis': analysis, 'pageId': page.id })) //render text
                Vue.set(state.pages[page.id], 'actions', processActions(page.actions))
                Vue.set(state.pages[page.id], 'renderInfo', buildRenderInfo(analysis, page.actions)) //build complete render info

                //update reverse links
                for (let i = 0; i < page.actions.link.length; i++) {
                    if (page.actions.link[i].pageId in state.pages) state.pages[page.actions.link[i].pageId].reverseLink.push({ 'pageId': page.id, 'actionId': page.actions.link[i].id })
                    else if (page.actions.link[i].pageId != null) Vue.set(state.pages, page.actions.link[i].pageId, { 'reverseLink': [{ 'pageId': page.id, 'actionId': page.actions.link[i].id }] })
                }

                state.pagesOrder.push(page.id) //remmember all existing pages

            })

            state.pagesOrder = state.pagesOrder.sort((a,b) => a - b) //sort pages

            editorNotification.newInternalInfo('Initial pages of book have been processed',true)
        },
        [mutationTypes.VALIDATE_BOOK](state, args) {
            //args should contains pages and actionType arguments
            //onlyId arg can be provided --> array of pages id --> get pages from state
            let pages = {},i,res,key
            if(args.onlyId) {
                for(i=0;i<args.pages.length;i++) {
                    if(args.pages[i] in state.pages) pages[args.pages[i]] = state.pages[args.pages[i]]
                }
            } else {    
                pages = args.pages === null ? state.pages : args.pages
            }

            for(key in pages) {
                res = isPageCorrect(state,pages[key],args.actionType)
                if(key in state.pagesMinorError) Vue.delete(state.pagesMinorError,key)
                if(key in state.pagesSevereError) Vue.delete(state.pagesSevereError,key)

                if(res[ErrorImportance.MINOR].length > 0) Vue.set(state.pagesMinorError,key,res[ErrorImportance.MINOR])
                if(res[ErrorImportance.SEVERE].length > 0) Vue.set(state.pagesSevereError,key,res[ErrorImportance.SEVERE])
            }

            editorNotification.newInternalInfo('Pages of book ('+Object.keys(pages)+') have been validated',true)
        },
        [mutationTypes.RENDER_PAGE](state, page) {
            //console.log('STORE: rendering text for page number ' + page.id)
            editorNotification.newInternalInfo('Rendering text for page number ' + page.id,true)
        },
        [mutationTypes.SELECT_PAGE](state, pageId) {
            //console.log('STORE: selecting new page ' + pageId)
            editorNotification.newInternalInfo('Selecting new page ' + pageId,true)

            if (pageId in state.pages) state.selectedPage = pageId
            else state.selectedPage = null
        },
        [mutationTypes.EDIT_PAGE](state, pageId) {
            //console.log('STORE: editing new page ' + pageId)
            editorNotification.newInternalInfo('Editing new page ' + pageId,true)

            if (state.pagesOrder.length > 0) { //check if pages data are already loaded
                if (pageId in state.pages && pageId != null) {
                    state.editedPage = pageId //change only edited page in case that page id is valid one
                    editorNotification.newExternalInfo(String.doTranslationEditor('notification-loaded-page',state.pages[pageId].data.pageNumber))
                } else if(state.editedPage === null) { //be sure that some page is selected as edited
                    if(state.startPage != null && state.startPage in state.pages) {
                        state.editedPage = state.startPage
                    } else {
                        editorNotification.newInternalWarn('Edited page was changed by force',true)
                        state.editedPage = state.pagesOrder[0] //set up first suitable pages as edited
                    }  
                }
            } else {
                state.editedPage = pageId
            }

        },
        [mutationTypes.DELETE_PAGE](state, pageId) {
            if(state.selectedPage === pageId) state.selectedPage = null //unselected deleted page
            Vue.delete(state.pagesOrder,state.pagesOrder.indexOf(pageId)) //delete pages from complete list of pages
            Vue.delete(state.pagesSevereError,pageId) //delete page from list of severe errors
            Vue.delete(state.pagesMinorError,pageId)

            //based on actions, find reverse pages (its links) and correct them (delete it)
            for(let key in state.pages[pageId].actions.link) {
                if(state.pages[pageId].actions.link[key].pageId in state.pages) {
                    let reverseLinks = state.pages[state.pages[pageId].actions.link[key].pageId].reverseLink
                    for(let i=0;i<reverseLinks.length;i++) { //find appropriate reverse link
                        if(reverseLinks[i].pageId === pageId && reverseLinks[i].actionId === state.pages[pageId].actions.link[key].id) {
                            Vue.delete(reverseLinks,i)
                        }
                    }
                }
            }

            //reverse links have to be corrected --> find actions and change pageId to null
            for(let i=0;i<state.pages[pageId].reverseLink.length;i++) {
                if(state.pages[pageId].reverseLink[i].pageId in state.pages) {
                    let links = state.pages[state.pages[pageId].reverseLink[i].pageId].actions.link
                    if(state.pages[pageId].reverseLink[i].actionId in links) 
                        Vue.set(links[state.pages[pageId].reverseLink[i].actionId],'pageId',null)  
                }
            }

            let pageNumber = state.pages[pageId].data.pageNumber
            Vue.delete(state.pages,pageId) //delete page data

            editorNotification.newExternalInfo(String.doTranslationEditor('notification-page-deleted',pageNumber))
        },
        [mutationTypes.ADD_PAGE](state,page) {
            if(page.data.id in state.pages) {
                editorNotification.newInternalError('Page with id '+page.data.id+' already exists. It cannot be created.',false)
                return
            }
            Vue.set(state.pages,page.data.id,page) //add page to pages state

            //update link info -> back from null to this page id
            let i,links,valid
            for(i=0;i<page.reverseLink.length;i++) {
                valid = false
                if(page.reverseLink[i].pageId in state.pages) {
                    links = state.pages[page.reverseLink[i].pageId].actions.link
                    if(page.reverseLink[i].actionId in links) {
                        valid = true
                        Vue.set(links[page.reverseLink[i].actionId],'pageId',page.data.id)  
                    }
                }
                if(!valid) Vue.delete(page.reverseLink,i)
            }

            //build reverse info for other pages
            for (i = 0; i < page.actions.link.length; i++) {
                if (page.actions.link[i].pageId in state.pages) state.pages[page.actions.link[i].pageId].reverseLink.push({ 'pageId': page.id, 'actionId': page.actions.link[i].id })
                else if (page.actions.link[i].pageId != null) Vue.set(state.pages, page.actions.link[i].pageId, { 'reverseLink': [{ 'pageId': page.id, 'actionId': page.actions.link[i].id }] })
            }

            state.pagesOrder.push(page.data.id)
            state.pagesOrder = state.pagesOrder.sort((a,b) => a - b) //sort pages

            editorNotification.newExternalInfo(String.doTranslationEditor('notification-page-added',page.data.pageNumber))
        },
        [mutationTypes.MODULE_REF_DELETED](state,args) {
            //args should contain pageId and actionId -> ref will be set up to null
            //args should contain module name -> moduleName
            for(let i=0;i<args.rev.length;i++) {
                if(args.rev[i].pageId in state.pages) {
                    if(args.rev[i].actionId in state.pages[args.rev[i].pageId].actions[args.moduleName]) {
                        state.pages[args.rev[i].pageId].actions[args.moduleName][args.rev[i].actionId].ref = null
                    }
                }
            }
        },
        [mutationTypes.MODULE_REF_ADDED](state,args) {
            //args should contain rev array with pageId and actionId -> ref will be set up to args.localId value
            //args should contain module name -> moduleName
            for(let i=0;i<args.rev.length;i++) {
                if(args.rev[i].pageId in state.pages) {
                    if(args.rev[i].actionId in state.pages[args.rev[i].pageId].actions[args.moduleName]) {
                        state.pages[args.rev[i].pageId].actions[args.moduleName][args.rev[i].actionId].ref = args.localId
                    }
                }
            }
        },
        [mutationTypes.CHANGE_STARTING_PAGE](state,pageId) {
            if(pageId in state.pages) {
                state.startPage = pageId
                editorNotification.newInternalInfo('Starting page was changed to: '+pageId)
            }
        },
        [mutationTypes.CHANGE_LINK_PAGEID](state,args) {
            //args should contain pageId, actionId, value arguments
            if(args.pageId in state.pages) {
                if(args.actionId in state.pages[args.pageId].actions.link) {
                    let oldValue = state.pages[args.pageId].actions.link[args.actionId].pageId
                    Vue.set(state.pages[args.pageId].actions.link[args.actionId],'pageId',args.value)
                    if(oldValue != null && oldValue != args.value) { //remove old reverse info
                        if(oldValue in state.pages) {
                            for(let i=0;i<state.pages[oldValue].reverseLink.length;i++) {
                                if(state.pages[oldValue].reverseLink[i].pageId == args.pageId && state.pages[oldValue].reverseLink[i].actionId == args.actionId) {
                                    Vue.delete(state.pages[oldValue].reverseLink,i)
                                }
                            }
                        }
                    }
                    if(args.value != null && oldValue != args.value) { //add new reverse info
                        if(args.value in state.pages) {
                            state.pages[args.value].reverseLink.push({'pageId':args.pageId,'actionId':args.actionId})
                            state.pages[args.value].reverseLink.sort((a,b) => {
                                return ((a.pageId < b.pageId) ? -1 : ((a.pageId > b.pageId) ? 1 : 0))
                            })
                        }
                    }
                    editorNotification.newInternalInfo('Link pageId value was changed to: '+args.value)
                    return
                }
            }
            editorNotification.newInternalInfo('Impossible to change link pageId value')
        },
        [mutationTypes.DELETE_LINK](state,args) {
            //args should contain pageId and action
            //link action should be deleted by delete action mutation, this part only takes care of deleting reverse info
            if(args.action.pageId in state.pages) {
                for(let i=0;i<state.pages[args.action.pageId].reverseLink.length;i++) {
                    if(state.pages[args.action.pageId].reverseLink[i].pageId == args.pageId && state.pages[args.action.pageId].reverseLink[i].actionId == args.action.id) {
                        Vue.delete(state.pages[args.action.pageId].reverseLink,i)
                    }
                }
            }
        },
        [mutationTypes.ADD_LINK](state,args) {
            //link action is added by add action mutation, this part takes only care about reverse info
            if(args.action.pageId in state.pages) {
                state.pages[args.action.pageId].reverseLink.push({'pageId':args.pageId,'actionId':args.action.id})
                state.pages[args.action.pageId].reverseLink.sort((a,b) => {
                    return ((a.pageId < b.pageId) ? -1 : ((a.pageId > b.pageId) ? 1 : 0))
                })
            }
        },
        [mutationTypes.DELETE_ACTION](state,args) {
            //args should contain actionType, pageId and actionId variables
            if(args.pageId in state.pages) {
                if(args.actionType in state.pages[args.pageId].actions) {
                    if(args.actionId in state.pages[args.pageId].actions[args.actionType]) {
                        Vue.delete(state.pages[args.pageId].actions[args.actionType],args.actionId)
                        editorNotification.newInternalInfo('Action was deleted properly')
                        return
                    }
                }
            }
            editorNotification.newInternalInfo('Impossible to delete action. Action wasnt loaded properly')

        },
        [mutationTypes.ADD_ACTION](state,args) {
            //args should contain pos and action variables
            //action is copy of action
            //pos contains actionType, pageId and actionId values
            if(args.pos.pageId in state.pages) {
                if(args.pos.actionType in state.pages[args.pos.pageId].actions) {
                    if(args.pos.actionId in state.pages[args.pos.pageId].actions[args.pos.actionType]) { //action already exists --> imposible to add
                        editorNotification.newInternalError('Impossible to add action. Action with same id already exists')
                        return
                    } else {
                        Vue.set(state.pages[args.pos.pageId].actions[args.pos.actionType],args.pos.actionId,args.action)
                    }
                } else { //create even actionType
                    let res = {}
                    res[args.pos.actionId] = args.action
                    Vue.set(state.pages[args.pos.pageId].actions,args.pos.actionType,res)
                }
                editorNotification.newInternalInfo('Action was added properly')
            }
        }
    },
    getters: {
        fullPageText: (state, getters) => (pageModel) => {},
        getOnlyErrorPagesArray: (state,getter) => () => {
            return Object.keys(state.pagesSevereError).sort((a,b) => a - b)
        },
    },
    actions: {
        loadBook({ commit, state }, bookName) {
            editorNotificationWrapper.newInternalInfo(commit,'Starting loading initial data of book',true)

            editorLoaderWrapper.addLoader(commit,'page-load',String.doTranslationEditor('loader-loading-editor-book'))

            return api.getInitialBookData(bookName).then((initData) => {
                editorNotificationWrapper.newInternalInfo(commit,'Initial data of book have been loaded',true)
                editorLoaderWrapper.removeLoader(commit,'page-load')

                editorLoaderWrapper.addLoader(commit,'page-process',String.doTranslationEditor('loader-processing-editor-book'))
                editorNotificationWrapper.newInternalInfo(commit,'Starting processing initial data of book',true)

                commit(mutationTypes.LOAD_BOOK_DATA, initData) //load pages
                commit(mutationTypes.EDIT_PAGE,null)
                commit(mutationTypes.MODULES_PROCESS_LOCAL_DATA,initData) //load modules data
                commit(mutationTypes.MODULES_BUILD_REVERSE_INFO,state.pages) //pages are already prepared at this point
                commit(mutationTypes.VALIDATE_BOOK,{
                    pages:null,
                    actionType:null
                }) //do validation after pages and module data are prepared

                editorNotificationWrapper.newInternalInfo(commit,'Initial data of book have been processed',true)
                editorLoaderWrapper.removeLoader(commit,'page-process')

            }).catch((reason) => {
                editorNotificationWrapper.newInternalInfo(commit,'Initial data of book have been not loaded. Reason is: '+reason,true)
                editorLoaderWrapper.removeLoader(commit,'page-load')
            })
        },
        deletePage({ commit, dispatch, state }, pageId) {
            let i,key, localData, pageToBeValidated = {}
            for(key in state.pages[pageId].actions.link) {
                if(state.pages[pageId].actions.link[key].pageId in state.pages)
                    pageToBeValidated[state.pages[pageId].actions.link[key].pageId] = state.pages[state.pages[pageId].actions.link[key].pageId]
            }
            for(i=0;i<state.pages[pageId].reverseLink.length;i++) {
                if(state.pages[pageId].reverseLink[i].pageId in state.pages)
                    pageToBeValidated[state.pages[pageId].reverseLink[i].pageId] = state.pages[state.pages[pageId].reverseLink[i].pageId]
            }

            localData =  {
                pageData: JSON.parse(JSON.stringify(state.pages[pageId])),
                validatePages: Object.keys(pageToBeValidated), //remmember just 
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.ADD_PAGE,localData.pageData)
                    commit(mutationTypes.MODULES_PAGE_ADDED,localData.pageData)
                    localData.validatePages.push(localData.pageData.data.id) //validate even new page
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:localData.validatePages,
                        actionType:null,
                        onlyId: true
                    })
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.DELETE_PAGE,pageId)
                    commit(mutationTypes.MODULES_PAGE_DELETED,localData.pageData)
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:localData.validatePages,
                        actionType:null,
                        onlyId: true
                    })
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
        },
        addNewPage({ commit, dispatch, state },newPage) {
            //only required value of new page is now pageNumber
            let newPageDict = {}
            Vue.set(newPageDict,'data', {
                'id': newPage.pageNumber,
                'pageNumber': newPage.pageNumber,
                'pageTittle':newPage.pageTittle,
                'pageType':newPage.pageType,
                'text': '',
                'renderedText': ''
            })
            Vue.set(newPageDict, 'actions', {
                'link': {},
            })
            Vue.set(newPageDict, 'renderInfo', {})
            Vue.set(newPageDict, 'reverseLink', [])

            return dispatch('addPage',{
                page:newPageDict,
                isStartingPage: newPage.isStartingPage,
                setLinkAction: newPage.setLinkAction,
                linkData: newPage.linkData
            })
        },
        addPage({ commit, dispatch, state }, args) {
            //args contain page and isStartingPage variables
            let page, localData
            page = args.page
            localData =  {
                page: JSON.parse(JSON.stringify(page)),
                isStartingPage: args.isStartingPage,
                startingPage: JSON.parse(JSON.stringify(state.startPage)),
                setLinkAction: args.setLinkAction,
                linkData: JSON.parse(JSON.stringify(args.linkData)),
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.DELETE_PAGE,localData.page.data.id)
                    commit(mutationTypes.MODULES_PAGE_DELETED,localData.page)
                    let validatedPages = []
                    if(localData.isStartingPage) {
                        commit(mutationTypes.CHANGE_STARTING_PAGE,localData.startingPage)
                        validatedPages.push(localData.page.data.id)
                    }
                    if(localData.setLinkAction && localData.linkData.pageId) {
                        if(validatedPages.indexOf(localData.linkData.pageId) === -1) validatedPages.push(localData.linkData.pageId)
                        localData.linkData.value = null //set value to null
                        commit(mutationTypes.CHANGE_LINK_PAGEID,localData.linkData)
                    }
                    if(validatedPages.length > 0) {
                        commit(mutationTypes.VALIDATE_BOOK,{
                            pages:[localData.startingPage],
                            actionType:null,
                            onlyId: true
                        })
                    }
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.ADD_PAGE,localData.page)
                    commit(mutationTypes.MODULES_PAGE_ADDED,localData.page)
                    let validatedPages = [localData.page.data.id]
                    if(localData.isStartingPage) {
                        validatedPages.push(localData.startingPage)
                        commit(mutationTypes.CHANGE_STARTING_PAGE,localData.page.data.id)
                    }
                    if(localData.setLinkAction && localData.linkData.pageId) {
                        if(validatedPages.indexOf(localData.linkData.pageId) === -1) validatedPages.push(localData.linkData.pageId)
                        localData.linkData.value = localData.page.data.id //set value for new page
                        commit(mutationTypes.CHANGE_LINK_PAGEID,localData.linkData)
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedPages,
                        actionType:null,
                        onlyId: true
                    })
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
        },
        deleteAction({ commit, dispatch, state }, args) {
            //args should contain actionType, pageId and actionId variables
            let localData, valid = false
            if(args.pageId in state.pages) {
                if(args.actionType in state.pages[args.pageId].actions) {
                    if(args.actionId in state.pages[args.pageId].actions[args.actionType]) valid = true
                }
            }
            if(!valid) {
                editorNotificationWrapper.newInternalInfo('Impossible to delete action. Action wasnt loaded properly')
                return
            }
            localData = {
                action: JSON.parse(JSON.stringify(state.pages[args.pageId].actions[args.actionType][args.actionId])),
                pos: JSON.parse(JSON.stringify(args))
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.ADD_ACTION,localData)
                    commit(mutationTypes.MODULES_ACTION_ADDED,localData)
                    if(localData.pos.actionType === 'link') {
                        commit(mutationTypes.ADD_LINK,{
                            pageId: localData.pos.pageId,
                            action:localData.action
                        })
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:[localData.pos.pageId],
                        actionType:null,
                        onlyId: true
                    })
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.DELETE_ACTION,localData.pos)
                    commit(mutationTypes.MODULES_ACTION_DELETED,localData)
                    if(localData.pos.actionType === 'link') {
                        commit(mutationTypes.DELETE_LINK,{
                            pageId: localData.pos.pageId,
                            action:localData.action
                        })
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:[localData.pos.pageId],
                        actionType:null,
                        onlyId: true
                    })
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
            
        },
        changeLinkPageId({ commit, dispatch, state }, args) {
            let valid = false, localData

            if(args.pageId in state.pages) {
                if(args.actionId in state.pages[args.pageId].actions.link) valid = true
            }
            if(!valid) editorNotificationWrapper.newInternalInfo('Impossible to change link pageId value')

            localData = {
                newLink: JSON.parse(JSON.stringify(args)),
                oldPageId: state.pages[args.pageId].actions.link[args.actionId].pageId
            }
            
            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.CHANGE_LINK_PAGEID,{
                        pageId: localData.newLink.pageId,
                        actionId: localData.newLink.actionId,
                        value: localData.oldPageId
                    })
                    let validatedBooks = [localData.newLink.pageId]
                    if(localData.oldPageId != null && validatedBooks.indexOf(localData.oldPageId) === -1) validatedBooks.push(localData.oldPageId)
                    if(localData.newLink.value != null && validatedBooks.indexOf(localData.newLink.value) === -1) validatedBooks.push(localData.newLink.value)
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.CHANGE_LINK_PAGEID,localData.newLink)
                    let validatedBooks = [localData.newLink.pageId]
                    if(localData.oldPageId != null && validatedBooks.indexOf(localData.oldPageId) === -1) validatedBooks.push(localData.oldPageId)
                    if(localData.newLink.value != null && validatedBooks.indexOf(localData.newLink.value) === -1) validatedBooks.push(localData.newLink.value)
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
        },
        moduleRefAdded({ commit, dispatch, state }, args) {
            //args should contain moduleName, localId and rev (reverseInfo) --> how the ref actions should be changed
            commit(mutationTypes.MODULE_REF_ADDED,{
                moduleName:args.moduleName,
                localId:args.localId,
                rev: args.rev
            })

            let pages = {}
            for(let i=0;i<args.rev.length;i++) {
                if(!(args.rev[i].pageId in pages)) {
                    pages[args.rev[i].pageId] = state.pages[args.rev[i].pageId]
                } 
            }

            commit(mutationTypes.MODULES_UPDATE_REV,{
                    moduleName:args.moduleName,
                    localId:args.localId,
                    pages:pages,
                })   
            commit(mutationTypes.VALIDATE_BOOK,{
                pages:pages,
                actionType:null
            }) //run validation after rev has been added   

        },
        moduleRefDeleted({ commit, dispatch, state }, args) {
            //args should contain moduleName and rev (reverseInfo) --> how the ref actions should be changed
            commit(mutationTypes.MODULE_REF_DELETED,{
                moduleName:args.moduleName,
                rev:args.rev
            })

            let pages = {}
            for(let i=0;i<args.rev.length;i++) {
                if(!(args.rev[i].pageId in pages)) {
                    pages[args.rev[i].pageId] = state.pages[args.rev[i].pageId]
                } 
            }

            commit(mutationTypes.VALIDATE_BOOK,{
                pages:pages,
                actionType:null
            }) //run validation after rev has been deleted
        }
    }
}