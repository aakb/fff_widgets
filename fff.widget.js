// Your code goes here.
var finurligeFaktaWidget = (function() {
  "use strict";
  
  // Define global config object
  var fff = {};
    fff.domain = "//service.finurligefakta.dk/";
    fff.baseGuid = null;
    fff.getGuid = fff.domain + "?method=getGuid&callback=?";
  
  // Define widget configuration object
  var settings = [];
  
  // Get url parameter
  function getParameterByName(name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)')
                .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  
  // ----- / Define widgets -----
  // Interactive widget
  function interactiveWidget(data, params) {
    // Create wrapper for mobile menu.
    var $widget = $("<div />", {
      "class" : "fffW-interactive fffW-widget"
    })
    .append(
      $("<div />", {
        "class" : "fffW-innerwrapper"
      })
      .append($("<h2 />", {
        "class" : "fffW-title",
        "text"  : data.title
      }))
      .append($("<div />", {
        "class" : "fffW-text"
      })
        .append(data.content)
      )
      .append($("<span />", {
        "class" : "fffW-link fffW-source",
        "text"  : "Kilde: "
      })
        .append($("<a />", {
          "rel"   : "external",
          "href"  : data.sources[0].url,
          "text"  : data.sources[0].title       
        }))
      )
    );
    this.element = $widget;    
  }
  
  interactiveWidget.prototype.insert = function(target) {
    this.element.hide()
                .appendTo(jQuery(target))
                .slideDown("fast");
  };
  
  // Slidein widgets
  function slideInWidget(data, params) {
    this.element = "<p>Output: Interactive Widget</p>";
  }
  
  // Mobile widget
  function mobileWidget(data, params) {
    this.element = "<p>Output: Interactive Widget</p>";
  }

  // ----- / Create Widgets -----
  function widget(params) {
    if (params.guid !== null) {
      getFactData(params);
    } else {
      $.getJSON(fff.getGuid, function(rtnjson) {
        params.guid = rtnjson.guid;
        // @todo: Add check for existing guids
        getFactData(params);
      });
    }
  }
  
  // Get data
 function getFactData(params) {
    var method = "getFact";

    // Push parameters to settings object for later retrieval
    settings[params.guid] = params;

    $.ajax({
      url: fff.domain,
      cache: true,
      data: {guid: params.guid, method: method},
      dataType: "jsonp",
      jsonp : "callback",
      jsonpCallback: "finurligeFaktaWidget.load"
    });
  }
  
  // Returns object from json
  function loadFact(rtnjson) {
    var data = rtnjson;
    var params = settings[data.guid];
    var widget;

    // Call appropriate function to create widget
    switch(params.widget) {
      case 'interactive':
        widget = new interactiveWidget(data, params); 
        widget.insert(params.target);
        break;
        
      case 'slidein':
        widget = new slideInWidget(data, params); 
        widget.insert(params.target);
        break;
        
      case 'mobile':
        widget = new mobileWidget(data, params); 
        widget.insert(params.target);
        break;
    }    
  }
  
  // Insert widget
  function insertWidget($widget, target) {
    var $target = jQuery(target);
  }
  
  // Define error handling function
  function errorHandler(rtnjson) {
    alert(rtnjson.msg);
  }

  function initializeFramework() {
    // Expand configuration parameters
    // Get GUID from url string
    fff.baseGuid = getParameterByName("fffGuid");
  
    // Start creating some widgets 
    // Loop through through configuration array
    $.each(fffWidgetConfig, function(i, params) {
      if (params.widget === "interactive") {
        params.guid = fff.baseGuid;
      }
      widget(params);
    });
  }
  
  return {
    init: initializeFramework,
    load: loadFact,
    error: errorHandler
  };

}());

jQuery(document).ready(function() {
  finurligeFaktaWidget.init();
});
