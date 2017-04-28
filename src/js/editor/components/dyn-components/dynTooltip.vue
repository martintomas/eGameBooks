<template>
     <div class="tooltip-inner tooltip" ref='tooltip' @click="tooltipWasClicked" @mouseenter="tooltipMouseEnter" @mouseleave="tooltipMouseLeave">
        <slot name='tooltip'></slot>
        <span class="tooltiptext hide-tooltip" :style='tooltipStyle' ref='tooltiptext'>
            <span @mouseenter="tooltipMouseLeave">
                <slot name='tooltipText'></slot>
            </span>
        </span>
        <template v-if="hasSecondTooltip">
            <span class="tooltiptext hide-tooltip" :style='tooltipStyle' ref='tooltiptext2'>
                <slot name='secondTooltipText'></slot>
            </span>
        </template>
    </div>
</template>

<script>

import {bus} from 'app.js'

import {getElementOffset,getCompStyle} from 'defaults.js'

export default {
    props: {
        tooltipId: {
            default:null,
            type:String
        },
        tooltipBox: {
            default: null,
            type: Object
        },
        allowAutomaticHidding: {
            default:true,
            type:Boolean
        },
        leftRightOrientation: {
            default:false,
            type:Boolean
        },
        forceTop: {
            default:false,
            type:Boolean
        },
        forceRight: {
            default:false,
            type:Boolean
        },
        forceWidth: {
            default:0,
            type:Number
        },
        reactToClick: {
            default:false,
            type:Boolean
        },
        inline: {
            default: false,
            type: Boolean
        },
        reactToHover: {
            default:true,
            type:Boolean
        },
        ignoreDefaultBehavior: {
            default:false,
            type:Boolean
        },
        zIndex: {
            default:100,
            type:Number
        }
    },
    data() {
        return {
            showSecond: false,
            tooltiptext: null,
            tooltiptext2: null,
            tooltip: null,
            mouseLeave: true,
        }
    },
    computed: {
        hasSecondTooltip() {
            return !!this.$slots.secondTooltipText
        },
        tooltipStyle() {
            return {
                zIndex: this.zIndex,
            }
        }
    },
    mounted() {
        this.tooltiptext = this.$refs.tooltiptext
        if(this.hasSecondTooltip)this.tooltiptext2 = this.$refs.tooltiptext2
        this.tooltip = this.$refs.tooltip

        bus.$on('automatic-hide',source => {
            if(this.allowAutomaticHidding && this.reactToClick) { //automatically hide tooltip
                if (!source.target.matches('.tooltip')) {
                    if(!this.tooltip.contains(source.target)) { //check if tooltip inner element was not clicked
                        if(this.isTooltipShow()) this.hide()
                        if(this.isSecondTooltipShown()) this.hide()
                    }
                } else {
                    let componentId = source.target.getAttribute('component-id')
                    if(componentId && this.tooltipId != null) {
                        if(componentId != this.tooltipId) {
                            if(this.isTooltipShow()) this.hide()
                            if(this.isSecondTooltipShown()) this.hide()
                        }
                    }
                }
            }
        })

        if(this.inline) {
            this.tooltip.style.display = 'inline'
            this.tooltiptext.style.position = 'absolute'
        }
    },
    methods: {
        offsetLeftRelativeToPage(element) { //get relative left position even for inline elements (they can go across multiple lines)
            var offset = element.offsetLeft;
            var offsetParent = element.offsetParent;
            if (offsetParent != null) {
                offset += this.offsetLeftRelativeToPage(offsetParent);
            }
            return offset
            
        },
        isTooltipShow() {
            return this.tooltiptext.classList.contains('show-tooltip')
        },
        isSecondTooltipShown() {
            if(this.tooltiptext2 != null) {
                if(this.tooltiptext2.classList.contains('show-tooltip')) return true
            }
            return false
        },
        tooltipWasClicked(event) {
            if(this.reactToClick && !this.ignoreDefaultBehavior) {
                if(this.inline) {
                    if(this.tooltiptext.contains(event.target)) { //inside tooltiptext was clicked
                        if(this.allowAutomaticHidding) this.hide() //hide when atomatic allowed
                        //otherwise ignore
                    }
                    else {
                        this.showInline(event.pageY - getElementOffset(event.target).top + event.target.offsetTop ,event.pageX - this.offsetLeftRelativeToPage(event.target) + event.target.offsetLeft)
                    }
                }
                else this.show(false)
            }
        },
        tooltipMouseEnter() {
            if(this.reactToHover && !this.ignoreDefaultBehavior) {
                this.mouseLeave = false
                if(!this.isTooltipShow()) {
                    this.show(false)
                }
            }
        },
        tooltipMouseLeave() {
            if(this.reactToHover && !this.ignoreDefaultBehavior) {
                this.mouseLeave = true
                if(this.isTooltipShow()) {
                    this.hide()
                }
            }
        },
        toogle(showSecond) {
            if (this.isTooltipShow()) { //check if first tooltip is shown
                this.hide() //hide it
                if(!(showSecond || this.showSecond)) return //end only if second tooltip shouldn be imidiatelly shown
            }

            if(this.isSecondTooltipShown()) { //check if second tooltip is shown
                this.hide() //hide it
                if(showSecond || this.showSecond) return //end only if first tooltip shouldn be imidiatelly shown
            }

            this.show(showSecond)
        },
        show(itemBorder = null,showSecond=false) {
            if(itemBorder === null || !itemBorder) {
                if(this.tooltipBox != null) itemBorder = this.tooltipBox
                else itemBorder = window
            }
            if(this.leftRightOrientation) {
                this.showRightLeft(itemBorder,showSecond)
            } else {
                this.showTopBottom(itemBorder,showSecond)
            }
        },
        showInline(posTop=null,posLeft=null,itemBorder = null) {
            if(itemBorder === null || !itemBorder) {
                if(this.tooltipBox != null) itemBorder = this.tooltipBox
                else itemBorder = window
            }
            this.showTopBottomInline(itemBorder,posTop,posLeft)
        },
        showRightLeft(itemBorder=window,showSecond,iterations = 4) {
            var tooltiptext = this.tooltiptext
            if((this.showSecond || showSecond) && this.tooltiptext2 != null) {
                 tooltiptext = this.tooltiptext2
            }

            //console.log('Showing tooltip')

            let posLeft = this.tooltip.offsetLeft + this.tooltip.clientWidth + 5
            let posTop = this.tooltip.offsetTop + ( this.tooltip.clientHeight / 2 ) - ( tooltiptext.clientHeight / 2 )
            let itemWidth = itemBorder.innerWidth
            if(!itemWidth) itemWidth = itemBorder.clientWidth
            let itemHeight = itemBorder.innerHeight
            if(!itemHeight) itemHeight = itemBorder.clientHeight
            let alreadyUpdated = false
            let clientHeightTemp = tooltiptext.clientHeight
            let clientWidthTemp = tooltiptext.clientWidth            

            //take care of max-width & max-height
            if(this.forceWidth === 0) {
                if(posLeft + tooltiptext.clientWidth > itemWidth) {
                    //tooltiptext.style.width = itemWidth - posLeft  + 'px'
                    tooltiptext.style.maxWidth = itemWidth - posLeft - 10  + 'px' //item is to width
                } else {
                    //tooltiptext.style.width = '200px'
                    tooltiptext.style.maxWidth = '200px' //default tooltip width
                }
            } else {
                tooltiptext.style.width = this.forceWidth + 'rem'
                tooltiptext.style.maxWidth = this.forceWidth + 'rem'
            }
            if(posTop + tooltiptext.clientHeight > itemHeight) tooltiptext.style.maxHeight = itemHeight + 'px'
            //else tooltiptext.style.maxHeight = tooltiptext.clientWidth/2 + 'px' //set up height and width( = 2x height)

            //position right or left --> right position can be forced only
            if(this.forceRight) {
                tooltiptext.style.right = posLeft + 'px'
                tooltiptext.classList.add('right')
                if(tooltiptext.classList.contains('left')) tooltiptext.classList.remove('left')
            } else {
                tooltiptext.style.left = posLeft + 'px'
                tooltiptext.classList.add('left')
                if(tooltiptext.classList.contains('right')) tooltiptext.classList.remove('right')
            }

            if(posTop + tooltiptext.clientHeight > itemHeight) { //item is out
                alreadyUpdated = true
                posTop = this.tooltip.offsetTop + this.tooltip.clientHeight/2 - tooltiptext.clientHeight + 10
                tooltiptext.classList.add('move-bottom')
                if(tooltiptext.classList.contains('move-top')) tooltiptext.classList.remove('move-top')
            }

            if(posTop < 0 && !alreadyUpdated) {
                posTop = this.tooltip.offsetTop + this.tooltip.clientHeight/2 - 10
                tooltiptext.classList.add('move-top')
                if(tooltiptext.classList.contains('move-bottom')) tooltiptext.classList.remove('move-bottom')
            }

            tooltiptext.style.top = posTop + 'px'

            //show tooltip
            if((clientHeightTemp !=tooltiptext.clientHeight || clientWidthTemp != tooltiptext.clientWidth) && iterations > 0) { //parameters can be sometimes changed during procesing --> try to position tooltip one more time to obtain more stable position
                setTimeout(() => {
                    this.showRightLeft(itemBorder,showSecond,iterations-=1) //do recalculation one more time (change iteration attr)
                },50)
            } else {
                if(this.reactToHover && !this.ignoreDefaultBehavior && this.mouseLeave) this.hide() //hide when mouse leave region before tooltip is stabilized
                else tooltiptext.classList.add('show-tooltip');
            }
            
        },
        showTopBottom(itemBorder=window,showSecond,iterations = 4) { //iterations --> added styles can influence size of tooltip text -> therefore influence position of tooltip (positionign can be sometimes done more precisely for several times until all styles are not setup up)
            var tooltiptext = this.tooltiptext
            if((this.showSecond || showSecond) && this.tooltiptext2 != null) {
                 tooltiptext = this.tooltiptext2
            }

            //console.log('Showing tooltip')
            //compute position of tooltip
            //inspired by https://osvaldas.info/elegant-css-and-jquery-tooltip-responsive-mobile-friendly
            var pos_left = this.tooltip.offsetLeft + ( this.tooltip.clientWidth / 2 ) - ( tooltiptext.clientWidth / 2 )
            var pos_top = this.tooltip.offsetTop - tooltiptext.clientHeight - 5
            let itemWidth = itemBorder.innerWidth
            if(!itemWidth) itemWidth = itemBorder.clientWidth
            let clientHeightTemp = tooltiptext.clientHeight
            let clientWidthTemp = tooltiptext.clientWidth

            //take care of max-width & max-height
            tooltiptext.style.maxHeight = tooltiptext.clientWidth/2 //set up height and width( = 2x height)
            if(this.forceWidth === 0) {
                if(itemWidth < tooltiptext.clientWidth + 10 )
                    tooltiptext.style.maxWidth = tooltiptext.clientWidth - 10 + 'px'
                else
                    tooltiptext.style.maxWidth = '340px'
            } else {
                tooltiptext.style.maxWidth = this.forceWidth + 'rem'
            }

            //set left position
            if( pos_left < 0 ) {
                pos_left = this.tooltip.offsetLeft + this.tooltip.clientWidth / 2 - 10;
                tooltiptext.classList.add('move-left')
            } else {
                if (tooltiptext.classList.contains('move-left')) {
				    tooltiptext.classList.remove('move-left')
                }
            }

            //set right position
            if( pos_left + tooltiptext.clientWidth > itemWidth ) { //we can check whenever item is inside provided boundaries
                pos_left = this.tooltip.offsetLeft - tooltiptext.clientWidth + tooltiptext.clientWidth / 2 + 10;
                tooltiptext.classList.add('move-right')
            } else {
                if (tooltiptext.classList.contains('move-right')) {
                    tooltiptext.classList.remove('move-right')
                }
            }

            //position up or down
            if( pos_top < 0 && !this.forceTop) {
                pos_top = this.tooltip.offsetTop + this.tooltip.clientHeight;
                tooltiptext.classList.add('top') //arrow is at top -> text is at bottom
            } else {
                if (tooltiptext.classList.contains('top')) {
				    tooltiptext.classList.remove('top')
                }
            }

            //set up position fo tooltip
            tooltiptext.style.top = pos_top + 'px'
            tooltiptext.style.left = pos_left + 'px'

            //show tooltip
            if((clientHeightTemp !=tooltiptext.clientHeight || clientWidthTemp != tooltiptext.clientWidth) && iterations > 0) { //parameters can be sometimes changed during procesing --> try to position tooltip one more time to obtain more stable position
                setTimeout(() => {
                    this.showTopBottom(itemBorder,showSecond,iterations-=1) //do recalculation one more time (change iteration attr)
                },50)
            } else {
                if(this.reactToHover && !this.ignoreDefaultBehavior && this.mouseLeave) this.hide() //hide when mouse leave region before tooltip is stabilized
                else tooltiptext.classList.add('show-tooltip');
            }
            
        },
        showTopBottomInline(itemBorder=window,posTop,posLeft,iterations = 4) {
            var tooltiptext = this.tooltiptext

            let itemWidth = itemBorder.innerWidth
            if(!itemWidth) itemWidth = itemBorder.clientWidth
            let clientHeightTemp = tooltiptext.clientHeight
            let clientWidthTemp = tooltiptext.clientWidth

            //take care of max-width & max-height
            tooltiptext.style.maxHeight = tooltiptext.clientWidth/2 //set up height and width( = 2x height)
            if(this.forceWidth === 0) {
                if(itemWidth < tooltiptext.clientWidth + 10 )
                    tooltiptext.style.maxWidth = tooltiptext.clientWidth - 10 + 'px'
                else
                    tooltiptext.style.maxWidth = '340px'
            } else {
                tooltiptext.style.maxWidth = this.forceWidth + 'rem'
            }

            //set left position
            let pos_left = posLeft - tooltiptext.clientWidth/2 //try to keep it in middle
            if( pos_left < 0 ) {
                pos_left = posLeft - 10;
                tooltiptext.classList.add('move-left')
            } else {
                if (tooltiptext.classList.contains('move-left')) {
				    tooltiptext.classList.remove('move-left')
                }
            }

            //set right position
            if( pos_left + tooltiptext.clientWidth > itemWidth ) { //we can check whenever item is inside provided boundaries
                pos_left = posLeft - tooltiptext.clientWidth + 10;
                tooltiptext.classList.add('move-right')
            } else {
                if (tooltiptext.classList.contains('move-right')) {
                    tooltiptext.classList.remove('move-right')
                }
            }

            let pos_top = posTop - tooltiptext.clientHeight - 10
            //position up or down
            if( pos_top < 0 && !this.forceTop) {
                pos_top = posTop + 5
                tooltiptext.classList.add('top') //arrow is at top -> text is at bottom
            } else {
                if (tooltiptext.classList.contains('top')) {
				    tooltiptext.classList.remove('top')
                }
            }

            //set up position fo tooltip
            tooltiptext.style.top = pos_top + 'px'
            tooltiptext.style.left = pos_left + 'px'

            //show tooltip
            if((clientHeightTemp !=tooltiptext.clientHeight || clientWidthTemp != tooltiptext.clientWidth) && iterations > 0) { //parameters can be sometimes changed during procesing --> try to position tooltip one more time to obtain more stable position
                setTimeout(() => {
                    this.showTopBottomInline(itemBorder,posTop,posLeft,iterations-=1) //do recalculation one more time (change iteration attr)
                },50)
            } else {
                if(this.reactToHover && !this.ignoreDefaultBehavior && this.mouseLeave) this.hide() //hide when mouse leave region before tooltip is stabilized
                else tooltiptext.classList.add('show-tooltip');
            }
        },
        hide() {
            //console.log('Hide tooltip')
            if (this.tooltiptext.classList.contains('show-tooltip')) {
                this.tooltiptext.classList.remove('show-tooltip');
            }
            this.tooltiptext.classList.add('hide-tooltip')

            if(this.tooltiptext2 != null) {
                if (this.tooltiptext2.classList.contains('show-tooltip')) {
                    this.tooltiptext2.classList.remove('show-tooltip');
                }
                this.tooltiptext2.classList.add('hide-tooltip')
            }
        },
        
    }
}
</script>

