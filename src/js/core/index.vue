<template>
    <div class='app-root'>
        <router-view name='main-center-view'></router-view>

        <message-box></message-box>
    </div>
</template>

<script>
import { store } from 'store/'
import * as defaultCore from 'core/services/defaults'
import * as protCore from 'core/prototypes'
import * as constants from 'core/constants'

import MessageBox from 'core/components/dyn-components/messageBox.vue'

//do index initialization
defaultCore.coreNotificationWrapper.initializeNotification(store.commit)
defaultCore.coreLoaderWrapper.initializeLoader(store.commit)

export default {
    components: {
        MessageBox
    },
    created() {
        //load core language
        if(!store.getters['core/languageExists'](constants.coreLangType)) {
            let prom1 = store.dispatch('core/loadCoreLanguage').then(() => { //load core language
                //defaultCore.coreNotificationWrapper.newInternalInfo(store.commit,'Core language have been loaded',true)
            }).catch((reason) => {
                defaultCore.coreNotificationWrapper.newInternalError(store.commit,'Error during core language processing. Reason of error is: '+reason,true)
            })
        }
    },
    mounted() {
        // setTimeout(() => {
        //     this.$router.push({ name: 'editor-page-view-default', params: { book: 'test' }})
        // },1000)
    }
}
</script>

<style>
</style>