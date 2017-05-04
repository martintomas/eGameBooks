import * as mutationTypes from 'core/store/mutationTypes'
import Vue from 'vue'
import {coreNotification} from 'core/services/defaults.js'

export default {
    state: {
        messages: []
    },
    mutations: {
        [mutationTypes.NEW_MESSAGE](state, args) {

            state.messages.push(args)

            coreNotification.newInternalInfo('New message has been added',true)
        },
        [mutationTypes.DELETE_MESSAGE](state, id) {

            Vue.delete(state.messages,id)

            coreNotification.newInternalInfo('Message with id: '+id+' has been deleted',true)
        },
    }
}