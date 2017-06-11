import * as mutationTypes from 'editor/store/mutationTypes'
import * as api from 'editor/api'
import { MarkdownComp } from 'editor/services/markdown-it/markdownComp.js'
import Vue from 'vue' //use Vue.set for manipulation with dict/array --> it is reactive

import {editorNotification,editorNotificationWrapper,editorLoaderWrapper} from 'editor/services/defaults.js'
import {buildRenderInfo,getPageJson} from 'editor/services/bookFuncs'
import {isPageCorrect} from 'editor/services/validators'
import {AllowedActions,ErrorImportance} from 'editor/constants'
import {messageBoxWrapper} from 'editor/services/defaults.js'

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
            Vue.set(actionInfo[key][i],'existsInText',false)
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
        editedPage: null,
        lastSave: null,
    },
    mutations: {
        [mutationTypes.LOAD_BOOK_DATA](state, initData) {
            //console.log('STORE: loading initial data')
            editorNotification.newInternalInfo('Starting processing initial pages of book',true)

            for(let key in initData.main) Vue.set(state.mainInfo,key,initData.main[key]) //load main info
            state.startPage = initData.main.startingPage //set up starting page

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
                Vue.set(state.pages[page.id], 'renderInfo', buildRenderInfo(analysis, state.pages[page.id].actions)) //build complete render info

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
        [mutationTypes.RENDER_PAGE](state, args) {
            //args should contain pageId and text
            if(args.pageId in state.pages) {
                //editorNotification.newInternalInfo('Rendering text for page number ' + args.pageId,true)

                Vue.set(state.pages[args.pageId].data,'text',args.text)
                let analysis = JSON.parse(JSON.stringify(markdownItAnalysis)) //deep copy of markdownItAnalysis
                Vue.set(state.pages[args.pageId].data, 'renderedText', state.markdownCompDefault.render(args.text, { 'analysis': analysis, 'pageId': args.pageId })) //render text
                Vue.set(state.pages[args.pageId], 'renderInfo', buildRenderInfo(analysis, state.pages[args.pageId].actions)) //build complete render info

                editorNotification.newInternalInfo('Text for page number ' + args.pageId + ' has been rendered',true)
            }
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
                            i--
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
                if(!valid) {
                    Vue.delete(page.reverseLink,i)
                    i--
                }
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
            if(pageId in state.pages || pageId === null) {
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
                                    i--
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
                        i--
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
                        if(args.actionType in state.pages[args.pageId].renderInfo && args.actionId in state.pages[args.pageId].renderInfo[args.actionType]) { //change rendered info value --> action doenst exists
                            Vue.set(state.pages[args.pageId].renderInfo[args.actionType][args.actionId],'exist',false)
                        }
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
                        if(args.pos.actionType in state.pages[args.pos.pageId].renderInfo && args.pos.actionId in state.pages[args.pos.pageId].renderInfo[args.pos.actionType]) { //change rendered info value --> action exists
                            Vue.set(state.pages[args.pos.pageId].actions[args.pos.actionType][args.pos.actionId],'existsInText',true)
                            Vue.set(state.pages[args.pos.pageId].renderInfo[args.pos.actionType][args.pos.actionId],'exist',true)
                        }
                    }
                } else { //create even actionType
                    let res = {}
                    res[args.pos.actionId] = args.action
                    Vue.set(state.pages[args.pos.pageId].actions,args.pos.actionType,res)
                }
                editorNotification.newInternalInfo('Action was added properly')
            }
        },
        [mutationTypes.EDIT_ACTION](state,args) {
            //args should contain pos and action variables
            //action are new action values
            //pos contains actionType, pageId and actionId values
            if(args.pos.pageId in state.pages) {
                if(args.pos.actionType in state.pages[args.pos.pageId].actions) {
                    if(args.pos.actionId in state.pages[args.pos.pageId].actions[args.pos.actionType]) { //action exists
                        let attrBlackList = {'pageId':null,'id':null}
                        for(let key in args.action) {
                            if(key in state.pages[args.pos.pageId].actions[args.pos.actionType][args.pos.actionId] && !(key in attrBlackList)) {
                                Vue.set(state.pages[args.pos.pageId].actions[args.pos.actionType][args.pos.actionId],key,args.action[key])
                            }
                        }
                    } else {
                        editorNotification.newInternalError('Impossible to edit action. Action doesnt exists')
                    }
                }
                editorNotification.newInternalInfo('Action was edited properly')
            }

        },
        [mutationTypes.CHANGE_PAGE_SETTINGS](state,args) {
            //args should contain pageId and pageNewValues values
            if(args.pageId in state.pages) {
                if(args.pageNewValues.pageTittle || args.pageNewValues.pageTittle === null) 
                    Vue.set(state.pages[args.pageId].data,'pageTittle',args.pageNewValues.pageTittle)

                editorNotification.newExternalInfo(String.doTranslationEditor('notification-page-edited',args.pageId))
            }
        },
        [mutationTypes.CHANGE_BOOK_NAME](state,bookName) {
            if(bookName != '') {
                Vue.set(state.mainInfo,'name',bookName)
                editorNotification.newInternalInfo('Book name has been changed to '+bookName,true)
            }
        },
        [mutationTypes.CHANGE_USED_MODULES](state,usedMobules) {
            Vue.set(state.mainInfo,'usedModules',usedMobules)
            editorNotification.newInternalInfo('Used modules has been changed to '+usedMobules,true)
        },
        [mutationTypes.UPDATE_LAST_SAVE](state,newTime) {
            Vue.set(state,'lastSave',newTime)

            editorNotification.newInternalInfo('Last save was change to '+newTime,true)
        },
        [mutationTypes.BOOK_CLEAR](state) {
            Vue.set(state,'mainInfo',{})
            Vue.set(state,'pages',{})
            Vue.set(state,'pagesOrder',[])
            Vue.set(state,'startPage',1)
            Vue.set(state,'pagesSevereError',{})
            Vue.set(state,'pagesMinorError',{})
            Vue.set(state,'selectedPage',null)
            Vue.set(state,'editedPage',null)
            Vue.set(state,'lastSave',null)
        }
    },
    getters: {
        fullPageText: (state, getters) => (pageModel) => {},
        getOnlyErrorPagesArray: (state,getter) => () => {
            return Object.keys(state.pagesSevereError).sort((a,b) => a - b)
        },
    },
    actions: {
        loadBook({ commit, state }, bookId) {
            editorNotificationWrapper.newInternalInfo(commit,'Starting loading initial data of book',true)

            editorLoaderWrapper.addLoader(commit,'page-load',String.doTranslationEditor('loader-loading-editor-book'))

            return api.getInitialBookData(bookId).then((initData) => {
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
        updatePageText({ commit, dispatch, state }, args) {
            //args should contain pageId and text
            if(!(args.pageId in state.pages)) {
                editorNotificationWrapper.newInternalError(commit,'Impossible to update page text. Page is missing!',false)
                return
            }

            let localData =  {
                pageId: args.pageId,
                text: args.text,
                oldText: state.pages[args.pageId].data.text,
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.RENDER_PAGE,{
                        pageId: localData.pageId,
                        text: localData.oldText
                    })
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:[localData.pageId],
                        actionType:null,
                        onlyId: true
                    })
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.RENDER_PAGE,localData)
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:[localData.pageId],
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
                            pages:validatedPages,
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
                editorNotificationWrapper.newInternalInfo(commit,'Impossible to delete action. Action wasnt loaded properly',false)
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
                    let validatedBooks = [localData.pos.pageId]
                    if(localData.pos.actionType === 'link') {
                        if(localData.action.pageId != null || localData.action.pageId != '') validatedBooks.push(localData.action.pageId)
                        commit(mutationTypes.ADD_LINK,{
                            pageId: localData.pos.pageId,
                            action:localData.action
                        })
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-new-action'),false)
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.DELETE_ACTION,localData.pos)
                    commit(mutationTypes.MODULES_ACTION_DELETED,localData)
                    let validatedBooks = [localData.pos.pageId]
                    if(localData.pos.actionType === 'link') {
                        if(localData.action.pageId != null || localData.action.pageId != '') validatedBooks.push(localData.action.pageId)
                        commit(mutationTypes.DELETE_LINK,{
                            pageId: localData.pos.pageId,
                            action:localData.action
                        })
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-action'),false)
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
            
        },
        savePage({ commit, dispatch, state }, pageId) { 
            if(pageId in state.pages) {
                res = getPageJson(state.pages[pageId])
                api.savePage(res).then(() => {
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('page-saved',pageId),false)
                }).catch((reason) => {
                    editorNotificationWrapper.newExternalError(commit,String.doTranslationEditor('page-no-saved',pageId,reason),false)
                })
            }
        },
        saveBook({ commit, dispatch, state }) { 
            let res,key,pageRes

            //prepare main
            res = {
                main: {
                    name: state.mainInfo.name,
                    author: state.mainInfo.author,
                    published: state.mainInfo.published,
                    lastSave: state.mainInfo.lastSave,
                    usedModules: state.mainInfo.usedModules,
                    startingPage: state.startPage,
                },
            }

            //prepare pages
            res.pages = []
            for(key in state.pages) {
                res.pages.push(getPageJson(state.pages[key]))
            }

            //prepare modules
            res.modules = {}
            dispatch('saveModules',res).then(() => {
                return api.saveBook(res) //save book data
            }).then(() => {
                commit(mutationTypes.UPDATE_LAST_SAVE,new Date().timeNow())
                editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('book-saved'),false)
            }).catch((reason) => {
                editorNotificationWrapper.newExternalError(commit,String.doTranslationEditor('book-no-saved',reason),false)
            })
        },
        newLinkAction({ commit, dispatch, state }, args) {
            let valid = true
            if(!(args.actionData.pageId in state.pages) || !(args.pageId in state.pages)) {
                valid = false
            } else if('link' in state.pages[args.pageId].actions) { //check if link action is there
                if(args.actionData.id in state.pages[args.pageId].actions.link) { //check if action already exists
                    valid = false
                }
            }

            if(!valid) {
                editorNotificationWrapper.newInternalInfo(commit,'Impossible to create appropriate link action',false)
                return
            }

            let linkAction = {
                id:args.actionData.id,
                pageId: args.actionData.pageId,
                condition: args.actionData.condition,
                existsInText: false,
            }

            dispatch('newAction',{
                'actionType':AllowedActions.LINK,
                'pageId':args.pageId,
                'action':linkAction
            })
        },
        newAction({ commit, dispatch, state }, args) {
            let localData = {
                action: JSON.parse(JSON.stringify(args.action)),
                pos: JSON.parse(JSON.stringify({
                    'actionType':args.actionType,
                    'pageId':args.pageId,
                    'actionId':args.action.id,
                }))
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.DELETE_ACTION,localData.pos)
                    commit(mutationTypes.MODULES_ACTION_DELETED,localData)
                    let validatedBooks = [localData.pos.pageId]
                    if(localData.pos.actionType === 'link') {
                        if(localData.action.pageId != null || localData.action.pageId != '') validatedBooks.push(localData.action.pageId)
                        commit(mutationTypes.DELETE_LINK,{
                            pageId: localData.pos.pageId,
                            action:localData.action
                        })
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-deleted-action'),false)
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.ADD_ACTION,localData)
                    commit(mutationTypes.MODULES_ACTION_ADDED,localData)
                    let validatedBooks = [localData.pos.pageId]
                    if(localData.pos.actionType === 'link') {
                        if(localData.action.pageId != null || localData.action.pageId != '') validatedBooks.push(localData.action.pageId)
                        commit(mutationTypes.ADD_LINK,{
                            pageId: localData.pos.pageId,
                            action:localData.action
                        })
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-new-action'),false)
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
        },
        editAction({ commit, dispatch, state }, args) {
            let valid = false
            if(args.pageId in state.pages) {
                if(args.actionType in state.pages[args.pageId].actions) {
                    if(args.actionId in state.pages[args.pageId].actions[args.actionType]) valid = true
                }
            }

            if(!valid) {
                editorNotificationWrapper.newInternalInfo(commit,'Impossible to edit action. Action doesnt exists.',false)
                return
            }

            let localData = {
                action: JSON.parse(JSON.stringify(args.actionData)), //new action values
                pos: JSON.parse(JSON.stringify({
                    'actionType':args.actionType,
                    'pageId':args.pageId,
                    'actionId':args.actionId,
                })),
                oldAction: JSON.parse(JSON.stringify(state.pages[args.pageId].actions[args.actionType][args.actionId]))
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.EDIT_ACTION,{
                        pos:localData.pos,
                        action:localData.oldAction
                    })
                    commit(mutationTypes.MODULES_ACTION_EDITED, {
                        pos: localData.pos,
                        action: localData.oldAction,
                        oldAction: localData.action,
                    })
                    let validatedBooks = [localData.pos.pageId]
                    if(localData.pos.actionType === AllowedActions.LINK) {
                        if(localData.action.pageId && localData.action.pageId != localData.oldAction.pageId) {
                            if(localData.action.pageId != null || localData.action.pageId != '') validatedBooks.push(localData.action.pageId)
                            if(localData.oldAction.pageId != null || localData.oldAction.pageId != '') validatedBooks.push(localData.oldAction.pageId)
                            commit(mutationTypes.CHANGE_LINK_PAGEID,{
                                pageId: localData.pos.pageId,
                                actionId: localData.pos.actionId,
                                value: localData.oldAction.pageId
                            })
                        }   
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edit-action'),false)
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.EDIT_ACTION,localData)
                    commit(mutationTypes.MODULES_ACTION_EDITED, localData)
                    let validatedBooks = [localData.pos.pageId]
                    if(localData.pos.actionType === AllowedActions.LINK) {
                        if(localData.action.pageId && localData.action.pageId != localData.oldAction.pageId) {
                            if(localData.action.pageId != null || localData.action.pageId != '') validatedBooks.push(localData.action.pageId)
                            if(localData.oldAction.pageId != null || localData.oldAction.pageId != '') validatedBooks.push(localData.oldAction.pageId)
                            commit(mutationTypes.CHANGE_LINK_PAGEID,{
                                pageId: localData.pos.pageId,
                                actionId: localData.pos.actionId,
                                value: localData.action.pageId
                            })
                        }   
                    }
                    commit(mutationTypes.VALIDATE_BOOK,{
                        pages:validatedBooks,
                        actionType:null,
                        onlyId: true
                    })
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-edit-action'),false)
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
            if(!valid) {
                editorNotificationWrapper.newInternalInfo(commit,'Impossible to change link pageId value',false)
                return
            }

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
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-modify-link-action'),false)
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
                    editorNotificationWrapper.newExternalInfo(commit,String.doTranslationEditor('notification-modify-link-action'),false)
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })
        },
        changeSettingsPage({ commit, dispatch, state }, args) {
            //args should contain page, pageTittle and isStartingPage arguments
            let localData
            localData =  {
                pageId: args.page.data.id,
                pageNewValues: {pageTittle: args.pageTittle}, //only tittle page is changed now
                pageData: JSON.parse(JSON.stringify(args.page.data)), //remmeber old page data values
                isStartingPage: args.isStartingPage,
                startingPage: JSON.parse(JSON.stringify(state.startPage)), //remmeber old starting page
            }

            dispatch('undoRedoWrapper',{
                'undoAction':function(localData) {
                    commit(mutationTypes.CHANGE_PAGE_SETTINGS,{
                        pageId: localData.pageId,
                        pageNewValues: localData.pageData
                    })
                    let validatedPages = []
                    if(localData.isStartingPage && localData.pageId != localData.startingPage) {
                        commit(mutationTypes.CHANGE_STARTING_PAGE,localData.startingPage)
                        validatedPages.push(localData.pageId)
                        validatedPages.push(localData.startingPage)
                    } else if(!localData.isStartingPage && localData.pageId == localData.startingPage) {
                        commit(mutationTypes.CHANGE_STARTING_PAGE,localData.pageId)
                        validatedPages.push(localData.pageId)
                    }
                    if(validatedPages.length > 0) {
                        commit(mutationTypes.VALIDATE_BOOK,{
                            pages:validatedPages,
                            actionType:null,
                            onlyId: true
                        })
                    }
                },
                'undoArgs':localData,
                'redoAction':function(localData) {
                    commit(mutationTypes.CHANGE_PAGE_SETTINGS,localData)
                    let validatedPages = []
                    if(localData.isStartingPage && localData.pageId != localData.startingPage) { //add start page atribute
                        commit(mutationTypes.CHANGE_STARTING_PAGE,localData.pageId)
                        validatedPages.push(localData.pageId)
                        validatedPages.push(localData.startingPage)
                    } else if(!localData.isStartingPage && localData.pageId == localData.startingPage) { //remove start page atribute
                        commit(mutationTypes.CHANGE_STARTING_PAGE,null)
                        validatedPages.push(localData.pageId)
                    }
                    if(validatedPages.length > 0) {
                        commit(mutationTypes.VALIDATE_BOOK,{
                            pages:validatedPages,
                            actionType:null,
                            onlyId: true
                        })
                    }
                },
                'redoArgs':localData,
                'undo':true,
                'redo':false,
                'runRedo':true
            })

        },
        changeBookSettings({ commit, dispatch, state }, bookData) {
            //bookData should contain name and usedModules variables
            //!!! no undo/redo wrapper
            dispatch('changeBookName',bookData.name).then(() => {
                return dispatch('changeBookModules',bookData.usedModules)
            }).then(() => {
                messageBoxWrapper.showInformationMessage(commit,String.doTranslationEditor('settings-book-saved'))
            }).catch((reason) => {
                switch(reason) {
                    case 'no-unique-name':
                        messageBoxWrapper.showErrorMessage(commit,String.doTranslationEditor('settings-book-no-unique-name'))
                        break
                    default:
                        console.log('Impossible to change book setting. Reason of error is: '+reason)
                }
            })
        },
        changeBookName({ commit, dispatch, state }, newName) {
            if(newName != state.mainInfo.name && newName != '') {
                editorLoaderWrapper.addLoader(commit,'book-name-unique',String.doTranslationEditor('loader-checking-book-name'))
                return api.isBookNameUnique(newName).then((value) => {
                    editorLoaderWrapper.removeLoader(commit,'book-name-unique')
                    if(value) commit(mutationTypes.CHANGE_BOOK_NAME,newName)
                    else throw 'no-unique-name'
                }).catch((reason)=> {
                    //error is resolved up, here only remove loader
                    editorLoaderWrapper.removeLoader(commit,'book-name-unique')
                    throw reason
                })
            }
        },
        changeBookModules({ commit, dispatch, state }, newModules) {
            commit(mutationTypes.CHANGE_USED_MODULES,newModules)
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
        },
        clear({ commit, dispatch, state }) {
            commit(mutationTypes.MODULES_CLEAR)
            commit(mutationTypes.BOOK_CLEAR)
        }
    }
}