// Enclosed within an anonymous function to protect against clashes with other JS. 
(function() {

// Localize jQuery variable
var jQuery;

// ----- / Load jQuery if not present -----
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
  var script_tag = document.createElement('script');
  script_tag.setAttribute("type","text/javascript");
  script_tag.setAttribute("src",
    "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
  if (script_tag.readyState) {
    script_tag.onreadystatechange = function () { // For old versions of IE
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        scriptLoadHandler();
      }
    };
  } else {
    script_tag.onload = scriptLoadHandler;
  }
  // Try to find the head, otherwise default to the documentElement
  (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
  // The jQuery version on the window is the one we want to use
  jQuery = window.jQuery;
  fffMain();
}

// ----- / Called once jQuery has loaded -----
function scriptLoadHandler() {
  // Restore $ and window.jQuery to their previous values and store the
  // new jQuery in our local jQuery variable
  jQuery = window.jQuery.noConflict(true);
  // Call our main function
  fffMain(); 
}

// ----- / Our main function -----
function fffMain() { 
  jQuery(document).ready(function($) { 
    // Define config object
    var fff = new Object();
    fff.guid = false;
    fff.getGuid = "//service.finurligefakta.dk/getFactByGuid?callback=?";
    
    // Get url parameter
    function getParameterByName(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)')
                  .exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
 
    // ----- / Define actions for event listeners -----
    // Action: Reload random factData
    
    // Action: Load next factData
    
    // Action: Generate link
    
    
    // ----- / Define behaviors -----
    // Behavior: Slide-in
    
    // Behavior: Slide-out
    
    
    // ----- / Get factData -----

    
    // Load factObject
    
    
    // ----- / Create Widgets -----
    function createWidget(params) {
      // Get GUID
      function getGUID(startGUID) {
        var guid = new Integer();
     
        // Check if we already have a GUID
        if (startGUID) {
          // If we have a GUID already, get the next one
          guid = 0;
                  
        } else {
          // Otherwise get a random
        
        }
       
        return guid;
      }

      // Get data
      function getFactData(getGUID(params.guid)) {
        // @todo: add guid parameter to service
                      
        $.ajax({
          url: getGuid,
          dataType: 'json',
          jsonp:'loadFact'
        });
      }   
      
      // Returns object from json
      function loadFact(json) {
        var data = new Object();
        data = json;
        
        // Call appropriate function to create widget
        switch(params.type) {
          case 'interactive':
            defineInteractive(data, params);
            break;
          case 'interactive':
            defineSlidein(data, params);
            break;
          case 'interactive':
            defineTouch(data, params);
            break;
        }
      }
      
      getFactData();
    }
    
    // Interactive Widget
    function defineInteractive(data, params) {
      var $w;
    
      return $w;
    }
    
    // Slide-in Widget
    function defineSlidein(data, params) {
      var $w;
    
      return $w;    
    }
    
    // Touch-widget
    function defineTouch(data, params) {
      var $w;
    
      return $w;    
    }
    
    
    // ----- / Insert Widgets -----
    // Append and fade-in widgets
    function appendWidgets(widget) {
      
      // Hide widget
      
      // Append widget
      
      // Show widget
    }
    
    // Expand configuration parameters
    // Get GUID from url string
    fff.guid = getParameterByName(fffGuid);
    
    // Start creating some widgets 
    // Loop through through configuration array
    $.each(fffWidgetConfig, function(i, params) {
      params.guid = fff.guid;
      createWidget(params)
    });
  });
}

})(); // We call our anonymous function immediately