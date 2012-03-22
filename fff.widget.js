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
    "use strict";
    jQuery(document).ready(function($) { 
      // Define config object
      var fff = new Object();
      fff.guid = null;
      fff.domain = "//service.finurligefakta.dk/";
      fff.getGuid = fff.domain + "?method=getGuid&callback=?";
      
      
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

        // Returns object from json
        function loadFact(rtnjson) {
          console.log("fisk");
          var data = {};
          data = rtnjson;
          
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

        // Get data
        function getFactData(guid) {
          var method = "getFact";

          $.ajax({
            url: fff.domain,
            cache: true,
            data: {guid: guid, method: method},
        		dataType: "jsonp",
        		jsonp : "callback",
            jsonpCallback: "loadFact"
          });
        }   
        
        if (params.guid != null) {
          getFactData(params.guid);
        } else {
          $.getJSON(fff.getGuid,  function(rtnjson) { 
		        getFactData(rtnjson.guid);
          }); 
        }
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
      fff.guid = getParameterByName("fffGuid");
      
      // Start creating some widgets 
      // Loop through through configuration array
      $.each(fffWidgetConfig, function(i, params) {
        params.guid = fff.guid;
        createWidget(params);
      });
    });
  }
})(); // We call our anonymous function immediately

