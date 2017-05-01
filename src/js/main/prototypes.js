import { store } from 'store/'
import * as constants from 'main/constants'

//do translation of string values
String.doTranslationMain = function(value, args) {
    return store.getters[constants.mainStorePrefix + '/getTransText'](constants.mainLangType,value, args)
}