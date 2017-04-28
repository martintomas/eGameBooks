<template>
    <div class="page-connection-down-view">
        <div class='page-connection-down-box' ref='pageConnectionView'>
            <div class="page-connection-wrapper scroller-bottom" ref="page-mini-main-wrapper">
                <div class="page-connection-scroller" ref="page-mini-main-scroller">
                    <template v-if="pages.length === 0">
                        <div class='page-connection-no-pages'>
                            {{String.doTranslationEditor('no-forward-pages')}}
                        </div>
                    </template>
                    <template v-else>
                        <ul>
                            <li is="mini-page-connection-down" v-for="(model,index) in pages" ref="pageConnectionsBox" :key="index" :model="model" :index='index' :model-length='pages.length' :page-edited-id='pageId'
                                :page-mini-distance="pageDistanceDefault" v-on:show-connection-page="showConnectionPage" v-on:hide-connection-page="hideConnectionPage" :active-distance="pageMaxActivationDistance" v-on:mini-page-update-width='miniPageUpdateWidth'>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import MiniPageConnectionDown from 'editor/components/page-main/page-summary-view/miniPageConnectionDown.vue'
import PageConnectionsView from 'editor/components/page-main/page-summary-view/pageConnectionsView'

export default {
    mixins: [PageConnectionsView],
    components: {
        MiniPageConnectionDown,
    },
    computed: {
         pages() {
            return this.pageData.actions.link
        },
    }
}

</script>

<style>
    .page-connection-down-view {
        position:relative;
        width: 80%;
        min-width:15rem;
        margin: 0% auto;
        min-height: 10rem;
        height:21%;
        border: black solid 1px;
        border-radius:1rem;
    }
    .page-connection-down-box {
        position:absolute;
        width:90%;
        height:98%;
        left:5%;
        top:2%;
    }
    .scroller-bottom > div:nth-child(2) {
        bottom:0;
        top:auto;
    }
</style>