import * as mutationTypes from 'editor/store/mutationTypes'
import * as api from 'editor/api'
import { MarkdownComp } from 'editor/services/markdown-it/markdownComp.js'
import Vue from 'vue' //use Vue.set for manipulation with dict/array --> it is reactive

import {editorNotification,editorNotificationWrapper,editorLoaderWrapper} from 'editor/services/defaults.js'
import {buildRenderInfo} from 'editor/services/bookFuncs'

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
    link: [{
        id:
        pageId:
        condition:
        existsInText:
    },...],
    ...
},
renderInfo: {
    link: [{
        id:
        exist:
    },...],
    ...
},
reverseLink: [{
    pageId:
    actionId:    
},...]
*/

function actionDoesntExistByDefault(actionInfo) { //set up by default for all actions that they are missing in text
    for (let key in actionInfo) {
        for (let i = 0; i < actionInfo[key].length; i++) {
            actionInfo[key][i]['existsInText'] = false
        }
    }
    return actionInfo
}

var markdownItAllowedActions = ['link']
var markdownItAnalysisTemp = { 'link': [] }

export default {
    state: {
        markdownItAllowedActions: markdownItAllowedActions, //to be sure that other part of system can access it
        markdownCompDefault: new MarkdownComp(markdownItAllowedActions),
        pages: {},
        pagesOrder: [], //array that describes which pages exists
        selectedPage: null,
        editedPage: null
    },
    mutations: {
        [mutationTypes.LOAD_BOOK_DATA](state, initData) {
            //console.log('STORE: loading initial data')
            editorNotification.newInternalInfo('Starting processing initial data of book',true)

            initData.pages.forEach(page => {
                if (!(page.id in state.pages)) Vue.set(state.pages, page.id, { 'data': null, 'actions': null, 'renderInfo': null, 'reverseLink': [] }) //create emty dict if it is not existing
                Vue.set(state.pages[page.id], 'data', {
                    'id': page.id,
                    'pageNumber': page.pageNumber,
                    'text': page.text,
                    'renderedText': ''
                })

                let analysis = JSON.parse(JSON.stringify(markdownItAnalysisTemp)) //deep copy of markdownItAnalysisTemp
                Vue.set(state.pages[page.id].data, 'renderedText', state.markdownCompDefault.render(page.text, { 'analysis': analysis, 'pageId': page.id })) //render text
                Vue.set(state.pages[page.id], 'actions', actionDoesntExistByDefault(page.actions))
                Vue.set(state.pages[page.id], 'renderInfo', buildRenderInfo(analysis, page.actions)) //build complete render info

                //update reverse links
                for (let i = 0; i < page.actions.link.length; i++) {
                    if (page.actions.link[i].pageId in state.pages) state.pages[page.actions.link[i].pageId].reverseLink.push({ 'pageId': page.id, 'actionId': page.actions.link[i].id })
                    else if (page.actions.link[i].pageId != null) Vue.set(state.pages, page.actions.link[i].pageId, { 'reverseLink': [{ 'pageId': page.id, 'actionId': page.actions.link[i].id }] })
                }

                state.pagesOrder.push(page.id) //remmember all existing pages

            })

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
        [mutationTypes.GET_ALL_PAGES](state, initData) {
            
        }
    },
    getters: {
        fullPageText: (state, getters) => (pageModel) => {}
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
    }
}