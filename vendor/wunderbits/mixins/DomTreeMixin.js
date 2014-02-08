define([

  '../global',
  '../WBMixin'

], function(
  global,
  WBMixin,
  undefined
) {

  'use strict';

  var document = global.document;
  var filter = global.NodeFilter;

  var acceptNodesFn = function () {
    return filter.FILTER_ACCEPT;
  };

  function process (node, fn, context) {
    var newNodes = fn.call(context, node);
    newNodes && swapNode(node, newNodes);
  }

  function swapNode (oldNode, newNodes) {

    var parentNode = oldNode.parentNode;
    if (!parentNode) {
      return;
    }

    var current = oldNode, node;
    newNodes = [].slice.call(newNodes);
    while (newNodes.length) {
      node = newNodes.pop();
      parentNode.insertBefore(node, current);
      current = node;
    }
    parentNode.removeChild(oldNode);
  }

  function useTreeWalker (parent, fn, context) {

    var treeWalker = document.createTreeWalker(parent, filter.SHOW_TEXT, acceptNodesFn, false);
    while (treeWalker.nextNode()) {
      process(treeWalker.currentNode, fn, context);
    }
  }

  function useNodeLooper (parent, fn, context, recursive) {

    // gather all child nodes into an array
    var nodes = [].slice.call(parent.childNodes), node;

    // and loop through them
    while (nodes.length) {
      node = nodes.shift();

      // if it's a text node, then process it
      if (node.nodeType === 3) {
        process(node, fn, context);
      }
      // otherwise for all other nodes, gather all the children into the array
      else if (recursive && node.childNodes.length) {
        nodes.push.apply(nodes, node.childNodes);
      }
    }
  }

  return WBMixin.extend({

    // walk all text nodes & replace them with marked tokens
    'renderTokens': function ($el, helper) {

      var self = this;
      $el = $el || self.$el;

      if ($el.length) {
        self.walkTextNodes($el[0], helper.tokenize, helper);
      }

      return self;
    },

    // Find all text nodes & apply fn over each text node
    'walkTextNodes': function (parent, fn, context, recursive) {

      context || (context = this);

      // recursive by default
      (recursive === undefined) && (recursive = true);

      // use tree walker, if available
      if (recursive && 'createTreeWalker' in  document) {
        useTreeWalker(parent, fn, context);
      }
      // fallback to old-school "looping through the nodes"
      else {
        useNodeLooper(parent, fn, context, recursive);
      }
    }
  });
});
