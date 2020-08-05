var tty = require('tty');
var ttys = require('ttys');
var rl = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();

function getChar() {
  return new Promise(resolve => {
    stdin.once('data', key => resolve(key));
  })
}

const move = {};
['up', 'down', 'right', 'left'].forEach((d, i) => {
  move[d] = function (n = 1) {
    stdout.write('\033[' + n + String.fromCharCode('A'.charCodeAt() + i));
  }
});

async function select(choices) {
  let selectIdx = 0;
  choices.forEach((c, i) => {
    if (i === selectIdx) {
      stdout.write('[x] ' + c + '\n');
    } else {
      stdout.write('[ ] ' + c + '\n');
    }
  })
  move.right();
  move.up(choices.length);
  while (true) {
    const char = await getChar();
    if (char.charCodeAt() === 13) {
      move.down(choices.length - selectIdx);
      break;
    }
    
    if (char === 'w' && selectIdx > 0) {
      stdout.write(' ')
      move.left()
      selectIdx -= 1
      move.up()
      stdout.write('x')
      move.left()
    }

    if (char === 's' && selectIdx < choices.length - 1) {
      stdout.write(' ')
      move.left()
      selectIdx += 1
      move.down()
      stdout.write('x')
      move.left()
    }
  }
  return choices[selectIdx];
}

void async function () {
  stdout.write('Which framework do you want to use?\n');
  const answer = await select(['vue', 'react', 'ng']);
  stdout.write('You selected ' + answer + '!\n');
  process.exit();
}()