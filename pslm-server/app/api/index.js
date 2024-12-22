/**
 * Created by lysy on 2024/12/22.
 */

const router = require('koa-router')();
const koaBody = require('koa-body');
//router.prefix('/api');

/**
 * kg
 * **/
const uploadKG = require('../controller/fileManagement/uploadKG');
router.post('/file/uploadKG',uploadKG);
const download = require('../controller/fileManagement/download');
router.get('/file/download',download);
const getImg = require('../controller/fileManagement/getImg');
router.get('/file/getImg',getImg);
/**
 * neo4j
 * **/
const init = require('../controller/neo4j/init');
router.post('/kg/init',init);
const initPatent = require('../controller/kg/initPatent');
router.post('/kg/initPatent',initPatent);
const initSupplier = require('../controller/kg/initSupplier');
router.post('/kg/initSupplier',initSupplier);
const initProduct = require('../controller/kg/initProduct');
router.post('/kg/initProduct',initProduct);

const getAllLabel = require('../controller/neo4j/getAllLabel');
router.post('/kg/getAllLabel',getAllLabel);
const getSchema = require('../controller/neo4j/getSchema');
router.post('/kg/getSchema',getSchema);

const queryKgInterface = require('../controller/neo4j/queryKgInterface');
router.post('/kg/queryKgInterface',queryKgInterface);
const querySingleResource = require('../controller/neo4j/querySingleResource');
router.post('/kg/querySingleResource',querySingleResource);
const queryLabelCount = require('../controller/neo4j/queryLabelCount');
router.post('/kg/queryLabelCount',queryLabelCount);
const queryCount = require('../controller/neo4j/queryCount');
router.post('/kg/queryCount',queryCount);
const queryKgPropInterface = require('../controller/neo4j/queryKgPropInterface');
router.post('/kg/queryKgPropInterface',queryKgPropInterface);
const queryEntity = require('../controller/neo4j/queryEntity');
router.post('/kg/queryEntity',queryEntity);
const queryTail = require('../controller/neo4j/queryTail');
router.post('/kg/queryTail',queryTail);
const queryChild = require('../controller/neo4j/queryChild');
router.post('/kg/queryChild',queryChild);
const queryPathLength = require('../controller/neo4j/queryPathLength');
router.post('/kg/queryPathLength',queryPathLength);
const queryRelationship = require('../controller/neo4j/queryRelationship');
router.post('/kg/queryRelationship',queryRelationship);
const querySingleLabel = require('../controller/neo4j/querySingleLabel');
router.post('/kg/querySingleLabel',querySingleLabel);
const createTriple = require('../controller/neo4j/createTriple');
router.post('/kg/createTriple',createTriple);
const deleteEntity = require('../controller/neo4j/deleteEntity');
router.post('/kg/deleteEntity',deleteEntity);
const deleteDB = require('../controller/neo4j/deleteDB');
router.post('/kg/deleteDB',deleteDB);
const deleteRelationship = require('../controller/neo4j/deleteRelationship');
router.post('/kg/deleteRelationship',deleteRelationship);
const setEntity = require('../controller/neo4j/setEntity');
router.post('/kg/setEntity',setEntity);
const setRelationship = require('../controller/neo4j/setRelationship');
router.post('/kg/setRelationship',setRelationship);
const removeProperty = require('../controller/neo4j/removeProperty');
router.post('/kg/removeProperty',removeProperty);
const assertion = require('../controller/neo4j/assertion');
router.post('/kg/assertion',assertion);
const mergeRelationship = require('../controller/neo4j/mergeRelationship');
router.post('/kg/mergeRelationship',mergeRelationship);
const shortestPath = require('../controller/neo4j/shortestPath');
router.post('/kg/shortestPath',shortestPath);
const nodeClick = require('../controller/neo4j/nodeClick');
router.post('/kg/nodeClick',nodeClick);

const nodeSurrounding = require('../controller/neo4j/nodeSurrounding');
router.post('/kg/nodeSurrounding',nodeSurrounding);
const mergeOnEntity = require('../controller/neo4j/mergeOnEntity');
router.post('/kg/mergeOnEntity',mergeOnEntity);
const mergeRelationshipBatchRel = require('../controller/neo4j/mergeRelationshipBatchRel');
router.post('/kg/mergeRelationshipBatchRel',mergeRelationshipBatchRel);
const loadcsvMergeOnEntity = require('../controller/neo4j/loadcsvMergeOnEntity');
router.post('/kg/loadcsvMergeOnEntity',loadcsvMergeOnEntity);
const loadcsvMergeRelationshipBatchRel = require('../controller/neo4j/loadcsvMergeRelationshipBatchRel');
router.post('/kg/loadcsvMergeRelationshipBatchRel',loadcsvMergeRelationshipBatchRel);

