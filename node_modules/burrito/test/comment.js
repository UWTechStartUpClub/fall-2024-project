var test = require('tap').test;
var burrito = require('../');
var vm = require('vm');

test('comment', function (t) {
  t.plan(1);
  
  burrito('/* the comment */\nfunction f1() {}', function (node) {
    if (node.name === 'defun' || node.name === 'function') {
      t.same(node.start.comments_before[0].value, ' the comment ');
    }
  });
});
