 //Set Endpoint URLs
 var spotifyAlbum = "https://api.spotify.com/v1/search?q=";
 var getAlbum = "https://api.spotify.com/v1/albums/";

//Search event
 $('form').submit(function (evt) {
    var $submitButton = $('#submit');
    var $searchField = $('#search');
    evt.preventDefault();
    $searchField.prop("disabled",true);
    $submitButton.attr("disabled", true);
    var album = $searchField.val();
    $('#photos').html('');
    //Get Album from Spotify
    $.getJSON(spotifyAlbum+album+"&type=album",
    function(data){
      var albumHTML = '';
      var albums = data.albums.items;
      if (albums.length > 0) {
        //Populate results
        $.each(albums,function(i,album) {
          albumHTML += '<li><a href="'+album.external_urls.spotify+'">';
          albumHTML += '<div class="album-wrap"><img class="album-art" src="'+album.images[0].url+'"></a>';
          albumHTML += '</div><span class="album-title"><a href="#" class="album-button" id="'+album.id+'">'+album.name+'</a></span>';
          albumHTML += '<span class="album-artist">'+album.artists[0].name+'</span></li>';          
        });
      } else {
        //Handle if no results
        albumHTML += "<li class='no-albums'><i class='material-icons icon-help'>help_outline</i>";
        albumHTML += "No albums found that match: "+ album + ".</li>";
      }
      $('#albums').html(albumHTML);
      $searchField.prop("disabled", false);
      $submitButton.attr("disabled", false);
    });

  }); // end search event

//Click on album event
$(document).on("click", '.album-button',function(e){
  e.preventDefault();
  var albumId = this.id;
  var lightboxHTML = '';
  
  //get Album data from Spotify
  $.getJSON(getAlbum+albumId, function(data){
    var year = data.release_date;
    year = year.substring(0, 4);
    lightboxHTML += '<header><a href="#" class="back-button"> <- Back to search </a><img src="'+data.images[1].url+'">';
    lightboxHTML += '<div class="album-info"><a href="'+data.external_urls.spotify+'"><h1>'+data.name+' ('+year+')</h1></a>';
    lightboxHTML += '<p>'+data.artists[0].name+'</p></div></header>';
    var tracks = data.tracks.items;
    lightboxHTML += '<div class="tracks"><p>Track list:</p><ol>';
    $.each(tracks,function(i,track){
      lightboxHTML += '<li>'+track.name+'</li>';
    });
    lightboxHTML += '</ol></div>';
    $('.main-content').hide("slow");
    $('#album-lightbox').html(lightboxHTML).show("slow");
  });
 });//end click event

//Go back to search results
$(document).on("click", '.back-button',function(e){
  $('#album-lightbox').hide("slow");
  $('.main-content').show("slow");
});
