<template>
    <li class="page-mini-box" ref="page-mini-box" v-bind:style="styleMiniPageBox" @click="activeMiniPage">
        <div class="page-mini" ref='pageMini'>
            <div class="page-mini-title">
                <dyn-tooltip ref='tooltipMiniPage' :tooltip-id="generateHash('mini-page',index)" :allow-automatic-hidding="false" :force-top='true' :react-to-hover='false'>
                    <span class="page-mini-title-text text-center" slot='tooltip'>{{String.doTranslationEditor('page-num',(pageNumber))}}</span>
                    <span slot='tooltipText'>
                        <template v-if='active'> <!-- render tooltip only when page is active -->
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-edit unactive-icon" aria-hidden="true" slot='tooltip' @click='editMiniPage'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('edit-page')}}</span>
                            </dyn-tooltip>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-search unactive-icon" aria-hidden="true" slot='tooltip'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('zoom-mini-page')}}</span>
                            </dyn-tooltip>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-close unactive-icon" aria-hidden="true" slot='tooltip' @click='hideMiniPage'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('deactive-page')}}</span>
                            </dyn-tooltip>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-trash unactive-icon" aria-hidden="true" slot='tooltip'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('delete-page')}}</span>
                            </dyn-tooltip>
                        </template>
                    </span>
                </dyn-tooltip>       
            </div>
            <div class="page-mini-content" v-html="simpleText">
            </div>
        </div>
    </li>
</template>

<script>
    import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
    import * as mutationTypes from 'editor/store/mutation-types'
    import {generateHash} from 'defaults.js'
    
    export default {
        components: {
            DynTooltip
        },
        props: {
            model: Object,
            index: 0,
            pageMiniHeight: 0,
            pageMiniDistance: 0,
            multiPage: true,
        },
        data() {
            return {
                pageMiniDistanceMove: 0,
                pageMini: null,
                tooltipMiniPage: null
            }
        },
        computed: {
            styleMiniPageBox() {
                return {
                    top: ((this.pageMiniDistance * this.index) + this.pageMiniDistanceMove) + 'rem',
                    height: this.pageMiniHeight + 'rem',
                    minHeight: this.pageMiniHeight + 'rem',
                }
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
                return this.model.data.id === this.editorStore.pages.selectedPage
            }
        },
        watch: {
            active() { //observe if page selection is changed
                if(this.active) this.showMiniPageEvent()
                else this.hideMiniPageEvent()
            }
        },
        mounted() {
            this.pageMini = this.$refs.pageMini
            this.tooltipMiniPage = this.$refs.tooltipMiniPage
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
                console.log('Mini pages - showing page number: ' + this.pageId);

                this.pageMini.classList.add('active-page')
                this.showTooltip()
            },
            hideMiniPageEvent() {
                console.log('Mini pages - hiding page number: ' + this.pageId)

                this.pageMini.classList.remove('active-page')
                this.hideTooltip()

            },
            hideMiniPage(event) {
                console.log('Mini pages - manualy hiding page number: ' + this.pageId);

                if (event) event.stopPropagation() //be sure that page is not actived again by click
                this.$store.commit('editor/'+mutationTypes.SELECT_PAGE,null) //no page is selected

                this.$emit('hide-mini-page', this) //let othet components know     
            },
            editMiniPage(event) {
                console.log('Mini pages - editing page number: ' + this.pageId)

                if (event) event.stopPropagation()

                //this.$store.commit(mutationTypes.EDIT_PAGE,this.pageId) //set new edited page --> is done by reading url
                this.$router.push({ name: 'page-view', params: { pageId: this.pageId }})
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

        transition: top 0.5s;
    }
    
    .page-mini {
        width: 12rem;
        height: 100%;
        border: solid 0.1rem black;
        border-radius: 0.25rem;
        -webkit-border-radius: 0.25rem;
        -moz-border-radius: 0.25rem;
        background-color: white;
        overflow:hidden;
    }

    .page-mini-box .active-page {
        border-color: blue;
    }
    
    .page-mini .page-mini-title {
        text-align: center;
        background-color: lightgray;
        border-bottom: solid 0.1rem black;
        font-weight: bold;
        padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    }
    
    .page-mini .page-mini-content {
        padding: 0.2rem 0.2rem 0.2rem 0.2rem;
        background-color: white;
    }
</style>