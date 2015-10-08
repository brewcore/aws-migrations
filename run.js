//var PropertiesReader = require('properties-reader');
var fs = require('fs');
var shell = require('shelljs');
var Mustache = require('mustache');
var jsonfile = require('jsonfile');

var state = readFile('state.json');

if (undefined === process.argv[2] || ('up' !== process.argv[2] && 'down' !== process.argv[2])) {
  console.error('You must specify either \'up\' or \'down\' as an argument.');
  process.exit(1);
}

//var count = fs.readdirSync('migrations').length;
var count = 5;
var data = {};

loadData(count);

if ('up' === process.argv[2]) {
  for (var i = state.migration + 1; i <= count; i++) {
    console.log('migrate'+i);
    migrateUp(i, data);
    state.migration = i;
    jsonfile.writeFileSync('state.json', state);
  }
} else if ('down' === process.argv[2]) {
  for (var i = state.migration; i > 0; i--) {
    console.log('migrate'+i);
    migrateDown(i);
    state.migration = i-1;
    jsonfile.writeFileSync('state.json', state);
  }
}

function loadData(count) {
  for (var i = 1; i <= count; i++) {
    try {
      fs.accessSync('output/migration'+i+'.json');
      var output = readFile('output/migration'+i+'.json');
      data['migration'+i] = JSON.parse(output);
    } catch (err) {
      continue;
    }
  }
}

function migrateUp(counter) {
  var migration = readFile('migrations/'+counter+'.json');
  var command = Mustache.render(migration.up, data);
  var output = shell.exec(command).output;
  if (output) {
    data['migration'+counter] = JSON.parse(output);
    jsonfile.writeFileSync('output/migration'+counter+'.json', output);
  }
}

function migrateDown(counter) {
  var migration = readFile('migrations/'+counter+'.json');
  if (migration.down){
    var command = Mustache.render(migration.down, data);
    shell.exec(command);
  }
}

function readFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/*function runMigration(migration, previousOutput) {
  if ('up' === process.argv[2]) {
    var command;
    if (previousOutput) {
      command = Mustache.render(migration.up, JSON.parse(previousOutput));
      console.log(command);
    } else {
      command = migration.up;
    }
    return shell.exec(command).output;
  } else if ('down' === process.argv[2]) {
    if (migration.down){
      shell.exec(migration.down);
    }
    return null;
  }
}*/
