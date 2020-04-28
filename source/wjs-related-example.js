/*!
 * wjs-related v2.0.6
 * Copyright 2018 zkreations
 * Developed by José Gregorio (fb.com/JGMateran)
 * Licensed under MIT (github.com/zkreations/wjs-related/blob/master/LICENSE)
 */
var related = (function(){
   'use strict';
   
   //Configuracion
   var defaults = {
      id: '1692379497738760100',
      homepage: 'https://www.zkreations.com', //Url del blog
      image: 'src/imgdefault.jpg', //Imagen por defecto
      length: 6, //Cantidad de entradas
      localeDate: 'es-ES', //Idioma
      snippet: 50, //Cantidad de texto
      imgSize: 's256', //Recorte de la imagen
      container: document.getElementById('wjs-related'), //Selector
      tags: ['tutorial','anime','plantilla'] //Etiquetas
   };
   
   //<![CDATA[
   var tags$length = defaults.tags.length;
   var script = document.createElement( 'script' );
   var src = defaults.homepage + '/feeds/posts/default' +
      '?alt=json-in-script' +
      '&callback=related' +
      '&max-results=' + ( defaults.length + 1 ) +
      '&q=';
   for ( var n = 0; n < tags$length; n++ ){
      src += 'label:"' + defaults.tags[ n ] + '"' + ( n === tags$length - 1 ? '' : '|' );
   }
   script.src = src;
   document.body.appendChild( script );
   function render( data ){
      var title = data.title.$t;
      var content = data.content;
      var summary = data.summary;
      var body = content ? content.$t : summary.$t;
      var snippet = (body).replace(/<[^>]*>?/g,'').substring( 0, defaults.snippet ) + '...';
      var img = data.media$thumbnail;
      var tempHtml = document.createElement('div');
      tempHtml.innerHTML = body;
      var imgHtml = tempHtml.querySelector('img');
      var image = ( img ? img.url : (imgHtml ? imgHtml.src : defaults.image)).replace( /s\B\d{2,4}-c/, defaults.imgSize); 
      var url = (function(){
         for ( var i = 0; i < data.link.length; i++ ){
            var link = data.link[i];
            if ( link.rel === 'alternate' ){
               return link.href;
            }
         }
      })();
      var published = new Date( data.published.$t ).toLocaleDateString(
         defaults.localeDate,
         {year:'numeric', month:'long', day: 'numeric'}
      );
      return (
         '<div class="relCard">'+
            '<div class="relCard-content">'+
               '<a href="' + url + '" class="relCard-image">'+
                  '<img src="' + image + '" alt="' + title + '" />'+
               '</a>'+
               '<div class="relCard-data">'+
                  '<h3 class="relCard-title">' + title + '</h3>'+
                  '<div class="relCard-date">' + published + '</div>'+
                  '<p class="relCard-snippet">' + snippet + '</p>'+
               '</div>'+
            '</div>'+
         '</div>'
      );
   }
   function related( json ){
      var i = 0;
      var post;
      var length = defaults.length;
      for ( ; i < length && ( post = json.feed.entry[ i ] ); i++ ){
         if ( defaults.id !== post.id.$t.split( '.post-' )[ 1 ] ){
            defaults.container.innerHTML += render( post );
         } else {
            length++;
         }
      }
   }
   return related;
})();