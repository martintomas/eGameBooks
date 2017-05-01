import { store } from 'store/'
import * as constants from 'editor/constants'
import {mainStorePrefix} from 'main/constants'

//do translation of string values
String.doTranslationEditor = function(value, args) {
    return store.getters[mainStorePrefix + '/getTransText'](constants.editorLangType,value, args)
}