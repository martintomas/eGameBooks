import { store } from 'store/'
import * as constants from 'core/constants'

//do translation of string values
String.doTranslationCore = function(value, args) {
    return store.getters[constants.coreStorePrefix + '/getTransText'](constants.coreLangType,value, args)
}