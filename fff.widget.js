// Your code goes here.
var finurligeFaktaWidget = (function() {
  "use strict";

  // Define global config object
  var fff = {
    'domain' : "//service.finurligefakta.dk/",
    'baseGuid' : null
  };

  // Defaul conifguration options.
  var options = {
    'widget' : 'interactive',
    'target' : '#fffwidget',
    'style' : 'full',
    'button' : {
      'reload' : true
    }
  };

  // jQuery 1.4 or newer, so use this through the code.
  var jQ;

  // Used to store widget settings for each widget index on GUID.
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
    var $widget = jQ("<div />", {
      "class" : "fffW-interactive fffW-widget"
    })
    .append(
      jQ("<div />", {
        "class" : "fffW-innerwrapper"
      })
      .append(jQ("<h2 />", {
        "class" : "fffW-title",
        "text"  : data.title
      }))
      .append(jQ("<div />", {
        "class" : "fffW-text"
      })
        .append(data.content)
      )
      .append(jQ("<span />", {
        "class" : "fffW-link fffW-source",
        "text"  : "Kilde: "
      })
        .append(jQ("<a />", {
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
                .appendTo(jQ(target))
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
      jQ.getJSON(fff.domain + "?method=getGuid&callback=?", function(rtnjson) {
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

    jQ.ajax({
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
    var $target = jQ(target);
  }

  // Define error handling function
  function errorHandler(rtnjson) {
    alert(rtnjson.msg);
  }

  function initializeFramework(ncjQuery) {
    // Set jQuery
    jQ = ncjQuery;

    // Expand configuration parameters
    // Get GUID from url string
    fff.baseGuid = getParameterByName("fffGuid");

    // Start creating some widgets
    // Loop through configuration array
    jQ.each(fffWidgetConfig, function(i, params) {
      if (params.widget === "interactive") {
        params.guid = fff.baseGuid;
      }
      // Merge default configuration into params.
      params = jQ.extend({}, options, params);

      // Activate the widget.
      widget(params);
    });
  }

  return {
    init: initializeFramework,
    load: loadFact,
    error: errorHandler
  };

}());


// Include JQuery programatically
(function() {
  // Don't let the script run forever.
  var attempts = 30;

  var addLibs = function() {
    // Try to insert jQuery into the header.
    var head = document.getElementsByTagName("head");
    if (head.length == 0) {
      if (attempts-- > 0) {
        setTimeout(addLibs, 100);
      }
      return;
    }

    var node = document.createElement("script");
    node.src = "//ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js";
    head[0].appendChild(node);
    checkLibs();
  }

  var checkLibs = function() {
    if (typeof(jQuery) === "undefined" || parseFloat(jQuery.fn.jquery) < 1.4) {
      // Library isn't done loading
      if (attempts-- > 0) {
        setTimeout(checkLibs, 100);
      }
      return;
    }
    var jQ = jQuery.noConflict(true);
    // Start the widget parsing in jQuery 1.4.0.
    jQ(document).ready(function() {
      finurligeFaktaWidget.init(jQ);
    });
  }

  // Load jQuery 1.4.0 as thats the first known version to support jsonp as we
  // uses it in the widgets to load facts. But only if an newer version is not
  // found.
  if (typeof(jQuery) !== "undefined" && parseFloat(jQuery.fn.jquery) >= 1.4) {
    jQuery(document).ready(function() {
      finurligeFaktaWidget.init(jQuery);
    });
  }
  else {
    addLibs();
  }
})();
