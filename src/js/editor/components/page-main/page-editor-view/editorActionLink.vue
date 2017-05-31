<template>
    <div>

        <ul>
           <li v-for="(value,key,index) in linkData" :key="key">
                <dyn-tooltip ref='tooltipLink' :tooltip-id="generateHash('link',index)" :reactToClick='true' :reactToHover='false'>
                    <span slot='tooltip' :component-id="generateHash('link',index)"  class='tooltip markdown-action-buttons markdown-action-buttons-links bold'>
                    link:&nbsp;{{key}}&nbsp;
                        <template v-if="value.pageId != '' && value.pageId != null">
                            (page&nbsp;{{value.pageId}})
                        </template>
                    </span>
                    <span slot='tooltipText'>
                        <i class="fa fa-edit unactive-icon" aria-hidden="true" @click="editLink(value)"></i>
                        <i class="fa fa-question unactive-icon tooltip" aria-hidden="true" @click="showInfo(key)"></i>
                        <i class="fa fa-times-circle unactive-icon" aria-hidden="true" @click="removeLink(key)" ></i>
                    </span>
                </dyn-tooltip>
            </li>
        </ul>

        <template if='showModal'>
            <!--Link modal-->
            <dyn-modal ref='linkModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
                <span slot='modalHeader'>{{String.doTranslationEditor('link-action-dev')}}</span>
                <span slot='modalBody'>
                    <label class="modalLabel text-left" for='pageNumberEditLink'>{{String.doTranslationEditor('page-number')}}<span class='required'>*</span>: </label>
                    <page-whisperer :edited-page='pageId' :page-number='linkFormFields.pageId' ref='pageWhisperer' input-id='pageNumberEditLink'></page-whisperer>
                    <br>
                    <dyn-condition ref='pageDynCondition' :pageCondition='linkFormFields.condition'></dyn-condition>
                </span>
                <span slot='modalFooter' class='text-right'>
                    <span class='common-button' @click='saveLinkAction'>{{String.doTranslationEditor('save')}}</span>
                    <span class='common-button' @click='closeLinkAction'>{{String.doTranslationEditor('close')}}</span>
                </span>
            </dyn-modal>
        </template>

        <!-- Modal for link info -->
        <dyn-modal ref='linkInfoModal' body-specific='modal-body-form' footer-specific='modal-footer-form' content-specific='modal-content-form'>
            <span slot='modalHeader'>
                {{String.doTranslationEditor('link-item-modal-header')}}
            </span>
            <span slot='modalBody'>
                <template v-if='openedLink != null'>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('link-id')}}: </label>
                    <span class="modalInput">{{openedLink.id}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('page-number')}}: </label> 
                    <template v-if="openedLink.pageId != null">
                        <span class="modalInput">{{openedLink.pageId}}</span>
                    </template>
                    <template v-else>
                        <span class="modalInput">{{String.doTranslationEditor('missing-page')}}</span>
                    </template> 
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('condition')}}: </label> 
                    <span class="modalInput">{{openedLink.condition}}</span>
                    <br>
                    <label class="text-left modalLabel">{{String.doTranslationEditor('used-in-text')}}: </label>
                    <i class="fa fa-times-circle modalInput" v-if='openedLink.existsInText' aria-hidden="true" ></i>
                    <i class="fa fa-check modalInput" v-else aria-hidden="true" ></i>
                </template>
            </span>
            <span slot='modalFooter'>
                <span class='common-button' @click='closeInfoLink'>{{String.doTranslationEditor('close')}}</span>
            </span>
        </dyn-modal>

    </div>
</template>

<script>
import Vue from 'vue'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import PageWhisperer from 'editor/components/dyn-components/pageWhisperer.vue'
import DynCondition from 'editor/components/page-main/page-editor-view/dynCondition.vue'
import {getUniqueId, generateHash,clearDict} from 'defaults.js'
import {AllowedActions} from 'editor/constants'

export default {
    components: {
        DynModal,
        DynTooltip,
        PageWhisperer,
        DynCondition
    },
    props: {
        pageId: null,
        linkData: Object,
    },
    data() {
        return {
            linkFormFields: {'id':'','pageId':'','condition':''},
            showModal: false,
            openedLink: null,
        }
    },
    methods: {
        generateHash,
        showLinkModal() {
            this.clear()
            this.showModal = true
            this.$refs.linkModal.show()
        },
        saveLinkAction() {
            let linkData = {
                'id':this.linkFormFields.id,
                'pageId':this.$refs.pageWhisperer.pageNumberLocal,
                'condition':this.$refs.pageDynCondition.getDynConditionText()
            }

            if(this.linkFormFields.id === '' || this.linkFormFields.id === null) {
                this.$emit('add-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionData':linkData})
            } else {
                this.$emit('edit-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionId':this.linkFormFields.id,'actionData':linkData})
            }

            this.clear()
            this.$refs.linkModal.close()
        },
        closeLinkAction() {
            this.clear()
            this.$refs.linkModal.close()
        },
        editLink(linkData) {
            this.clear()

            Vue.set(this.linkFormFields,'id',linkData['id'])
            Vue.set(this.linkFormFields,'pageId',linkData['pageId'])
            Vue.set(this.linkFormFields,'condition',linkData['condition'])

            this.$refs.linkModal.show()
        },
        removeLink(linkId) {
            this.$emit('remove-action',{'actionType':AllowedActions.LINK,'pageId':this.pageId,'actionId':linkId})
        },
        showInfo(linkId) {
            this.openedLink = this.linkData[linkId]
            this.$refs.linkInfoModal.show()
        },
        closeInfoLink() {
            this.openedLink = null
            this.$refs.linkInfoModal.close()
        },
        clear() {
            clearDict(this.linkFormFields,Vue)
            this.$refs.pageWhisperer.clear()
            this.$refs.pageDynCondition.clear()
        },
    }
}

</script>

<style>
.markdown-action-buttons-links {
    border: 1px solid #FFCC99;
    background-color:#FFCC99;
    cursor:pointer;
}
</style>