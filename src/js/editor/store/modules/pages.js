import * as mutationTypes from 'editor/store/mutation-types'
import * as api from 'editor/api'
import { MarkdownComp } from 'editor/components/markdown-it/markdownComp.js'
import Vue from 'vue' //use Vue.set for manipulation with dict/array --> it is reactive
import {notification} from 'editor/store/modules/notification.js'
import * as mutationTypesMain from 'store/mutationTypes'

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

function buildRenderInfo(renderInfo, actionInfo) {
    var res = {}
    for (let key in renderInfo) { //go through action types
        if (!(key in res)) res[key] = [] //prepare array for storing data

        let i, j, isValid
        if (key in actionInfo) { //key exist in actions
            for (i = 0; i < renderInfo[key].length; i++) {
                isValid = false
                for (let j = 0; j < actionInfo[key].length; j++) {
                    if (renderInfo[key][i].id === actionInfo[key][j].id) { //appropriate action for rendered action exists
                        actionInfo[key][j].existsInText = true
                        isValid = true
                        break
                    }
                }
                res[key].push({ 'id': renderInfo[key][i].id, 'exist': isValid })
            }
        } else { //key is completely missing in actionInfo
            for (i = 0; i < renderInfo[key].length; i++) {
                res[key].push({ 'id': renderInfo[key][i].id, 'exist': false })
            }
        }
    }
    return res
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
        [mutationTypes.LOAD_INITIAL_DATA](state, initData) {
            //console.log('STORE: loading initial data')
            notification.newInternalInfo('Starting processing initial data of book',true)

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
                notification.newInternalWarn('Edited page was changed by force',true)
                for (let key in state.pages) {
                    state.editedPage = key //set up first suitable pages as edited
                    break
                }
            }

            notification.newInternalInfo('Initial data of book have been processed',true)
        },
        [mutationTypes.RENDER_PAGE](state, page) {
            //console.log('STORE: rendering text for page number ' + page.id)
            notification.newInternalInfo('Rendering text for page number ' + page.id,true)
        },
        [mutationTypes.SELECT_PAGE](state, pageId) {
            //console.log('STORE: selecting new page ' + pageId)
            notification.newInternalInfo('Selecting new page ' + pageId,true)

            if (pageId in state.pages) state.selectedPage = pageId
            else state.selectedPage = null
        },
        [mutationTypes.EDIT_PAGE](state, pageId) {
            //console.log('STORE: editing new page ' + pageId)
            notification.newInternalInfo('Editing new page ' + pageId,true)

            if (Object.keys(state.pages).length > 0) { //check if pages data are already loaded
                if (pageId in state.pages) {
                    state.editedPage = pageId //change only edited page in case that page id is valid one
                    notification.newExternalInfo(String.doTranslationEditor('notification-loaded-page',state.pages[pageId].data.pageNumber))
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
            notification.newInternalInfo('Starting loading initial data of book',true)

            commit('loader/'+mutationTypesMain.MODIFY_LOADER_QUEUE, {start:true,id:'page-load',text:String.doTranslationEditor('loader-loading-editor-book')},{ root: true })

            api.getInitialPageData(initData => {
                commit('loader/'+mutationTypesMain.MODIFY_LOADER_QUEUE, {start:true,id:'page-process',text:String.doTranslationEditor('loader-processing-editor-book')},{ root: true })
                commit(mutationTypes.LOAD_INITIAL_DATA, initData)
                commit('loader/'+mutationTypesMain.MODIFY_LOADER_QUEUE, {start:false,id:'page-process'},{ root: true })
            }, bookName).then(() => {
                notification.newInternalInfo('Initial data of book have been loaded',true)
                commit('loader/'+mutationTypesMain.MODIFY_LOADER_QUEUE, {start:false,id:'page-load'},{ root: true })
            }).catch((reason) => {
                notification.newInternalError('Initial data of book have been not loaded. Reason is: '+reason,true)
                commit('loader/'+mutationTypesMain.MODIFY_LOADER_QUEUE, {start:false,id:'page-load'},{ root: true })
            })
        },
    }
}