import IScroll from 'iscroll'
import { bus } from 'app.js'


//expects that page variable will be defined in childrens
export default {
    props: {
        pageId: 0,
        pageData: null,
    },
    data() {
        return {
            pageDistanceDefault: 0,
            pageConnectionView: null,
            scrollContainerRef: null,
            scroller: null,
            scrollWrapper: 'page-mini-main-wrapper',
            scrollContainer: 'page-mini-main-scroller',
            activatedPage: null, //remmember last active page
            fontSize: null,
            miniPageWidth: 200,
        }
    },
    computed: {
        pageMiniDistance() {
            return Math.ceil(this.miniPageWidth * this.editorStore.appConf.miniPageMiniDistanceLeft * 10) / 10;
        },
        pageMaxDistance() {
            return Math.ceil(this.miniPageWidth * this.editorStore.appConf.miniPageMaxDistanceLeft * 10) / 10;
        },
        pageMaxActivationDistance() { //how much should activated mini page move to left
            if (this.activatedPage != null) {
                if (!this.activatedPage.tooltipMiniPage) { //tooltip is missing --> not needed to create special space next to mini page!!
                    if (this.activatedPage.index === this.pages.length - 1 || this.pageDistanceDefault < this.miniPageWidth) return this.miniPageWidth
                    return this.pageDistanceDefault
                }
            }
            return this.pageMaxDistance
        },
        linkActions() {
            return this.pageData.actions.link
        }
    },
    watch: {
        pages(value) {
            if (this.activatedPage != null) this.hideConnectionPage(this.activatedPage, false) //hide shown pages (updates pageDistanceDefault value)
            setTimeout(() => {
                    this.pageDistanceDefault = this.pageOptimalDistance() //change optimal distance when pages are changed
                    this.updateScroller() //update toolbar
                }, 100) //wait a bit for reverse pages to stabilize
        }
    },
    mounted() {
        this.pageConnectionView = this.$refs.pageConnectionView
        this.scrollContainerRef = this.$refs[this.scrollContainer]
        this.fontSize = parseFloat(window.getComputedStyle(this.pageConnectionView, null).getPropertyValue('font-size')) //used to compute rem from pixel value --> rem = pixel / font_size

        this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
            scrollX: true,
            scrollY: false
        })
        this.pageDistanceDefault = this.pageOptimalDistance() //update page distance based on window size --> use optimaly width of box
        this.updateScroller()

        bus.$on(['window-resize-end', 'editor-panel-resize'], source => {
            this.pageDistanceDefault = this.pageOptimalDistance() //be sure to update distance between elements when window is resized
            if (this.activatedPage != null) this.moveMiniPagesX(this.activatedPage, this.pageMaxActivationDistance - this.pageDistanceDefault) //update distance of moved pages (behind active one)
            this.updateScroller()
        })
    },
    methods: {
        miniPageUpdateWidth(width) {
            this.miniPageWidth = width
            this.$nextTick(() => {
                this.pageDistanceDefault = this.pageOptimalDistance()
                this.updateScroller()
            })
        },
        showConnectionPage(page) {
            //console.log('Connection pages main -- show connection reverse page');

            if (this.activatedPage != null && this.activatedPage != page) { //hide previously active page
                this.hideConnectionPage(this.activatedPage, false);
            }
            this.activatedPage = page; //set active pages
            this.pageDistanceDefault = this.pageOptimalDistance() //update optimal distance with active item

            this.moveMiniPagesX(page, this.pageMaxActivationDistance - this.pageDistanceDefault)
            this.updateScroller()
        },
        hideConnectionPage(page, updateScroller = true) {
            page.hideMiniPageEvent()
            this.moveMiniPagesX(page, 0)
            this.activatedPage = null
            this.pageDistanceDefault = this.pageOptimalDistance()

            if (updateScroller) this.updateScroller()
        },
        moveMiniPagesX(fromPage, distance) {
            for (var i = fromPage.index + 1; i < this.$refs['pageConnectionsBox'].length; i++) {
                this.$refs['pageConnectionsBox'][i].moveDistanceLeft(distance);
            }
        },
        pageOptimalDistance() {
            if (this.pageConnectionView != null && this.pages.length > 0) {

                // let widthRem = (this.pageConnectionView.clientWidth - 2) / this.fontSize //width of component
                // let remMiniPage = this.$refs.pageConnectionsBox[0].$refs.miniPage.clientWidth / this.fontSize //mini page box rem width
                // let remDiff = this.miniPageWidth / remMiniPage //diff between styled width and computed

                // let distTemp = this.miniPageWidth
                // if (this.pages.length > 1) {
                //     if (this.activatedPage != null) {
                //         if (this.activatedPage.index === this.pages.length - 1) distTemp = remDiff * ((widthRem - this.pageMaxDistance / remDiff) / (this.pages.length - 1))
                //         else distTemp = remDiff * ((widthRem - remMiniPage - this.pageMaxDistance / remDiff) / (this.pages.length - 2))
                //     } else {
                //         distTemp = remDiff * ((widthRem - remMiniPage) / (this.pages.length - 1))
                //     }
                //}

                let distTemp = this.miniPageWidth
                let widthBox = this.pageConnectionView.clientWidth
                if (this.pages.length > 1) {
                    if (this.activatedPage != null) {
                        if (this.activatedPage.index === this.pages.length - 1) distTemp = ((widthBox - this.pageMaxActivationDistance - 5) / (this.pages.length - 1))
                        else distTemp = ((widthBox - this.miniPageWidth - this.pageMaxActivationDistance - 5) / (this.pages.length - 2))
                    } else {
                        distTemp = ((widthBox - this.miniPageWidth - 5) / (this.pages.length - 1))
                    }
                }


                if (distTemp > this.pageMaxDistance) return this.pageMaxDistance
                else if (distTemp < this.pageMiniDistance) return this.pageMiniDistance
                else return Math.floor((distTemp) * 10) / 10
            }
            return this.pageMaxDistance
        },
        updateScroller() {
            //console.log('Mini pages connections - updating scroll width')

            var scrollBarWidth = this.miniPageWidth + ((this.pages.length - 1) * this.pageDistanceDefault)
            if (this.activatedPage != null) {
                if (this.activatedPage.index === this.pages.length - 1) scrollBarWidth += this.pageMaxActivationDistance - this.miniPageWidth
                else scrollBarWidth += this.pageMaxActivationDistance - this.pageDistanceDefault
            }

            if (this.scrollContainerRef != null) {
                if (this.pageDistanceDefault === this.pageMiniDistance) scrollBarWidth += 6 //scrollbar is shown --> be sure that some place is free behind it

                this.scrollContainerRef.style.width = Math.ceil(scrollBarWidth * 10) / 10 + 'px'; //recompute width of scrollbar container
                setTimeout(() => {
                    this.scroller.refresh(); //actualize scroller based on new width
                    if (this.activatedPage != null) {
                        if (this.activatedPage.index === this.pages.length - 1) this.scroller.scrollToElement(this.activatedPage.$el, 100)
                    }
                }, 200);
            }
        }
    }

}