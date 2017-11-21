"strict"

var gql = require('graphql-tag');

module.exports = function easy(strings) {
  var args = new Array(arguments.length-1);
  for (var i = 1; i < arguments.length; i++) {
    args[i-1] = arguments[i];
  }

  var formattedString = strings.map(function(str, i) {
    if (args[i]) {
      if (str.endsWith('...') && isValidFragment(args[i])) {
        return str + args[i].definitions[0].name.value;
      }
      console.log(args);
      throw new Error('Invalid query format. It should be `{ ...${fragmentVariable} }`');
    }
    return str;
  }).join('');

  var res = gql([formattedString]);
  res.definitions = args.reduce(function(res, i){return res.concat(i.definitions)}, res.definitions);
  return res;
}

function isValidFragment(fragment) {
  return fragment.kind === 'Document'
    && fragment.definitions
    && fragment.definitions.length > 0
    && fragment.definitions[0].kind === 'FragmentDefinition';
}
