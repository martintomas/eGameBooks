import * as mutationTypes from 'editor/store/mutation-types'
import {notification} from 'editor/store/modules/notification.js'

export default {
    state: {
        miniPageListShown: true,
        miniPageMultiPages: false,
        elementsListShow: true,

    },
    mutations: {
        [mutationTypes.CHANGE_MINI_PAGE_LIST_STATUS](state, status) {
            if (status) {
                //console.log('STORE: mini page list is shown')
                notification.newInternalInfo('Mini page list is shown',true)
            }
            else {
                //console.log('STORE: mini page list is hidden')
                notification.newInternalInfo('Mini page list is hidden',true)
            }

            state.miniPageListShown = status
        },
        [mutationTypes.CHANGE_MINI_PAGE_SHOWN_METHOD](state, status) {
            if (status) {
                //console.log('STORE: mini page list is showing more compact mini pages')
                notification.newInternalInfo('Mini page list is showing more compact mini pages',true)
            }
            else {
                //console.log('STORE: mini page list is showing complete mini pages')
                notification.newInternalInfo('Mini page list is showing complete mini pages',true)
            }

            state.miniPageMultiPages = status
        },
        [mutationTypes.CHANGE_ELEMENTS_LIST_STATUS](state, status) {
            if (status) {
                //console.log('STORE: elements list is shown')
                notification.newInternalInfo('Elements list is shown',true)
            }
            else {
                //console.log('STORE: elements list is hidden')
                notification.newInternalInfo('Elements list is hidden',true)
            }

            state.elementsListShow = status
        }
    }
}