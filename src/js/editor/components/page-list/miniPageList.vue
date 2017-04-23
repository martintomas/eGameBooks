<template>
<div class="page-mini-container" ref='pageMiniContainer'>
    <div class="page-mini-main" ref='pageMiniMain'>
        <p class="page-mini-summary-text active-text" @click="showHidePageList">{{String.doTranslationEditor('page-summary')}}</p>
        <div class="page-mini-main-header">
            <dyn-tooltip class='dyn-tooltip'>
                <i class="fa fa-file-text-o active-icon" aria-hidden="true" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('new-page')}}</span>
            </dyn-tooltip>
            <dyn-tooltip class='dyn-tooltip'>
                <i class="fa fa-files-o active-icon" aria-hidden="true" @click="multiPageShow" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('multi-pages')}}</span>
            </dyn-tooltip>
            <dyn-tooltip class='dyn-tooltip'>
                <i class="fa fa-file-o active-icon" aria-hidden="true" @click="onePageShow" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('one-pages')}}</span>
            </dyn-tooltip>
        </div>
        <!--<p class="vertical-text float-right page-mini-vertical-text">Page summary</p>-->
        <div class="page-mini-main-wrapper" ref="page-mini-main-wrapper">

            <div class="page-mini-main-scroller" ref="page-mini-main-scroller">
                <ul>
                    <li is="mini-page" v-for="(model,key,index) in pageMiniData" ref="mini-pages-box" :key="key" v-bind:model="model" v-bind:index="index" :page-mini-height="pageMiniHeight" v-bind:page-mini-distance="pageDistanceDefault" v-bind:multi-page="multiPage"
                        v-on:show-mini-page="showMiniPage" v-on:hide-mini-page="hideMiniPage">
                    </li>
                </ul>
            </div>
        </div>
        <div class="page-mini-main-footer text-center">This is footer</div>
    </div>
</div>
</template>

<script>
    import IScroll from 'iscroll'
    import MiniPage from 'editor/components/page-list/miniPage.vue'
    import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
    import {bus} from 'app.js'
    import {generateHash, waitForResizeEnd, setCss3Style} from 'defaults.js'
    import * as mutationTypes from 'editor/store/mutation-types'

    export default {
        data() {
            return {
                miniPagesHistory: null,
                pageDistanceDefault: 0,
                multiPage: true,
                activatedPage: null, //remmember last active page
                scrollWrapper: 'page-mini-main-wrapper',
                scrollContainer: 'page-mini-main-scroller',
                scroller: null,
            };
        },
        components: {
            MiniPage,
            DynTooltip
        },
        computed: {
            pageMiniData() {
                if (this.miniPagesHistory != Object.keys(this.editorStore.pages.pages).length) { //be sure to update scroll when number of pages changes
                    this.miniPagesHistory = Object.keys(this.editorStore.pages.pages).length
                    this.updateScroller()
                }
                return this.editorStore.pages.pages
            },
            pageMiniHeight() {
                return this.editorStore.appConf.miniPageHeight
            },
            pageMiniDistance() {
                return Math.ceil(this.pageMiniHeight * this.editorStore.appConf.miniPageMiniDistance); //mini distance is 20%
            },
            pageMaxDistance() {
                return Math.ceil(this.pageMiniHeight * this.editorStore.appConf.miniPageMaxDistance); //max distance is 115%
            },
        },
        created() {
            this.pageDistanceDefault = this.pageMiniDistance;

            bus.$on('editor-panel-shown-fast', source => {
                if(this.$refs.pageMiniContainer) { //this element have to be created and mounted
                    if(source != this.$refs.pageMiniContainer) { //some other list changed its status (probably element list)
                        if(this.editorStore.editorStatus.miniPageListShown) { //if this list is show --> check if this should be automaticaly hidden
                            if(window.innerWidth/this.$refs.pageMiniContainer.clientWidth < this.editorStore.appConf.listsShownTogetherLimit) { //keep hidden by default (when widht si too small)
                                this.hideImmidiatellyMiniPageList()
                            }
                        }
                    }
                }
            })
        },
        mounted() {
            this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
                mouseWheel: true,
                bounce: false,
                interactiveScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
            });

            if(window.innerWidth/this.$refs.pageMiniContainer.clientWidth < this.editorStore.appConf.miniPageListWindowWidthAutomaticShown) { //keep hidden by default (when widht si too small)
                this.hideImmidiatellyMiniPageList()
            }

            this.updateScroller()
        },
        methods: {
            generateHash,
            miniPageLength() {
                return Object.keys(this.pageMiniData).length
            },
            isLastPage(page) {
                if (page.index + 1 === this.miniPageLength()) return true;
                return false;
            },
            showMiniPage(page) {
                console.log('Mini pages main -- show mini page');

                if (this.activatedPage != null && this.activatedPage != page) { //hide previously active page
                    this.hideMiniPage(this.activatedPage, false);
                }
                this.activatedPage = page; //set active pages
                let overTop = 0
                if(this.multiPage || (page.index == 0 && !this.multiPage)) {
                    overTop = this.pageMiniDistance
                }
                page.moveDistanceTop(overTop)
                this.moveMiniPagesY(page, this.pageMaxDistance - this.pageDistanceDefault + overTop)
                this.updateScroller(overTop);
            },
            hideMiniPage(page, updateScroller = true) {
                page.moveDistanceTop(0);
                this.moveMiniPagesY(page, 0);
                this.activatedPage = null;
                if (updateScroller) this.updateScroller();
            },
            moveMiniPagesY(fromPage, distance) {
                for (var i = fromPage.index +1 ; i < this.$refs['mini-pages-box'].length; i++) {
                    this.$refs['mini-pages-box'][i].moveDistanceTop(distance);
                }
            },
            onePageShow(event) {
                console.log('Mini pages - one page show');

                this.pageDistanceDefault = this.pageMaxDistance;
                this.multiPage = false;

                if (this.activatedPage != null) { //keep activated page shown
                    this.showMiniPage(this.activatedPage) //updates scroller itself
                } else {
                    this.updateScroller();
                }
            },
            multiPageShow(event) {
                console.log('Mini pages - multi page show');

                this.pageDistanceDefault = this.pageMiniDistance;
                this.multiPage = true

                if (this.activatedPage != null) { //keep activated page shown
                    this.showMiniPage(this.activatedPage) //updates scroller itself
                } else {
                    this.updateScroller();
                }
            },
            updateScroller(overTop) {
                console.log('Mini pages - updating scroll height');

                if(!overTop) overTop=0

                var scrollBarHeight = this.miniPageLength() * this.pageDistanceDefault + (this.pageMiniHeight - this.pageDistanceDefault + 1 + overTop);
                if (this.activatedPage != null && !this.isLastPage(this.activatedPage)) {
                    scrollBarHeight += this.pageMaxDistance - this.pageDistanceDefault;
                }

                if (this.scrollContainer in this.$refs) {
                    this.$refs[this.scrollContainer].style.height = scrollBarHeight + 'rem'; //recompute height of scrollbar container

                    setTimeout(() => {
                        this.scroller.refresh(); //actualize scroller based on new height
                    }, 200);
                }
            },
            showHidePageList() {
                //console.log('Changing page list show')
                if(!this.editorStore.editorStatus.miniPageListShown) {
                    this.showMiniPageList()
                } else {
                    this.hideMiniPageList()
                }
            },
            hideMiniPageList() {
                this.$refs.pageMiniContainer.classList.add('page-hide-root')
                this.$refs.pageMiniMain.classList.add('page-hide-main')
                this.$store.commit('editor/'+mutationTypes.CHANGE_MINI_PAGE_LIST_STATUS,false)
                this.updateWindowResize()
            },
            hideImmidiatellyMiniPageList() {
                setCss3Style(this.$refs.pageMiniContainer,'transition','width 0s')
                setCss3Style(this.$refs.pageMiniMain,'transition','left 0s')

                this.hideMiniPageList()

                setTimeout(() => {
                    setCss3Style(this.$refs.pageMiniContainer,'transition','width 0.3s')
                    setCss3Style(this.$refs.pageMiniMain,'transition','left 0.3s')
                },250)
            },
            showMiniPageList() {
                this.$refs.pageMiniContainer.classList.remove('page-hide-root')
                this.$refs.pageMiniMain.classList.remove('page-hide-main')
                this.$store.commit('editor/'+mutationTypes.CHANGE_MINI_PAGE_LIST_STATUS,true)
                bus.$emit('editor-panel-shown-fast', this.$refs.pageMiniContainer)
                this.updateWindowResize()
            },
            updateWindowResize() {
                setTimeout(() => {
                    waitForResizeEnd(() => {
                        bus.$emit('editor-panel-resize', this.$refs.pageMiniContainer)
                    },this.$refs.pageMiniContainer,true)
                },50)
            }
        },
    };
