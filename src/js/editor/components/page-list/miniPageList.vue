<template>
<div class="page-mini-container" ref='pageMiniContainer'>
    <div class="page-mini-main" ref='pageMiniMain'>
        <p class="page-mini-summary-text active-text" @click="showHidePageList">{{String.doTranslationEditor('page-summary')}}</p>
        <div class="page-mini-main-header">
            <!--
            <dyn-tooltip class='dyn-tooltip'>
                <i class="fa fa-file-text-o active-icon tooltip" aria-hidden="true" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('new-page')}}</span>
            </dyn-tooltip>
            -->
            <dyn-tooltip class='dyn-tooltip'>
                <i :class="[multiPage ? 'active-icon' : 'unactive-icon', 'fa','fa-files-o','tooltip']" aria-hidden="true" @click="multiPageShow" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('multi-pages')}}</span>
            </dyn-tooltip>
            <dyn-tooltip class='dyn-tooltip'>
                <i :class="[!multiPage ? 'active-icon' : 'unactive-icon', 'fa','fa-file-o','tooltip']" aria-hidden="true" @click="onePageShow" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('one-pages')}}</span>
            </dyn-tooltip>
            <dyn-tooltip class='dyn-tooltip'>
                <i :class="[onlyErrorMiniPages ? 'active-icon' : 'unactive-icon', 'fa','fa-exclamation-circle','tooltip']" aria-hidden="true" @click="onlyErrorPages" slot='tooltip'></i>
                <span slot='tooltipText'>{{String.doTranslationEditor('wrong-pages')}}</span>
            </dyn-tooltip>
        </div>
        <!--<p class="vertical-text float-right page-mini-vertical-text">Page summary</p>-->
        <div class="page-mini-main-wrapper scroller-left" ref="page-mini-main-wrapper">

            <div class="page-mini-main-scroller" ref="page-mini-main-scroller">
                <ul>
                    <li is="mini-page" v-for="(model,index) in pagesList" ref="miniPagesBox" :key="model" :index='index' v-bind:model="pages[model]" v-bind:page-mini-distance="pageDistanceDefault" v-bind:multi-page="multiPage"
                        v-on:show-mini-page="showMiniPage" v-on:hide-mini-page="hideMiniPage" v-on:mini-page-update-height='miniPageUpdateHeight'>
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
    import {busEditor} from 'editor/services/defaults.js'
    import {generateHash, waitForResizeEnd, setCss3Style} from 'defaults.js'
    import * as mutationTypes from 'editor/store/mutationTypes'

    export default {
        data() {
            return {
                activatedPage: null, //remmember last active page
                scrollWrapper: 'page-mini-main-wrapper',
                scrollContainer: 'page-mini-main-scroller',
                scroller: null,
                pageMiniHeight: 240,
            };
        },
        components: {
            MiniPage,
            DynTooltip
        },
        computed: {
            pagesList() {
                if(!this.onlyErrorMiniPages) {
                    return this.$store.state.editor.bookData.pagesOrder
                } else {
                    return this.$store.getters['editor/getOnlyErrorPagesArray']()
                }
            },
            pages() {
                return this.$store.state.editor.bookData.pages
            },
            activePage() {
                return this.$store.state.editor.bookData.selectedPage
            },
            multiPage() {
                return this.$store.state.editor.editorStatus.miniPageMultiPages
            },
            pageMiniDistance() {
                return Math.ceil(this.pageMiniHeight * this.$store.state.editor.editorConfig.miniPageMiniDistance); //mini distance is 20%
            },
            pageMaxDistance() {
                return Math.ceil(this.pageMiniHeight * this.$store.state.editor.editorConfig.miniPageMaxDistance); //max distance is 115%
            },
            pageDistanceDefault() {
                if(this.multiPage) return this.pageMiniDistance;
                else return this.pageMaxDistance
            },
            onlyErrorMiniPages() {
                return this.$store.state.editor.editorStatus.onlyErrorMiniPageList
            }
        },
        watch: {
            pagesList(value) {
                this.$nextTick(() => { //wait for page rendering
                    if(this.activatedPage != null)  this.showMiniPage(this.activatedPage) //keep activatedPage correctly shown
                })
                this.updateScroller()
            },
            activePage(value) {
                if(value === null && this.activatedPage != null) this.hideMiniPage(this.activatedPage, true)
            }
        },
        created() {
            busEditor.$on('editor-panel-shown-fast', source => {
                if(this.$refs.pageMiniContainer) { //this element have to be created and mounted
                    if(source != this.$refs.pageMiniContainer) { //some other list changed its status (probably element list)
                        if(this.$store.state.editor.editorStatus.miniPageListShown) { //if this list is show --> check if this should be automaticaly hidden
                            if(window.innerWidth/this.$refs.pageMiniContainer.clientWidth < this.$store.state.editor.editorConfig.listsShownTogetherLimit) { //keep hidden by default (when widht si too small)
                                this.hideImmidiatellyMiniPageList()
                            }
                        }
                    }
                }
            })

            bus.$on('window-resize-end', source => {
                if(this.$refs.pageMiniContainer) {
                    if(this.$store.state.editor.editorStatus.miniPageListShown) {
                        if(window.innerWidth/this.$refs.pageMiniContainer.clientWidth < this.$store.state.editor.editorConfig.listsAutomaticHide) { //keep hidden by default (when widht si too small)
                            this.hideMiniPageList()
                        }
                    }
                }
            })
        },
        mounted() {
            //set up scroller
            this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
                mouseWheel: true,
                bounce: false,
                interactiveScrollbars: true,
                shrinkScrollbars: 'clip',
                scrollbars: 'custom',
            });

            //check if lists should be automaticaly hidden
            if(window.innerWidth/this.$refs.pageMiniContainer.clientWidth < this.$store.state.editor.editorConfig.miniPageListWindowWidthAutomaticShown) { //keep hidden by default (when widht si too small)
                this.hideImmidiatellyMiniPageList()
            }

            //update scroller
            this.updateScroller()
        },
        methods: {
            generateHash,
            miniPageUpdateHeight(height) {
                this.pageMiniHeight = height
            },
            isLastPage(page) {
                if (page.index + 1 === this.pagesList.length) return true;
                return false;
            },
            showMiniPage(page) {
                //console.log('Mini pages main -- show mini page');

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
                for (let i = 0 ; i < this.$refs.miniPagesBox.length; i++) { //manipulation with pages list changes ref order --> go through all list and check index
                    if(this.$refs.miniPagesBox[i].index > fromPage.index) this.$refs.miniPagesBox[i].moveDistanceTop(distance);
                }
            },
            onePageShow(event) {
                //console.log('Mini pages - one page show');

                this.$store.commit('editor/'+mutationTypes.CHANGE_MINI_PAGE_SHOWN_METHOD,false)

                if (this.activatedPage != null) { //keep activated page shown
                    this.showMiniPage(this.activatedPage) //updates scroller itself
                } else {
                    this.updateScroller();
                }
            },
            multiPageShow(event) {
                //console.log('Mini pages - multi page show');

                this.$store.commit('editor/'+mutationTypes.CHANGE_MINI_PAGE_SHOWN_METHOD,true)

                if (this.activatedPage != null) { //keep activated page shown
                    this.showMiniPage(this.activatedPage) //updates scroller itself
                } else {
                    this.updateScroller();
                }
            },
            onlyErrorPages(event) {
                if(this.onlyErrorMiniPages) this.$store.commit('editor/'+mutationTypes.ONLY_ERROR_MINI_PAGE_SHOWN_METHOD,false)
                else this.$store.commit('editor/'+mutationTypes.ONLY_ERROR_MINI_PAGE_SHOWN_METHOD,true)
            },
            updateScroller(overTop) {
                //console.log('Mini pages - updating scroll height');

                if(!overTop) overTop=0

                var scrollBarHeight = this.pagesList.length * this.pageDistanceDefault + (this.pageMiniHeight - this.pageDistanceDefault + 10 + overTop);
                if (this.activatedPage != null && !this.isLastPage(this.activatedPage)) {
                    scrollBarHeight += this.pageMaxDistance - this.pageDistanceDefault;
                }

                if (this.scrollContainer in this.$refs) {
                    this.$refs[this.scrollContainer].style.height = scrollBarHeight + 'px'; //recompute height of scrollbar container

                    setTimeout(() => {
                        this.scroller.refresh(); //actualize scroller based on new height
                    }, 200);
                }
            },
            showHidePageList() {
                //console.log('Changing page list show')
                if(!this.$store.state.editor.editorStatus.miniPageListShown) {
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
                busEditor.$emit('editor-panel-shown-fast', this.$refs.pageMiniContainer)
                this.updateWindowResize()
            },
            updateWindowResize() {
                setTimeout(() => {
                    waitForResizeEnd(() => {
                        busEditor.$emit('editor-panel-resize', this.$refs.pageMiniContainer)
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
        min-height:35rem;
        /*background-color: red;*/
        width: 16.5rem;
        background-color:white;

        transition: width 0.3s;
    }
    
    .page-mini-main {
        position:absolute;
        width: 16rem;
        height: 100%;
        min-height:35rem;
        /*border: 0.05rem solid black;*/
        /*margin: 0.2rem 0.2rem 0.2rem 0.2rem;*/
        background: url('/img/editor/mini-page-list-up-without-text.svg') no-repeat top left;
        background-size: contain;
        left:0rem;
        z-index:10001;

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

    .scroller-left > div:nth-child(2) {
        right:auto;
        left:1px
    }
</style>