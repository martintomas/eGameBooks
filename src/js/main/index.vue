<template>
    <router-view name='main-center-view'></router-view>
</template>

<script>
import { store } from 'store/'
import * as defaultMain from 'main/services/defaults'

import * as protMain from 'main/prototypes' //should be inside main part

//do index initialization
defaultMain.mainNotificationWrapper.initializeNotification(store.commit)
defaultMain.mainLoaderWrapper.initializeLoader(store.commit)

export default {
    components: {
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