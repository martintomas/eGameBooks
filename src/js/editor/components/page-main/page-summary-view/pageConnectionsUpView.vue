<template>
    <div class="page-connection-up-view">
        <div class='page-connection-view' ref='pageConnectionView'>
            <div class="page-connection-wrapper" ref="page-mini-main-wrapper">
                <div class="page-connection-scroller" ref="page-mini-main-scroller">
                    <template v-if="pages.length === 0">
                        <div class='page-connection-no-pages'>
                            {{String.doTranslationEditor('no-reverse-pages')}}
                        </div>
                    </template>
                    <template v-else>
                        <ul>
                            <li is="mini-page-connection-up" v-for="(model,index) in pages" ref="pageConnectionsBox" :key="index" :model="model" :index='index' :model-length='pages.length'
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
import MiniPageConnectionUp from 'editor/components/page-main/page-summary-view/miniPageConnectionUp.vue'
import PageConnectionsView from 'editor/components/page-main/page-summary-view/pageConnectionsView'

export default {
    mixins: [PageConnectionsView],
    components: {
        MiniPageConnectionUp
    },
    computed: {
        pages() {
            return this.pageData.reverseLink
        }
    }
}

</script>

<style>
    .page-connection-up-view {
        position:relative;
        width: 80%;
        min-width:15rem;
        margin: 0% auto;
        min-height: 10rem;
        height:21%;
        border: black solid 1px;
        border-radius:1rem;
    }
    .page-connection-view {
        position:absolute;
        width:90%;
        height:95%;
        left:5%;
        top:5%;
    }
    .page-connection-wrapper {
        height: 100%;
        overflow: hidden;
    }
    .page-connection-scroller {
        height: 100%;
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
    }
    .page-connection-scroller ul {
        list-style: none;
        padding: 0;
        margin: 0 0.5rem 0 1rem;
        height: 100%;
    }
    .page-connection-no-pages {
        font-weight:bold;
        font-size:200%;
        text-align: center;
        position: relative;
        top: 20%;
    }
</style>