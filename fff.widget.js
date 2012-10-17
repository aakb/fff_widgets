var finurligeFaktaWidget = (function() {
  "use strict";

  // Define global config object
  var fff = {
    'domain' : "//service.finurligefakta.dk/",
    'widgetDomain' : '//service.finurligefakta.dk/widgets/',
    'baseGuid' : null,
    'GAProfile' : 'UA-33089188-1'
  };

  // Defaul conifguration options.
  var options = {
    'callback' : 'finurligeFaktaWidget.load',
    'widget' : 'interactive',
    'target' : '#fffwidget',
    'style' : {
      'type' : 'normal', // @todo: if style not given, fff homepage only build default is returned.
      'color' : 'default'
    },
    'tracking' : true,
    'button' : {
      'reload' : true,
      'create' : true
    },
    'event' : {
      'loadComplet' : null
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

  // Enable Google Analytices tracking.
  function trackEvent(events, trackPageview) {
    // Add Google Analytics to the page.
    if (window._gaq === undefined) {
      // Build Google Analytics script tag.
      var gat = jQ('<script />', {
        'type' : 'text/javascript',
        'async' : true,
        'src' : ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'
      });

      // Add global tracking array.
      var gaq = jQ('<script type="text/javascript">var _gaq = _gaq || [];</script>');
      jQ('body').append(gat).append(gaq);
    }

    // Track page view.
    if (trackPageview === true) {
      _gaq.push(
        ['fff._setAccount', fff.GAProfile],
        ['fff._setDomainName', document.location.host],
        ['fff._trackPageview']
      );
    }

    // Push track events to Google Analytics.
    for (var event in events) {
      _gaq.push(
        ['fff._setAccount', fff.GAProfile],
        ['fff._setDomainName', document.location.host],
        ['fff._trackEvent', 'Finurlig Fakta', event, events[event]]
      );
    }
  }

  // ----- / Define widget object -----
  function Widget() {
    this.widget = '';
    this.data = {};
    this.params = {};
    this.reloaded = false;

    this.init = function init(data, params) {
      this.data = data;
      this.params = params;
      this.build();
      this.style();
    };

    this.build = function build() {
      this.widget = jQ("<div/>", {"class" : "fffW-" + this.params.widget + " fffW-widget"})
                      .append(jQ("<div />", {"class" : "fffW-innerwrapper"})
                                .append(jQ("<h2 />", {"class" : "fffW-title", "text"  : this.data.title}))
                                .append(jQ("<p />", {"class" : "fffW-text"}).append(this.data.content))
                            );

      // Check if reload button should be attached.
      if (this.params.button.reload) {
        var self = this;
        var reload = jQ('<a class="fffw-button fffw-button-reload" href="#">Indlæs et nyt faktum</a>');
        jQ('.fffW-innerwrapper', this.widget).prepend(reload);
        reload.click(function (event) {
          event.stopPropagation();
          event.preventDefault();

          // Should the event be send to GA.
          if (self.params.tracking) {
            trackEvent({
             'Reloaded' : document.location.host
            });
          }

          // Reset params and save ref. to this widget.
          self.params.guid = null;
          self.params.callback = 'finurligeFaktaWidget.reload';
          jQ(self.params.target).data('widget', self);
          getGuid(self.params);
        });
      }

      if (this.params.button.create) {
        var create = jQ('<a class="fffw-button fffw-button-create" href="#">Opret nyt faktum</a>');
        jQ('.fffW-innerwrapper', this.widget).prepend(create);
        create.click(function(event) {
          event.stopPropagation();
          event.preventDefault();

          // Should the event be send to GA.
          if (self.params.tracking) {
            trackEvent({
             'New fact' : document.location.host
            });
          }

          // Build the dialog window.
          var popup = jQ('<div/>', { 'class' : 'fffw-dialog' })
                       .append(jQ('<h3/>', { 'class' : 'fffw-header' }).html('Indsend ny fakta'))
                       .append(jQ('<a/>', { 'class' : 'fffw-close', 'href' : '#' }).html('Close'))
                       .append(jQ('<iframe/>', { 'class' : 'fffw-dialog-iframe' }));

          // Add overlay and insert the dialog.
          jQ('body').append(jQ('<div/>', { 'class' : 'fffw-overlay' }));
          jQ('body').append(popup);

          // Load the form into the iframe from the homepage.
          jQ('iframe', popup).attr('src', 'http://fff.leela/ajax/create/fact');

          jQ('.fffw-close', popup).click(function() {
            popup.remove();
            jQ('.fffw-overlay').remove();
          });
        });
      }

      // Add slogan
      jQ('.fffW-innerwrapper', this.widget).append(jQ('<p />', {
        'class' : 'fffW-slogan',
        'text' : 'Viden fra biblioteket'
      }));

      // Make sure that it now shown yet.
      this.widget.hide();
    };

    // Apply some styling to the widget and add extra information based on
    // style.
    this.style = function style() {
      switch (this.params.style.type) {
        case 'none':
          // Add source link(s).
          jQ('.fffW-slogan', this.widget).before(this.getSourceLinks());

          // Add author.
          jQ('.fffW-slogan', this.widget).before(this.getAuthor());

          // Add organization.
          jQ('.fffW-slogan', this.widget).before(this.getOrganization());
          break;

        case 'minimal':
          // Add CSS.
          this.addCSS(this.params.widget, 'minimal', this.params.style.color);

          // Add logo placeholder.
          jQ('.fffW-innerwrapper', this.widget).prepend('<span class="fffw-logo"></span>');
          break;

        case 'normal':
          // Add source link(s).
          jQ('.fffW-slogan', this.widget).before(this.getSourceLinks());

          // Add logo placeholder.
          jQ('.fffW-innerwrapper', this.widget).prepend('<span class="fffw-logo"></span>');

          // Add CSS.
          this.addCSS(this.params.widget, 'normal', this.params.style.color);
          break;

        case 'full':
          // Add source link(s).
          jQ('.fffW-slogan', this.widget).before(this.getSourceLinks());

          // Add author.
          jQ('.fffW-slogan', this.widget).before(this.getAuthor());

          // Add organization.
          jQ('.fffW-slogan', this.widget).before(this.getOrganization());

          // Add logo placeholder.
          jQ('.fffW-innerwrapper', this.widget).prepend('<span class="fffw-logo"></span>');

          // Add CSS.
          this.addCSS(this.params.widget, 'full', this.params.style.color);
          break;
      }
    };

    this.addCSS = function addCSS(type, style, color) {
      // Add CSS.
      var css = fff.widgetDomain + 'css/fffw-' + type + '.' + style + '.' + color + '.css';
      if (document.createStyleSheet){
        document.createStyleSheet(css);
      }
      else {
        jQ('head').append('<link media="all" rel="stylesheet" href="' + css + '" type="text/css" />');
      }
    };

    this.getSourceLinks = function getSourceLinks() {
      var sources = jQ('<div />', {
        'class' : 'fffW-external-links fffW-extra'
      }).append(jQ("<span />", {
        'class' : 'fffW-label',
        'text' : 'Læs mere:'
      }));
      for (var i in this.data.sources) {
        sources.append(jQ("<a />", {'class' : 'fffw-link',
                                      'rel' : 'external',
                                      'href' : this.data.sources[i].url,
                                      'text' : this.data.sources[i].title}));
      }

      return sources;
    };

    this.getAuthor = function getAuthor() {
      return jQ('<div />', {
        'class' : 'fffW-author fffW-extra'
      }).append(jQ('<span />', {
        'text' : 'Forfatter:',
        'class' : 'fffW-label'
      })).append(this.data.author);
    };

    this.getOrganization = function getOrganization() {
      return jQ('<div />', {
        'class' : 'fffW-orgnization fffW-extra'
      }).append(jQ('<span />', {
        'text' : 'Organisation:',
        'class' : 'fffW-label'
      })).append(this.data.organization);
    };

    // Insert the widget and fire loadComplet event.
    this.insert = function insert() {
      var target = jQ(this.params.target);
      if (target.length != 1) {
        // Target was not found on the page.
        alert('The target div was not found on the page. Please add it to the page and try again.');
        return -1;
      }

      target.html(this.widget);

      // Fire loadComplet event.
      if (this.params.event.loadComplet !== null) {
        this.params.event.loadComplet();
      }

      // Show the widget.
      this.show();
    };

    // Reload the widget with new fact from the data parameter.
    this.reload = function reload(data) {
      var self = this;
      self.data = data;
      self.reloaded = true;
      self.hide(function () {
        // Update title and text.
        jQ('.fffW-title', self.widget).text(self.data.title);
        jQ('.fffW-text', self.widget).html(self.data.content);

        // Update source links etc.
        switch (self.params.style.type) {
          case 'none':
          case 'normal':
          case 'full':
            jQ('.fffW-external-links', self.widget).html(self.getSourceLinks());
            jQ('.fffW-author', self.widget).html(self.getAuthor());
            jQ('.fffW-orgnization', self.widget).html(self.getOrganization());
            break;
        }
        self.show();
      });
    };

    // Hide the widget for the user.
    this.hide = function hide(callback) {
      this.widget.hide(0, function() {
        if (callback) {
          callback();
        }
      });
    };

    // Display the widget for the user.
    this.show = function show(callback) {
      this.widget.show(0, function() {
        if (callback) {
          callback();
        }
      });
    };
  }

  /************
   * Interactive inherit from widget
   */
  function InteractiveWidget() {}
  InteractiveWidget.prototype = new Widget();

  // Override show method.
  InteractiveWidget.prototype.show = function() {
    this.widget.fadeIn();
  };

  // Override hide method.
  InteractiveWidget.prototype.hide = function(callback) {
    this.widget.fadeOut(function () {
      if (callback) {
        callback();
      }
    });
  };

  /************
   * Slide in widget inherit from widget
   */
  function SlideInWidget() {}
  SlideInWidget.prototype = new Widget();

  // Create target div to insert the widget into.
  SlideInWidget.prototype.createTarget = function() {
    var target;
    if (this.params.target.charAt(0) === '#') {
      target = jQ('<div />', {
        'id' : this.params.target.substring(1)
      });
    }
    else {
      target =jQ('<div />', {
        'class' : this.params.target.substring(1)
      });
    }
    target.addClass('fffW-widget-wrapper');
    jQ('body').append(target);
  };

  // Override show method.
  SlideInWidget.prototype.show = function() {
    var self = this;

    // If at bottom when loaded, slide in the widget (with 10px buffer).
    if (jQ(window).scrollTop() >= jQ(document).height() - (jQ(window).height() + 10)) {
      self.slideIn();
    }

    // Slide in if bottom of page is reached.
    jQ(window).scroll(function() {
      if (jQ(window).scrollTop() >= jQ(document).height() - (jQ(window).height() + 10)) {
        self.slideIn();
      }
    });
  };

  // Override hide method.
  SlideInWidget.prototype.hide = function(callback) {
    if (this.reloaded) {
      this.widget.fadeOut(function () {
        if (callback) {
          callback();
        }
      });
    }
    else {
      jQ('.fffW-slidein').animate({
        width : '0px'
      }, {
        complete : function() {
          jQ('.fffW-slidein').removeClass('active');
          if (callback) {
            callback();
          }
        }
      }, 1000);
    }
  };

  // Implementation of slide in aninmation.
  SlideInWidget.prototype.slideIn = function() {
    var self = this;
    if (self.reloaded) {
      // The widget have been reloaded so fade not slide.
      self.widget.fadeIn();
      self.reloaded = false;
    }
    else {
      var slideIn = jQ('.fffW-slidein');
      if (!slideIn.hasClass('active')) {
        // The widget have not been slide in, so do it.
        self.widget.show();
        slideIn.width('0px').animate({
          width : '370px'
        }, {
          complete : function() {
            slideIn.addClass('active');
          }
        }, 1000);
      }
    }
  };

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
    switch (params.widget) {
      case 'interactive':
        widget = new InteractiveWidget();
        widget.init(data, params);
        widget.insert();
        break;

      case 'slidein':
        widget = new SlideInWidget();
        widget.init(data, params);
        widget.createTarget();
        widget.insert();
        break;

      default:
        alert('The selected firnulig fakta widget type is not supported');
        break;
    }
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
      // Legacy, what was the idea (force load content) ?
      params.guid = fff.baseGuid;

      // Merge default configuration into params.
      params = jQ.extend({}, options, params);

      // Fix default style.
      if (!params.style.color) {
        params.style.color = 'default';
      }
      if (!params.style.type) {
        params.style.type = 'minimal';
      }

      // Enable event tracking (Google Analytices).
      if (params.tracking) {
        trackEvent({
          'Loaded at' : document.location.host,
          'Widget type' : params.widget,
          'Widget style' : params.style.type,
          'Widget color' : params.style.color
        }, true);
      }

      // Activate the widget.
      getGuid(params);
    });
  }

  return {
    init: initializeFramework,
    load: loadFact,
    reload: reloadWidget
  };

}());

/************************************
 **                                **
 ** Include JQuery programatically **
 **                                **
 ************************************/
(function() {
  "use strict";

  // Helper function to load jQuery.
  var load_javascript = function(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) { //IE fix
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    }
    else { //Others
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  // Load jQuery 1.4.0 as thats the first known version to support jsonp as we
  // uses it in the widgets to load facts. But only if an newer version is not
  // found.
  if (typeof(jQuery) !== "undefined" && parseFloat(jQuery.fn.jquery) >= 1.4) {
    jQuery(document).ready(function() {
      finurligeFaktaWidget.init(jQuery);
    });
  }
  else {
    load_javascript("https://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js", function () {
      var jQ = jQuery.noConflict(true);
      // Start the widget parsing in jQuery 1.4.0.
      jQ(document).ready(function() {
        finurligeFaktaWidget.init(jQ);
      });
    });
  }
})();
