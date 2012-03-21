# Finurlige Fakta Webservices

## Webservices
The web service offers the following methods:

1. getFact
2. getGuid

## getfact 
Returns a fact object from a GUID as a JSON-P response.

### Call
    ?method=getFact&callback=parseJson&guid=1

### Reponse (JSON)
```javascript
{
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
}
```

## getFact
Returns a random GUID matching a published fact object.

### Call
    ?method=getGuid&callback=parseJson

### Response (JSON)
```javascript
{"guid":"1"}
```

## JSON-P Example
factWidgetLoad('{"facts":[{"guid":423,"title":"Kakao-cola?","date":"23-03-2012T14:33:00Z+1000","author":"Kristensen,Jesper","content":"<p>Vidste du, at ordet 'karat' har vandret fra græsk til arabisk til spansk til resten af Europa, og undervejs har skiftet betydning&nbsp; fra 'lille horn' til 'johannesbrød(kerne)' til 'vægtenhed for guld og sølv' til 'positiv værdi'?</p>","source":{"uri":"http://finurligefakta.dk/&q=1234","text":"Link text"},"inspiration":{"uri":"","text":""},"keywords":["overtro","teatre"]}]}');