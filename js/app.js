'use strict';

var Gender = [
    { id : 1, name : 'Masculino' },
    { id : 2, name : 'Femenino' },
];

var Position = [
    { id : 1, name : 'Administrador' },
    { id : 2, name : 'Colaborador' },
    { id : 3, name : 'Usuario' },
];

var eleSelection = ( parameters = {} )=>{

    // const params        = window.dataLib.params
    // const user          = window.dataApp.user

    const link      = window.dataApp.link;
    const def       = window.dataApp.def;

    const $element = createNodeElement(`
        <div class="div_f75GQd12BanP2X6 children-hover">
            <div id="closeElement" class="div_BF5zc8o39hDq6yV"></div>
            <div class="div_0obl68EV183c7gK">
                <div class="div_N1hNsm5myMuYi82">
                    <div class="div_pCjM7W480vX872y">
                        <button id="btnCleanSearch"><i class="fi fi-rr-search"></i></button>
                        <input id="inputSearch" type="search" placeholder="buscar">
                    </div>
                    <div class="scroll-y" style="display:flex; min-height: 300px; flex: 1; border-radius: 15px;">
                        <div id="itemNull" class="element-loader" style="--pixel:40px"></div>
                        <div id="itemFalse" class="div_b14S3dH">
                            <i class="fi fi-rr-search-alt"></i>
                            <h3>No hay resultados</h3>
                        </div>
                        <div id="itemTrue" class="div_AUndD0G2PK0SMxU scroll-y"></div>
                    </div>
                </div>
            </div>
        </div>
    `);

    const objectElement         = createObjectElement( $element.querySelectorAll('[id]'), 'id', true );
    const renderObjectElement   = new RenderObjectElement( objectElement );

    const { itemTrue, closeElement, btnCleanSearch, inputSearch } = objectElement;

    const observer = new IntersectionObserver(( entries, observer ) => {

        entries.forEach(entry => {
            if( entry.isIntersecting ) {
                observer.unobserve( entry.target );
                dataLoad();
            }
        });

    }, { root: null, rootMargin: '0px', threshold: 0.5,  });

    closeElement.addEventListener('click', ()=> $element.remove());

    btnCleanSearch.addEventListener('click', ()=> {
        $element.remove();
    });

    inputSearch.addEventListener('input', () => {
        itemTrue.innerHTML = '';
        dataRender(0);
        dataLoad();
    });

    itemTrue.setAttribute('data-value', parameters.focus);
    itemTrue.addEventListener('click', e => {
        const button = e.target.closest('button');
        if( button ) {

            itemTrue.setAttribute('data-value', button.getAttribute('data-value'));
            itemTrue.querySelectorAll('.focus').forEach( element => element.classList.remove('focus') );
            button.classList.add('focus');

            $element.dispatchEvent(
                new CustomEvent('_change', {
                    detail : { 
                        data : JSON.parse( button.getAttribute('data-data') ),
                        value: button.getAttribute('data-value')
                    }
                })
            );

            $element.remove();
        }
    });
    
    const dataIsTrue =(Data = [])=>{
        
        itemTrue.insertAdjacentHTML('beforeend', Data.map( data => {
            return `
                <button 
                    class="button_DVDM01LTdjL1bZi ${ data.id == itemTrue.getAttribute('data-value') ? 'focus' : '' }" 
                    data-id="${ data.id }" data-value="${ encodeText(data.name).input() }" 
                    data-data="${ encodeText(JSON.stringify( data )).input() }">

                    <span class="text-ellipsis">${ encodeText(data.name).textarea() }</span>
                    <i class="fi fi-rr-check-circle"></i>
                </button>
            `
        }).join(''));

        if( Data.length > 49 ) {
            observer.observe( itemTrue.children[ itemTrue.children.length - 1 ] );
        }

    };

    const dataRender =( Data = [] )=>{

        const render = {
            itemNull    : Data === 0,
            itemFalse   : Array.isArray(Data) && !Data.length && !itemTrue.children.length ,
            itemTrue    : (Array.isArray(Data) && Data.length) || (!Data.length && itemTrue.children.length)
        };

        if( render.itemNull ) ;
        else if( render.itemFalse ) ;
        else if( render.itemTrue ) dataIsTrue( Data );

        renderObjectElement.set( render );
    };

    const dataLoad =()=>{


        if( parameters.from == 'categoria' ) {

            const queries = {
                // token : user.token,
                query : 1,
                query_limit : [ itemTrue.children.length, 50 ].join(','),
                col_1 : 10000,
                query_like : inputSearch.value.trim()
            };

            fetch( link.api(`/categoria?${ def.paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender );
        }

        else if( parameters.from == 'marca' ) {

            const queries = {
                // token : user.token,
                query : 1,
                query_limit : [ itemTrue.children.length, 50 ].join(','),
                col_1 : 10000,
                query_like : inputSearch.value.trim()
            };

            fetch( link.api(`/marca?${ def.paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender );
        }

        else if( parameters.from == 'seccion' ) {

            const queries = {
                // token : user.token,
                query : 1,
                query_limit : [ itemTrue.children.length, 50 ].join(','),
                col_1 : 10000,
                query_like : inputSearch.value.trim()
            };

            fetch( link.api(`/seccion?${ def.paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender );
        }

        else if( parameters.from == 'departamento' ) {

            const queries = {
                // token : user.token,
                query : 1,
                query_limit : [ itemTrue.children.length, 50 ].join(','),
                col_1 : 10000,
                query_like : inputSearch.value.trim()
            };

            fetch( link.api(`/departamento?${ def.paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender );
        }

        else if( parameters.from == 'gender' ) {
            dataRender( Gender.filter( gender => (gender.name).toLowerCase().indexOf( inputSearch.value.toLowerCase().trim()) != -1 ) );
        }

        else if( parameters.from == 'position' ) {
            dataRender( Position.filter( position => (position.name).toLowerCase().indexOf( inputSearch.value.toLowerCase().trim()) != -1 ) );
        }

    };

    dataRender(0);
    dataLoad();

    $element.prepend(createNodeElement(`
        <style>
            .div_f75GQd12BanP2X6 {
                background: rgb(0 0 0 / 0.1);
                backdrop-filter: blur(2.5px);
            
                position: fixed;
                inset: 0;
            
                display: flex;
                padding: 10px;
            }
            
            .div_BF5zc8o39hDq6yV {
                position: inherit;
                inset: inherit;
            }
            
            .div_0obl68EV183c7gK {
                position: relative;
                background: var(--color-background);
                margin: auto;
            
                width: min(100%, 450px);
                max-height: min(100%, 750px);
            
                padding: 10px;
            
                border-radius: 15px;
            
                display: flex;
                overflow: hidden;
            }
            
            .div_N1hNsm5myMuYi82 {
                display: flex;
                flex-direction: column;
                gap: 10px;
            
                flex: 1;
            }
            
            .div_pCjM7W480vX872y {
                display: grid;
                grid-template-columns: 60px 1fr;
                height: 60px;
            
                background: var(--color-item);
                color: var(--color-letter);
            
                border-radius: 15px;
                overflow: hidden;
            
                & input {
                background: none;
                outline: none;
                border: none;
            
                color: inherit;
            
                padding-right: 20px;
                }
            
                & button {
                background: none;
                color: var(--color-letter);
            
                width: 40px;
                height: 40px;
            
                margin: auto;
                border-radius: 15px;
                }
            }
            
            .div_AUndD0G2PK0SMxU {
                margin:auto;
                margin-top:initial;
                background: var(--color-item);
                display: grid;
            
                border-radius: 15px;
            
                width: 100%;
            }
            
            .button_DVDM01LTdjL1bZi {
                background: none;
                color: var(--color-letter);
            
                width: 100%;
                height: 60px;
            
                display: grid;
                grid-template-columns: 1fr 60px;
                align-items: center;
            
                padding-left: 20px;
            
                &.focus {
                opacity: 0.7;
            
                & i {
                    opacity: 1;
                }
                }
            
                & span {
                text-align: left;
                }
            
                & i {
                opacity: 0;
                }
            }
        </style>
    `));

    return $element
};

var filterProducto = ()=>{
    const $element = createNodeElement(`
        <div class="div_zKKi095">
            <div id="closeElement" class="div_N21q19I"></div>
            <form id="form" class="div_5a1Hnp2">
                <header class="header_fSv7i19">
                    <h3>Filtrar</h3>
                    <button id="btnCloseElement" type="button"><i class="fi fi-rr-cross"></i></button>
                </header>
                <div class="div_vBNJ8OL">
                    <div class="div_qPAIzJj">
                        <h4>Categoria</h4>
                        <div class="div_n3t50x6">
                            <label>
                                <input type="radio" name="categoria" value="" checked>
                                <span>Todos</span>
                            </label>
                            <label>
                                <input id="inputCategoria" type="radio" name="categoria" value="">
                                <span id="textCategoria">Elegir</span>
                            </label>
                        </div>
                    </div>
                    <div class="div_qPAIzJj">
                        <h4>Marca</h4>
                        <div class="div_n3t50x6">
                            <label>
                                <input type="radio" name="marca" value="" checked>
                                <span>Todos</span>
                            </label>
                            <label>
                                <input id="inputMarca" type="radio" name="marca" value="">
                                <span id="textMarca">Elegir</span>
                            </label>
                        </div>
                    </div>
                    <div class="div_qPAIzJj">
                        <h4>Seccion</h4>
                        <div class="div_n3t50x6">
                            <label>
                                <input type="radio" name="seccion" value="" checked>
                                <span>Todos</span>
                            </label>
                            <label>
                                <input id="inputSeccion" type="radio" name="seccion" value="">
                                <span id="textSeccion">Elegir</span>
                            </label>
                        </div>
                    </div>
                    <div class="div_qPAIzJj">
                        <h4>Departamento</h4>
                        <div class="div_n3t50x6">
                            <label>
                                <input type="radio" name="departamento" value="" checked>
                                <span>Todos</span>
                            </label>
                            <label>
                                <input id="inputDepartamento" type="radio" name="departamento" value="">
                                <span id="textDepartamento">Elegir</span>
                            </label>
                        </div>
                    </div>
                </div>
                <footer class="footer_5Fl2Cb4">
                    <button type="submit" class="focus"><span>Aceptar</span><i class="fi fi-rr-check"></i></button>
                </footer>
            </form>
        </div>
    `);

    const $elements         = createObjectElement( $element.querySelectorAll('[id]'), 'id', true );
    //const render$elements   = new RenderObjectElement( $elements )

    const elementCategoria      = eleSelection({ from : 'categoria' });
    const elementMarca          = eleSelection({ from : 'marca' });
    const elementSeccion        = eleSelection({ from : 'seccion' });
    const elementDepartamento   = eleSelection({ from : 'departamento' });

    elementCategoria.addEventListener('_change', e => {
        const data = e.detail.data;
        $elements.textCategoria.textContent = data.name;
        $elements.inputCategoria.value = data.id;
    });

    elementMarca.addEventListener('_change', e => {
        const data = e.detail.data;
        $elements.textMarca.textContent = data.name;
        $elements.inputMarca.value = data.id;
    });

    elementSeccion.addEventListener('_change', e => {
        const data  = e.detail.data;
        $elements.textSeccion.textContent = data.name;
        $elements.inputSeccion.value = data.id;
    });

    elementDepartamento.addEventListener('_change', e => {
        const data  = e.detail.data;
        $elements.textDepartamento.textContent = data.name;
        $elements.inputDepartamento.value = data.id;
    });

    $elements.inputCategoria.addEventListener('click', ()=> {
        $element.append( elementCategoria );
    });

    $elements.inputMarca.addEventListener('click', ()=> {
        $element.append( elementMarca );
    });

    $elements.inputSeccion.addEventListener('click', ()=> {
        $element.append( elementSeccion );
    });

    $elements.inputDepartamento.addEventListener('click', ()=> {
        $element.append( elementDepartamento );
    });

    $elements.form.addEventListener('submit', e => {
        e.preventDefault();

        $element.dispatchEvent(
            new CustomEvent('_submit', {
                detail : {
                    filter : {
                        col_2 : $elements.form.querySelector('input[name = categoria]:checked').value,
                        col_3 : $elements.form.querySelector('input[name = marca]:checked').value,
                        col_4 : $elements.form.querySelector('input[name = seccion]:checked').value,
                        col_5 : $elements.form.querySelector('input[name = departamento]:checked').value,
                    }
                }
            })
        );

        $element.remove();
    });

    $elements.closeElement.addEventListener('click', ()=> $element.remove());
    $elements.btnCloseElement.addEventListener('click', ()=> $element.remove());
    
    return $element
};

var producto = ()=>{

    const icon  = window.dataApp.icon;
    const link  = window.dataApp.link;
    const def   = window.dataApp.def;

    const $element = createNodeElement(`
        <div class="div_Xu02Xjh children-hover">
            <header class="header_K0hs3I0">

                <div class="div_uNg74XS">
                    <button id="theme" class="button_lvV6qZu">${ icon.get('fi fi-rr-moon') }</button>
                </div>

                <div class="div_x0cH0Hq">
                    <button id="searchOpen" class="button_lvV6qZu">${ icon.get('fi fi-rr-search') }</button>
                    <button id="filter" class="button_lvV6qZu">${ icon.get('fi fi-rr-filter') }</button>
                </div>

                <div id="searchElement" class="div_2Knxv43" style="display:none">
                    <button id="searchClose" class="button_lvV6qZu">${ icon.get('fi fi-rr-angle-small-left') }</button>
                    <input id="searchInput" type="search" placeholder="buscar">
                </div>

            </header>
            <div class="div_guZ6yID" style="padding:10px">

                <div id="itemNull" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="itemFalse" class="div_b14S3dH">
                    <i class="fi fi-rr-search-alt"></i>
                    <h3>Lista vacia</h3>
                </div>
                <div id="itemTrue" class="div_pPbxc9j">
                    <div id="itemTrueLoad" class="div_Qm4cPUn">
                        <div class="element-loader" style="--color:var(--color-letter)"></div>
                    </div>
                </div>

            </div>
        </div>
    `);

    const $elements         = createObjectElement( $element.querySelectorAll('[id]'), 'id', true );
    const render$elements   = new RenderObjectElement( $elements );

    const elements = {
        filter : filterProducto()
    };

    const observer = new IntersectionObserver(( entries, observer ) => {

        entries.forEach(entry => {
            if( entry.isIntersecting ) {
                observer.unobserve( entry.target );
                $elements.itemTrue.append( dataLoad() );
            }
        });

    }, { root: null, rootMargin: '0px', threshold: 0 });

    let filter = {};

    const Data = defineVal(0);
    Data.observe(()=> {

        const render = {
            itemNull    : Data.value === 0,
            itemFalse   : Array.isArray(Data.value) && !Data.value.length,
            itemTrue    : Array.isArray(Data.value) && !!Data.value.length,
            itemTrueLoad: false
        };

        render$elements.set( render );

        if( render.itemTrue ) {
            
            $elements.itemTrue.insertAdjacentHTML('beforeend', Data.value.map( data => {

                console.log(data);

                return `
                    <a href="#/producto/${ data.id }" class="a_AtXWaYn">
                        <div class="div_6JXzBm">
                            <img src="${ link.storage(`/metro/producto/${ data.image }`) }" alt="${ data.sap }">
                        </div>
                        <div class="div_Qf7NjXG">
                            <span>${ data.description }</span>
                        </div>
                    </a>
                `
            }).join(''));

            if( Data.value.length > 49 ) {
                $elements.itemTrue.append( $elements.itemTrueLoad );
                observer.observe( $elements.itemTrue.lastElementChild );
            }

        }
    });

    const dataLoad =()=>{

        const element = document.createTextNode("");

        const queries = {
            query       : 3,
            query_limit : [ $elements.itemTrue.children.length, 50 ].join(','),
            col_1       : 10000,
            ...filter,
            query_like  : $elements.searchInput.value.trim()
        };

        fetch( link.api(`/producto?${ def.paramQueries( queries ) }`) )
            .then( res => res.json())
            .then( data => {
                if( element.parentElement ) {
                    Data.value = data;
                    console.log(data);
                }
            });

        return element
    };

    $elements.theme.addEventListener('click', ()=> {

        localStorage.setItem('theme', localStorage.getItem('theme') != 'light' ? 'light' : 'dark' );
        dispatchEvent( new CustomEvent('_theme') );
        
    });

    $elements.filter.addEventListener('click', ()=> {
        $element.append( elements.filter );
    });

    $elements.searchOpen.addEventListener('click', ()=> {
        $elements.searchElement.setAttribute('style', '');
        $elements.searchInput.focus();
    });

    $elements.searchClose.addEventListener('click', ()=> {
        $elements.searchElement.setAttribute('style', 'display:none');
    });

    $elements.searchInput.addEventListener('input', ()=> {
        Data.value = 0;
        $elements.itemTrue.innerHTML = '';
        $elements.itemTrue.append( dataLoad() );

    });

    elements.filter.addEventListener('_submit', e => {
        filter = e.detail.filter;

        Data.value = 0;
        $elements.itemTrue.innerHTML = '';
        $elements.itemTrue.append( dataLoad() );
    });

    $elements.itemTrue.append( dataLoad() );
    return $element
};

var productoId = ()=>{


    const params    = window.dataLib.params;
    const icon      = window.dataApp.icon;
    const link      = window.dataApp.link;
    const def       = window.dataApp.def;
 
    const $element = createNodeElement(`
        <div class="div_Xu02Xjh children-hover">
            <header class="header_K0hs3I0">

                <div class="div_uNg74XS">
                    <a href="#/producto" class="button_lvV6qZu">${ icon.get('fi fi-rr-angle-small-left') }</a>
                    <h3 id="textTitle"></h3>
                </div>

            </header>
            <div id="item" class="div_guZ6yID" style="padding:10px">
                <div id="itemNull" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="itemFalse" class="div_b14S3dH">
                    <i class="fi fi-rr-exclamation"></i>
                    <h3>El Producto no existe</h3>
                </div>
                <div id="itemTrue" class="div_be7jj4e">
                    <div id="containerImage" class="div_4Q78J05">
                        <div class="div_OeLSr4w">
                            <img data-render-img="image" class="img_9U2iiC0 producto" src="">
                        </div>
                    </div>
                    <div class="div_XE6XvnP">
                        <h3>Informacion</h3>
                        <div class="div_uRiOF5v">
                            <div class="div_2BgrORg">
                                <span>sap</span>
                                <p data-render-text="sap">-</p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>ean</span>
                                <p data-render-text="ean">-</p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>descripcion</span>
                                <p data-render-text="description">-</p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>precio</span>
                                <p data-render-text="price"></p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>categoria</span>
                                <p data-render-text="data_categoria"></p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>marca</span>
                                <p data-render-text="data_marca"></p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>seccion</span>
                                <p data-render-text="data_seccion"></p>
                            </div>
                            <div class="div_2BgrORg">
                                <span>departamento</span>
                                <p data-render-text="data_departamento"></p>
                            </div>
                            <div class="div_mPfrWhy">
                                <img src="" alt="bar" data-render-img="ean">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    const $elements         = createObjectElement( $element.querySelectorAll('[id]'), 'id', true );
    const render$elements   = new RenderObjectElement( $elements );

    const data = defineVal(0);
    data.observe(()=> {
        console.log(data.value);
    });

    const dataIsTrue =( data = {} )=>{
        
        data.data_inventario    = JSON.parse( data.data_inventario );
        data.data_categoria     = JSON.parse( data.data_categoria );
        data.data_marca         = JSON.parse( data.data_marca );
        data.data_seccion       = JSON.parse( data.data_seccion );
        data.data_departamento  = JSON.parse( data.data_departamento );
        
        $elements.textTitle.textContent   = data.sap;

        $elements.itemTrue.querySelectorAll('[ data-render-text ]').forEach( element => {
            const name = element.getAttribute('data-render-text');

            if(['datetime_start', 'datetime_end'].includes( name )) {
                const date = new Date( data[ name ] );
                element.textContent = date.toLocaleDateString();
            }

            else if(['data_inventario', 'data_categoria', 'data_marca', 'data_seccion', 'data_departamento'].includes( name )) {
                element.textContent = data[ name ].name ?? '-';
            }

            else {
                element.textContent = data[ name ] ?? '-';
            }

        });

        $elements.itemTrue.querySelectorAll('[ data-render-img ]').forEach( element => {
            const name  = element.getAttribute('data-render-img');
            
            
            if( name == 'image' ) {
                element.src = link.storage(`/metro/producto/${ data[ name ] || 'image.webp' }`);
                $elements.containerImage.setAttribute('style', data[ name ] == '' ? 'display:none' : '');
            }

            else if( name == 'ean' ) {

                JsBarcode(element, data[ name ], {
                    format: "CODE128",
                    width: 2,
                    height: 100,
                });
                
            }

            
        });
        
    };

    const dataRender =( data = null )=>{
        const render = {
            itemNull    : data === 0,
            itemFalse   : data === null,
            itemTrue    : Object.keys(data ?? {}).length
        };
        
        if( render.itemNull ) ;
        else if( render.itemFalse ) ;
        else if( render.itemTrue  ) dataIsTrue( data );

        render$elements.set( render );
    };

    const dataLoad =()=>{

        const queries = {
            query : 2,
            query_limit : 'one',
            col_0 : params.id,
        };

        fetch(link.api(`/producto?${ def.paramQueries( queries ) }`))
            .then( res => res.json() )
            .then( dataRender );

    };


    dataRender(0);
    dataLoad();
     
    return $element
};


/*
[
    "SELECT {$TABLE[0]['id']}.*, {$TABLE_DATA_JSON[$TABLE[1]['id']]}, {$TABLE_DATA_JSON[$TABLE[2]['id']]}, {$TABLE_DATA_JSON[$TABLE[3]['id']]}, {$TABLE_DATA_JSON[$TABLE[4]['id']]}, {$TABLE_DATA_JSON[$TABLE[5]['id']]} FROM {$TABLE_AS[0]} {$TABLE_LEFT_JOIN[1]} {$TABLE_LEFT_JOIN[2]} {$TABLE_LEFT_JOIN[3]} {$TABLE_LEFT_JOIN[4]} {$TABLE_LEFT_JOIN[5]} AND {$TABLE[2]['id']}.status = 1",
    []
]
*/

var routes = ()=>{
    
    const $element  = createNodeElement(`<div class="content-page"></div>`);
    const Route     = new RenderRouteHash();

    Route.param('/', producto);
    Route.param('/producto', producto);
    Route.param('/producto/:id', productoId);

    addEventListener('hashchange', () => {
        $element.innerHTML = '';
        $element.append( Route.render() );
    });

    dispatchEvent(new CustomEvent('hashchange'));

    return $element

};

var Font = [
  {
    name: "predeterminado",
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
    link: "",
  },
  {
    name: "Montserrat",
    font: "'Montserrat', sans-serif",
    link: "https://fonts.googleapis.com/css2?family=Montserrat&display=swap",
  },
  {
    name: "Roboto",
    font: "'Roboto', sans-serif",
    link: "https://fonts.googleapis.com/css2?family=Roboto:ital@1&display=swap",
  },
  {
    name: "Lato",
    font: "'Lato', sans-serif",
    link: "https://fonts.googleapis.com/css2?family=Lato&display=swap",
  },
  {
    name: "Open Sans",
    font: "'Open Sans', sans-serif",
    link: "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
  },
  {
    name: "Poppins",
    font: "'Poppins', sans-serif",
    link: "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
  },
  {
    name: "Playfair Display",
    font: "'Playfair Display', serif",
    link: "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap",
  },
  {
    name: "Raleway",
    font: "'Raleway', sans-serif",
    link: "https://fonts.googleapis.com/css2?family=Raleway&display=swap",
  },
];

var theme = ()=>{

    const metaThemeColor = document.getElementById('meta-theme-color');
    const styleApp = document.getElementById('style-app');

    addEventListener('_theme', ()=> {
        if( !localStorage.getItem('theme') )
            localStorage.setItem('theme', 'light');

        if( !localStorage.getItem('theme-chat') )
            localStorage.setItem('theme-chat', '#7C4DFF');
        
        if( !localStorage.getItem('font-family') )
            localStorage.setItem('font-family', Font[0].name);

        if( !localStorage.getItem('width-navigate') )
            localStorage.setItem('width-navigate', '80px');

        const font = Font.find( font => font.name == localStorage.getItem('font-family'));

        const themeLight = {
            'color-background-transparent'  : 'rgb(0 0 0 / 0.1)',
            'color-background'  : '#F7F7F7',
            'color-item'        : '#FFFFFF',
            'color-letter'      : '#1C1C1E',
            'filter-img'        : 'initial',
            'color-chat'        : localStorage.getItem('theme-chat'),
            'font-family'       : font.font,
            'width-navigate'    : localStorage.getItem('width-navigate')
        };
        
        const themeDark  = {
            'color-background-transparent'  : 'rgb(255 255 255 / 0.1)',
            'color-background'  : '#1C1C1E',   
            'color-item'        : '#2C2C2E',   
            'color-letter'      : '#F7F7F7',
            'filter-img'        :'invert(82%) sepia(99%) saturate(0%) hue-rotate(102deg) brightness(111%) contrast(100%)',
            'color-chat'        : localStorage.getItem('theme-chat'),
            'font-family'       : font.font,
            'width-navigate'    : localStorage.getItem('width-navigate')
        };

        const theme = localStorage.getItem('theme') == 'light' ? themeLight : themeDark;

        metaThemeColor.setAttribute('content', theme['color-background']);
        styleApp.innerHTML = `@import url("${ font.link }");\n:root {\n${ Object.keys(theme).map( key => `--${ key } : ${ theme[key] };\n` ).join('') }}`;
    });

    dispatchEvent( new CustomEvent('_theme') );

    return ''
};

window.dataApp = {
    link     : {
        api         : ( path = '' ) => 'https://api-metro.victor01sp.com/api' + path,
        storage     : ( path = '' ) => 'https://api-storage.victor01sp.com/storage' + path
    },
    user    : {},
    icon    : new IconSVG(),
    def     : {
        paramQueries : ( query = {} ) => Object.keys( query ).map( key => `${ key }=${ query[key] }`).join('&')
    }
};

theme();

addEventListener('contextmenu', e => {
    e.preventDefault();
});

addEventListener('DOMContentLoaded', ()=> {

    document.getElementById('app').append( routes() );

});
