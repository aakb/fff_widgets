
var finurligeFaktaWidget = (function() {
  "use strict";

  // Define global config object
  var fff = {
    'domain' : "//service.finurligefakta.dk/",
    'baseGuid' : null
  };

  // Defaul conifguration options.
  var options = {
    'callback' : 'finurligeFaktaWidget.load',
    'widget' : 'interactive',
    'target' : '#fffwidget',
    'style' : 'none',
    'button' : {
      'reload' : true
    }
  };

  // Used to store widget settings for each widget index on GUID.
  var settings = [];
  
  // jQuery 1.4 or newer, so use this through out the object.
  var jQ;

  // Get url parameter
  function getParameterByName(name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)')
                .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  // ----- / Define widget object -----
  function Widget() {
    this.widget = '';
    this.data = {};
    this.params = {};
    
    this.init = function init(data, params) {
      this.data = data;
      this.params = params;
      
      this.build();                        
      this.style();
    }
    
    this.build = function build() {
      this.widget = jQ("<div/>", {"class" : "fffW-interactive fffW-widget"})
                      .append(jQ("<div />", {"class" : "fffW-innerwrapper"})
                                .append(jQ("<h2 />", {"class" : "fffW-title", "text"  : this.data.title}))
                                .append(jQ("<div />", {"class" : "fffW-text"})
                                          .append(this.data.content)
                                      )                                
                            );
      
      // Check if reload button should be attached.
      if (this.params.button.reload) {
        var self = this;
        var reload = jQ('<a class="button fffw-button-reload" href="#">Reload</a>');
        $('.fffW-innerwrapper', this.widget).append(reload);
        reload.click(function () {
          // Reset params and save ref. to this widget.
          self.params.guid = null;
          self.params.callback = 'finurligeFaktaWidget.reload';
          jQ(self.params.target).data('widget', self);
          getGuid(self.params);
        });
      }
    }
    
    // Apply some styling to the widget and add extra information based on 
    // style.
    this.style = function style() {
      if (this.params.style === 'minimal') {

      }
      else if (this.params.style == 'full') {
        
      }
    }
    
    this.reload = function reload(data) {
      var self = this;
      self.data = data;
      self.widget.slideUp("fast", function() {
        jQ('.fffW-title', self.widget).text(self.data.title);
        jQ('.fffW-text', self.widget).html(self.data.content);
        self.widget.slideDown("fast");        
      });
    }
    
    // Default insertion of the widget.
    this.insert = function insert(target) {
      this.widget.appendTo(jQ(target));
    }
  }
   
  // Interactive inherit from widget
  function InteractiveWidget() {}
  InteractiveWidget.prototype = new Widget();
  
  // Override insert method.
  InteractiveWidget.prototype.insert = function() {
    this.widget.hide()
               .appendTo(jQ(this.params.target))
               .slideDown("fast");
  };
  
  // Override reload method.
//  InteractiveWidget.prototype.reload = function() {
//    alert('new reload');
//  }

  // ----- / Create Widgets -----
  function getGuid(params) {
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

  // Reload callback that retives the widget and reloads it with new data.
  function reloadWidget(data) {
    var params = settings[data.guid];
    var widget = jQ(params.target).data('widget');
    widget.reload(data);
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
      jsonpCallback: params.callback
    });
  }

  // Returns object from json
  function loadFact(data) {
    var params = settings[data.guid];
    var widget;

    // Call appropriate function to create widget
    switch(params.widget) {
      case 'interactive':
        widget = new InteractiveWidget();
        widget.init(data, params);
        widget.insert();
        
        break;

      case 'slidein':
        widget = new SlideInWidget(data, params);
        widget.insert(params.target);
        break;

      case 'mobile':
        widget = new MobileWidget(data, params);
        widget.insert(params.target);
        break;
    }
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
      getGuid(params);
    });
  }

  return {
    init: initializeFramework,
    load: loadFact,
    reload: reloadWidget,
    error: errorHandler
  };

}());

/************************************
 **                                **
 ** Include JQuery programatically **
 **                                **
 ************************************/
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

    // Insert jQuery into the page header.
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
