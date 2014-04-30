var traverse   = require('circularjs');

module.exports= function clone(orig,filter,stopper,skipDelete)
{
    var _clone, known= [], nodes= [], keyss= [];

    if (traverse.isNode(orig))
    {
        var fn= function (node,keys)
        {
           var x= known[node.__visited]= Array.isArray(node) ? [] : {};

           nodes.push(node);
           keyss.push(keys);
        };

        if (stopper)
          fn= (function (fn)
               {
                 return function (node,keys)
                 {
                     fn(node,keys);
                     return stopper(node);
                 };
               })(fn);

        // structure
        traverse(orig,fn,true);

        // values
        nodes.forEach(function (node,idx)
        {
           var o= known[node.__visited], keys= keyss[idx],
               copy= filter ? 
                       function (val,key)
                       {
                          var _val;

                          if (val&&traverse.isNode(val))
                            _val= known[val.__visited];
                          else
                            _val= val;

                          _val= filter(key,_val,o,node,val);

                          if (_val!==undefined)
                            o[key]= _val;
                       } :
                       function (val,key)
                       {
                          if (val&&traverse.isNode(val))
                            o[key]= known[val.__visited];
                          else
                            o[key]= val;
                       };

           if (!_clone) _clone= o;

           if (keys)
             keys.forEach(function (key)
             {
                var val= node[key];
                copy(val,key); 
             });
           else
             node.forEach(copy);
        });

        if (!skipDelete)
          nodes.forEach(function (node) { delete node.__visited; });
    }
    else
        _clone= orig;

    return _clone;
};
