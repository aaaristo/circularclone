var traverse   = require('circularjs');

module.exports= function clone(orig,skipDelete)
{
    var _clone, known= [], nodes= [], keyss= [];

    if (typeof orig=='object')
    {
        // structure
        traverse(orig,
        function (node,keys)
        {
           var x= known[node.__visited]= Array.isArray(node) ? [] : {};
           nodes.push(node);
           keyss.push(keys);
        },true);

        // values
        nodes.forEach(function (node,idx)
        {
           var o= known[node.__visited], keys= keyss[idx];

           if (!_clone) _clone= o;

           if (keys)
             keys.forEach(function (key)
             {
                var val= node[key];

                if (val&&typeof val=='object')
                  o[key]= known[val.__visited];
                else
                  o[key]= val;
             });
           else
             node.forEach(function (val,key)
             {
                if (val&&typeof val=='object')
                  o[key]= known[val.__visited];
                else
                  o[key]= val;
             });
        });

        if (!skipDelete)
          nodes.forEach(function (node) { delete node.__visited; });
    }
    else
        _clone= orig;

    return _clone;
};
