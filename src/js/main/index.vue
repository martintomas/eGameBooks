<template>
    <div class='app-root'>
        <router-view name='main-center-view'></router-view>

        <message-box></message-box>
    </div>
</template>

<script>
import { store } from 'store/'
import * as defaultMain from 'main/services/defaults'
import * as protMain from 'main/prototypes'

import MessageBox from 'main/components/dyn-components/messageBox.vue'

//do index initialization
defaultMain.mainNotificationWrapper.initializeNotification(store.commit)
defaultMain.mainLoaderWrapper.initializeLoader(store.commit)

export default {
    components: {
        MessageBox
    },
    created() {
        
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