/**
 * kg
 * **/
const patent = require('../controller/kg/patent');
router.post('/kg/patent', patent);

const dataDesign = require('../controller/kg/dataDesign');
router.post('/kg/dataDesign', dataDesign);

const productPart = require('../controller/kg/productPart');
router.post('/kg/productPart', productPart);

const supplierPart = require('../controller/kg/supplierPart');
router.post('/kg/supplierPart', supplierPart);

/**
 * kg sc resource
 * **/

const device2kg = require('../controller/kg/device2kg');
router.post('/kg/device2kg', device2kg);
const wfPatent2kg = require('../controller/kg/wfPatent2kg');
router.post('/kg/wfPatent2kg', wfPatent2kg);
const wfPaper2kg = require('../controller/kg/wfPaper2kg');
router.post('/kg/wfPaper2kg', wfPaper2kg);
const wfMeeting2kg = require('../controller/kg/wfMeeting2kg');
router.post('/kg/wfMeeting2kg', wfMeeting2kg);
const wfStandard2kg = require('../controller/kg/wfStandard2kg');
router.post('/kg/wfStandard2kg', wfStandard2kg);
const wfRef2kg = require('../controller/kg/wfRef2kg');
router.post('/kg/wfRef2kg', wfRef2kg);
const wfScholar2kg = require('../controller/kg/wfScholar2kg');
router.post('/kg/wfScholar2kg', wfScholar2kg);

const nbHignTech2kg = require('../controller/kg/nbHignTech2kg');
router.post('/kg/nbHignTech2kg', nbHignTech2kg);
const nbExpert2kg = require('../controller/kg/nbExpert2kg');
router.post('/kg/nbExpert2kg', nbExpert2kg);
const nbAgency2kg = require('../controller/kg/nbAgency2kg');
router.post('/kg/nbAgency2kg', nbAgency2kg);
const nbPatent2kg = require('../controller/kg/nbPatent2kg');
router.post('/kg/nbPatent2kg', nbPatent2kg);

const zsglExpert2kg = require('../controller/kg/zsglExpert2kg');
router.post('/kg/zsglExpert2kg', zsglExpert2kg);

const wfKjResource2kg = require('../controller/kg/wfKjResource2kg');
router.post('/kg/wfKjResource2kg', wfKjResource2kg);

const wfKjComment2kg = require('../controller/kg/wfKjComment2kg');
router.post('/kg/wfKjComment2kg', wfKjComment2kg);

// kg 模块化

// const mainStructureGen = require('../controller/kg/mainStructureGen');
// router.post('/kg/mainStructureGen', mainStructureGen);

const mainstructureEnd2End = require('../controller/kg/mainstructureEnd2End');
router.post('/kg/mainstructureEnd2End', mainstructureEnd2End);

const mainstructure = require('../controller/kg/mainstructure');
router.post('/kg/mainstructure', mainstructure);

const sunburstModel = require('../controller/kg/sunburstModel');
router.post('/kg/sunburstModel', sunburstModel);

// const processSimStep1 = require('../controller/kg/processSimStep1');
// router.post('/kg/processSimStep1', processSimStep1);

// const processSimStep2 = require('../controller/kg/processSimStep2');
// router.post('/kg/processSimStep2', processSimStep2);

// const productionSchedule = require('../controller/kg/productionSchedule');
// router.post('/kg/productionSchedule', productionSchedule);

// const XTOproportion = require('../controller/kg/XTOproportion');
// router.post('/kg/XTOproportion', XTOproportion);

// const XTOforecast = require('../controller/kg/XTOforecast');
// router.post('/kg/XTOforecast', XTOforecast);

// const producePriority = require('../controller/kg/producePriority');
// router.post('/kg/producePriority', producePriority);

// const independenceEval = require('../controller/kg/independenceEval');
// router.post('/kg/independenceEval', independenceEval);

// const AHP = require('../controller/kg/AHP');
// router.post('/kg/AHP', AHP);

