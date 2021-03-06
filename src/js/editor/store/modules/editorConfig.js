export default {
    state: {
        miniPageDefaultWidth: 180, //px
        miniPageMiniDistance: 0.2, //15*0.2
        miniPageMaxDistance: 1.1, //*0.1
        miniPageMiniDistanceLeft: 0.5, //10*0.4
        miniPageMaxDistanceLeft: 1.4, //*1.4
        miniPageListWindowWidthAutomaticShown: 3.5, //this is ration of how many page list is possible to shown at screen (if it is not possible to show at least defined number of page list, this element is show)
        miniElementListWindowWidthAutomaticShown: 4.5, //applies previous comment
        listsShownTogetherLimit: 3.5, //how much space between have to be at display to show both lists together (at same time)
        listsAutomaticHide: 3,

        commentShaveHTMLPageConnection: 100, //max number of letters in comments
        whispererShaveHTML: 50,
        whispererLimit: 20,
    }
}