$( document ).ready(function() {
    var userPosition = {lat:null,long:null};
    var coordinatesFrom = {lat:null,long:null};
    var coordinatesTo = {lat:null,long:null};
    
    initialize();

    
    function positionFound(input,overwrite)
    {
        input.parent().find('.input-group-addon').addClass('btn-success');
        if(overwrite) input.val(coordinatesFrom.lat+" "+coordinatesFrom.long);
        input.prop('disabled', true);
        input.parent().find('button').show();
        input.parent().find('button').text('Change');
    }
    
    $('span.input-group-btn button').click(function(){
        var input = $(this).parent().parent().find('input');
        var id = $(this).prop('id');
        if(input.prop('disabled')===false){
            if(id=="detect"){
                coordinatesFrom.lat = userPosition.lat;
            }
            positionFound(input,true);
        }
        else
        {
            input.prop('disabled',false);
            if(id=="detect")
                $(this).text('Detect');
            else
                $(this).hide();
            input.parent().find('.input-group-addon').removeClass('btn-success');
        }
    });
    //-------------GEO LOCATION---------------------------
    var autocompleteFrom, autocompleteTo;
    
    function handle_errors(error){
        switch(error.code)
        {
            case error.PERMISSION_DENIED: alert("user did not share geolocation data");
            break;

            case error.POSITION_UNAVAILABLE: alert("could not detect current position");
            break;

            case error.TIMEOUT: alert("retrieving position timed out");
            break;

            default: alert("unknown error");
            break;
        }
    }
    
  
    function initialize() {
            
        geolocate();
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        autocompleteFrom = new google.maps.places.Autocomplete(
          /** @type {HTMLInputElement} */(document.getElementById('addressFrom')),
          { types: ['geocode'] });
        // When the user selects an address from the dropdown,
        // populate the address fields in the form.
        google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
            fillInAddress(autocompleteFrom,coordinatesFrom,'#addressFrom');
        });
        
        autocompleteTo = new google.maps.places.Autocomplete(
          /** @type {HTMLInputElement} */(document.getElementById('addressTo')),
          { types: ['geocode'] });
        // When the user selects an address from the dropdown,
        // populate the address fields in the form.
        google.maps.event.addListener(autocompleteTo, 'place_changed', function() {
            fillInAddress(autocompleteTo,coordinatesTo,'#addressTo');
        });
    }
    
    // [START region_fillform]
    function fillInAddress(autoComplete,coordinates,id) {
      // Get the place details from the autocomplete object.
        var place = autoComplete.getPlace();
        coordinates.lat = place.geometry.location.k;
        coordinates.long = place.geometry.location.A;
        positionFound($(id),false);
    }
    // [END region_fillform]
    
    // [START region_geolocation]
    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = new google.maps.LatLng(
                    position.coords.latitude, position.coords.longitude);
                autocompleteFrom.setBounds(new google.maps.LatLngBounds(geolocation,
                    geolocation));
                userPosition.lat = position.coords.latitude;
                userPosition.long = position.coords.longitude;
        },handle_errors);
      }
    }
    // [END region_geolocation]
});
