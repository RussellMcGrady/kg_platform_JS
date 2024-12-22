<template>
  <div id="app">
    <div style="padding:20px 60px;display: flex;flex-direction: row;">
      <el-container>
        <el-header width="200px" style="line-height:60px;font-weight:600;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;">
          <span>配置设计</span>
          <el-radio-group v-model="searchRadio" style="height:36px;line-height: 36px;margin-left: 40px;padding: 4px;">
            <el-radio label="product">
              基于案例配置
            </el-radio>
            <el-radio label="mainStructure">
              基于主结构配置
            </el-radio>
          </el-radio-group>
        </el-header>
        <el-container>
          <el-main style="padding:0 20px 20px 20px;">
            <el-card shadow="never">
              <el-row style="margin-left: 60px; margin-top: 10px; margin-bottom: 10px">
                <span style="font-weight:600;font-size:20px;font-family: Avenir, Helvetica, Arial, sans-serif;">面向{{ searchRadioTitle(searchRadio) }}的配置</span>
              </el-row>
              <el-row v-show="searchRadio==='mainStructure' || searchRadio==='product'" style="margin-left: 60px; margin-top: 20px; margin-bottom: 20px">
                <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="auto" class="demo-dynamic">
                  <el-form-item
                    label="配置目标类型"
                    size="large"
                    prop="label"
                  >
                    <!-- <el-input v-model="dynamicValidateForm.value" placeholder="产品主特性。可选项，可以不填写。" prefix-icon="el-icon-search" class="input-with-select"> -->
                    <el-autocomplete
                      v-model="dynamicValidateForm.label"
                      :fetch-suggestions="querySearchLabelAsync"
                      placeholder="请选择配置目标"
                      class="select-of-input"
                    />
                    <!-- </el-input> -->
                  </el-form-item>
                  <el-form-item
                    v-for="(domain, index) in dynamicValidateForm.domains"
                    :key="domain.key"
                    :label="'需求 ' + (index+1)"
                    :prop="'domains.' + index + '.value'"
                    :rules="{
                      required: true, message: '特性不能为空，且至少配置一种特性。', trigger: 'blur'
                    }"
                    size="large"
                  >
                    <el-col :span="20">
                      <el-input v-model="domain.value" :placeholder="domain.name" prefix-icon="el-icon-search" class="input-with-select">
                        <el-autocomplete
                          slot="prepend"
                          v-model="domain.attr"
                          :fetch-suggestions="querySearchAttrAsync"
                          placeholder="请输入内容"
                          class="select-of-input"
                          @select="((item)=>selectItem(index, item))"
                        />
                      </el-input>
                    </el-col>
                    <el-col :span="3" style="margin-left: 10px">
                      <el-button v-show="index>0" type="danger" plain @click.prevent="removeDomain(domain)">
                        删除
                      </el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="warning" plain icon="el-icon-search" @click="submitForm('dynamicValidateForm')">
                      查询
                    </el-button>
                    <!-- <el-button type="primary" plain @click="addDomain">新增特性</el-button> -->
                    <el-button type="success" plain @click="resetForm('dynamicValidateForm')">
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-row>
              <!-- 配置列表 -->
              <el-dialog :visible.sync="dialogTableVisible" :title="listTitle" width="90%">
                <!-- 案例备选件 -->
                <el-dialog
                  :visible.sync="transferVisible"
                  width="80%"
                  title="个性化配置裸机"
                  append-to-body
                >
                  <el-col :span="18">
                    <el-pagination
                      :pager-count="9"
                      :total="countTransfer"
                      :page-size="10"
                      background
                      layout="prev, pager, next"
                      @current-change="current_changeTransferPage"
                    />
                  </el-col>
                  <el-col :span="6">
                    <el-button size="small" type="primary" plain @click="toggleSelection('true')">
                      加入备选
                    </el-button>
                    <el-button size="small" type="warning" plain @click="toggleSelection('false')">
                      取消选择
                    </el-button>
                  </el-col>
                  <el-table
                    ref="multipleTableInner"
                    v-loading="listLoadingTrans"
                    :data="transferList"
                    :row_style="{height: '40px'}"
                    :cell-style="{height: '40px'}"
                    :default-sort="{prop: 'score', order: 'ascending'}"
                    stripe
                    tooltip-effect="dark"
                    content="Top center"
                    placement="top"
                    max-height="1200"
                    element-loading-text="Loading"
                    border
                    height="500"
                    highlight-current-row
                    @selection-change="handleSelectionChangeInner"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                    />
                    <el-table-column align="center" type="index" label="序号" width="95" />
                    <el-table-column label="编码" align="center" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="searchRadio==='product'" label="类别" align="center" prop="labels" width="120">
                      <template slot-scope="scope">
                        <span>{{ getProductLabel(scope.row.labels) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="名称" show-overflow-tooltip align="center" prop="title" width="450">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['name'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="相似性" align="center" prop="score" width="80" sortable>
                      <template slot-scope="scope">
                        <span>{{ scope.row['linkScore'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="来源" align="left" prop="source" width="50">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['来源'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="序号" align="center" prop="characteristic" width="80">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['序号'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" align="center" prop="characteristic" width="80">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['数量'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="产品线" show-overflow-tooltip align="left" prop="characteristic" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['产品线'] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-dialog>
                <!-- 主结构变型设计 -->
                <el-dialog
                  :visible.sync="masterTransferVisible"
                  width="80%"
                  title="主结构变型设计"
                  append-to-body
                >
                  <el-col :span="18">
                    <el-pagination
                      :pager-count="9"
                      :total="masterCountTransfer"
                      :page-size="10"
                      background
                      layout="prev, pager, next"
                      @current-change="current_changeMatserTransferPage"
                    />
                  </el-col>
                  <el-col :span="6">
                    <el-button size="small" type="primary" plain @click="toggleSelectionMaster('true')">
                      选择
                    </el-button>
                    <el-button size="small" type="warning" plain @click="toggleSelectionMaster('false')">
                      取消
                    </el-button>
                  </el-col>
                  <el-table
                    ref="multipleTableInnerMaster"
                    v-loading="listLoadingMasterTrans"
                    :data="masterTransferList"
                    :row_style="{height: '40px'}"
                    :cell-style="{height: '40px'}"
                    :default-sort="{prop: 'labels', order: 'ascending'}"
                    stripe
                    tooltip-effect="dark"
                    content="Top center"
                    placement="top"
                    max-height="1200"
                    element-loading-text="Loading"
                    border
                    height="500"
                    highlight-current-row
                    @selection-change="handleSelectionChangeInnerMaster"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                    />
                    <el-table-column align="center" type="index" label="序号" width="95" />
                    <el-table-column label="编码" align="center" width="150">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="类别" align="center" prop="labels" width="120">
                      <template slot-scope="scope">
                        <span>{{ getProductLabel(scope.row.labels) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="名称" show-overflow-tooltip align="center" prop="title" width="450">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['name'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="来源" align="left" prop="source" width="50">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['来源'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="序号" align="center" prop="characteristic" width="80">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['序号'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" align="center" prop="characteristic" width="80">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['数量'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="产品线" show-overflow-tooltip align="left" prop="characteristic" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['产品线'] }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="生命周期状态" show-overflow-tooltip align="left" prop="characteristic" width="150">
                      <template slot-scope="scope">
                        <span>{{ scope.row.properties['生命周期状态'] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-dialog>
                <!-- 主结构不支持分页 -->
                <!-- <el-col :span="16">
                  <el-pagination
                    :pager-count="9"
                    :total="countTable"
                    :page-size.sync="pageSizeDialog"
                    :page-sizes="[10, 20, 100, 1000]"
                    background
                    layout="sizes, prev, pager, next"
                    @current-change="current_changeDialogPage"
                    @size-change="size_changeDialogPage"/>
                </el-col> -->
                <!-- 默认选择数量最大的必选模块 -->
                <!-- <el-col :span="5">
                  <el-select v-show="searchRadio==='mainStructure'" v-model="selectionVal" clearable placeholder="请选择默认选项~" @change="selectOptionChange">
                    <el-option
                      v-for="item in selectOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"/>
                  </el-select>
                </el-col> -->
                <el-dialog
                  :visible.sync="addModuleVis"
                  width="60%"
                  title="主结构变型设计"
                  append-to-body
                >
                  <el-autocomplete
                    v-model="labelProp"
                    :fetch-suggestions="querySearchLabelAsync"
                    placeholder="事物类型"
                  />
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" plain @click="onSubmitInterface()">
                      查询
                    </el-button>
                    <el-button type="warning" size="small" plain @click="createModuleVis=true">
                      新增
                    </el-button>
                  </div>
                </el-dialog>
                <el-dialog
                  :visible.sync="createModuleVis"
                  width="60%"
                  title="主结构变型设计"
                  append-to-body
                >
                  <el-form :model="createModuleForm">
                    <el-form-item :label-width="formLabelWidth" label="类别">
                      <el-input v-model="createModuleForm.label" style="width: 60%" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="编码">
                      <el-input v-model="createModuleForm.name" style="width: 50%" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="名称">
                      <el-input v-model="createModuleForm['name']" style="width: 80%" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="来源">
                      <el-input v-model="createModuleForm['来源']" style="width: 40%" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="序号">
                      <el-input v-model="createModuleForm['序号']" style="width: 50%" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="数量">
                      <el-input v-model="createModuleForm['数量']" style="width: 40%" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="产品线">
                      <el-input v-model="createModuleForm['产品线']" style="width: 80%" />
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleMergeModule">
                      确定
                    </el-button>
                    <el-button @click="createModuleVis = false">
                      取消
                    </el-button>
                  </div>
                </el-dialog>
                <el-row type="flex" style="margin-top: 0px;" justify="end">
                  <el-button-group>
                    <el-button size="medium" type="warning" plain @click="addModuleVis=true">
                      增材
                    </el-button>
                    <el-button size="medium" type="success" plain @click="saveConfig2Exel">
                      保存BOM
                    </el-button>
                  </el-button-group>
                </el-row>
                <!-- 产品、主结构配置 :load="loadTreeLazy default-expand-all"-->
                <el-table
                  v-if="showTable"
                  id="srpgtable"
                  ref="multipleTable"
                  v-loading="listLoading"
                  :data="configList"
                  :row_style="{height: '40px'}"
                  :cell-style="{height: '40px'}"
                  :default-sort="{prop: 'labels', order: 'ascending'}"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  row-key="id"
                  lazy
                  stripe
                  tooltip-effect="dark"
                  content="Top center"
                  placement="top"
                  max-height="1200"
                  element-loading-text="Loading"
                  border
                  height="500"
                  highlight-current-row
                  default-expand-all
                  @row-dblclick="dblclickRow"
                  @selection-change="handleSelectionChange"
                  @select="handleSelectionChangeRow"
                  @select-all="selectAll"
                >
                  <el-table-column align="center" type="index" label="序号" width="80" />
                  <el-table-column v-if="searchRadio==='product'" label="类别" align="left" prop="labels" width="250">
                    <template slot-scope="scope">
                      <span>{{ getProductLabel(scope.row.labels) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="searchRadio==='mainStructure'"
                    :selectable="checkbox"
                    :reserve-selection="true"
                    align="center"
                    type="selection"
                    width="55"
                    fixed="left"
                  />
                  <el-table-column
                    v-if="searchRadio==='mainStructure'"
                    :filters="[{ text: '基本', value: '基本' }, { text: '必选', value: '必选' }, { text: '可选', value: '可选' }]"
                    :filter-method="filterTag"
                    label="类别"
                    align="left"
                    width="350"
                    prop="tag"
                    filter-placement="bottom-end"
                  >
                    <template slot-scope="scope">
                      <el-tag
                        :type="tagRecog(scope.row, true)"
                        disable-transitions
                      >
                        {{ tagRecog(scope.row, false) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="层级" align="center" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.layer }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="编码" align="center" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称" show-overflow-tooltip align="center" prop="title" width="450">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties['name'] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="来源" align="left" prop="source" width="50">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties['来源'] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="序号" align="center" prop="characteristic" width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties['序号'] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" align="center" prop="characteristic" width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties['数量'] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="产品线" show-overflow-tooltip align="left" prop="characteristic" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties['产品线'] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="searchRadio==='product'" label="备选件" show-overflow-tooltip align="center" prop="transfers" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.properties.transfers }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="searchRadio==='product'"
                    center
                    width="80"
                  >
                    <template slot="header">
                      配置
                    </template>
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="configDetial(scope.$index, scope.row)"
                      >
                        配置
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <!-- 配置规则 -->
              <!-- <el-dialog :visible.sync="dialogFormVisible" title="功能模块配置规则" width="80%">
                <el-form :model="formConfigRule">
                  <el-form-item :label-width="formLabelWidth" label="模块一">
                    <el-select v-model="formConfigRule.region1.label" placeholder="请选择" @change="ruleLabelOptionChange">
                      <el-option
                        v-for="item in ruleOptionLabel"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"/>
                    </el-select>
                    <el-select v-model="formConfigRule.region1.value" placeholder="请选择" @change="ruleOptionChange">
                      <el-option
                        v-for="item in ruleOption"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth" label="模块二">
                    <el-select v-model="formConfigRule.region2.value" placeholder="请选择">
                      <el-option
                        v-for="item in ruleResOption"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"/>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-row type="flex" style="margin-top: 40px; margin-bottom: 10px;" justify="end">
                  <el-button :loading="ruleloading" type="primary" icon="el-icon-search" circle size="medium" plain @click="configRuleText"/>
                  <el-button type="warning" icon="el-icon-share" circle size="medium" plain @click="configRuleVis"/>
                  <el-button type="success" size="medium" plain @click="ruleConfigToggleSelection">加入配置</el-button>
                </el-row>
                <el-dialog
                  :visible.sync="ruleshow"
                  title="配置规则："
                  width="60%"
                  append-to-body>
                  <el-card v-loading="ruleloading" v-for="(rule, index) in rules" :key="index" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <el-row type="flex" style="font-weight:500;font-size:25px;font-family: Avenir, Helvetica, Arial, sans-serif;" justify="center">
                      <span class="spanShow">IF {{ rule.Q }} THEN {{ rule.A }}</span>
                    </el-row>
                  </el-card>
                </el-dialog>
                <el-row>
                  <el-card v-loading="loading" v-show="ruleGraphDis" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div id="neo4jd3IdRule" class style="height: 600px;">暂无数据~</div>
                  </el-card>
                </el-row>
              </el-dialog> -->

              <!-- 图和树展示 -->
              <el-row>
                <el-card v-show="graphDis && (searchRadio==='mainStructure' || searchRadio==='product')" v-loading="loading" shadow="hover" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                  <el-radio-group v-model="showRadio" style="height:36px;line-height: 36px;margin-left: 40px;padding: 4px;">
                    <el-radio label="graph">
                      配置图谱
                    </el-radio>
                    <el-radio label="tree">
                      配置树
                    </el-radio>
                    <!-- <el-popover
                      v-if="searchRadio==='product'"
                      placement="right"
                      width="500"
                      trigger="click">
                      <el-table
                        v-loading="ProRelistLoading"
                        id="ProRetable"
                        ref="ProductRecommendationTable"
                        :data="demandProductRecommendation"
                        :default-sort = "{prop: 'synthesis', order: 'descending'}"
                        :row_style="{height: '40px'}"
                        :cell-style="{height: '40px'}"
                        stripe
                        tooltip-effect="dark"
                        content="Top center"
                        placement="top"
                        max-height="450"
                        element-loading-text="Loading"
                        border
                        height="300"
                        highlight-current-row>
                        <el-table-column width="180" property="product" label="名称">
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              icon="el-icon-search"
                              type="warning"
                              plain
                              @click="productRecommendationDetail(scope.$index, scope.row)">{{ scope.row.product }}
                            </el-button>
                          </template>
                        </el-table-column>
                        <el-table-column width="90" property="cost" label="成本" sortable/>
                        <el-table-column width="90" property="ddate" label="交货期" sortable/>
                        <el-table-column width="90" property="synthesis" label="综合" sortable/>
                      </el-table>
                      <el-button slot="reference" icon="el-icon-search" type="warning" size="mini" plain>产品推优</el-button>
                    </el-popover> -->
                    <el-popover
                      v-if="rulePropVis===true"
                      placement="right"
                      width="600"
                      trigger="click"
                    >
                      <el-table
                        id="ruleVistable"
                        ref="ruleVisTable"
                        v-loading="ruleVisLoading"
                        :data="ruleVis"
                        :row_style="{height: '40px'}"
                        :cell-style="{height: '40px'}"
                        stripe
                        tooltip-effect="dark"
                        content="Top center"
                        placement="top"
                        max-height="450"
                        element-loading-text="Loading"
                        height="300"
                        highlight-current-row
                      >
                        <el-table-column width="100" property="if" label="If" />
                        <el-table-column width="200" property="ifContent" label="需求特性" />
                        <el-table-column width="100" property="then" label="Then" />
                        <el-table-column width="200" property="thenContent" label="规则模块" />
                      </el-table>
                      <el-button slot="reference" icon="el-icon-chat-line-square" type="success" size="mini" plain>
                        规则详情
                      </el-button>
                    </el-popover>
                  </el-radio-group>
                  <div v-show="showRadio==='graph'" id="neo4jd3Id" class style="height: 600px;">
                    暂无数据~
                  </div>
                  <!-- <pre v-show="showRadio==='graph'" style="color: orangered; margin-left: 200px">{{ loadRecommendFactor() }}</pre> -->
                  <div v-show="showRadio==='tree'" id="echartTree" style="height: 1200px;" @contextmenu.prevent="">
                    请输入需求特性进行配置~
                  </div>
                </el-card>
              </el-row>
              <!-- 用于保存主结构 -->
              <el-table
                v-show="false"
                id="saveTable"
                :data="transferSelection"
              >
                <!-- <el-table-column align="center" type="index" label="序号" width="80" /> -->
                <el-table-column label="层级" align="center" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.layer }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="searchRadio==='mainStructure'"
                  :filters="[{ text: '基本', value: '基本' }, { text: '必选', value: '必选' }, { text: '可选', value: '可选' }]"
                  :filter-method="filterTag"
                  label="类别"
                  align="center"
                  width="180"
                  prop="tag"
                  filter-placement="bottom-end"
                >
                  <template slot-scope="scope">
                    <el-tag
                      :type="tagRecog(scope.row, true)"
                      disable-transitions
                    >
                      {{ tagRecog(scope.row, false) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="编码" align="center" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="名称" show-overflow-tooltip align="center" prop="title" width="450">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties['name'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="来源" align="left" prop="source" width="50">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties['来源'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="序号" align="center" prop="characteristic" width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties['序号'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="数量" align="center" prop="characteristic" width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties['数量'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="产品线" show-overflow-tooltip align="left" prop="characteristic" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.properties['产品线'] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { knowledgeService, result2echartTree, getProductLabel, getMainStrLabel } from '@/api/resource/knowledge'

// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import * as d3 from 'd3' // secondary package based on el-pagination
import * as Neo4jd3 from '@/utils/neo4jd3.js?v=0.0.1'
import * as echarts from 'echarts'

// 引入导出Excel表格依赖
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'App',
  // components: {
  //   Pagination

  // },
  props: {
    currentCategory: {
      type: String,
      default: () => 'all'
    }
  },
  data() {
    return {
      // detailData: this.$route.query.detail,
      // 选择bug
      checkedKeys: false,
      // 初始化table bug
      showTable: false,
      graphDis: true,
      ruleGraphDis: false,
      ruleGraphVis: false,
      loading: false,
      ruleloading: false,
      processloading: false,
      listLoading: false,
      listLoadingTrans: false,
      listLoadingMasterTrans: false,
      ProRelistLoading: false,
      searchRadio: 'product',
      processRadio: 'priority',
      showRadio: 'graph',
      listParams: {},
      params: {},
      tree: {},
      // 动态表单
      dynamicValidateForm: {
        domains: [{
          value: '',
          attr: '',
          name: '',
          key: Math.random()
        }],
        value: '',
        label: '电推剪'
      },
      // 动态select器
      configAttr: [],
      configLabel: [],
      timeout: null,

      // tabel 弹窗
      dialogTableVisible: false,
      dialogFormVisible: false,
      addModuleVis: false,
      createModuleVis: false,
      createModuleForm: {
        name: '',
        label: '',
        名称: '',
        来源: '',
        序号: '',
        数量: 1,
        产品线: ''
      },
      labelProp: '',
      countTable: 0,
      countTransfer: 0,
      masterCountTransfer: 0,
      configList: [],
      pageNumberDialog: 1,
      pageSizeDialog: 100,
      pageNumberTransfer: 1,
      pageNumberMasterTransfer: 1,
      labelClick: '',
      listTitle: '',
      clickId: 0,
      tableListTmp: [],

      transferVisible: false,
      masterTransferVisible: false,
      transferList: [],
      masterTransferList: [],
      // configData: [],
      // configResult: [],
      // leftCheck: [],
      // rightCheck: [],
      transferSelectionInner: [],
      masterTransferSelectionInner: [],
      transferSelection: [],
      transferIndex: 0,
      transferRow: {},

      selectOption: [
        {
          value: '数量',
          label: '数量'
        },
        {
          value: '使用率',
          label: '使用率',
          disabled: true
        }
      ],
      selectionVal: '',

      configRuleRow: {},
      ruleOptionLabel: [
        {
          key: Math.random(),
          label: '必选镜头',
          value: '必选镜头',
          disabled: false
        },
        {
          key: Math.random(),
          label: '必选制成板',
          value: '必选制成板',
          disabled: false
        }
      ],
      ruleOption: [],
      ruleResOption: [],

      ruleGenSel: '',
      formConfigRule: {
        region1: {
          label: '',
          value: ''
        },
        region2: {
          label: '',
          value: ''
        }
      },
      formLabelWidth: '120px',
      // 规则上传
      De2ParFileData: [], // 文件上传数据（多文件合一）
      De2ParFileList: [],
      De2ProFileData: [], // 文件上传数据（多文件合一）
      De2ProFileList: [],
      // BOMFileData: [], // 文件上传数据（多文件合一）
      // BOMFileList: [],
      RuleFileData: [], // 文件上传数据（多文件合一）
      RuleFileList: [],
      // 工艺智能推优上传
      priorityFileData: [], // 文件上传数据（多文件合一）
      priorityFileList: [],
      coProductionFileListFileData: [], // 文件上传数据（多文件合一）
      coProductionFileListFileList: [],
      lineSwitchingFileData: [], // 文件上传数据（多文件合一）
      lineSwitchingFileList: [],
      priorityTabel: [
        {
          name: '02350007/A0003-2',
          order: 1
        },
        {
          name: '02350004/A0003-1 ',
          order: 2
        },
        {
          name: '02350018/A0005',
          order: 3
        },
        {
          name: '02350008/A0001',
          order: 5
        },
        {
          name: '02350003/A0004',
          order: 6
        },
        {
          name: '02350009/A0002',
          order: 7
        }
      ],

      ruleshow: false,
      processshow: false,
      rulesGeneration: [],
      rules: [],
      productRecommendation: this.loadRecommendFactor(),

      // 面向用户的产品推优
      demandProductRecommendation: [],
      treeTrunkNode: '',
      treeTrunkTmp: '',
      treeLoad: {},

      // 规则详情
      rulePair: [],
      rulePropVis: false,
      ruleVisLoading: false,
      ruleVis: [],
      ruleVisConfig: []
    }
  },
  watch: {
    searchRadio() {
      switch (this.searchRadio) {
        case 'product': { this.dynamicValidateForm.label = '电推剪'; this.rulePropVis = false; break }
        case 'mainStructure': { this.dynamicValidateForm.label = '主结构'; this.rulePropVis = false; break }
        case 'rule': { break }
        default: { this.dynamicValidateForm.label = '电推剪'; break }
      }
    },
    processRadio() {
      switch (this.processRadio) {
        case 'priority': { this.processshow = false; break }
        case 'coProduction': { this.processshow = false; break }
        default: { this.processshow = false; break }
      }
    },
    dialogTableVisible() {
      if (!this.dialogTableVisible) {
        this.tableListTmp = []
        this.refreshTable()
      }
    }
  },
  mounted() {
    console.log('mainSearch > category', this.category)
    this.init()
    this.configLabel = this.loadAllLabel()
    this.ruleQuery()
    // this.configAttr = this.loadAttr()
  },
  methods: {
    /**
     * 监听子组件检索词变化，重新检索
     * */
    refreshTable() {
      this.showTable = false
      this.$nextTick(() => {
        this.showTable = true
      })
    },
    ruleQuery() {
      const _this = this
      const H = {
        label: '需求',
        name: '',
        skip: 0,
        limit: 100
      }

      const params = {
        H: JSON.stringify(H),
        type: 'list'
      }
      knowledgeService.productConfigurationRuleQuery(params).then(res => {
        var data = res.data.data
        console.log('initRule:', data)
        // 配置结果
        _this.configAttr = []
        var valueMerge = []
        data.nodes.forEach(rule => {
          if (valueMerge.indexOf(rule[0].properties.name) === -1) {
            var ruleObj = {}
            // { 'value': '音频接口', 'label': 'm', 'targetLabel': '音视频与控制信号电缆', 'name': '音视频' }
            ruleObj.value = rule[0].properties.name
            valueMerge.push(ruleObj.value)
            ruleObj.label = rule[1].type
            ruleObj.targetLabel = rule[2].properties.name
            ruleObj.name = rule[0].properties.ref
            _this.configAttr.push(ruleObj)
          } else {
            _this.configAttr.forEach(attr => {
              if (attr.value === rule[0].properties.name) {
                // label 转列表
                if (typeof (attr.label) === 'object') {
                  attr.label.push(rule[1].type)
                } else {
                  var tmpLabel = attr.label
                  attr.label = [tmpLabel]
                  attr.label.push(rule[1].type)
                }

                // targetLabel 转列表
                if (typeof (attr.targetLabel) === 'object') {
                  attr.targetLabel.push(rule[2].properties.name)
                } else {
                  var tmpTargetLabel = attr.targetLabel
                  attr.targetLabel = [tmpTargetLabel]
                  attr.targetLabel.push(rule[2].properties.name)
                }
              }
            })
          }
        })
        console.log('_this.configAttr::', _this.configAttr)
        _this.ruleVisConfig = []
        // 保存规则，用于主结构配置时的message box 弹框
        _this.configAttr.forEach(rulePair => {
          if (typeof (rulePair.targetLabel) === 'object') {
            for (var i = 0; i < rulePair.targetLabel.length; i++) {
              for (var j = i + 1; j < rulePair.targetLabel.length; j++) {
                var rule = {
                  if: 'If',
                  ifContent: rulePair.targetLabel[i],
                  then: 'Then',
                  thenContent: rulePair.targetLabel[j]
                }
                if (_this.ruleVisConfig.length === 0) {
                  _this.ruleVisConfig.push(rule)
                } else {
                  _this.ruleVisConfig.forEach(item => {
                    // eslint-disable-next-line no-undef
                    if (!_.isEqual(item, rule)) {
                      _this.ruleVisConfig.push(rule)
                    }
                  })
                }
              }
            }
          }
        })
        console.log('_this.ruleVisConfig::', _this.ruleVisConfig)
      }, err => {
        console.error('需求查询失败：', err)
        _this.loading = false
        _this.$notify({
          message: '需求查询失败~',
          type: 'error',
          duration: 10000
        })
      })
    },
    productConfig() {
      // 配置图谱
      const _this = this
      _this.rulePropVis = true

      // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
      // BOM三层层次结构
      if (_this.dynamicValidateForm.label !== '') {
        _this.loading = true
        _this.listParams = {
          reqObj: {},
          label: _this.dynamicValidateForm.label
        }
        var data = _this.listParams
        _this.dynamicValidateForm.domains.forEach(domain => {
          _this.configAttr.forEach(item => {
            if (domain.attr === item.value) {
            // 模糊匹配
              // var matchStr = _this.getMaxStr(domain.value, item.name)
              var matchStr = domain.value
              // 目标模块标签
              // data.targetLabel = item.targetLabel

              // 判断需求-模块规则是否唯一，否则要遍历规则数组
              if (typeof (item.targetLabel) === 'string') {
                if (item.targetLabel === '镜头' && matchStr.includes('~')) {
                  matchStr = matchStr.replace('~', '-')
                } else if (item.targetLabel === '机芯模组' && matchStr.includes('-')) {
                  matchStr = matchStr.replace('-', '~')
                }
                if (!data.reqObj[Number(item.label)]) {
                  data.reqObj[Number(item.label)] = []
                }
                // 特性为名称被写死，需要优化
                data.reqObj[Number(item.label)].push({
                  名称: matchStr,
                  label: item.targetLabel
                })
              } else {
                for (var i in item.targetLabel) {
                  if (item.targetLabel === '镜头' && matchStr.includes('~')) {
                    matchStr = matchStr.replace('~', '-')
                  } else if (item.targetLabel === '机芯模组' && matchStr.includes('-')) {
                    matchStr = matchStr.replace('-', '~')
                  }
                  if (Number(item.label[i]) > 1) {
                    if (!data.reqObj[Number(item.label[i])]) {
                      data.reqObj[Number(item.label[i])] = []
                    }
                    data.reqObj[Number(item.label[i])].push({
                      名称: matchStr,
                      label: item.targetLabel[i]
                    })
                  } else {
                    if (!data.reqObj[Number(item.label[i])]) {
                      data.reqObj[Number(item.label[i])] = []
                    }
                    data.reqObj[Number(item.label[i])].push({
                      名称: matchStr,
                      label: _this.dynamicValidateForm.label
                    })
                  }
                }
              }
            }
          })
        })
        // 产品主特性
        // if (_this.dynamicValidateForm.value !== '') {
        //   _this.configAttr.forEach(item => {
        //     // 模糊匹配
        //     console.log(item.name)
        //     // var matchStr = _this.getMaxStr(_this.dynamicValidateForm.value, item.name)
        //     // data.h.push(matchStr)
        //   })
        // }
        data.label = _this.dynamicValidateForm.label
        _this.params = JSON.parse(JSON.stringify(data))
        if (_this.showRadio === 'graph') {
          var params1 = {
            data: JSON.stringify(data)
          }
          console.log('图谱请求参数：', params1)
          knowledgeService.productConfigurationGraph(params1).then(res => {
            const data = res.data.data
            console.log('patent > onSubmit > 检索结果', data)
            for (var n in data.nodes) {
              data.nodes[n].id = data.nodes[n].identity.low
            }
            for (var r in data.relationships) {
              data.relationships[r].id = data.relationships[r].identity.low
            }

            // 高亮点击的节点
            var highlight =
          [{
            class: this.dynamicValidateForm.label
          }]
          // 图谱需求submit
            window.neo4jd3.resetNeoData(data, highlight)

            // 满足需求特性的智能推优
            _this.demandProductRecommendation = []
            data.nodes.forEach(node => {
              _this.productRecommendation.forEach(product => {
              // 去重
                var index = _this.demandProductRecommendation.findIndex((item) => {
                  if (product.product === item.product) {
                    return true
                  } else {
                    return false
                  }
                })
                if (node.properties.name === product.product && index) {
                  _this.demandProductRecommendation.push(product)
                }
              })
            })

            _this.loading = false
            if (data.nodes.length === 0) {
              _this.$notify({
                message: '无匹配结果，请适当的删减或修改需求特性~',
                type: 'error',
                duration: 6000
              })
            } else {
              _this.$notify({
                message: '请单击图中高亮阴影节点查看配置详情~',
                type: 'success',
                duration: 6000
              })
            }
          }, err => {
            console.error('请求失败：', err)
            _this.loading = false
            _this.$notify({
              message: '请求失败~',
              type: 'error',
              duration: 2000
            })
          })
        } else if (_this.showRadio === 'tree') {
          _this.echartTree()
        }
      } else {
        _this.$notify({
          message: '请输入需要配置目标类型',
          type: 'warning',
          duration: 6000
        })
      }
    },
    onSubmit3() {
      const _this = this
      var data = JSON.parse(JSON.stringify(_this.listParams))
      // console.log('------------__________>dynamicValidateForm', _this.dynamicValidateForm)
      if (_this.labelClick === _this.dynamicValidateForm.label || typeof (_this.clickId) === 'string') {
        data.label = _this.dynamicValidateForm.label
        data['clickId'] = _this.clickId
        data['skip'] = (Number(_this.pageNumberDialog - 1)) * _this.pageSizeDialog
        data['limit'] = _this.pageSizeDialog
        var params1 = {
          data: JSON.stringify(data)
        }
        console.log('图谱请求参数：', params1)
        knowledgeService.productConfigurationList(params1).then(res => {
          const data = res.data.data
          console.log('res > 检索结果', res)
          if (data.nodes.length > 0) {
            _this.dialogTableVisible = true
            _this.refreshTable()
            _this.$nextTick(() => {
              _this.listLoading = true
              _this.countTable = res.data.count
              _this.configList = data.nodes[0].children
              _this.defaultSelection('数量')
              _this.listLoading = false
              _this.loading = false
            })
          } else {
            _this.loading = false
            _this.$notify({
              message: '无更多模块，请保存',
              type: 'error',
              duration: 6000
            })
          }
        }, err => {
          console.error('请求失败：', err)
          // _this.listLoading = false
          _this.$notify({
            message: '请求失败~',
            type: 'error',
            duration: 2000
          })
        })
      } else {
        _this.loading = false
        _this.$notify({
          message: '图谱请单击高亮节点！树图请右键单击裸机产品！',
          type: 'error',
          duration: 2000
        })
      }
    },
    configDetial(index, row, fnInit = true) {
      const _this = this
      _this.listLoadingTrans = true
      _this.transferVisible = true
      if (fnInit) {
        _this.pageNumberTransfer = 1
      }
      _this.transferList = []
      console.log('获取备选件在tabel中的行', index, row)
      _this.transferIndex = index
      _this.transferRow = row
      var data = JSON.parse(JSON.stringify(_this.listParams))
      data.label = _this.dynamicValidateForm.label
      data['transferid'] = row.identity.low
      data['transferlabel'] = getProductLabel(row.labels)
      data['fnLink'] = true
      data['skip'] = (Number(this.pageNumberTransfer - 1)) * 10
      data['limit'] = 10
      var params1 = {
        data: JSON.stringify(data)
      }
      console.log('图谱请求参数：', params1)
      knowledgeService.productConfigurationList(params1).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        _this.countTransfer = res.data.count
        var checkName = []
        _this.configList.forEach(item => {
          checkName.push(item.properties.name)
        })
        data.nodes.forEach(item => {
          // console.log(checkName)
          // console.log(item.properties.name)
          if (!checkName.includes(item.properties.name)) {
            item.linkScore = item.linkScore.toFixed(3)
            _this.transferList.push(item)
          }
        })
        // _this.transferList = res.nodes
        console.log('transferList', _this.transferList)
        // _this.generateConfigData()
        _this.listLoadingTrans = false
      }, err => {
        console.error('请求失败：', err)
        _this.listLoadingTrans = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },

    // 树形懒加载
    loadTreeLazy(tree, treeNode, resolve) {
      setTimeout(() => {
        const _this = this
        const H = {
          label: this.tagRecog(tree, false).includes('专用') ? this.tagRecog(tree, false).slice(2) : this.tagRecog(tree, false),
          name: tree.properties.name,
          skip: 0,
          limit: 1000
        }
        const data = {
          H: JSON.stringify(H)
        }
        const params = {
          data: JSON.stringify(data)
        }
        console.log('图谱请求参数：', params)
        knowledgeService.queryChild(params).then(res => {
          const data = res.data.data
          console.log('res > 检索结果', res)
          if (data.nodes.length > 0) {
            // _this.dialogTableVisible = true
            // _this.listLoading = true
            for (var n in data.nodes) {
              data.nodes[n].id = data.nodes[n].identity.low
              // 树形懒加载
              data.nodes[n].hasChildren = true
            }
            for (var r in data.relationships) {
              data.relationships[r].id = data.relationships[r].identity.low
            }
            console.log('res > 检索结果', data)
            _this.configList.forEach(item => {
              if (item.properties.name === tree.properties.name) {
                item.children = data.nodes
              }
            })
            console.log('树懒加载后表数据：：', _this.configList)
            resolve(data.nodes)
          } else {
            _this.$notify({
              message: '无子节点！',
              type: 'error',
              duration: 6000
            })
            resolve(data.nodes)
          }
        }, err => {
          console.error('请求失败：', err)
          // _this.listLoading = false
          _this.$notify({
            message: '请求失败~',
            type: 'error',
            duration: 2000
          })
        })
      }, 1000)
    },
    echartTree() {
      const _this = this
      _this.params['skip'] = 0
      _this.params['limit'] = 100
      var params1 = {
        data: JSON.stringify(_this.params)
      }
      console.log('图谱请求参数：', params1)
      knowledgeService.productConfigurationTree(params1).then(res => {
        const data = res.data.data
        console.log('patent > onSubmit > 检索结果', data)
        if (data.nodes.length > 0) {
          for (var n in data.nodes) {
            data.nodes[n].id = data.nodes[n].identity.low
          }
          for (var r in data.relationships) {
            data.relationships[r].id = data.relationships[r].identity.low
          }

          result2echartTree(data, _this.searchRadio)
          _this.tree = JSON.parse(JSON.stringify(window.echartTree))
          var myChart = echarts.init(document.getElementById('echartTree'))
          // myChart.showLoading('default', { text: '统计中，请稍候...', maskColor: '#404a59', textColor: '#fff' })
          myChart.clear()
          myChart.hideLoading()
          setTimeout(() => {
            myChart.setOption(_this.option = {
              tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                position: 'top',
                formatter: function(params, ticket, callback) {
                  // console.log(params)
                  if (params.data.label === '电推剪' || params.data.label === '主结构') {
                    // if (_this.dynamicValidateForm.label === '主结构') {
                    //   _this.treeTrunkTmp = params.name
                    // } else {
                    //   _this.treeTrunkTmp = params.data.label
                    // }
                    _this.treeTrunkTmp = params.name
                    // console.log(_this.treeTrunkTmp)
                  }
                  return params.value
                }
              },
              toolbox: {
                show: true,
                feature: {
                  saveAsImage: {}
                }
              },
              series: [
                {
                  type: 'tree',

                  data: [window.echartTree],

                  top: '5%',
                  left: '7%',
                  bottom: '2%',
                  right: '6%',

                  symbolSize: 7,

                  // edgeShape: 'polyline',
                  // orient: 'vertical',
                  roam: true, // 鼠标
                  labelLayout: {
                    hideOverlap: true
                  },

                  label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right'
                  },

                  leaves: {
                    label: {
                      position: 'right',
                      verticalAlign: 'middle',
                      align: 'left'
                    }
                  },
                  emphasis: {
                    focus: 'ancestor'
                  },

                  itemStyle: {
                    color: 'lightsteelblue', // rgba(180, 0, 0, 1)
                    borderColor: '#c23531',
                    borderWidth: 1.5
                  },
                  lineStyle: {
                    color: 'rgba(135, 135, 135, 1)',
                    width: 1.5,
                    curveness: 0.5
                  },
                  animationEasing: 'linear',

                  expandAndCollapse: true,
                  animationDuration: 550,
                  animationDurationUpdate: 750
                }
              ]
            })
          }, 100)
          myChart.on('contextmenu', function(params) {
            _this.loading = true
            if (_this.dynamicValidateForm.label !== '') {
              console.log('dfasdf', params)
              _this.clickId = params.name
              _this.listTitle = params.data.label + ':' + params.name
              _this.onSubmit3()
            } else {
              _this.$notify({
                message: '请输入需要配置目标类型',
                type: 'warning',
                duration: 6000
              })
            }
          })
          setTimeout(() => {
            myChart.on('dblclick', function(params) {
              console.log('echart dblclick node::', params)
              _this.params = params
              _this.loading = true
              var data = {
                clickName: params.name,
                fnInit: false,
                skip: 0,
                limit: 100
              }
              var params1 = {
                data: JSON.stringify(data)
              }
              console.log('图谱请求参数dbclick：', params1)
              knowledgeService.productConfigurationTree(params1).then(res => {
                const data = res.data.data
                console.log('patent > onSubmit > 检索结果', data)
                for (var n in data.nodes) {
                  data.nodes[n].id = data.nodes[n].identity.low
                }
                for (var r in data.relationships) {
                  data.relationships[r].id = data.relationships[r].identity.low
                }
                if (data.nodes.length === 0) {
                  _this.$notify({
                    message: '到底了~',
                    type: 'warning',
                    duration: 2000
                  })
                } else {
                  // 判断双击节点层级
                  if (_this.params.data.label === '主结构' || _this.params.data.label === '电推剪') {
                    _this.treeTrunkNode = _this.treeTrunkTmp
                  }
                  result2echartTree(data, _this.searchRadio, _this.treeTrunkNode)
                  // 清空产品、主结构的叶子结点
                  _this.tree.children[0].children.forEach(node => {
                    if (node.name !== _this.treeTrunkNode) {
                      node.children = []
                    }
                  })
                  // 点击扩展树
                  var expandTree = _this.objRecurrent([_this.tree], _this.params.name)
                  console.log('expandTree::', expandTree)
                  _this.tree = JSON.parse(JSON.stringify(expandTree))
                  _this.echartReset()
                }
              })
              _this.loading = false
            }, err => {
              console.error('请求失败：', err)
              _this.loading = false
              _this.$notify({
                message: '请求失败~',
                type: 'error',
                duration: 2000
              })
            })
          }, 10)
          _this.loading = false
        } else {
          _this.loading = false
          _this.$notify({
            message: '无法找到相关产品，请适当修改或者删减产品特性~',
            type: 'error',
            duration: 6000
          })
        }
      }, err => {
        console.error('请求失败：', err)
        _this.loading = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    objRecurrent(tree, prop) {
      const _this = this
      // console.log('treetreetree', tree)
      for (var item of tree) {
        // console.log('itemitemitemitem', item)
        // console.log('propproppropprop', prop)
        if (item.name !== prop && item.children.length > 0) {
          _this.objRecurrent(item.children, prop)
        } else if (item.name === prop) {
          // window.echartTree.children.forEach(child => {
          //   item.children.push(child)
          // })
          item.children = []
          item.children = window.echartTree.children
        }
      }
      // _this.tree = tree[0]
      return tree[0]
    },
    echartReset() {
      const _this = this
      var myChart = echarts.init(document.getElementById('echartTree'))
      // myChart.showLoading()
      myChart.clear()
      myChart.hideLoading()
      setTimeout(() => {
        myChart.setOption(_this.option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            position: 'top',
            formatter: function(params, ticket, callback) {
              // console.log(params)
              if (params.data.label === '电推剪' || params.data.label === '主结构') {
                // if (_this.dynamicValidateForm.label === '主结构') {
                //   _this.treeTrunkTmp = params.name
                // } else {
                //   _this.treeTrunkTmp = params.data.label
                // }
                _this.treeTrunkTmp = params.name
                // console.log(_this.treeTrunkTmp)
              }
              return params.value
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {},
              dataView: {
                readOnly: false
              }
            }
          },
          series: [
            {
              type: 'tree',

              data: [_this.tree],

              top: '5%',
              left: '7%',
              bottom: '2%',
              right: '6%',

              symbolSize: 7,

              // edgeShape: 'polyline',
              // orient: 'vertical',
              roam: true, // 鼠标
              labelLayout: {
                hideOverlap: true
              }, // 隐藏覆盖
              initialTreeDepth: -1, // 展开

              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
                // width: 100,
                // overflow: 'truncate'
              },

              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              emphasis: {
                focus: 'ancestor'
              },

              itemStyle: {
                color: 'lightsteelblue',
                borderColor: '#c23531',
                borderWidth: 1.5
              },
              lineStyle: {
                color: 'rgba(135, 135, 135, 1)',
                width: 1.5,
                curveness: 0.5
              },
              animationEasing: 'linear',

              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        })
      }, 100)
    },
    current_changeDialogPage(currentPage) {
      this.pageNumberDialog = currentPage
      // this.pageNumberMap = currentPage - 1
      this.onSubmit3()
    },
    size_changeDialogPage(pageSize) {
      this.pageSizeDialog = pageSize
      // this.pageNumberMap = currentPage - 1
      this.onSubmit3()
    },
    current_changeTransferPage(currentPage) {
      this.pageNumberTransfer = currentPage
      this.configDetial(this.transferIndex, this.transferRow, false)
    },
    current_changeMatserTransferPage(currentPage) {
      this.pageNumberMasterTransfer = currentPage
      this.onSubmitInterface()
    },
    init() {
      const H = {
        label: '电推剪'
      }
      const params = {
        data: JSON.stringify(H)
      }
      const _this = this
      knowledgeService.getInit(params).then(res => {
        console.log('initdata:', res)
        var data = res.data.data
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        window.Neo4jd3 = Neo4jd3
        window.d3 = d3
        console.log('格式化data:', data)
        window.myData = data
        var timer = null
        // eslint-disable-next-line new-cap
        window.neo4jd3 = new Neo4jd3.default('#neo4jd3Id', {
          minCollision: 50,
          neo4jData: window.myData,
          nodeRadius: 25,
          // onNodeMouseEnter: function(node) {
          //   console.log('dianji：', node)
          // },
          onNodeDoubleClick: function(node) {
            console.log('dianji：', node)
            clearTimeout(timer)
            const params = {
              id: node.id
            }
            _this.node = node
            knowledgeService.nodeClick(params).then(res => {
              // 为双击事件准备数据格式
              var graph = res.data.data
              console.log('点击事件patent:', res)
              for (var n in graph.nodes) {
                graph.nodes[n].id = graph.nodes[n].identity.low
              }
              for (var r in graph.relationships) {
                graph.relationships[r].id = graph.relationships[r].identity.low
              }
              var data = {}
              data['graph'] = {}
              data['graph'] = graph

              // 高亮点击的节点
              var highlight =
                [{
                  class: getProductLabel(_this.node.labels),
                  property: 'name',
                  value: _this.node.properties.name
                }]
              // window.neo4jd3.resetNeoData(graph, highlight)
              // var data1 = window.neo4jd3.randomD3Data(_this.node, 5)
              // window.neo4jd3.updateWithD3Data(data1)
              window.neo4jd3.updateWithNeo4jData(data, highlight)
              // window.open(node.properties.url, '_blank');
            })
          },
          onNodeClick: function(node) {
            // console.log('dianji：', node)
            clearTimeout(timer)
            timer = setTimeout(function() {
              if (_this.dynamicValidateForm.label && _this.dynamicValidateForm.domains[0].value) {
                _this.loading = true
                _this.labelClick = getProductLabel(node.labels)
                _this.listTitle = getProductLabel(node.labels) + ':' + node.properties.name
                _this.clickId = node.id
                _this.onSubmit3()
                // _this.loading = false
              } else {
                _this.$message({
                  type: 'warning',
                  message: '请先输入配置特性~'
                })
              }
            }, 300)
            _this.loading = false
            // setTimeout(() => {
            //   _this.$confirm('是否查看相关配置资源详情?', '提示', {
            //     confirmButtonText: '查看',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            //   }).then(() => {
            //     _this.onSubmit3()
            //   }).catch(() => {
            //     _this.$message({
            //       type: 'info',
            //       message: '已取消'
            //     })
            //   })
            // }, 1000 * Math.random())
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ', relationship
            )
          },
          zoomFit: true
        })
      })
    },

    checkbox(row, index) {
      // console.log(row.labels[1])
      // console.log(index)
      var mainStr = this.listTitle.split(':')[1]
      var checkRes = 1
      row.labels.forEach(label => {
        if (label.includes(mainStr) && label.includes('基本')) {
          checkRes = 0
        }
      })
      return checkRes
    },
    filterTag(value, row) {
      // console.log(value, row)
      if (row.labels[1]) {
        return row.labels[1].includes(value)
      }
    },
    defaultSelection(val) {
      const _this = this
      _this.$nextTick(() => {
        _this.configList.forEach(item => {
          _this.$refs.multipleTable.toggleRowSelection(item, false)
          if (item.children !== undefined) {
            this.splite(item.children, false)
          }
        })
        console.log('_this.configList::', _this.configList)
        _this.spliteDefaultSelection(_this.configList, val)
      })
    },
    // 全选bug修复
    selectAll() {
      this.checkedKeys = !this.checkedKeys
      this.splite(this.configList, this.checkedKeys)
    },
    /**
     * 处理数据
     */
    splite(data, flag) {
      data.forEach((row) => {
        this.$refs.multipleTable.toggleRowSelection(row, flag)
        if (row.children !== undefined) {
          this.splite(row.children, flag)
        }
      })
    },
    spliteDefaultSelection(data, val) {
      // val 的推优功能未开发
      // 配置规则
      const _this = this
      // var cmpArr = []
      var mainStr = _this.listTitle.split(':')[1]
      var ruleFlag = true
      for (let i = 0; i < data.length; i++) {
        try {
          data[i].labels.forEach(label => {
            if (label.includes(mainStr) && label.includes('必选')) {
              if (!_this.tableListTmp.includes(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))) {
                // 需求-规则查询：labelTmp
                var labelTmp = []
                _this.configAttr.forEach(item => {
                  _this.dynamicValidateForm.domains.forEach(domain => {
                    if (item.value === domain.attr) {
                      if (item.value === '像素') {
                        // 默认加入像素-摄像机主机配置规则
                        labelTmp.push('摄像机主机')
                      }
                      if (typeof (item.targetLabel) === 'object') {
                        item.targetLabel.forEach(i => {
                          labelTmp.push(i)
                        })
                      } else {
                        labelTmp.push(item.targetLabel)
                      }
                    }
                  })
                })
                console.log('有规则的模块类别：：', labelTmp)
                // 第一个选中
                if (!data[i - 1]) {
                  // 模块是否有配置规则
                  if (labelTmp.includes(getProductLabel(data[i].labels))) {
                    // 是否满足需求-模块规则
                    if (data[i].properties['name'].includes(_this.dynamicValidateForm.domains[0].value)) {
                      _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                      if (data[i].children !== undefined) {
                        _this.splite(data[i].children, true)
                      }
                      _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                      ruleFlag = false
                    } else if (_this.dynamicValidateForm.domains[0].value.includes('MP')) {
                      // 写死了像素MP和00万，需要建立本体解决名称歧义问题
                      if (data[i].properties['name'].includes(_this.dynamicValidateForm.domains[0].value.slice(0, -2) + '00万')) {
                        _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                        if (data[i].children !== undefined) {
                          _this.splite(data[i].children, true)
                        }
                        _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                        ruleFlag = false
                      } else {
                        // 向下遍历
                        ruleFlag = true
                      }
                    } else {
                      // 向下遍历
                      ruleFlag = true
                    }
                  } else {
                    // 无配置规则
                    _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                    if (data[i].children !== undefined) {
                      _this.splite(data[i].children, true)
                    }
                    _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                    ruleFlag = false
                  }
                // 不同类的模块选配（符合需求的第一个）
                } else if (!data[i - 1].labels.includes(label)) {
                  // 第一个不同类的模块是否有配置规则
                  if (labelTmp.includes(getProductLabel(data[i].labels))) {
                    // 是否满足需求-模块规则
                    if (data[i].properties['name'].includes(_this.dynamicValidateForm.domains[0].value)) {
                      _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                      if (data[i].children !== undefined) {
                        _this.splite(data[i].children, true)
                      }
                      _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                      ruleFlag = false
                    } else if (_this.dynamicValidateForm.domains[0].value.includes('MP')) {
                      // 写死了像素MP和00万，需要建立本体解决名称歧义问题
                      if (data[i].properties['name'].includes(_this.dynamicValidateForm.domains[0].value.slice(0, -2) + '00万')) {
                        _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                        if (data[i].children !== undefined) {
                          _this.splite(data[i].children, true)
                        }
                        _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                        ruleFlag = false
                      } else {
                        // 功能特性关键词MP不满足，向下遍历
                        ruleFlag = true
                      }
                    } else {
                      // 需求特性不满足，向下遍历
                      ruleFlag = true
                    }
                  } else {
                    // 无配置规则
                    _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                    if (data[i].children !== undefined) {
                      _this.splite(data[i].children, true)
                    }
                    _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                    ruleFlag = false
                  }
                } else {
                  // 配置还未满足规则的相同模块
                  if (ruleFlag === true) {
                    // 模块是否有配置规则
                    if (labelTmp.includes(getProductLabel(data[i].labels))) {
                      // 是否满足需求-模块规则
                      if (data[i].properties['name'].includes(_this.dynamicValidateForm.domains[0].value)) {
                        _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                        if (data[i].children !== undefined) {
                          _this.splite(data[i].children, true)
                        }
                        _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                        ruleFlag = false
                      } else if (_this.dynamicValidateForm.domains[0].value.includes('MP')) {
                        // 写死了像素MP和00万，需要建立本体解决名称歧义问题
                        if (data[i].properties['name'].includes(_this.dynamicValidateForm.domains[0].value.slice(0, -2) + '00万')) {
                          _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                          if (data[i].children !== undefined) {
                            _this.splite(data[i].children, true)
                          }
                          _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                          ruleFlag = false
                        } else {
                          // 向下遍历
                          ruleFlag = true
                        }
                      } else {
                        // 向下遍历
                        ruleFlag = true
                      }
                    } else {
                      // 无配置规则
                      _this.$refs.multipleTable.toggleRowSelection(data[i], true)
                      if (data[i].children !== undefined) {
                        _this.splite(data[i].children, true)
                      }
                      _this.tableListTmp.push(getMainStrLabel(data[i].labels, _this.listTitle.split(':')[1]))
                      ruleFlag = false
                    }
                  }
                }
              }
            } else if (label.includes(mainStr) && label.includes('基本')) {
              _this.$refs.multipleTable.toggleRowSelection(data[i], true)
              if (data[i].children !== undefined) {
                _this.splite(data[i].children, true)
              }
            } else if (label.includes(mainStr) && label.includes('可选')) {
              _this.$refs.multipleTable.toggleRowSelection(data[i], false)
              if (data[i].children !== undefined) {
                _this.splite(data[i].children, false)
              }
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
    },

    selectOptionChange(val) {
      // console.log(val)
      this.defaultSelection(val)
    },
    tagRecog(val, color) {
      var mainStr = this.listTitle.split(':')[1]
      this.mainStrLabel = ''
      val.labels.forEach(label => {
        if (label === '主结构') {
          label = mainStr + '_基本主结构'
        }
        if (label.includes(mainStr)) {
          if (color) {
            this.mainStrLabel = label ? (label.includes('可选') ? 'warning' : (label.includes('必选') ? 'primary' : 'success')) : 'danger'
          } else {
            this.mainStrLabel = label
          }
        }
      })
      if (this.mainStrLabel !== '') {
        return this.mainStrLabel
      } else {
        this.mainStrLabel = getProductLabel(val.labels)
        if (color) {
          this.mainStrLabel = 'danger'
        } else {
          this.mainStrLabel = '专用' + this.mainStrLabel
        }
        return this.mainStrLabel
      }
    },
    dblclickRow(row, event, column) {
      console.log('val::', row)
      this.labelProp = getProductLabel(row.labels)
      this.onSubmitInterface()
    },
    onSubmitInterface() {
      const _this = this
      _this.masterTransferVisible = true
      _this.listLoadingMasterTrans = true
      _this.masterTransferList = []
      var H = {}
      H['label'] = _this.labelProp
      // H['name'] = _this.property
      H['skip'] = (Number(this.pageNumberMasterTransfer - 1)) * 10
      H['limit'] = 10
      var params1 = {
        data: JSON.stringify(H)
      }
      console.log('图谱请求参数：', params1)
      knowledgeService.queryKgInterface(params1).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        _this.masterCountTransfer = res.data.count // 有bug
        var checkName = []
        _this.configList.forEach(item => {
          checkName.push(item.properties.name)
        })
        data.nodes.forEach(item => {
          // console.log(checkName)
          // console.log(item.properties.name)
          if (!checkName.includes(item.properties.name)) {
            _this.masterTransferList.push(item)
          }
        })
        console.log('masterTransferList', _this.masterTransferList)
        // _this.tabelList = data.nodes
        _this.listLoadingMasterTrans = false
      }, err => {
        console.error('请求失败：', err)
        _this.listLoadingMasterTrans = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    handleMergeModule() {
      this.$confirm('确认添加？')
        .then(_ => {
          const _this = this
          const H = {
            label: _this.createModuleForm.label,
            name: _this.createModuleForm.name,
            名称: _this.createModuleForm['name'],
            来源: _this.createModuleForm['来源'],
            序号: _this.createModuleForm['序号'],
            数量: _this.createModuleForm['数量'],
            产品线: _this.createModuleForm['产品线']
          }
          const params = {
            0: JSON.stringify(H)
          }

          knowledgeService.mergeOnEntity(params).then(res => {
            // var data = res.data.data
            console.log('mergedata:', res)
            _this.$notify({
              message: '添加成功~',
              type: 'success',
              duration: 2000
            })
            this.createModuleVis = false
          // done()
          }, err => {
            console.error('请求失败：', err)
            _this.$notify({
              message: '请仔细检查模块属性！',
              type: 'error',
              duration: 2000
            })
          })
        })
        .catch(_ => {
          this.$notify({
            message: '请修改~',
            type: 'warning',
            duration: 2000
          })
        })
    },
    handleSelectionChangeInner(val) {
      this.transferSelectionInner = val
      console.log('this.transferSelectionInner', this.transferSelectionInner)
    },
    handleSelectionChangeInnerMaster(val) {
      this.masterTransferSelectionInner = val
      console.log('this.masterTransferSelectionInner', this.masterTransferSelectionInner)
    },
    handleSelectionChange(val) {
      this.transferSelection = val
      console.log('this.transferSelection', this.transferSelection)
    },
    handleSelectionChangeRow(val, row) {
      console.log('select row label:: ', getProductLabel(row.labels))
      var alertTxt = ''
      // 关联规则提示
      this.ruleVisConfig.forEach(item => {
        if (item.ifContent === getProductLabel(row.labels) || item.thenContent === getProductLabel(row.labels)) {
          alertTxt += 'If: ' + item.ifContent + ' Then:' + item.thenContent + '</br>'
        }
      })
      if (alertTxt !== '') {
        this.$alert(alertTxt, '关联规则提示：请调整下述模块！', { dangerouslyUseHTMLString: true }, {
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            this.$message({
              type: 'success',
              message: `关联规则: ${action}`
            })
          }
        })
      }
      // 勾选子节点
      var flag
      this.transferSelection.forEach(item => {
        if (item.properties.name === row.properties.name) {
          flag = true
        } else {
          flag = false
        }
      })
      if (row.children !== undefined) {
        // 选中子节点
        this.splite(row.children, !flag)
      }
    },
    toggleSelection(state) {
      const _this = this
      if (state === 'true') {
        _this.configList.forEach(item => {
          _this.toggleSelectionLoop(item)
        })
        _this.transferVisible = false
        // console.log(_this.configList)
      } else {
        _this.$refs.multipleTableInner.clearSelection()
      }
    },
    toggleSelectionLoop(item) {
      if (item.properties.name === this.transferRow.properties.name) {
        item.properties.transfers = ''
        this.transferSelectionInner.forEach(i => {
          item.properties.transfers += i.properties.name + '\n'
        })
        // item.properties.transfers = JSON.stringify(_this.transferSelectionInner)
      } else if (item.children) {
        item.children.forEach(itemChild => {
          this.toggleSelectionLoop(itemChild)
        })
      }
      return item
    },
    toggleSelectionMaster(state) {
      const _this = this
      if (state === 'true') {
        _this.configList = _this.configList.concat(_this.masterTransferSelectionInner)
        _this.masterTransferVisible = false
        _this.addModuleVis = false
        // _this.defaultSelection('数量')
      } else {
        _this.$refs.multipleTableInnerMaster.clearSelection()
      }
    },
    saveConfig2Exel() {
      // this.savepagesize = 1000// 表格长度变长
      // this.pageNumberDialog = 1
      // this.$nextTick(function() {
      this.listLoading = true
      var tableSave
      var wb
      if (this.searchRadio === 'mainStructure') {
        tableSave = document.querySelector('#saveTable')
        wb = XLSX.utils.table_to_book(tableSave)
      } else if (this.searchRadio === 'product') {
        tableSave = document.querySelector('#srpgtable')
        var fix = document.querySelector('.el-table__fixed')
        if (fix) {
          wb = XLSX.utils.table_to_book(tableSave.removeChild(fix))
          tableSave.appendChild(fix)
        } else {
          wb = XLSX.utils.table_to_book(tableSave)
        }
      }
      /* get binary string as output */
      const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        var saveName = this.listTitle + '.xlsx'
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), saveName)
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      // this.savepagesize = 10// 表格还原
      //   return wbout
      // })
    },
    searchRadioTitle() {
      switch (this.searchRadio) {
        case 'product': {
          return '案例'
        }
        case 'mainStructure': {
          return '主结构'
        }
        case 'rule': {
          return '配置规则'
        }
        case 'process': {
          return '工艺'
        }
        default: {
          return '配置规则'
        }
      }
    },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 5) {
    //     return {
    //       rowspan: 10,
    //       colspan: 1
    //     }
    //   }
    //   // if (columnIndex === 0) {
    //   //   return [1, 2]
    //   // } else if (columnIndex === 1) {
    //   //   return [0, 0]
    //   // }
    // },

    // 动态select
    loadAllLabel() {
      return [
        { 'value': '电推剪', 'label': 'h' }]
    },

    loadRecommendFactor() {
      return [
        { 'product': '02350003/A0004', 'cost': '0.9', 'ddate': '0.94', 'synthesis': '0.396', 'sum': '2.236' },
        { 'product': '02350004/A0003-1', 'cost': '0.8', 'ddate': '1', 'synthesis': '0.32', 'sum': '2.12' },
        { 'product': '02350007/A0003-2', 'cost': '0.6', 'ddate': '0.58', 'synthesis': '0.492', 'sum': '1.672' },
        { 'product': '02350008/A0001', 'cost': '0.8', 'ddate': '0.41', 'synthesis': '0.674', 'sum': '1.884' },
        { 'product': '02350009/A0002', 'cost': '0.7', 'ddate': '0.52', 'synthesis': '0.568', 'sum': '1.788' },
        { 'product': '02350018/A0005', 'cost': '0.6', 'ddate': '0.73', 'synthesis': '0.402', 'sum': '1.732' },
        { 'product': '02350006/A0004-1', 'cost': '0.7', 'ddate': '0.45', 'synthesis': '0.61', 'sum': '1.76' },
        { 'product': '02350015/B0003', 'cost': '0.5', 'ddate': '0.97', 'synthesis': '0.218', 'sum': '1.688' },
        { 'product': '02350005/A0003', 'cost': '0.6', 'ddate': '0.84', 'synthesis': '0.336', 'sum': '1.776' }]
    },
    querySearchLabelAsync(queryString, cb) {
      const _this = this
      knowledgeService.getAllLabel().then(res => {
        var data = res.data.data
        if (res.data.errcode === 20000) {
          this.configLabel = []
          data.forEach(label => {
            var labelObj = {}
            labelObj['value'] = label
            labelObj['label'] = label
            this.configLabel.push(labelObj)
          })
          console.log('返回的标签类型：：', this.configLabel)
          var configLabel = this.configLabel
          var results = queryString ? configLabel.filter(this.createStateFilter(queryString)) : configLabel

          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 500 * Math.random())
        } else {
          _this.$notify({
            message: '查询失败，请检查后台数据库',
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    querySearchAttrAsync(queryString, cb) {
      this.ruleQuery()

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        var configAttr = this.configAttr
        var results = queryString ? configAttr.filter(this.createStateFilter(queryString)) : configAttr

        cb(results)
      }, 600 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectClass(val) {
      console.log('所选产品类别', val)
    },
    selectItem(index, item) {
      // console.log(index)
      // console.log(item)
      const _this = this
      _this.ruleVis = []
      _this.dynamicValidateForm.domains[index].name = item.name
      _this.rulePair = item
      console.log('_this.rulePair::', _this.rulePair)
      // 规则可视化，分别考虑关联规则和单条规则
      if (typeof (_this.rulePair.targetLabel) === 'object') {
        _this.rulePair.targetLabel.forEach(item => {
          var rule = {
            if: 'If',
            ifContent: _this.rulePair.value,
            then: 'Then',
            thenContent: item
          }
          _this.ruleVis.push(rule)
        })
        for (var i = 0; i < _this.rulePair.targetLabel.length; i++) {
          for (var j = i + 1; j < _this.rulePair.targetLabel.length; j++) {
            var rule = {
              if: 'If',
              ifContent: _this.rulePair.targetLabel[i],
              then: 'Then',
              thenContent: _this.rulePair.targetLabel[j]
            }
            _this.ruleVis.push(rule)
          }
        }
      } else if (typeof (_this.rulePair.targetLabel) === 'string') {
        // eslint-disable-next-line no-redeclare
        var rule = {
          if: 'If',
          ifContent: _this.rulePair.value,
          then: 'Then',
          thenContent: _this.rulePair.targetLabel
        }
        _this.ruleVis.push(rule)
      }
    },
    // 自定义查询表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productConfig()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        attr: '',
        name: '',
        key: Math.random()
      })
    },

    // 配置规则form表
    configRule(index, row) {
      const _this = this
      _this.dialogFormVisible = true
      _this.configRuleRow = row
    },
    // ruleLabelOptionChange(val) {
    //   const _this = this
    //   const H = {
    //     label: _this.configRulegetProductLabel(row.labels),
    //     name: _this.configRuleRow.properties.name
    //   }
    //   const T = {
    //     label: _this.formConfigRule.region1.label,
    //     skip: 0,
    //     limit: 20
    //   }
    //   const data = {
    //     H: JSON.stringify(H),
    //     T: JSON.stringify(T)
    //   }
    //   const params = {
    //     data: JSON.stringify(data)
    //   }
    //   knowledgeService.queryTail(params).then(res => {
    //     const data = res.data.data
    //     console.log('res > 检索结果', res)
    //     for (var n in data.nodes) {
    //       data.nodes[n].id = data.nodes[n].identity.low
    //     }
    //     for (var r in data.relationships) {
    //       data.relationships[r].id =
    //         data.relationships[r].identity.low
    //     }
    //     _this.ruleOption = []
    //     _this.ruleResOption = []
    //     data.nodes.forEach(item => {
    //       _this.ruleOption.push({
    //         key: Math.random(),
    //         label: item.properties.name,
    //         value: item.properties.name,
    //         disabled: false
    //       })
    //     })
    //     // var count = res.data.count
    //   }, err => {
    //     console.error('请求失败：', err)
    //     _this.$notify({
    //       message: '请求失败~',
    //       type: 'error',
    //       duration: 2000
    //     })
    //   })
    // },
    // 配置规则获取结果
    ruleOptionChange(val) {
      const _this = this
      const Hres = {
        label: _this.configRuleRow.labels[1],
        name: _this.configRuleRow.properties.name
      }
      const Mres = {
        label: _this.formConfigRule.region1.label,
        name: _this.formConfigRule.region1.value
      }
      const Tres = {
        label: '必选功能模块'
      }
      const res = {
        label: _this.formConfigRule.region1.label === '必选镜头' ? '必选制成板' : '必选镜头',
        skip: 0,
        limit: 60
      }
      const datares = {
        H: JSON.stringify(Hres),
        M: JSON.stringify(Mres),
        T: JSON.stringify(Tres),
        res: JSON.stringify(res),
        type: 'option'
      }
      const params1 = {
        data: JSON.stringify(datares)
      }
      knowledgeService.productConfigurationRule(params1).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        // var count = res.data.count
        _this.ruleResOption = []
        data.nodes.forEach(item => {
          _this.formConfigRule.region2.label = (_this.formConfigRule.region1.label === '必选镜头' ? '必选制成板:' : '必选镜头:') + item.properties.name
          _this.ruleResOption.push({
            key: Math.random(),
            label: _this.formConfigRule.region2.label,
            value: item.properties.name,
            disabled: false
          })
        })
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    configRuleVis() {
      // const _this = this
      // _this.ruleGraphDis = true
      // const H = {
      //   label: '必选镜头',
      //   limit: 60
      // }
      // const M = {
      //   label: '必选功能模块',
      //   name: _this.configRuleRow.properties.name
      // }
      // const T = {
      //   label: '必选制成板'
      // }
      // const data = {
      //   H: JSON.stringify(H),
      //   M: JSON.stringify(M),
      //   T: JSON.stringify(T)
      // }
      // const params = {
      //   data: JSON.stringify(data)
      // }
      // knowledgeService.productConfigurationRuleGraph(params).then(res => {
      //   console.log('initdata:', res)
      //   var data = res.data.data
      //   for (var n in data.nodes) {
      //     data.nodes[n].id = data.nodes[n].identity.low
      //   }
      //   for (var r in data.relationships) {
      //     data.relationships[r].id =
      //       data.relationships[r].identity.low
      //   }
      const _this = this
      _this.ruleGraphDis = true
      const Hres = {
        label: _this.configRuleRow.labels[1],
        name: _this.configRuleRow.properties.name
      }
      const Mres = {
        label: _this.formConfigRule.region1.label,
        name: _this.formConfigRule.region1.value
      }
      const Tres = {
        label: '必选功能模块'
      }
      const res = {
        label: _this.formConfigRule.region1.label === '必选镜头' ? '必选制成板' : '必选镜头',
        skip: 0,
        limit: 60
      }
      const datares = {
        H: JSON.stringify(Hres),
        M: JSON.stringify(Mres),
        T: JSON.stringify(Tres),
        res: JSON.stringify(res),
        type: 'graph'
      }
      const params1 = {
        data: JSON.stringify(datares)
      }
      knowledgeService.productConfigurationRule(params1).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        // var count = res.data.count
        window.Neo4jd3Rule = Neo4jd3
        window.d3 = d3
        console.log('格式化data:', data)
        window.myDataRule = data
        var timer = null
        // eslint-disable-next-line new-cap
        window.neo4jd3Rule = new Neo4jd3.default('#neo4jd3IdRule', {
          minCollision: 50,
          neo4jData: window.myDataRule,
          nodeRadius: 25,
          onNodeDoubleClick: function(node) {
            console.log('dianji：', node)
            clearTimeout(timer)
            const params = {
              id: node.id
            }
            _this.node = node
            knowledgeService.nodeClick(params).then(res => {
              // 为双击事件准备数据格式
              var graph = res.data.data
              console.log('点击事件patent:', res)
              for (var n in graph.nodes) {
                graph.nodes[n].id = graph.nodes[n].identity.low
              }
              for (var r in graph.relationships) {
                graph.relationships[r].id = graph.relationships[r].identity.low
              }
              var data = {}
              data['graph'] = {}
              data['graph'] = graph

              // 高亮点击的节点
              var highlight =
                [{
                  class: getProductLabel(_this.node.labels),
                  property: 'name',
                  value: _this.node.properties.name
                }]
              window.neo4jd3Rule.updateWithNeo4jData(data, highlight)
            })
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ', relationship
            )
          },
          zoomFit: true
        })
      }, err => {
        console.error('请求失败：', err)
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    configRuleText() {
      const _this = this
      _this.ruleshow = true
      _this.ruleloading = true
      const Hres = {
        label: _this.configRuleRow.labels[1],
        name: _this.configRuleRow.properties.name
      }
      const Mres = {
        label: _this.formConfigRule.region1.label,
        name: _this.formConfigRule.region1.value
      }
      const Tres = {
        label: '必选功能模块'
      }
      const res = {
        label: _this.formConfigRule.region1.label === '必选镜头' ? '必选制成板' : '必选镜头',
        skip: 0,
        limit: 60
      }
      const datares = {
        H: JSON.stringify(Hres),
        M: JSON.stringify(Mres),
        T: JSON.stringify(Tres),
        res: JSON.stringify(res),
        type: 'rule'
      }
      const params1 = {
        data: JSON.stringify(datares)
      }
      knowledgeService.productConfigurationRule(params1).then(res => {
        const data = res.data.data
        console.log('res > 检索结果', res)
        _this.rules = []
        data.nodes.forEach(item => {
          var tmpRule = {}
          tmpRule.Q = getProductLabel(item[0].labels) + ':' + item[0].properties.name
          tmpRule.A = getProductLabel(item[1].labels) + ':' + item[1].properties.name
          _this.rules.push(tmpRule)
        })
        _this.ruleloading = false
      }, err => {
        console.error('请求失败：', err)
        _this.ruleloading = false
        _this.$notify({
          message: '请求失败~',
          type: 'error',
          duration: 2000
        })
      })
    },
    // // 加入配置规则的结果到主结构BOM
    // ruleConfigToggleSelection() {
    //   const _this = this
    //   _this.configList.forEach(item => {
    //     if (getProductLabel(item.labels) === _this.configRulegetProductLabel(row.labels)) {
    //       item.properties['name'] += ' => ' + _this.formConfigRule.region1.label + ':' + _this.formConfigRule.region1.value + '\n' + _this.formConfigRule.region2.label
    //     }
    //   })
    //   _this.dialogFormVisible = false
    // },
    ruleGeneration() {
      const _this = this
      _this.ruleloading = true
      _this.ruleGraphVis = false
      _this.ruleshow = true
      if (_this.De2ProFileData !== [] && _this.De2ParFileData !== []) {
        // 需求-产品 文件
        _this.De2ProFileData = new FormData()
        _this.$refs.uploadDe2Pro.submit()
        console.log('this.De2ProFileData:::', _this.De2ProFileData.get('files'))
        // 需求-模块 文件
        _this.De2ParFileData = new FormData()
        _this.$refs.uploadDe2Par.submit()
        console.log('this.De2ProFileData:::', _this.De2ParFileData.get('files'))

        // 需求导入图谱
        knowledgeService.fileUploading(_this.De2ProFileData).then(res => {
        // console.log('请求成功:', res)
          res.data.forEach(file => {
            // 需要手动配置后端的绝对路径
            var relPath = file
            console.log('load relPath', relPath)
            var param = {
              path: JSON.stringify(relPath)
            // label: JSON.stringify(file.split('.').slice(-2)[0])
            }
            // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
            knowledgeService.loadcsvMergeDeProRule(param).then(res => {
              const data = res.data.data
              console.log('patent > onSubmit > 检索结果', data)
              for (var n in data.nodes) {
                data.nodes[n].id = data.nodes[n].identity.low
              }
              for (var r in data.relationships) {
                data.relationships[r].id = data.relationships[r].identity.low
              }
              console.log('datadata', data)
              // 图谱需求submit
              // window.neo4jd3.resetWithNeo4jData(data)
              _this.$notify({
                message: '需求导入完成~',
                type: 'success',
                duration: 5000
              })

              // 需求图谱补全
              knowledgeService.fileUploading(_this.De2ParFileData).then(res => {
                // console.log('请求成功:', res)
                res.data.forEach(file => {
                  // 需要手动配置后端的绝对路径
                  var relPath = file
                  console.log('load relPath', relPath)
                  const H = {
                    label: '需求',
                    name: _this.ruleGenSel,
                    skip: 0,
                    limit: 60
                  }
                  const R = {
                    label: '配置规则'
                  }
                  var param = {
                    H: JSON.stringify(H),
                    R: JSON.stringify(R),
                    path: JSON.stringify(relPath)
                  }
                  // 解析查询的输入，转换为知识图谱查询的请求window.H。返回的neo4j数据为window.queryData
                  knowledgeService.loadcsvMergeDeParRule(param).then(res => {
                    const data = res.data.data
                    console.log('配置规则生成结果：', data)
                    // 配置结果展示
                    _this.rulesGeneration = []
                    data.nodes.forEach(item => {
                      var tmpRule = {}
                      tmpRule.Q = getProductLabel(item[0].labels) + ':' + item[0].properties.name
                      tmpRule.A = getProductLabel(item[1].labels) + ':' + item[1].properties.name
                      _this.rulesGeneration.push(tmpRule)
                    })

                    // 图谱需求submit
                    // window.neo4jd3.resetWithNeo4jData(data)
                    _this.$notify({
                      message: '规则生成完成~',
                      type: 'success',
                      duration: 5000
                    })
                    _this.ruleloading = false
                  }, err => {
                    console.error('需求图谱补全失败：', err)
                    _this.ruleloading = false
                    _this.$notify({
                      message: '需求图谱补全失败~',
                      type: 'error',
                      duration: 10000
                    })
                  })
                })
              }, err => {
                console.error('文件上传失败：', err)
                _this.ruleloading = false
                _this.$notify({
                  message: '文件上传失败~',
                  type: 'error',
                  duration: 2000
                })
              })
            }, err => {
              console.error('需求导入失败：', err)
              _this.ruleloading = false
              _this.$notify({
                message: '需求导入失败~',
                type: 'error',
                duration: 10000
              })
            })
          })
        }, err => {
          console.error('文件上传失败：', err)
          _this.ruleloading = false
          _this.$notify({
            message: '文件上传失败~',
            type: 'error',
            duration: 2000
          })
        })
      } else if (_this.RuleFileData !== []) {
        // 规则 文件
        _this.RuleFileData = new FormData()
        _this.$refs.uploadRule.submit()
        console.log('this.RuleFileData:::', _this.RuleFileData.get('files'))

        knowledgeService.fileUploading(_this.RuleFileData).then(res => {
        // console.log('请求成功:', res)
          res.data.forEach(file => {
            this.loading = true
            // 需要手动配置后端的绝对路径
            var relPath = file
            console.log('load relPath', relPath)
          })
        })
        _this.$notify({
          message: '规则上传成功',
          type: 'success',
          duration: 6000
        })
        _this.ruleloading = false
      } else {
        _this.$notify({
          message: '请同时上传需求-产品文件和需求-模块文件，或者上传规则文件~',
          type: 'danger',
          duration: 6000
        })
        _this.ruleloading = false
      }
    },
    ruleGraphView() {
      const _this = this
      _this.ruleloading = true
      _this.ruleshow = false
      _this.ruleGraphVis = true
      const H = {
        label: '需求',
        name: _this.ruleGenSel,
        skip: 0,
        limit: 60
      }
      const R = {
        label: '配置规则'
      }

      const data = {
        H: JSON.stringify(H),
        R: JSON.stringify(R)
      }
      const params = {
        data: JSON.stringify(data)
      }
      knowledgeService.productConfigurationRuleGenGraph(params).then(res => {
        console.log('initdata:', res)
        var data = res.data.data
        for (var n in data.nodes) {
          data.nodes[n].id = data.nodes[n].identity.low
        }
        for (var r in data.relationships) {
          data.relationships[r].id =
            data.relationships[r].identity.low
        }
        window.Neo4jd3Rule = Neo4jd3
        window.d3 = d3
        console.log('格式化data:', data)
        window.myDataRuleGen = data
        var timer = null
        // eslint-disable-next-line new-cap
        window.neo4jd3IdRuleGen = new Neo4jd3.default('#neo4jd3IdRuleGen', {
          minCollision: 50,
          neo4jData: window.myDataRuleGen,
          nodeRadius: 25,
          onNodeDoubleClick: function(node) {
            console.log('dianji：', node)
            clearTimeout(timer)
            const params = {
              id: node.id
            }
            _this.node = node
            knowledgeService.nodeClick(params).then(res => {
              // 为双击事件准备数据格式
              var graph = res.data.data
              console.log('点击事件patent:', res)
              for (var n in graph.nodes) {
                graph.nodes[n].id = graph.nodes[n].identity.low
              }
              for (var r in graph.relationships) {
                graph.relationships[r].id = graph.relationships[r].identity.low
              }
              var data = {}
              data['graph'] = {}
              data['graph'] = graph

              // 高亮点击的节点
              var highlight =
                [{
                  class: getProductLabel(_this.node.labels),
                  property: 'name',
                  value: _this.node.properties.name
                }]
              window.neo4jd3IdRuleGen.updateWithNeo4jData(data, highlight)
            })
          },
          onRelationshipDoubleClick: function(relationship) {
            console.log(
              'double click on relationship: ', relationship
            )
          },
          zoomFit: true
        })
      })
      _this.ruleloading = false
    },
    // 工艺智能推优结果
    processShow() {
      this.processloading = true
      this.processshow = true
      this.processloading = false
    },
    productRecommendationDetail(index, row) {
      const _this = this
      _this.labelClick = row.product
      _this.listTitle = _this.dynamicValidateForm.label + ':' + row.product
      _this.clickId = row.product
      _this.onSubmit3()
    },

    // 配置规则自动生成文件上传
    uploadFileDe2Pro(file) {
      this.De2ProFileData.append('files', file.file) // append增加数据
    },
    uploadFileDe2Par(file) {
      this.De2ParFileData.append('files', file.file) // append增加数据
    },
    uploadFileRule(file) {
      this.RuleFileData.append('files', file.file) // append增加数据
    },
    uploadChangeDe2Pro(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.De2ProFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadChangeDe2Par(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.De2ParFileList = fileList
      // this.fileList = fileList.slice(-3)
    },
    uploadChangeRule(file, fileList) {
      // console.log('file', file)
      var existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.RuleFileList = fileList
      // this.fileList = fileList.slice(-3)
    },

    getProductLabel(labels) {
      for (var i in labels) {
        if (!labels[i].includes('-')) {
          return labels[i]
        }
      }
    }
    // getMaxStr(str1, str2) {
    //   var max = str1.length > str2.length ? str1 : str2
    //   var min = (max === str1 ? str2 : str1)
    //   for (var i = 0; i < min.length; i++) {
    //     for (var x = 0, y = min.length - i; y !== min.length + 1; x++, y++) {
    //     // y表示所取字符串的长度
    //       var newStr = min.substring(x, y)
    //       // 判断max中是否包含newStr
    //       if (max.indexOf(newStr) !== -1) {
    //         return newStr
    //       }
    //     }
    //   }
    //   return -1
    // }
  }
}
</script>

<style>
  html,body,#app{
    height: 100%;
  }
</style>
<style>
  .my-app{
    background-color: rgb(238, 238, 238);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .module{
    margin-top: 10px;
  }
  .el-header {
    line-height: 10px;
  }
  .el-aside {
    color: #333;
  }
  .select-of-input {
    background-color: #fff;
    width: 150px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    padding:0 0px;
    border: 0px solid #DCDFE6;
  }
  .rule-row {
    margin-left: 80px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  /* .el-upload-dragger{
    width: 300px;
  } */
  .divShow  {
    text-align: center;
    font-size: 30px;
    font-weight: 300;
    line-height: 40px;
  }
  .spanShow  {
    color: #409EFF;
    text-shadow:
    0px 0px 5px #E6A23C,
    0px 0px 1px orange,
    0px 0px 1px orangered,
    0px 0px 1px #F56C6C;
  }
  /* .transfer-footer {
    margin-left: 150px;
    padding: 6px 5px;
  }
  .el-transfer-panel{
    width: 250px;
  } */

</style>
