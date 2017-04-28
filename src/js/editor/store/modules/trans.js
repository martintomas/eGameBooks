import * as mutationTypes from 'editor/store/mutation-types'
import * as api from 'editor/api'
import Vue from 'vue'
import {notification} from 'editor/store/modules/notification.js'

let warnInformed = false
export default {
    state: {
        langData: {},
        langDataLength: 0,
    },
    mutations: {
        [mutationTypes.GET_EDITOR_LANG_TEXT](state, langData) { //set up lang data
            //console.log('STORE: loading text for appropriate language')
            notification.newInternalInfo('Starting processing editor language',true)

            for (let key in langData) {
                Vue.set(state.langData, key, langData[key])
                state.langDataLength += 1
            }

            notification.newInternalInfo('Editor language is prepared now',true)
        }
    },
    actions: {
        loadLanguage({ commit, state }, lang) {
            notification.newInternalInfo('Starting loading editor language',true)
            return api.getLangData(langData => {
                commit(mutationTypes.GET_EDITOR_LANG_TEXT, langData)
            }, lang).then(() => {
                notification.newInternalInfo('Editor language have been loaded',true)
            }).catch((reason) => {
                notification.newInternalError('Editor language have been not loaded. Reason is: '+reason,true)
            })
        }
    },
    getters: {
        getTransText: (state, getters) => (textId, textArgs) => { //get translation of appropriate text --> even arguments can be provided
            if (state.langDataLength === 0) { //no translation dict
                if (!warnInformed) { //keep console clear --> show warning only once
                    //console.log('STORE WARNING: Editor translation is missing')
                    notification.newInternalWarn('Editor translation is missing',true)
                    warnInformed = true
                }
            } else {
                if (textId in state.langData) {
                    if (!textArgs) return state.langData[textId]
                    else return state.langData[textId].format(textArgs)
                } else {
                    //console.log('STORE WARNING: imposible to find text translation for ' + textId)
                    notification.newInternalWarn('Imposible to find text translation for ' + textId,true)
                    return textId
                }
            }
        }
    }

}