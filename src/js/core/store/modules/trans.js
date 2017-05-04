import * as mutationTypes from 'core/store/mutationTypes'
import * as api from 'core/api'
import Vue from 'vue'

import {coreNotification,coreNotificationWrapper,coreLoaderWrapper} from 'core/services/defaults.js'
import {coreLangType} from 'core/constants.js'
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
            coreNotification.newInternalInfo('Starting processing language of type: '+args.langType,true)

            if(!(args.langType in state.langData)) {
                Vue.set(state.langData,args.langType,{})
            }

            for (let key in args.langData) {
                Vue.set(state.langData[args.langType], key, args.langData[key])
            }

            coreNotification.newInternalInfo('Language of type: '+args.langType+' is prepared now',true)
        }
    },
    actions: {
        loadEditorLanguage({ commit, state }) {
            coreNotificationWrapper.newInternalInfo(commit,'Starting loading editor language',true)
            coreLoaderWrapper.addLoader(commit,'lang-load',String.doTranslationCore('loader-loading-editor-language'))

            return api.getLangData(editorLangType,state.lang).then((langData) => {
                coreNotificationWrapper.newInternalInfo(commit,'Editor language have been loaded',true)
                coreLoaderWrapper.removeLoader(commit,'lang-load')

                //coreLoaderWrapper.addLoader(commit,'lang-process',String.doTranslationCore('loader-processing-editor-language'))
                commit(mutationTypes.SET_LANG_TEXT, {langData:langData,langType:editorLangType})
                //coreLoaderWrapper.removeLoader(commit,'lang-process')

            }).catch((reason) => {
                coreNotificationWrapper.newInternalInfo(commit,'Editor language have been not loaded. Reason is: '+reason,true)
                coreLoaderWrapper.removeLoader(commit,'lang-load')
            })
        },
        loadCoreLanguage({ commit, state }) {
            coreNotificationWrapper.newInternalInfo(commit,'Starting loading core language',true)

            return api.getLangData(coreLangType,state.lang).then((langData) => {
                coreNotificationWrapper.newInternalInfo(commit,'Core language have been loaded',true)

                commit(mutationTypes.SET_LANG_TEXT, {langData:langData,langType:coreLangType})

            }).catch((reason) => {
                coreNotificationWrapper.newInternalInfo(commit,'Core language have been not loaded. Reason is: '+reason,true)
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