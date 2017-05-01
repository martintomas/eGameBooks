import {mainLangType} from 'main/constants'
import {editorLangType} from 'editor/constants'

const editorLangData = require('./mock-editor-lang-data')
const mainLangData = require('./mock-main-lang-data')
const LATENCY = 150

export function getLangData(langType,lang) {
    //if (lang === 'en') cb(langData) //english is always prepared
    //else { //download other language
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(langType === mainLangType) {
                resolve(mainLangData)
            } else if(langType === editorLangType) {
                resolve(editorLangData)
            } else {
                reject('Unknow language type')
            }
        }, LATENCY)
    })
}