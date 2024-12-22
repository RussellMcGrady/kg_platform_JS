const corenlp = require('corenlp');
const CoreNLP = corenlp.default;
// import CoreNLP, { Properties, Pipeline, ConnectorServer } from 'corenlp';

// stanford nlp
const connector_en = new corenlp.ConnectorServer({ dsn: 'http://localhost:9000' });
const props_en = new corenlp.Properties({
  annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
});
const pipeline_en = new corenlp.Pipeline(props_en, 'English', connector_en);

const connector_zh = new corenlp.ConnectorServer({ dsn: 'http://localhost:9001' });
const props_zh = new corenlp.Properties({
  annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
});
const pipeline_zh = new corenlp.Pipeline(props_zh, 'Chinese', connector_zh);

// var sent_en = new CoreNLP.simple.Sentence(
//     'Marie was born in Paris.'
//   )
// var sent_zh = new CoreNLP.simple.Sentence(
//     '玛丽出生在巴黎.'
//   )
    
  // constituency parse tree representation
//   var tree_en = CoreNLP.util.Tree.fromSentence(sent_en)
//   var tree_zh = CoreNLP.util.Tree.fromSentence(sent_zh)

var nlp = {}
nlp.annotate = async function (lan, sent) {
  var target_sent = new CoreNLP.simple.Sentence(sent)
  // performs the call to corenlp (in this case via http)
  if (lan === 'en' || lan === 'english' || lan === 'English' || lan === '英语' || lan === '英文') {
    var result = await pipeline_en.annotate(target_sent)
  } else if (lan === 'zh' || lan === 'chinese' || lan === 'Chinese' || lan === '中文') {
    var result = await pipeline_zh.annotate(target_sent)
  }
  
  return result
}

module.exports = nlp
  // performs the call to corenlp (in this case via http)
//   pipeline_zh.annotate(sent_zh)
//     .then(sent => {
//       console.log(sent.words());
//       console.log(sent.nerTags());
//     })
//     .catch(err => {
//       console.log('err', err);
//     })
  
  // // constituency parse string representation
  // console.log('parse', sent.parse());
  
  // // traverse the tree leaves and print some props
  // tree.visitLeaves(node =>
  //   console.log(node.word(), node.pos(), node.token().ner()));
    
  // // dump the tree for debugging
  // console.log(JSON.stringify(tree.dump(), null, 2));