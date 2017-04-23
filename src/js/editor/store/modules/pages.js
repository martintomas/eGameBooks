import * as mutationTypes from 'editor/store/mutation-types'
import * as api from 'editor/api'
import { MarkdownComp } from 'editor/components/markdown-it/markdownComp.js'
import Vue from 'vue' //use Vue.set for manipulation with dict/array --> it is reactive

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
        selectedPage: null,
        editedPage: null
    },
    mutations: {
        [mutationTypes.LOAD_INITIAL_DATA](state, initData) {
            console.log('STORE: loading initial data')

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
                    else Vue.set(state.pages, page.actions.link[i].pageId, { 'reverseLink': [{ 'pageId': page.id, 'actionId': page.actions.link[i].id }] })
                }

            })

            if (state.editedPage === null || !(state.editedPage in state.pages)) { //be sure that edited page is set up and exists
                console.log('STORE: changed edited page by force')
                for (let key in state.pages) {
                    state.editedPage = key //set up first suitable pages as edited
                    break
                }
            }
        },
        [mutationTypes.RENDER_PAGE](state, page) {
            console.log('STORE: rendering text for page number ' + page.id)
        },
        [mutationTypes.SELECT_PAGE](state, pageId) {
            console.log('STORE: selecting new page ' + pageId)

            if (pageId in state.pages) state.selectedPage = pageId
            else state.selectedPage = null
        },
        [mutationTypes.EDIT_PAGE](state, pageId) {
            console.log('STORE: editing new page ' + pageId)

            if (Object.keys(state.pages).length > 0) { //check if pages data are already loaded
                if (pageId in state.pages) state.editedPage = pageId //change only edited page in case that page id is valid one
            } else {
                state.editedPage = pageId
            }

        },
        [mutationTypes.GET_ALL_PAGES](state, initData) {}
    },
    getters: {
        fullPageText: (state, getters) => (pageModel) => {}
    },
    actions: {
        load({ dispatch }) {},
    }
}