// const partition = require('../controller/kg/partition');
// router.post('/kg/partition', partition);

// const rulePreProcess = require('../controller/kg/rulePreProcess');
// router.post('/kg/rulePreProcess', rulePreProcess);

const productConfigurationGraph = require('../controller/kg/productConfigurationGraph');
router.post('/kg/productConfigurationGraph', productConfigurationGraph);

const productConfigurationList = require('../controller/kg/productConfigurationList');
router.post('/kg/productConfigurationList', productConfigurationList);

const productConfigurationTree = require('../controller/kg/productConfigurationTree');
router.post('/kg/productConfigurationTree', productConfigurationTree);

const productConfigurationRule = require('../controller/kg/productConfigurationRule');
router.post('/kg/productConfigurationRule', productConfigurationRule);

const productConfigurationRuleGraph = require('../controller/kg/productConfigurationRuleGraph');
router.post('/kg/productConfigurationRuleGraph', productConfigurationRuleGraph);

const productConfigurationRuleQuery = require('../controller/kg/productConfigurationRuleQuery');
router.post('/kg/productConfigurationRuleQuery', productConfigurationRuleQuery);

const productConfigurationRuleReasoning = require('../controller/kg/productConfigurationRuleReasoning');
router.post('/kg/productConfigurationRuleReasoning', productConfigurationRuleReasoning);

const productConfigurationRuleCompletion = require('../controller/kg/productConfigurationRuleCompletion');
router.post('/kg/productConfigurationRuleCompletion', productConfigurationRuleCompletion);

const loadcsvMergeAll = require('../controller/neo4j/loadcsvMergeAll');
router.post('/kg/loadcsvMergeAll',loadcsvMergeAll);

const loadcsvMergeDeProRule = require('../controller/neo4j/loadcsvMergeDeProRule');
router.post('/kg/loadcsvMergeDeProRule',loadcsvMergeDeProRule);

const loadcsvMergeDeParRule = require('../controller/neo4j/loadcsvMergeDeParRule');
router.post('/kg/loadcsvMergeDeParRule',loadcsvMergeDeParRule);

const productConfigurationRuleGenList = require('../controller/kg/productConfigurationRuleGenList');
router.post('/kg/productConfigurationRuleGenList', productConfigurationRuleGenList);

const productConfigurationRuleGenGraph = require('../controller/kg/productConfigurationRuleGenGraph');
router.post('/kg/productConfigurationRuleGenGraph', productConfigurationRuleGenGraph);

/**
 * Integration
 * **/
 const PLMIntegration = require('../controller/kg/PLMIntegration');
 router.post('/kg/PLMIntegration', PLMIntegration);

/**
 * nlp
 * **/
const words = require('../controller/nlp/words');
router.post('/nlp/words', words);

const nerTags = require('../controller/nlp/nerTags');
router.post('/nlp/nerTags', nerTags);

const PTB = require('../controller/nlp/PTB');
router.post('/nlp/PTB', PTB);

const graphEmbeddingNode2Vec = require('../controller/nlp/graphEmbeddingNode2Vec');
router.post('/nlp/graphEmbeddingNode2Vec', graphEmbeddingNode2Vec);

/**
 * ownthink
 * **/
const kgExtraction = require('../controller/nlp/kgExtraction');
router.post('/nlp/kgExtraction', kgExtraction);

const keywordExtraction = require('../controller/nlp/keywordExtraction');
router.post('/nlp/keywordExtraction', keywordExtraction);

const summarizeExtraction = require('../controller/nlp/summarizeExtraction');
router.post('/nlp/summarizeExtraction', summarizeExtraction);

const sentimentExtraction = require('../controller/nlp/sentimentExtraction');
router.post('/nlp/sentimentExtraction', sentimentExtraction);

const textCluster = require('../controller/nlp/textCluster');
router.post('/nlp/textCluster', textCluster);

const nluExtraction = require('../controller/nlp/nluExtraction');
router.post('/nlp/nluExtraction', nluExtraction);

const cutExtraction = require('../controller/nlp/cutExtraction');
router.post('/nlp/cutExtraction', cutExtraction);

const nerExtraction = require('../controller/nlp/nerExtraction');
router.post('/nlp/nerExtraction', nerExtraction);

const posExtraction = require('../controller/nlp/posExtraction');
router.post('/nlp/posExtraction', posExtraction);

module.exports = router;
