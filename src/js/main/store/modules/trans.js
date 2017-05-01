import * as mutationTypes from 'main/store/mutationTypes'
import * as api from 'main/api'
import Vue from 'vue'

import {mainNotification,mainNotificationWrapper,mainLoaderWrapper} from 'main/services/defaults.js'
import {editorLangType} from 'editor/constants.js'

let warnInformed = {}
export default {
    state: {
        lang: 'en',
        langData: {},
    },
    mutations: {
        [mutationTypes.SET_LANG_TEXT](state, args) { //set up lang data
            //args: langData, langType
            //console.log('STORE: loading text for appropriate language')
            mainNotification.newInternalInfo('Starting processing editor language',true)

            if(!(args.langType in state.langData)) {
                Vue.set(state.langData,args.langType,{})
            }

            for (let key in args.langData) {
                Vue.set(state.langData[args.langType], key, args.langData[key])
            }

            mainNotification.newInternalInfo('Editor language is prepared now',true)
        }
    },
    actions: {
        loadEditorLanguage({ commit, state }) {
            mainNotificationWrapper.newInternalInfo(commit,'Starting loading editor language',true)
            mainLoaderWrapper.addLoader(commit,'lang-load',String.doTranslationMain('loader-loading-editor-language'))

            return api.getLangData(editorLangType,state.lang).then((langData) => {
                mainNotificationWrapper.newInternalInfo(commit,'Editor language have been loaded',true)
                mainLoaderWrapper.removeLoader(commit,'lang-load')

                //mainLoaderWrapper.addLoader(commit,'lang-process',String.doTranslationMain('loader-processing-editor-language'))
                commit(mutationTypes.SET_LANG_TEXT, {langData:langData,langType:editorLangType})
                //mainLoaderWrapper.removeLoader(commit,'lang-process')

            }).catch((reason) => {
                mainNotificationWrapper.newInternalInfo(commit,'Editor language have been not loaded. Reason is: '+reason,true)
                mainLoaderWrapper.removeLoader(commit,'lang-load')
            })
        }
    },
    getters: {
        getTransText: (state, getters) => (langType,textId, textArgs) => { //get translation of appropriate text --> even arguments can be provided
            if (!(langType in state.langData)) { //no translation dict
                if (!(langType in warnInformed)) { //keep console clear --> show warning only once
                    console.log('STORE WARNING: Translation is missing for '+langType)
                    warnInformed[langType] = true
                }
            } else {
                if (textId in state.langData[langType]) {
                    delete warnInformed[langType]
                    if (!textArgs) return state.langData[langType][textId]
                    else return state.langData[langType][textId].format(textArgs)
                } else {
                    console.log('STORE WARNING: imposible to find text translation for ' + textId +' in '+ langType)
                    return textId
                }
            }
        },
        languageExists: (state, getters) => (langType) => {
            return langType in state.langData
        }
    }

}