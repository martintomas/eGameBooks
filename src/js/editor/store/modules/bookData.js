import * as mutationTypes from 'editor/store/mutationTypes'
import * as api from 'editor/api'
import { MarkdownComp } from 'editor/services/markdown-it/markdownComp.js'
import Vue from 'vue' //use Vue.set for manipulation with dict/array --> it is reactive

import {editorNotification,editorNotificationWrapper,editorLoaderWrapper} from 'editor/services/defaults.js'
import {buildRenderInfo,isPageCorrect,isPageCorrectComplete} from 'editor/services/bookFuncs'
import {AllowedActions,ErrorImportance} from 'editor/constants'

/*
Structure of one page
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

export function actualizeValidation(pageId,original, res) {
    if(res.length > 0) {
        if(pageId in original) for(let i=0;i<res.length;i++) original[pageId].push(res[i])
        else Vue.set(original,pageId,res)
    }
}

var markdownItAllowedActions = []
for(let key in AllowedActions) markdownItAllowedActions.push(AllowedActions[key]) //provide array of allowed actions

var markdownItAnalysis = {}
markdownItAnalysis[AllowedActions.LINK] = []

export default {
    state: {
        markdownCompDefault: new MarkdownComp(markdownItAllowedActions),
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
            editorNotification.newInternalInfo('Starting processing initial data of book',true)

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

                //do page validation
                let res = isPageCorrect(state,state.pages[page.id])
                if(res[ErrorImportance.MINOR].length > 0) Vue.set(state.pagesMinorError,page.id,res[ErrorImportance.MINOR])
                if(res[ErrorImportance.SEVERE].length > 0) Vue.set(state.pagesSevereError,page.id,res[ErrorImportance.SEVERE])

            })
            
            //do page validation after all data have been build
            for(let pageKey in state.pages) {
                let res = isPageCorrectComplete(state,state.pages[pageKey])
                actualizeValidation(pageKey,state.pagesMinorError,res[ErrorImportance.MINOR])
                actualizeValidation(pageKey,state.pagesSevereError,res[ErrorImportance.SEVERE])
            }

            state.pagesOrder = state.pagesOrder.sort((a,b) => a - b) //sort pages

            if (state.editedPage === null || !(state.editedPage in state.pages)) { //be sure that edited page is set up and exists
                //console.log('STORE: changed edited page by force')
                editorNotification.newInternalWarn('Edited page was changed by force',true)
                for (let key in state.pages) {
                    state.editedPage = key //set up first suitable pages as edited
                    break
                }
            }

            editorNotification.newInternalInfo('Initial data of book have been processed',true)
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

            if (Object.keys(state.pages).length > 0) { //check if pages data are already loaded
                if (pageId in state.pages) {
                    state.editedPage = pageId //change only edited page in case that page id is valid one
                    editorNotification.newExternalInfo(String.doTranslationEditor('notification-loaded-page',state.pages[pageId].data.pageNumber))
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

            Vue.delete(state.pages,pageId) //delete page data
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
                commit(mutationTypes.LOAD_BOOK_DATA, initData)
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