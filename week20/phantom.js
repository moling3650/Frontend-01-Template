var page = require('webpage').create();

page.open('http://localhost:8080/', function (status) {
  console.log('Status: ' + status);

  if (status === 'success') {

    var bodyString = page.evaluate(function () {
      var toString = function (pad, element) {
        var children = element.childNodes;
        var childrenString = '';

        for (var i = 0; i < children.length; i++) {
          childrenString += toString('  ' + pad, children[i]) + '\n';
        }

        var name;

        if (element.nodeType === Node.TEXT_NODE) {
          name = '#text' + JSON.stringify(element.textContent);
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          name = element.tagName;
        }

        return pad + name + (childrenString ? '\n' + childrenString : '');
      };

      return toString('', document.body);
    });
    console.log(bodyString);
  }
  phantom.exit();
});