<style>
     /* Tooltip container */
.tooltip-inner {
    display: inline-block;
}

/* Tooltip text */
.tooltip-inner .tooltiptext {
    font-size: 0.875em;
    text-align: center;
    text-shadow: 0 1px rgba( 0, 0, 0, .5 );
    line-height: 1.5;
    color: #fff;
    background: #333;
    border-radius: 5px;
    box-shadow: 0 3px 5px rgba( 0, 0, 0, .3 );
    position: absolute;
    padding: 5px;
    border: solid 1px #555;

    transition: opacity 0.5s;
}

.tooltip-inner .tooltiptext i {
    padding:0.2rem;
    font-size:250%;
}

.tooltiptext:after
{
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    margin-left: -5px;
}
.tooltip-inner .top:after
{
    border-top-color: transparent;
    border-bottom-color:#555;
    top: -10px;
    bottom: auto;
}
.tooltip-inner .right:after
{
    border-top-color: transparent;
    border-left-color:#555;
    bottom: 50%;
    left: 100%;
    margin: -5px 0px -5px 0px;
}
.tooltip-inner .left:after
{
    border-top-color: transparent;
    border-right-color:#555;
    bottom: 50%;
    margin: -5px;
    left: -5px;
}
.tooltip-inner .move-bottom:after
{
    bottom: 10px;
}
.tooltip-inner .move-top:after
{
    bottom: auto;
    top: 10px;
}
.tooltip-inner .move-left:after
{
    left: 5px;
    margin: 0;
}
.tooltip-inner .move-right:after
{
    right: 5px;
    left: auto;
    margin: 0;
}

.hide-tooltip {
    /* Fade in tooltip */
    opacity: 0;
    visibility: hidden;
}

.show-tooltip {
    visibility: visible;
    opacity: 1;
}

</style>