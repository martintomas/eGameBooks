<template>
    <div class="page-connection-down-view">
        <div class='page-connection-down-box' ref='pageConnectionView'>
            <div class="page-connection-wrapper scroller-bottom" ref="page-mini-main-wrapper">
                <div class="page-connection-scroller" ref="page-mini-main-scroller">
                    <template v-if="pagesLength === 0">
                        <div class='page-connection-no-pages'>
                            {{String.doTranslationEditor('no-forward-pages')}}
                        </div>
                    </template>
                    <template v-else>
                        <ul>
                            <li is="mini-page-connection-down" v-for="(model,key,index) in pages" ref="pageConnectionsBox" :key="pageId+'-'+model.id" :model="model" :index='index' :model-length='pagesLength' :page-edited-id='pageId' @edit-link-action='editLinkAction'
                                :page-mini-distance="pageDistanceDefault" v-on:show-connection-page="showConnectionPage" v-on:hide-connection-page="hideConnectionPage" :active-distance="pageMaxActivationDistance" v-on:mini-page-update-width='miniPageUpdateWidth'>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>

        <!-- modal for link editing -->
        <dyn-modal ref='linkEditModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('edit-link-action')}}
            </span>
            <span slot='modalBody'>
                <template v-if='editedLink != null'>
                    <label class="modalLabel" for='pageNumberEditLink'>{{String.doTranslationEditor('page-number')}}<span class='required'>*</span>: </label>
                    <page-whisperer ref='linkEditPageWhisperer' :edited-page='pageId' :page-number='editedLink.pageId' input-id='pageNumberEditLink'></page-whisperer>
                </template>
            </span>
            <span slot='modalFooter'>
                <template v-if='editedLink != null'>
                    <span class='common-button' @click='saveEditedLink'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeEditedLink'>{{String.doTranslationEditor('close')}}</span>
                </template>
            </span>
        </dyn-modal>

    </div>
</template>

<script>

import MiniPageConnectionDown from 'editor/components/page-main/page-summary-view/miniPageConnectionDown.vue'
import PageConnectionsView from 'editor/components/page-main/page-summary-view/pageConnectionsView'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import PageWhisperer from 'editor/components/dyn-components/pageWhisperer.vue'
import {generateHash} from 'defaults.js'

export default {
    mixins: [PageConnectionsView],
    components: {
        MiniPageConnectionDown,
        DynModal,
        PageWhisperer
    },
    data() {
        return {
            editedLink: null
        }
    },
    computed: {
        pages() {
            return this.pageData.actions.link
        },
        pagesLength() {
            return Object.keys(this.pages).length
        }
    },
    methods: {
        generateHash,
        editLinkAction(linkId) {
            if(!(linkId in this.pages)) {
                console.log('missing action')
                return
            }
            this.editedLink = this.pages[linkId]
            this.$refs.linkEditModal.show()
        },
        saveEditedLink() {
            this.$store.dispatch('editor/changeLinkPageId',{
                pageId: this.pageId,
                actionId: this.editedLink.id,
                value:this.$refs.linkEditPageWhisperer.pageNumberLocal
            }).then(() => {
                this.closeEditedLink()
            })
        },
        closeEditedLink() {
            this.$refs.linkEditPageWhisperer.clear()
            this.$refs.linkEditModal.close()
        }
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