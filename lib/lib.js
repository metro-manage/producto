window.dataLib = {}

function rand( ...params ){
    const [ max, min = 0] = params.reverse()
    return Math.floor(Math.random() * ((max + 1) - min) + min)
}

function createNodeElement( html ) {
    const template      = document.createElement('div')
    template.innerHTML  = html
    const element       = template.children[0] ?? ''
    template.innerHTML  = ''

    if(element.tagName == 'TEMPLATE') {
        const fragment  = document.createDocumentFragment()
        fragment.append(...element.content.children);
        return fragment
    }
    
    return element;
}

function createObjectElement( elements, attribute, remove = false ) {
    
    return Array.from( elements ).reduce(( prev, curr) => {

        prev[ curr.getAttribute(attribute) ] = curr
        if ( remove ) curr.removeAttribute(attribute)

        return prev

    }, {})

}

function createNodeFragment( ...elements ) {
    const fragment = document.createDocumentFragment()

    elements.forEach( element => {
        if( typeof element == 'function' ) fragment.append( element() )
        else fragment.append( element )
    })
    
    return fragment
}

function replaceNodeChildren( element, children = {}, attribute = false ) {
    const isElementFragment = ( element ) => element instanceof HTMLElement || element instanceof DocumentFragment || false

    if( isElementFragment( element ) ) {
        element.querySelectorAll('[data-node-replace]').forEach(child => {

            const childObj = children[ child.getAttribute('data-node-replace') ]
            if( isElementFragment( childObj ) ) {
    
                child.removeAttribute('data-node-replace')
                child.replaceWith( childObj )
    
                if( attribute ) {
                    Array.from( child.attributes ).forEach(attribute => childObj.setAttribute(attribute.name, attribute.value))
                }
            } 
            
            else {
                child.remove()
            }
    
        });
    }

    return element
}

function copyToClipboard(text = '') {

    if( navigator.clipboard ) {
        navigator.clipboard.writeText(text)
    } else {

        if( !window.dataLib.copy ) {
            window.dataLib.copy = document.createElement('textarea')
            window.dataLib.copy.setAttribute('style', 'position: fixed; top: 0; transform: translateY(-100%);')
        }
        
        window.dataLib.copy.value = text;
    
        document.body.append(window.dataLib.copy);
    
        window.dataLib.copy.select();
        window.dataLib.copy.setSelectionRange(0, text.length);
    
        document.execCommand('copy');
    
        window.dataLib.copy.remove()
    } 

}


function ttrim( text = '' ) {
    const left =( symbol = '' )=>{
        if(text != '', symbol != ''){
            while( text.startsWith(symbol) ) text = text.slice(1)
        }
        return text
    }

    const right =( symbol = '' )=>{
        if(text != '', symbol != ''){
            while( text.endsWith(symbol) ) text = text.slice(0, -1)
        }
        return text
    }

    const both =( symbol = '' )=>{
        if(text != '', symbol != ''){ 
            while( text.startsWith(symbol) ) text = text.slice(1)
            while( text.endsWith(symbol) ) text = text.slice(0, -1)
        }
        return text
    }

    return { left, right, both }
}

class RenderRouteHash {
    constructor() {

        this._params = []
        this._routes = []

    }
    param(route = '', callback = false) {
        const dinamic = route.includes('/:')
        route = ttrim(route).both('/')
        this._routes.push({ route, callback, dinamic })
    }
    render() {

        const params = {}
        this._params = ttrim(location.hash.slice(1)).both('/')

        const findRoute = this._routes.find(route => {

            if (route.dinamic) {

                const splitRoute = route.route.split('/')
                const splitParam = this._params.split('/')

                if (splitRoute.length == splitParam.length) {
                    for (let i = 0; i < splitRoute.length; i++) {
                        const textRoute = splitRoute[i].trim()
                        if (textRoute.startsWith(':')) params[textRoute.slice(1)] = splitParam[i]
                        else if (textRoute !== splitParam[i]) return false
                    }

                    return route
                }

            } else if (route.route == this._params) {
                return route
            } else if (route.route == '*') {
                return route
            }

            return false
        })

        if (findRoute) {
            sessionStorage.setItem('params', JSON.stringify(params))
            window.dataLib.params = params
            return findRoute.callback(params)
        }

    }
}

class RenderObjectElement {
    constructor( objectElement = {} ) {
        this.savedElement   = Object.keys( objectElement ).reduce( ( prev, curr ) => {       
            prev[ curr ] = { element : objectElement[ curr ], elementText : document.createTextNode(''), parent : objectElement[ curr ].parentElement, status : true }
            return prev
        }, {} )
    }
    
    set( object ) {
        Object.keys( object ).forEach( key => {
            const savedElementKey = this.savedElement[ key ]
            if( savedElementKey ) {
                savedElementKey.status  = object[ key ]

                if( savedElementKey.status ) {
                    if( !savedElementKey.element.parentElement ) {
                        savedElementKey.elementText.replaceWith( savedElementKey.element )
                        //savedElementKey.parent.append( savedElementKey.element )
                    }
                } else {
                    if( savedElementKey.element.parentElement ) {
                        savedElementKey.element.replaceWith( savedElementKey.elementText )
                        //savedElementKey.element.parentElement.removeChild( savedElementKey.element )
                    }
                }
            }
        })
    }

}

function encodeText( string = '' ) {
    const input =()=>{
        if( string.trim() != '' ) {
            const input = document.createElement('input')
            input.setAttribute('value', string)
            return input.outerHTML.slice(14, -2)
        }
        
        return string
    }

    const textarea =()=>{
        if( string.trim() != '' ) {
            const textTarea     = document.createElement('textarea')
            textTarea.innerHTML = string
            return textTarea.innerHTML
        }

        return string
    }

    return { input, textarea }
}

const encodeInput = (string = '') => {
    if (string.trim() != "") {
        const input = document.createElement("input");
        input.setAttribute("value", string);
        return input.outerHTML.slice(14, -2);
    }
  
    return string;
  };
  
const encodeTextarea = (string = '') => {
    if (string.trim() != "") {
        const textTarea = document.createElement("textarea");
        textTarea.innerHTML = string;
        return textTarea.innerHTML;
    }

    return string;
};

function defineVal(value) {
    const object = new Object();
    const customEvent = new CustomEvent("_value");
    const nodeVal = document.createTextNode("");

    const listener = (callback) => {
        const listener = () => callback(object.value);

        listener();
        nodeVal.addEventListener("_value", listener);
        return () => nodeVal.removeEventListener("_value", listener);
    };

    const dispatch = () => {
        nodeVal.dispatchEvent(customEvent);
    };

    Object.defineProperty(object, "_value", {
        value: value,
        writable: true,
        enumerable: false,
        configurable: false,
    });

    Object.defineProperty(object, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
                dispatch();
            }
        },
    });
    Object.defineProperty(object, "observe", {
        value: listener,
        writable: false,
        enumerable: false,
        configurable: false,
    });

    Object.seal(object);

    return object;
}

function invertSign( num ) {
    if( typeof num == 'string' || typeof num == 'number' ) {
        num = parseInt(num)
        if( num > 0 || num < 0 ) return -num
    }

    return 0
}