let userToken;
const clientId = 'cf411c3a8a534946a579f1497e786401';
const clientSecret = 'acf2d5debbd04a61914ab089877b7835';
let numero = 15852;
let artista;
let album;
let cancion;
let bandera = "";
let modal = false;
let tema = "oscuro";

let Buscar_cancion="Help!";
let Buscar_artista="The beatles";
let Buscar_album="Rubber Soul";

//clases
class Artista{
    constructor(artista){
        this.Nombre = artista.name;
        this.Imagen = artista.images[0].url;
        this.Id = artista.id;
        this.Generos = artista.genres;
        this.Albumes = new Array();
    };
    
}

class Album{
    constructor(album){
        this.Titulo = album.name;
        this.Portada = album.images[0].url;
        this.TotalCanciones = album.total_tracks;
        this.Id = album.id;
        this.Canciones = new Array();
        this.Artistas = new Array();
    }
}

class Cancion{
    constructor(cancion){
        this.Duracion = cancion.duration_ms ;
        this.EsExplicita = cancion.explicit ;
        this.Id = cancion.id ;
        this.Href = cancion.href ;
        this.Titulo = cancion.name ;
        this.NumeroOrden = cancion.track_number ;
        this.Url = cancion.uri ;
        this.Artistas = new Array();
        this.Letra = "";
    }
}

class ArtistaBasico{    
    constructor(artistaBasico){
        this.Id = artistaBasico.id ;
        this.Nombre = artistaBasico.name; 
        this.Href = artistaBasico.href;  
        this.Uri = artistaBasico.uri;         
    }
}
   

//_GET DE LA API DE SPOTIFY
const _getToken_Spotify = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