</script>

<style>
    .page-mini-container {
        flex: 0 0 auto;
        height: 100%;
        /*background-color: red;*/
        width: 16.5rem;

        transition: width 0.3s;
    }
    
    .page-mini-main {
        position:fixed;
        width: 16rem;
        height: 100%;
        /*border: 0.05rem solid black;*/
        margin: 0.2rem 0.2rem 0.2rem 0.2rem;
        background: url('/img/editor/mini-page-list-up-without-text.svg') no-repeat top left;
        left:0rem;

        transition: left 0.3s;

    }

    .page-hide-root {
        width:3rem;
    }

    .page-mini-container .page-hide-main {
        left: -13.5rem;
    }

    .page-mini-summary-text {
        /*    transform: rotate(90deg) translate(8rem, -16rem); */
        cursor: pointer;
        position: absolute;
        top: 8rem;
        left: 16rem;
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        transform-origin: left top 0;
        -webkit-transform-origin: left top 0;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        /* has to be lower than 10000 and bigger than 1 */
        z-index: 2;
    }
    
    .page-mini-main-header {
        position: absolute;
        width: 14rem;
        top: 0;
        padding: 0.35rem 0.7rem 0.25rem 0.7rem;
    }
    
    .page-mini-main-header i {
        color:white;
        font-size:2.2rem;
        padding: 0.2em;
    }

    .page-mini-main-footer {
        position: absolute;
        width: 14rem;
        bottom: 1rem;
    }
    
    .page-mini-main-wrapper {
        position: absolute;
        /*z-index: 1;*/
        top: 3.5rem;
        bottom: 2rem;
        width: 100%;
        overflow: hidden;
    }
    
    .page-mini-main-scroller {
        /*position: absolute;*/
        /*z-index: 1;*/
        width: 100%;
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
    }
    
    .page-mini-main-scroller ul {
        list-style: none;
        padding: 0;
        margin: 0 0.5rem 0 1rem;
        width: 100%;
    }
</style>