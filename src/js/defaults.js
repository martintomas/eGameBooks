// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Return unique string id (key) in provided dict
export function getUniqueId(dictData) {
    for (var i = 1; i <= Object.keys(dictData).length + 1; i++) {
        if (!(String(i) in dictData)) {
            return i
        }
    }
}

//return hash string
export function generateHash(componentType, componentId) {
    if (!componentType || (!componentId && componentId != 0)) return ''
    return 'h' + componentType + 'a' + componentId
}

export function toCamelCase(str) {
    return str.toLowerCase().replace(/(\-[a-z])/g, function($1) {
        return $1.toUpperCase().replace('-', '');
    });
}

var vendors = [
    '-webkit-',
    '-o-',
    '-moz-',
    '-ms-',
    ''
]
export function setCss3Style(el, prop, val) {
    vendors.forEach(function(vendor) {
        prop = toCamelCase(vendor + prop);

        if (prop in el.style) {
            el.style[prop] = val;
        }
    });
}

export function getCompStyle(el, prop) {
    return window.getComputedStyle(el, null).getPropertyValue(prop)
}

// inspired by http://stackoverflow.com/questions/18953144/how-do-i-get-the-offset-top-value-of-an-element-without-using-jquery
// get elements global offset
export function getElementOffset(element)
{
    let de = window.document.body || window.document.documentElement
    let box = element.getBoundingClientRect();
    let top = box.top + window.pageYOffset - de.clientTop;
    let left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}

export function clearDict(dict,vue=null) {
    for(let key in dict) {
        if(vue != null) vue.set(dict,key,'') //clear dict reactive way
        else dict[key] = ''
    }
    return dict
}

// interval function that call provided function after window resize is finished --> window has stable size for defined time period
var windowResizeEndIntervalItems = {} //use global variable to remmember states
var numResizeEndAttempsDefault = 10 //number to attemps before it is forced to end
export function waitForResizeEnd(funcCall, viewItem, callIntervalFunc = false, intervalTime = 120, timeoutTime = 50) {
    if (!(viewItem in windowResizeEndIntervalItems)) {
        windowResizeEndIntervalItems[viewItem] = numResizeEndAttempsDefault
        let windowResizeEndInterval = null
        let windowResizeEndTimeout = null
        let windowSizeTemp = null
        let windowSizeTemp2 = null
        windowResizeEndInterval = setInterval(() => { //check until resize event is not finished --> size of window is not stable
            windowResizeEndIntervalItems[viewItem] -= 1

            if (windowResizeEndIntervalItems[viewItem] <= 0) { //force to end interval when number of attemps is out
                funcCall()
                clearInterval(windowResizeEndInterval)
                delete windowResizeEndIntervalItems[viewItem]
            }

            if (viewItem.innerWidth) windowSizeTemp = [viewItem.innerWidth, viewItem.innerHeight] //get width && height
            else windowSizeTemp = [viewItem.clientWidth, viewItem.clientHeight] //get width && height

            clearTimeout(windowResizeEndTimeout)
            windowResizeEndTimeout = setTimeout(() => { //try to get some time before width is checked once more
                if (viewItem.innerWidth) windowSizeTemp2 = [viewItem.innerWidth, viewItem.innerHeight] //get width && height
                else windowSizeTemp2 = [viewItem.clientWidth, viewItem.clientHeight] //get width && height

                if (JSON.stringify(windowSizeTemp) === JSON.stringify(windowSizeTemp2)) { //check if width changed
                    funcCall()
                    clearInterval(windowResizeEndInterval)
                    delete windowResizeEndIntervalItems[viewItem]
                } else if (callIntervalFunc) {
                    funcCall()
                }
            }, timeoutTime)
        }, intervalTime)
    }
}