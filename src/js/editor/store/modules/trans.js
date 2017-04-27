import * as mutationTypes from 'editor/store/mutation-types'
import * as api from 'editor/api'
import Vue from 'vue'

let warnInformed = false
export default {
    state: {
        langData: {},
        langDataLength: 0,
    },
    mutations: {
        [mutationTypes.GET_EDITOR_LANG_TEXT](state, langData) { //set up lang data
            console.log('STORE: loading text for appropriate language')

            for (let key in langData) {
                Vue.set(state.langData, key, langData[key])
                state.langDataLength += 1
            }
        }
    },
    actions: {
        loadLanguage({ commit, state }, lang) {
            return api.getLangData(langData => {
                commit(mutationTypes.GET_EDITOR_LANG_TEXT, langData)
            }, lang)
        }
    },
    getters: {
        getTransText: (state, getters) => (textId, textArgs) => { //get translation of appropriate text --> even arguments can be provided
            if (state.langDataLength === 0) { //no translation dict
                if (!warnInformed) { //keep console clear --> show warning only once
                    console.log('STORE WARNING: Editor translation is missing')
                    warnInformed = true
                }
            } else {
                if (textId in state.langData) {
                    if (!textArgs) return state.langData[textId]
                    else return state.langData[textId].format(textArgs)
                } else {
                    console.log('STORE WARNING: imposible to find text translation for ' + textId)
                    return textId
                }
            }
        }
    }

}