const _getArtist_Spotify = async (token, name, type) => {

    const result = await fetch(`https://api.spotify.com/v1/search?q=${name}&type=${type}`,
    {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    //Regresa un objeto Objeto en json, que no es el artista, sino que para acceder a él se requiere hacer
    //[objeto.json].artists
    //puedes leer el objeto con:
    //console.log('JSON.stringfy(data, null, 4):   ' +JSON.stringify(data, null, 4));
    //donde data es el nombre que yo le puse al objeto
    //este objeto tampoco lo puedes leer directamente, pues incluye 3 arrays, para leer las propiedades haz
    //console.log('data.artist.items:   ' +JSON.stringify(data.artists.items[0], null, 4) );
    //por ejemplo, el link del artista se obtiene con:
    //data.artists.items[0].external_urls.spotify
    
    //console.log('data.artist.items:   ' +JSON.stringify(data, null, 4) );
    //console.log('data.artist.items:   ' +JSON.stringify(data.artists, null, 4) );
    //console.log('data.artist.items:   ' +JSON.stringify(data.artists.items[0], null, 4) );

    

    return data.artists.items[0];
}

const _getAlbum_Spotify = async (token, name) => {

    const result = await fetch(`https://api.spotify.com/v1/search?q=${name}&type=album&limit=3`,
    {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    //Regresa un objeto Objeto en json, que no es el artista, sino que para acceder a él se requiere hacer
    //[objeto.json].artists
    //puedes leer el objeto con:
    //console.log('JSON.stringfy(data, null, 4):   ' +JSON.stringify(data, null, 4));
    //donde data es el nombre que yo le puse al objeto
    //este objeto tampoco lo puedes leer directamente, pues incluye 3 arrays, para leer las propiedades haz
    //console.log('data.artist.items:   ' +JSON.stringify(data.artists.items[0], null, 4) );
    //por ejemplo, el link del artista se obtiene con:
    //data.artists.items[0].external_urls.spotify
    
    //console.log('data.artist.items:   ' +JSON.stringify(data.artists, null, 4) );
    //console.log('data.artist.items:   ' +JSON.stringify(data.artists.items[0], null, 4) );

    
    //console.log('data.artist.items:   ' +JSON.stringify(data, null, 4) );

    //console.log('data.artist.items:   ' +JSON.stringify(data, null, 4) );
    //console.log('data.artist.items:   ' +JSON.stringify(data.albums, null, 4) );
    //console.log('data.artist.items:   ' +JSON.stringify(data.albums.items, null, 4) );


    return data.albums.items[0];
}

const _getAlbumByName_Spotify = async (token, titulo, artista) => {
    const result = await fetch(`https://api.spotify.com/v1/search?q=album:${titulo}%20${artista}&type=album&limit=3`,
    {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });
    const data = await result.json();    
    //console.log(data.albums.items[0]);
    return data.albums.items[0];
}

const _getAlbumByArtist_Spotify = async (token, name) => {
    const result = await fetch(`https://api.spotify.com/v1/search?q=${name}&type=album&include_groups=album`,
    {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });
    const data = await result.json();

    //console.log(data);
    //console.log(data.albums);
    //console.log(data.albums.items);

    return data.albums.items;
}

const _getAlbumSongs_Spotify = async (token, id) => {
    const result = await fetch(`https://api.spotify.com/v1/albums/${id}/tracks?limit=50`,
    {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });
    const data = await result.json();
    //console.log(data);
    //console.log(data.items);
    return data.items;
}


const _getSong_Spotify = async (token, nombre, nombreCancion) => {
    const result = await fetch(`https://api.spotify.com/v1/search?q=track:${nombreCancion}%20artist:${nombre}&type=track`,
    {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });
    const data = await result.json();
    //console.log(data);
    return data.tracks.items[0];
}

// _GET DE LA API DE WIKIPEDIA
const _getArticuloCompleto_Wikipedia = async (name, id) => {

    const result = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${name}&prop=extracts|pageimages|info&pithumbsize=400&inprop=url&redirects=&format=json&origin=*`,
    {
        method: 'GET'
    });

    //format=json&origin=* Es lo que permite que el fetch sea CORS en lugar de JSONP como originalmente.
    //puede haber varios parámetros para format =[], pero al final siempre agrega el &origin=*

    const data = await result.json();
    //console.log('data.query.pages:   ' +JSON.stringify(data.query.pages[id], null, 4) );
    //pageid
    //ns
    //title
    //extract
    //thumbnail{source: ,widht: , height: }
    //contentmodel
    //pagelanguage
    //touched
    //lastrevid
    //fullurl
    //editurl
    //canonicalurl
    //length

    return data.query.pages[id];
}

const _getMiniaturas_Wikipedia = async (name, cantidad) => {
    const result = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&srlimit=${cantidad}&srsearch=${name}&origin=*`,
    {
        method: 'GET'
    });
    const data = await result.json();
    // regresa id
    //console.log('data:   ' +JSON.stringify(data.query.search[0], null, 4) );
    //title
    //pageid
    //size
    //snippet
    //timestamp
    return data.query;
}

// _GET DE LA API DE LYRICS
const _getLetraCancion = async (tituloCancion, autorCancion) => {
    let lyricsKey = "639d67RGFk5UrmTRJA2ehIymVFmW0Wl7KwJZnZikmEnK8keRALXLzg5R";
    const result = await fetch (`https://api.happi.dev/v1/music?q=${tituloCancion},%20${autorCancion}&limit=&apikey=${lyricsKey}`,
    {
        method: 'GET'
    });
    const data = await result.json();
    //console.log('data:   ' +JSON.stringify(data, null, 4) );
    return data.result[0];
}

const _getLyrics = async (info) => {
    let lyricsKey = "639d67RGFk5UrmTRJA2ehIymVFmW0Wl7KwJZnZikmEnK8keRALXLzg5R";
    let id_album = info.id_album;
    let id_track = info.id_track;
    let id_artista = info.id_artist;

    const result = await fetch (`https://api.happi.dev/v1/music/artists/${id_artista}/albums/${id_album}/tracks/${id_track}/lyrics?apikey=${lyricsKey}`,
    {
        method: 'GET'
    });
    const data = await result.json();
    //console.log('data:   ' +JSON.stringify(data, null, 4) );
    //console.log('data:   ' +JSON.stringify(data.result.lyrics, null, 4) );
    return data.result.lyrics;
}












//MÉTODO ARTISTA
$("#menu_link_Artista").click(async function(){
    if(bandera != "artista"){
        $('#menu_link_Album').removeClass("BotonActivo");
        $('#menu_link_Cancion').removeClass("BotonActivo");
        $('#menu_link_Artista').addClass("BotonActivo");
        

        await $('#buscador').empty();
        await $("#resultado").empty();

        await $('#buscador').append(`<div class="barraBuscador" id="barraBuscador"></div>`);
        await $('#barraBuscador').append(`<span class="BarraBuscador_label" id="BarraBuscador_label"> Artista:</span>`);
        await $('#barraBuscador').append(`<input class="BarraBuscador_barra" type="text" value="${Buscar_artista}"/>`);
        await $('#barraBuscador').append(`<button class="BarraBuscador_boton" id="BarraBuscador_boton" >Enviar</button>`);
        bandera= "artista";
        
        $('#BarraBuscador_boton').click(function(){ MetodoBuscarArtista() });
    }    
});

function MetodoBuscarArtista(){
    let nombre =  $('.BarraBuscador_barra').val();
    if( nombre ==null ){
        console.log("por favor indique algún artista");
    }else{
        $("#resultado").empty();
        artista = "";
        cancion ="";
        album ="";
        BuscarArtista(nombre);
    }
}

async function BuscarArtista(nombre){
    await $('#resultado').append(`<p class="mensaje" id="mensaje"> Loading: </p>`);
    
    //Obtener token
    await ObtenerToken();

    //Obtener Artista-album-canción
    await ObtenerArtista(nombre);
    MostrarReproductorSpotify(artista.Id, "artist", artista.Nombre);

    //Obtener los albumes del artista
    await ObtenerAlbumPorArtista();
    MostrarAlbumesDeArtista();

    
    //traer artículo de wikipedia
    let articulosWikipedia_Miniatura = await _getMiniaturas_Wikipedia(nombre, 20);
    MostrarArtículoswikipediaArtista(articulosWikipedia_Miniatura.search);
}

function MostrarAlbumesDeArtista(){  
    $('#resultado').append(`<div class="Contenedor1" id="Contenedor1"> </div>`); 
    $('#Contenedor1').append(`<h5 class="Contenedor1_Mensaje" id="Contenedor1_Mensaje">Albumes del Artista</h5>`);
    
    $('#Contenedor1').append(`<div class="Contenedor1_Albumes" id="Contenedor1_Albumes"> </div>`); 
    let k = 0;
    for(let albumArtista of artista.Albumes){        
        $('#Contenedor1_Albumes').append(`<a data-albumartista="${albumArtista.Titulo}" data-artista="${artista.Nombre}" class="ContainerArtista_Albumes_AlbumesAlbum" id="ContainerArtista_Albumes_AlbumesAlbum${k}"></a>`);
        $(`#ContainerArtista_Albumes_AlbumesAlbum${k}`).append(`<img src="${albumArtista.Portada}" class="ContainerArtista_Albumes_AlbumesAlbum_Portada" id="ContainerArtista_Albumes_AlbumesAlbum_Portada${k}">`);
        $(`#ContainerArtista_Albumes_AlbumesAlbum${k}`).append(`<h5 class="ContainerArtista_Albumes_AlbumesAlbum_Titulo" id="ContainerArtista_Albumes_AlbumesAlbum_Titulo${k}"> ${albumArtista.Titulo} </h5>`);
        $(`#ContainerArtista_Albumes_AlbumesAlbum${k}`).append(`<h5 class="ContainerArtista_Albumes_AlbumesAlbum_TotalCanciones" id="ContainerArtista_Albumes_AlbumesAlbum_TotalCanciones${k}"> canciones:  ${albumArtista.TotalCanciones} </h5>`);
        
        $(`#ContainerArtista_Albumes_AlbumesAlbum${k}`).click(async function(){   TraerAlbumArtista(this.dataset.albumartista, this.dataset.artista); });

        k++;
    }
}


async function TraerAlbumArtista(albumEscogido, artistaEscogido){ 
    Buscar_album = await albumEscogido;
    Buscar_artista = await artistaEscogido;
    await MetodoAlbum();
    MetodoBuscarAlbum();
}





async function ObtenerArtista(nombre){
    artista = new Artista(await  _getArtist_Spotify(userToken, nombre, "artist"));
}

async function ObtenerAlbumPorArtista(){  
    let albumesArtista = await  _getAlbumByArtist_Spotify(userToken, artista.Nombre);
    let i=0;
    for(var albumArtista of albumesArtista){
        artista.Albumes.push( await new Album(albumArtista) );
        for(var artistaAlbum of albumArtista.artists ){
            artista.Albumes[i].Artistas.push(await new ArtistaBasico(artistaAlbum) );
        }
        i++;
    }
}

async function ObtenerCancionesPorAlbum(numeroAlbum){
    let cancionesAlbum = await  _getAlbumSongs_Spotify(userToken, artista.Albumes[numeroAlbum].Id); 
    let i = 0;   
    for(var cancion of cancionesAlbum){
        artista.Albumes[numeroAlbum].Canciones.push( await new Cancion(cancion) );
        for(var artistaCancion of cancion.artists ){
            artista.Albumes[numeroAlbum].Canciones[i].Artistas.push(await new ArtistaBasico(artistaCancion) );
        }
        i++;
    }
}







//MÉTODO ÁLBUM

$("#menu_link_Album").click(async function(){ MetodoAlbum(); });

async function MetodoAlbum(){
    if(bandera != "album" ){
        $('#menu_link_Album').addClass("BotonActivo");
        $('#menu_link_Artista').removeClass("BotonActivo");
        $('#menu_link_Cancion').removeClass("BotonActivo");



        await $('#buscador').empty();
        await $("#resultado").empty();

        //buscador Artista
        await $('#buscador').append(`<div class="barraBuscador_Album" id="barraBuscador_Album_Artista"></div>`);
        await $('#barraBuscador_Album_Artista').append(`<span class="BarraBuscador_Album_Label" id="BarraBuscador_Album_ArtistaLabel"> Artista:</span>`);
        await $('#barraBuscador_Album_Artista').append(`<input class="BarraBuscador_Album_Barra" type="text" id="BarraBuscador_Album_ArtistaBarra" value="${Buscar_artista}"/>`);
        
        //buscador Album
        await $('#buscador').append(`<div class="barraBuscador_Album" id="barraBuscador_Album_Album"></div>`);
        await $('#barraBuscador_Album_Album').append(`<span class="BarraBuscador_Album_Label" id="BarraBuscador_Album_AlbumLabel"> Album:</span>`);
        await $('#barraBuscador_Album_Album').append(`<input class="BarraBuscador_Album_Barra" type="text" id="BarraBuscador_Album_AlbumBarra" value="${Buscar_album}"/>`);

        //buscador Botón
        await $('#buscador').append(`<button class="BarraBuscador_Album_boton" id="BarraBuscador_Album_boton" >Enviar</button>`);
        bandera= "album";

        $('#BarraBuscador_Album_boton').click(function(){ MetodoBuscarAlbum(); });
    }

}

function MetodoBuscarAlbum(){
    let nombreBuscar = $('#BarraBuscador_Album_ArtistaBarra').val();
    let albumBuscar = $('#BarraBuscador_Album_AlbumBarra').val();
    if( nombreBuscar ==null || albumBuscar==null ){
        console.log("por favor indique algún artista y un albúm");
    }else{
        $("#resultado").empty();
        artista = "";
        cancion ="";
        album ="";
        BuscarAlbum(nombreBuscar, albumBuscar);
    }
}

async function BuscarAlbum(nombreBuscar, albumBuscar){
    await $('#resultado').append(`<p class="mensaje" id="mensaje"> Loading: </p>`);
    
    //Obtener token
    await ObtenerToken();

    //Obtener Album
    await ObtenerAlbumPorTituloYArtista(nombreBuscar, albumBuscar);
    MostrarReproductorSpotify(album.Id, "album", album.Titulo);

    //Obtener Canciones del album
    await ObtenerCancionesDeAlbumPorArtista();
    MostrarCancionesAlbum();
    
    //traer artículo de wikipedia
    let busqueda = albumBuscar + " "+nombreBuscar + " album";
    let articulosWikipedia_Miniatura = await _getMiniaturas_Wikipedia(busqueda, 20);
    MostrarArtículoswikipediaArtista(articulosWikipedia_Miniatura.search);
}

function MostrarCancionesAlbum(){      
    $('#resultado').append(`<div class="Contenedor1" id="Contenedor1"> </div>`); 

    $('#Contenedor1').append(`<h5 class="Contenedor1_Mensaje" id="Contenedor1_Mensaje">Canciones</h5>`);
    
    $('#Contenedor1').append(`<div class="Contenedor1_Canciones" id="Contenedor1_Canciones"> </div>`); 
    let k = 0;
    for(let cancionAlbum of album.Canciones){       
        $(`#Contenedor1_Canciones`).append(`<ul class="ContainerAlbum_Canciones_CancionesContenedorLista" id="ContainerAlbum_Canciones_CancionesContenedorLista${k}"></ul>`);
        $(`#ContainerAlbum_Canciones_CancionesContenedorLista${k}`).append(`<a data-autorcancion="${cancionAlbum.Artistas[0].Nombre}" data-nombre="${cancionAlbum.Titulo}" class="ContainerAlbum_Canciones_CancionesContenedorLista_Cancion" id="ContainerAlbum_Canciones_CancionesContenedorLista_Cancion${k}"></a>`);
        $(`#ContainerAlbum_Canciones_CancionesContenedorLista_Cancion${k}`).append(`<li class="ContainerAlbum_Canciones_CancionesContenedorLista_CancionTexto" i="ContainerAlbum_Canciones_CancionesContenedorLista_CancionTexto"> ${cancionAlbum.Titulo.slice(0, 40)}...  </li>`);
        $(`#ContainerAlbum_Canciones_CancionesContenedorLista_Cancion${k}`).append(`<li class="ContainerAlbum_Canciones_CancionesContenedorLista_CancionTextoDuracion" id="ContainerAlbum_Canciones_CancionesContenedorLista_CancionTextoDuracion"> ${cancionAlbum.Duracion.toString().slice(0,-5)}:${cancionAlbum.Duracion.toString().slice(-5, -3)} </li>`);
        
        $(  `#ContainerAlbum_Canciones_CancionesContenedorLista_Cancion${k}`  ).click(  async function(){ TraerCancionAlbum(this.dataset.autorcancion,  this.dataset.nombre);}  );
        k++;
    }

}


async function TraerCancionAlbum(autorcancion, cancionTitulo){  
    Buscar_cancion = await cancionTitulo;
    Buscar_artista = await autorcancion;
    await MetodoCancion();
    MetodoBuscarCancion();
}



async function ObtenerAlbumPorTituloYArtista(nombre, nombreAlbum){      
    albumCompleto = await  _getAlbumByName_Spotify(userToken, nombreAlbum, nombre);
    album = new Album(albumCompleto);
    for(var artista of albumCompleto.artists){
        album.Artistas.push(await new ArtistaBasico(artista));
    }
}

async function ObtenerCancionesDeAlbumPorArtista(){
    let cancionesAlbum = await  _getAlbumSongs_Spotify(userToken, album.Id); 
    i=0;
    for(var cancion of cancionesAlbum){
        album.Canciones.push( await new Cancion(cancion) );
        for(var artistaCancion of cancion.artists ){
            album.Canciones[i].Artistas.push(await new ArtistaBasico(artistaCancion) );
        }
        i++;
    }
}











//MÉTODO  CANCIÓN
$("#menu_link_Cancion").click(async function(){ MetodoCancion() });

async function MetodoCancion(){
    if(bandera != "cancion" ){        
        $('#menu_link_Cancion').addClass("BotonActivo");
        $('#menu_link_Artista').removeClass("BotonActivo");
        $('#menu_link_Album').removeClass("BotonActivo");


        await $('#buscador').empty();
        await $("#resultado").empty();

        //buscador Artista
        await $('#buscador').append(`<div class="barraBuscador_Album" id="barraBuscador_Album_Artista"></div>`);
        await $('#barraBuscador_Album_Artista').append(`<span class="BarraBuscador_Album_Label" id="BarraBuscador_Album_ArtistaLabel"> Artista:</span>`);
        await $('#barraBuscador_Album_Artista').append(`<input class="BarraBuscador_Album_Barra" type="text" id="BarraBuscador_Album_ArtistaBarra" value="${Buscar_artista}"/>`);
        
        //buscador Canción
        await $('#buscador').append(`<div class="barraBuscador_Album" id="barraBuscador_Album_Album"></div>`);
        await $('#barraBuscador_Album_Album').append(`<span class="BarraBuscador_Album_Label" id="BarraBuscador_Album_AlbumLabel"> Cancion:</span>`);
        await $('#barraBuscador_Album_Album').append(`<input class="BarraBuscador_Album_Barra" type="text" id="BarraBuscador_Album_AlbumBarra" value="${Buscar_cancion}"/>`);

        //buscador Botón
        await $('#buscador').append(`<button class="BarraBuscador_Album_boton" id="BarraBuscador_Album_boton" >Enviar</button>`);
        bandera= "cancion";

        $('#BarraBuscador_Album_boton').click(function(){ MetodoBuscarCancion() });
    }

}

function MetodoBuscarCancion(){
    console.log($('#BarraBuscador_Album_ArtistaBarra').val());
    let art = $('#BarraBuscador_Album_ArtistaBarra').val();
    let can = $('#BarraBuscador_Album_AlbumBarra').val();
    if( art ==null || can==null ){
        console.log("por favor indique algún artista y un albúm");
    }else{
        $("#resultado").empty();
        artista = "";
        cancion ="";
        album ="";
        BuscarCancion(art, can);
    }
}

async function BuscarCancion(nombreBuscar, cancionBuscar){
    await $('#resultado').append(`<p class="mensaje" id="mensaje"> Loading: </p>`);
    
    //Obtener token
    await ObtenerToken();

    //Obtener Album
    await ObtenerCancionPorTituloYArtista(nombreBuscar, cancionBuscar);
    MostrarReproductorSpotify(cancion.Id, "track", cancion.Titulo);

    //obtener letra de la canción
    cancion.Letra = await ObtenerLetraCancion(cancionBuscar, nombreBuscar);
    MostrarLetraCancion();
    
    //traer artículo de wikipedia
    let busqueda = cancionBuscar + " "+nombreBuscar;
    let articulosWikipedia_Miniatura = await _getMiniaturas_Wikipedia(busqueda, 20);
    MostrarArtículoswikipediaArtista(articulosWikipedia_Miniatura.search);
}

async function ObtenerLetraCancion(cancionBuscar, nombreBuscar){
    console.log(cancionBuscar);
    let objeto =await _getLetraCancion(cancionBuscar, nombreBuscar);
    if(objeto != null){
        let letra = await _getLyrics(objeto);
        return letra;
    }else{
        return "Letra no disponible";
    }
}

function MostrarLetraCancion(){
    $('#resultado').append(`<div class="Contenedor1" id="Contenedor1"> </div>`); 

    $('#Contenedor1').append(`<h5 class="Contenedor1_Mensaje" id="Contenedor1_Mensaje">¿Quieres seguir la letra?</h5>`);
    
    $('#Contenedor1').append(`<div class="Contenedor1_Letra" id="Contenedor1_Letra"> </div>`); 
    $('#Contenedor1_Letra').append(`<div class="ContainerCancion_LetraTitulo" id="ContainerCancion_LetraTitulo"> ${cancion.Titulo} </div>`); 
    $('#Contenedor1_Letra').append(`<pre class="ContainerCancion_LetraDescripcion" id="ContainerCancion_LetraDescripcion">  ${cancion.Letra} </pre>`); 

}

async function ObtenerCancionPorTituloYArtista(nombre, nombreCancion){
    cancionObtenida = await  _getSong_Spotify(userToken, nombre, nombreCancion);
    cancion = new Cancion (cancionObtenida);
    for (var artista of cancionObtenida.artists){
        cancion.Artistas.push(artista);
    }
}






















async function ObtenerToken(){
    userToken = await _getToken_Spotify();
}


function MostrarReproductorSpotify(id, tipo, titulo){   
    $('#mensaje').html(`Se han obtendo los siguientes resultados para la búsqueda: "${titulo}"`);
    $('#resultado').append(`<div class="ContainerReproductor" id="ContainerReproductor"> </div>`);
    
    
    $('#ContainerReproductor').append(`<h5 class="ContainerReproductor_Titulo" id="ContainerReproductor_Titulo"> Escuchalo en Spotify! </h5>`);
    $('#ContainerReproductor').append(`<iframe src="https://open.spotify.com/embed?uri=spotify:${tipo}:${id}" class="ContainerReproductor_Reproductor" id="ContainerReproductor_Reproductor" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`);
}



function MostrarArtículoswikipediaArtista(articulos){
    $('#resultado').append(`<div class="ContainerArtista_Wikipedia" id="ContainerArtista_Wikipedia"> </div>`);

    $('#ContainerArtista_Wikipedia').append(`<h5 class="ContainerArtista_Wikipedia_Mensaje" id="ContainerArtista_Wikipedia_Mensaje"> Artículos relacionados: </h5>`);
    $('#ContainerArtista_Wikipedia').append(`<div class="ContainerArtista_Wikipedia_Articulos" id="ContainerArtista_Wikipedia_Articulos"> </div>`);

    var k=0;
    for(var articulo of articulos){     
        $(`#ContainerArtista_Wikipedia_Articulos`).append(`<a class="ContainerArtista_Wikipedia_Articulos_Articulo" id="ContainerArtista_Wikipedia_Articulos_Articulo${k}" data-identificador="${articulo.pageid}" data-titulo = "${articulo.title}"> </a>`);
        
        $(`#ContainerArtista_Wikipedia_Articulos_Articulo${k}`).append(`<div class="ContainerArtista_Wikipedia_Articulos_Articulo_Encabezado" id="ContainerArtista_Wikipedia_Articulos_Articulo_Encabezado${k}"> ${articulo.title} </div>`);
        $(`#ContainerArtista_Wikipedia_Articulos_Articulo${k}`).append(`<div class="ContainerArtista_Wikipedia_Articulos_Articulo_Cuerpo" id="ContainerArtista_Wikipedia_Articulos_Articulo_Cuerpo${k}"> ${articulo.snippet} </div>`);
        
        
        
        $(`#ContainerArtista_Wikipedia_Articulos_Articulo${k}`).click(async function(){   MostrarArticuloCompleto(this.dataset.identificador, this.dataset.titulo);  });
        k++;
    }


}

async function MostrarArticuloCompleto(identificador, nombre){
    let articuloWikipedia_Completo = await _getArticuloCompleto_Wikipedia(nombre, identificador);
    CrearModal_ArticuloWikipedia(articuloWikipedia_Completo);
    console.log(articuloWikipedia_Completo);
}

function CrearModal_ArticuloWikipedia(articulo){
    if(modal == false){
        modal = true;
        $("#menu").append(`<div class="modal" id="modal"> </div>`);
        $("#modal").append(`<div class="modal_ArticuloWikipedia_Container" id="modal_ArticuloWikipedia_Container"> </div>`);
    
        $("#modal_ArticuloWikipedia_Container").append(`<div class="modal_ArticuloWikipedia_ArticuloEncabezado" id="modal_ArticuloWikipedia_ArticuloEncabezado"></div>`);
        $("#modal_ArticuloWikipedia_Container").append(`<div class="modal_ArticuloWikipedia_ArticuloCuerpo" id="modal_ArticuloWikipedia_ArticuloCuerpo"> <a class="modal_ArticuloWikipedia_ArticuloCuerpo_link" href="${articulo.fullurl}">${articulo.fullurl}</a> <br> ${articulo.extract} </div>`);
    
        
        $("#modal_ArticuloWikipedia_ArticuloEncabezado").append(`<h1 class="modal_ArticuloWikipedia_ArticuloEncabezado_Texto" id="modal_ArticuloWikipedia_ArticuloEncabezado_Texto"> Articulo completo: </div>`);
        $("#modal_ArticuloWikipedia_ArticuloEncabezado").append(`<button class="modal_ArticuloWikipedia_ArticuloEncabezado_Boton" id="modal_ArticuloWikipedia_ArticuloEncabezado_Boton"> X </button>`);
    
        $("#modal_ArticuloWikipedia_ArticuloEncabezado_Boton").click(function(){$("#modal").remove(); modal=false;});
    }
}


$('.tema').click(  function(){ cambiarTema()} );

function cambiarTema(){
    if(tema == "oscuro"){        
        $("#menu").removeClass('container_FondoOscuro');
        $("#resultado").removeClass('resultado_fondoOscuro');
        $("#piePagina").removeClass('piePagina_fondoOscuro');
        $("#barra").removeClass('barra_FondoOscuro');

        $("#menu").addClass('container_FondoClaro');
        $("#resultado").addClass('resultado_fondoClaro');
        $("#piePagina").addClass('piePagina_fondoClaro');
        $("#barra").addClass('barra_FondoClaro');
        
        tema = "claro"


    }else{
        $("#menu").removeClass('container_FondoClaro');
        $("#resultado").removeClass('resultado_fondoClaro');
        $("#piePagina").removeClass('piePagina_fondoClaro');
        $("#barra").removeClass('barra_FondoClaro');

        $("#menu").addClass('container_FondoOscuro');
        $("#resultado").addClass('resultado_fondoOscuro');
        $("#piePagina").addClass('piePagina_fondoOscuro');
        $("#barra").addClass('barra_FondoOscuro');
        tema = "oscuro"
    }

    console.log("hola");
}




$("#boton").click(async function(){
    //Se recomienda que el artista se transcriba como "john&20lennon" o "jonh%20lennon"
    let nombre = "John Lennon";
    let numeroAlbum = 2;
    let nombreAlbum = "Mind Games";
    let nombreCancion = "Imagine";
    

    
    ///conseguir album por título y artista
    //await ObtenerAlbumPorTituloYArtista(nombre, nombreAlbum);
    //await ObtenerCancionesDeAlbumPorArtista();
    //console.log(album);

    //conseguir canción por título y artista
    //await ObtenerCancionPorTituloYArtista(nombre, nombreCancion);
    //console.log(cancion);

    //$('#container').html(`<iframe src="https://open.spotify.com/embed?uri=spotify:track:${id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`);

    //<iframe src="https://open.spotify.com/embed?uri=spotify:artist:${id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    //<iframe src="https://open.spotify.com/embed?uri=spotify:track:${id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    //<iframe src="https://open.spotify.com/embed?uri=spotify:album:${id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>



    //traer artículo de wikipedia
    //let numeroArticulo_Wikipedia = 0;
    //let articuloWikipedia_Miniatura = await _getMiniaturas_Wikipedia(nombre, 20);
    //let articuloWikipedia_Completo = await _getArticuloCompleto_Wikipedia(nombre, articuloWikipedia_Miniatura.search[numeroArticulo_Wikipedia].pageid);


    //$('p').html('<h1>'+articuloWikipedia_Completo.title + '</h1>');
    //$('#container').html(`<img src=${articuloWikipedia_Completo.thumbnail.source}> `);
    //$('p').html(articuloWikipedia_Completo.extract );

    //obtener letra de la canción
    //let objeto =await _getLetraCancion();
    //let letra = await _getLyrics(objeto);
    //$('p').html(letra);
});
