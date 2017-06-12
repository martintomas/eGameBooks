<template>
    <span class='notification-root' ref='notificationRoot'>
        <template v-if="lineText.type === 'info'">
            <i class="fa fa-info" aria-hidden="true"></i>&nbsp;
        </template>
        <template v-if="lineText.type === 'warn'">
            <i class="fa fa-warning warning-color" aria-hidden="true"></i>&nbsp;
        </template>
        <template v-if="lineText.type === 'error'">
            <i class="fa fa-exclamation-circle error-color" aria-hidden="true"></i>&nbsp;
        </template>
        {{lineText.message}}
    </span>
</template>

<script>

import {editorNotificationWrapper} from 'editor/services/defaults.js'

export default {
    data() {
        return {
            lineText:'',
            inlineTimeout: null
        }
    },
    computed: {
        numNotification() {
            return editorNotificationWrapper.getNotifications(this.$store).length
        },
    },
    watch: {
        numNotification(value) {
            //console.log('New number of notifications is: '+value)

            //let previousText = this.$store.getters['editor/getNotification'](this.numNotification-2)
            let lastText = editorNotificationWrapper.getNotifications(this.$store,this.numNotification-1)

            if('notificationRoot' in this.$refs) {
                this.$refs.notificationRoot.classList.remove('no-fade')
                this.$refs.notificationRoot.classList.add('fade')

                setTimeout(() => {
                    this.lineText = lastText
                    this.$refs.notificationRoot.classList.remove('fade')
                    this.$refs.notificationRoot.classList.add('no-fade')

                    clearTimeout(this.inlineTimeout)

                    this.inlineTimeout = setTimeout(() => {
                        if('notificationRoot' in this.$refs && this.$refs.notificationRoot) {
                            this.$refs.notificationRoot.classList.add('fade')
                            this.$refs.notificationRoot.classList.remove('no-fade')
                        }
                    },1000*10)
                },800)
            }
        }
    }
}
</script>

<style>
.notification-root {
    padding: 0.25rem 1rem 0.25rem 1rem;
    line-height: 1.5rem;
    margin: 0.25rem 0.2rem 0.25rem 0.2rem;

    transition: opacity 0.5s
}
</style>