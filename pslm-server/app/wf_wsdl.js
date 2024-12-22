var soap =  require('soap');
var url = 'http://interface.sciinfo.cn/search.svc?wsdl';
var args = {
    userName: 'zhejiangdaxue',
    password: 'zhejiangdaxue2018',
    indexName: 'wf_mds_chn_zhuanli',
    queryString: '电动汽车',
    sortField: '',
    fields: '',
    pageNumber: 0,
    pagePerNo: 2,
    facets: '',
    fm: '[@JSON|@XML]'
};
// var esresult = "";
soap.createClient(url, function(err, client) {
  client.EsSearch(args, function(err, result) {
      console.log(err);
  });
});
// console.log(esresult)
// _EsXmlResult = _XmlStyle.esSearch(esresult, esindexname, fmtname, pagePerNo, pageNumber);
// Console.WriteLine(_EsXmlResult);