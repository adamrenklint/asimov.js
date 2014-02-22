# Views in Wunderbits

## WBView

### renderData and state

To make sure we don't create an immutable object and create new copies as we add properties to it and it changes its size, we pre-allocate objects called __renderData__ and __state__ that should include all the properties our view will use. Both these objects are merged with the SuperClass' implementation automatically, all the way up to WBView.

### formatData (renderData) > {}

__renderData__ is passed to the __formatData__ method that should assign values to the existing property keys, and then return the data object. This method should never increase the size of the __renderData__ object!

### _mergeFromSuper (instance, key)

Used to merge __renderData__ and __state__ from all SuperView levels, but could be used by a view to merge any object.

### A simple example

```javascript
var MyView = WBView.extend({

  'renderData': {
    'iconClass': 'person'
    'name': undefined,
    'avatar': undefined
  },

  'formatData': function (data) {

    var self = this;

    data = _super.formatData.call(self, data);
    data.name = 'some value';
    data.avatar = 'some other value';

    return data;
  },

  'render': function () {

    var self = this;
    var data = self.formatData(self.renderData);
    _super.render.call(self, data);

    self.$el.addClass(iconClass);

    return self;
  }
});
```

