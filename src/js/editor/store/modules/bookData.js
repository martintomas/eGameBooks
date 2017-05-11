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
        existsInText:
    },...},
    ...
},
renderInfo: {
    link: {id:{ //id corrrespond to action id
        id:
        exist:
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
        [mutationTypes.VALIDATE_BOOK](state, pageId=null) {
            let pages,res,key
            if(pageId === null) { //validate all pages
                pages = state.pages
            } else {
                pages = {pageId:state.pages[pageId]}
            }

            for(key in pages) {
                res = isPageCorrect(state,pages[key])
                if(res[ErrorImportance.MINOR].length > 0) Vue.set(state.pagesMinorError,key,res[ErrorImportance.MINOR])
                if(res[ErrorImportance.SEVERE].length > 0) Vue.set(state.pagesSevereError,key,res[ErrorImportance.SEVERE])
            }

            editorNotification.newInternalInfo('Initial data of book have been validated',true)
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
                    editorNotification.newInternalWarn('Edited page was changed by force',true)
                    state.editedPage = state.pagesOrder[0] //set up first suitable pages as edited
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
                commit(mutationTypes.VALIDATE_BOOK,null) //do validation after pages and module data are prepared

                editorNotificationWrapper.newInternalInfo(commit,'Initial data of book have been processed',true)
                editorLoaderWrapper.removeLoader(commit,'page-process')

            }).catch((reason) => {
                editorNotificationWrapper.newInternalInfo(commit,'Initial data of book have been not loaded. Reason is: '+reason,true)
                editorLoaderWrapper.removeLoader(commit,'page-load')
            })
        },
        deletePage({ commit, dispatch, state }, pageId) {
            let pageBackup = state.pages[pageId] //remmember backup for undo operation
            commit(mutationTypes.ADD_UNDO_ACTION,() => {
                dispatch('addPage',pageBackup)
            })
            commit(mutationTypes.DELETE_PAGE,pageId)
        },
        addEmptyPage({ commit, dispatch, state },pageId) {

        },
        addPage({ commit, dispatch, state }, page) {
            console.log(page)
        }
    }
}