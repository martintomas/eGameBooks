<template>
    <li class="page-mini-box" ref="pageMiniBox" v-bind:style="styleMiniPageBox" @click="activeMiniPage">
        <div class="page-mini" :style="styleMiniPage">
            <div class="page-mini-title">
                <dyn-tooltip ref='tooltipMiniPage' :tooltip-id="generateHash('mini-page',index)" :allow-automatic-hidding="false" :force-top='true' :react-to-hover='false'>
                    <span class="page-mini-title-text text-center" slot='tooltip'>
                        {{String.doTranslationEditor('page-num',(pageNumber))}}&nbsp;
                        <i v-if='isSevereError' class="fa fa-times-circle error-color" aria-hidden="true"></i>&nbsp;
                        <i v-if='isMinorError' class="fa fa-warning warning-color" aria-hidden="true"></i>
                    </span>
                    <span slot='tooltipText'>
                        <template v-if='active'> <!-- render tooltip only when page is active -->
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-edit unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='editMiniPage'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('edit-page')}}</span>
                            </dyn-tooltip>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-search unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='showPageDetail'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('zoom-mini-page')}}</span>
                            </dyn-tooltip>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-close unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='hideMiniPage'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('deactive-page')}}</span>
                            </dyn-tooltip>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-trash unactive-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('delete-page')}}</span>
                            </dyn-tooltip>
                        </template>
                    </span>
                </dyn-tooltip> 
                <span class='float-right'>{{numLinks}}/{{numReverseLinks}}</span>      
            </div>
            <div class="page-mini-content" v-html="simpleText">
            </div>
        </div>
    </li>
</template>

<script>
    import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
    import * as mutationTypes from 'editor/store/mutationTypes'
    import {generateHash,getCompStyle} from 'defaults.js'
    import {busEditor} from 'editor/services/defaults.js'
    
    export default {
        components: {
            DynTooltip
        },
        props: {
            model: Object,
            index: 0,
            pageMiniDistance: 0,
            multiPage: true,
        },
        data() {
            return {
                pageMiniDistanceMove: 0,
                tooltipMiniPage: null,
            }
        },
        computed: {
            styleMiniPageBox() {
                return {
                    top: ((this.pageMiniDistance * this.index) + this.pageMiniDistanceMove) + 'px',
                }
            },
            styleMiniPage() {
                if(this.isSevereError) return {borderColor: '#ff9999'}
                else if(this.isMinorError) return {borderColor: '#e6e600'}
                else if(this.active) return {borderColor: '#6699ff'}
            },
            isSevereError() {
                return this.model.data.id in this.$store.state.editor.bookData.pagesSevereError
            },
            isMinorError() {
                return this.model.data.id in this.$store.state.editor.bookData.pagesMinorError
            },
            simpleText() {
                return this.model.data.renderedText
            },
            pageNumber() {
                return this.model.data.pageNumber
            },
            pageId() {
                return this.model.data.id
            },
            active() { //is this mini page selected?
                return this.model.data.id === this.$store.state.editor.bookData.selectedPage
            },
            numLinks() {
                return this.model.actions.link.length
            },
            numReverseLinks() {
                return this.model.reverseLink.length
            }
        },
        watch: {
            active() { //observe if page selection is changed
                if(this.active) this.showMiniPageEvent()
                else this.hideMiniPageEvent()
            }
        },
        mounted() {
            this.tooltipMiniPage = this.$refs.tooltipMiniPage

            if(this.index === 0) this.$emit('mini-page-update-height',this.$el.clientHeight) //send only once
        },
        methods: {
            generateHash,
            moveDistanceTop(distance = 0) {
                //console.log('Mini pages - updating top distance to: +' + distance);
                this.pageMiniDistanceMove = distance;
            },
            activeMiniPage(event) {
                if (this.active) { //keep active even when douple clicked
                    //this.$store.commit(mutationTypes.SELECT_PAGE,this.pageId)
                } else {
                    this.$store.commit('editor/'+mutationTypes.SELECT_PAGE,this.pageId) //set new selected page
                    this.$emit('show-mini-page', this) //let know others components that this one is shown
                }
            },
            showMiniPageEvent() {
                //console.log('Mini pages - showing page number: ' + this.pageId);

                this.showTooltip()
            },
            hideMiniPageEvent() {
                //console.log('Mini pages - hiding page number: ' + this.pageId)

                this.hideTooltip()
            },
            hideMiniPage(event) {
                //console.log('Mini pages - manualy hiding page number: ' + this.pageId);

                if (event) event.stopPropagation() //be sure that page is not actived again by click
                this.$store.commit('editor/'+mutationTypes.SELECT_PAGE,null) //no page is selected

                this.$emit('hide-mini-page', this) //let othet components know     
            },
            editMiniPage(event) {
                //console.log('Mini pages - editing page number: ' + this.pageId)

                if (event) event.stopPropagation()

                //this.$store.commit(mutationTypes.EDIT_PAGE,this.pageId) //set new edited page --> is done by reading url
                this.$router.push({ name: 'editor-page-view', params: { pageId: this.pageId }})
            },
            showPageDetail(event) {
                //console.log('Mini pages - showing detail of page number: ' + this.pageId)

                if (event) event.stopPropagation()

                busEditor.$emit('show-page-detail',this.pageId)
            },
            showTooltip() {
                setTimeout(() => {
                    this.tooltipMiniPage.show() 
                }, 50)
                    
            },
            hideTooltip() {
                this.tooltipMiniPage.hide()
            }
        }
    };
</script>

<style>
    .page-mini-box {
        position: absolute;
        height: 15rem;
        min-height: 15rem;

        transition: top 0.5s;
    }
    
    .page-mini {
        width: 12rem;
        height: 100%;
        border: solid 1px black;
        border-radius: 0.25rem;
        -webkit-border-radius: 0.25rem;
        -moz-border-radius: 0.25rem;
        background-color: white;
        overflow:hidden;
    }
    
    .page-mini .page-mini-title {
        text-align: center;
        background-color: lightgray;
        border-bottom: solid 1px black;
        font-weight: bold;
        padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    }
    
    .page-mini .page-mini-content {
        padding: 0.2rem 0.2rem 0.2rem 0.2rem;
        background-color: white;
    }
</style>