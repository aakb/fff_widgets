# Finurlige Fakta Webservices

## Webservices
The web service offers the following methods:

1. getGuid
2. getFact

## getGuid
Returns a random GUID matching a published fact object.

### Call
    ?method=getGuid&callback=parseJson

### Response (JSON)
```javascript
{"guid":"1"}
```

## getfact 
Returns a fact object from a GUID as a JSON-P response.

### Call
    ?method=getFact&callback=parseJson&guid=1

### Reponse (JSON)
```javascript
parseJson({
  "guid": "1",
  "title": "Cheers Miss Sophie!",
  "author": "M. Krogbæk Aarhus Kommunes Biblioteker",
  "time": "1330956780",
  "content": "<p>&ldquo;90-års-fødselsdagen&rdquo; eller der bliver vist hver nytårsaften i bl.a. Danmark og Tyskland, er den TV udsendelse i hele verden, der har været vist flest gange. Filmen hedder også&nbsp;&rdquo;Dinner for One&rdquo; og er fuldstændig ukendt i den engelsk talende verden.</p>\r\n",
  "inspirations": [
    {
      "title": "YouTube – Dinner for one",
      "url": "https://www.youtube.com/watch?v=6lzQxjGL9S0&feature=fvst"
    }
  ],
  "sources": [
    {
      "title": "The frequent business traveller",
      "url": "http://www.frequentbusinesstraveler.com/2011/12/dinner-for-one-the-same-procedure-as-every-year-on-new-year%E2%80%99s-eve/"
    }
  ],
  "keywords": [
    "Popkultur",
    "Tv"
  ]
})
```

## Inserting a widget


### Configuration script
This is an example on the JavaScript that you can insert into your site to use Finurlig Facts.

```html
<!-- FFF Widget Code - So far does nothing :-) -->
<script type="text/javascript">

  var fffWidgetConfig = [];
  fffWidgetConfig.push({
    "widget" : "interactive",
    "target" : "#widget1",
    "style"  : "full"
  });

  (function() {
    var fff = document.createElement('script'); fff.type = 'text/javascript'; fff.async = true;
    fff.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'service.finurligefakta.dk/widgets/fff.widget.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fff, s);
  })();

</script>
```

### Configuration

``` javasxript
var fffWidgetConfig = [];
  fffWidgetConfig.push({
    "widget" : "interactive",
    "target" : "#widget1",
    "style"  : "full"
  });
```

#### Widget types
1. interactive

#### Styles
1. full
2. minimal (the one used on http://finurligfakta.dk).