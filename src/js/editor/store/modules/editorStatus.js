import * as mutationTypes from 'editor/store/mutation-types'

export default {
    state: {
        miniPageListShown: true,
        elementsListShow: true,
    },
    mutations: {
        [mutationTypes.CHANGE_MINI_PAGE_LIST_STATUS](state, status) {
            if (status) console.log('STORE: mini page list is shown')
            else console.log('STORE: mini page list is hidden')

            state.miniPageListShown = status
        },
        [mutationTypes.CHANGE_ELEMENTS_LIST_STATUS](state, status) {
            if (status) console.log('STORE: elements list is shown')
            else console.log('STORE: elements list is hidden')

            state.elementsListShow = status
        }
    }
}