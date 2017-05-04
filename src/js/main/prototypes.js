import { store } from 'store/'
import * as constants from 'editor/constants'
import {coreStorePrefix} from 'core/constants'

//do translation of string values
String.doTranslationMain = function(value, args) {
    return store.getters[coreStorePrefix + '/getTransText'](constants.mainLangType,value, args)
}