var should= require('chai').should(),
    assert= require('chai').assert,
    clone=  require('../index.js');

var cir= function ()
{
    var a= { nome: 'Andrea' },
        e= { nome: 'Elena' };

    a.figlia= e;
    a.figlia2= e;
    e.papa= a;

    return [a,3,[e,a]];
};

describe('clone',function ()
{
       it('exits a circular structure', function (done)
       {
          process.nextTick(function ()
          {
              clone(cir());
              done();
          });
       });

       it('should clone nodes', function (done)
       {
          var orig= cir(), _clone= clone(orig);

          _clone.should.not.equal(orig);
          _clone[0].should.not.equal(orig[0]);
          _clone[0].figlia.should.not.equal(orig[0].figlia);
          _clone[2].should.not.equal(orig[2]);
          done();
       });

       it('should leave scalars equal', function (done)
       {
          var orig= cir(), _clone= clone(orig);

          _clone[1].should.equal(orig[1]);
          _clone[0].nome.should.equal(orig[0].nome);
          _clone[0].figlia.nome.should.equal(orig[0].figlia.nome);
          done();
       });

       it('should replicate the same structure', function (done)
       {
          var orig= cir(), _clone= clone(orig);

          _clone.length.should.equal(orig.length);
          _clone[2].length.should.equal(orig[2].length);
          _clone[0].should.equal(_clone[2][1]);
          _clone[2][0].should.equal(_clone[0].figlia);
          _clone[2][0].should.equal(_clone[0].figlia2);
          _clone[2][0].papa.should.equal(_clone[0]);
          done();
       });

       it('should remove keys when the filter function returns undefined', function (done)
       {
          var orig= cir(), _clone= clone(orig,function (key,value,clone,node,origValue,known) { return key=='figlia2' ? undefined : value; });

          should.not.exist(_clone[0].figlia2);

          _clone[1].should.equal(orig[1]);
          _clone[0].nome.should.equal(orig[0].nome);
          _clone[0].figlia.nome.should.equal(orig[0].figlia.nome);
          _clone.length.should.equal(orig.length);
          _clone[2].length.should.equal(orig[2].length);
          _clone[0].should.equal(_clone[2][1]);
          _clone[2][0].should.equal(_clone[0].figlia);
          _clone[2][0].papa.should.equal(_clone[0]);
          done();
       });
});
