import request from '@/utils/request'
// import * as underscore from 'underscore'
import { NEO4J_HOST } from '../../../config/config'
// import { WF, NB } from '../../../config/config'
import axios from 'axios'
import XLSX from 'xlsx'

export function getknType() {
  return request({
    url: '/vue-admin-template/knowledge/getknTYpe',
    method: 'get'
  })
}

export function getProductLabel(labels) {
  for (var i in labels) {
    if (!labels[i].includes('-')) {
      return labels[i]
    }
  }
}

export function city2Urban(data) {
  var czy = ['武汉', '黄石', '鄂州', '黄冈', '孝感', '咸宁', '仙桃', '潜江', '天门', '襄阳', '宜昌', '荆州', '荆门', '长沙', '株洲', '湘潭', '岳阳', '益阳', '常德', '衡阳', '娄底', '南昌', '九江', '景德镇', '鹰潭', '新余', '宜春', '萍乡', '上饶', '抚州', '吉安']
  var hc = ['哈尔滨', '大庆', '齐齐哈尔', '绥化', '牡丹江', '长春', '吉林', '四平', '辽源', '松原', '延边']
  var cy = ['成都', '重庆', '自贡', '泸州', '德阳', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '资阳', '绵阳', '达州', '雅安']
  var csj = ['上海', '南京', '无锡', '常州', '苏州', '南通', '盐城', '扬州', '镇江', '泰州', '杭州', '宁波', '嘉兴', '湖州', '绍兴', '金华', '舟山', '台州', '合肥', '芜湖', '马鞍山', '铜陵', '安庆', '滁州', '池州', '宣城']
  var zy = ['郑州', '洛阳', '开封', '南阳', '安阳', '商丘', '新乡', '平顶山', '许昌', '焦作', '周口', '信阳', '驻马店', '鹤壁', '濮阳', '漯河', '三门峡', '济源', '长治', '晋城', '运城', '邢台', '邯郸', '聊城', '菏泽', '宿州', '淮北', '蚌埠', '阜阳', '亳州']
  var bbw = ['南宁', '北海', '钦州', '防城港', '玉林', '崇左', '湛江', '茂名', '阳江', '海口', '儋州', '东方', '澄迈', '临高', '昌江']
  var gzpy = ['西安', '宝鸡', '咸阳', '铜川', '渭南', '商洛', '运城', '临汾', '天水', '平凉', '庆阳']
  var hbey = ['呼和浩特', '包头', '鄂尔多斯', '榆林']
  var lx = ['兰州', '西宁', '海东', '白银', '定西', '临夏回族自治州', '海北藏族自治州', '海南藏族自治州', '黄南藏族自治州']
  var jjj = ['北京', '天津', '石家庄', '唐山', '保定', '秦皇岛', '廊坊', '沧州', '承德', '张家口']
  czy.forEach(item => {
    if (item.includes(data)) {
      window.urban = '长江中游城市群'
    }
  })
  hc.forEach(item => {
    if (item.includes(data)) {
      window.urban = '哈长城市群'
    }
  })
  cy.forEach(item => {
    if (item.includes(data)) {
      window.urban = '成渝城市群'
    }
  })
  csj.forEach(item => {
    if (item.includes(data)) {
      window.urban = '长三角城市群'
    }
  })
  zy.forEach(item => {
    if (item.includes(data)) {
      window.urban = '中原城市群'
    }
  })
  bbw.forEach(item => {
    if (item.includes(data)) {
      window.urban = '北部湾城市群'
    }
  })
  gzpy.forEach(item => {
    if (item.includes(data)) {
      window.urban = '关中平原城市群'
    }
  })
  hbey.forEach(item => {
    if (item.includes(data)) {
      window.urban = '呼包鄂榆城市群'
    }
  })
  lx.forEach(item => {
    if (item.includes(data)) {
      window.urban = '兰西城市群'
    }
  })
  jjj.forEach(item => {
    if (item.includes(data)) {
      window.urban = '京津冀城市群'
    }
  })
}

export function getMainStrLabel(labels, mainStr) {
  for (var i in labels) {
    if (labels[i].includes(mainStr)) {
      return labels[i]
    }
  }
}

export function result2map(data) {
  // echart 原始
  var dataO = {
    'provinces': [
      {
        'citys': [
          {
            'citysName': '石家庄'
          },
          {
            'citysName': '邯郸'
          },
          {
            'citysName': '唐山'
          },
          {
            'citysName': '保定'
          },
          {
            'citysName': '秦皇岛'
          },
          {
            'citysName': '邢台'
          },
          {
            'citysName': '张家口'
          },
          {
            'citysName': '承德'
          },
          {
            'citysName': '沧州'
          },
          {
            'citysName': '廊坊'
          },
          {
            'citysName': '衡水'
          },
          {
            'citysName': '辛集'
          },
          {
            'citysName': '晋州'
          },
          {
            'citysName': '新乐'
          },
          {
            'citysName': '遵化'
          },
          {
            'citysName': '迁安'
          },
          {
            'citysName': '霸州'
          },
          {
            'citysName': '三河'
          },
          {
            'citysName': '定州'
          },
          {
            'citysName': '涿州'
          },
          {
            'citysName': '安国'
          },
          {
            'citysName': '高碑店'
          },
          {
            'citysName': '泊头'
          },
          {
            'citysName': '任丘'
          },
          {
            'citysName': '黄骅'
          },
          {
            'citysName': '河间'
          },
          {
            'citysName': '冀州'
          },
          {
            'citysName': '深州'
          },
          {
            'citysName': '南宫'
          },
          {
            'citysName': '沙河'
          },
          {
            'citysName': '武安'
          }
        ],
        'provinceName': '河北'
      },
      {
        'citys': [
          {
            'citysName': '太原'
          },
          {
            'citysName': '大同'
          },
          {
            'citysName': '朔州'
          },
          {
            'citysName': '阳泉'
          },
          {
            'citysName': '长治'
          },
          {
            'citysName': '晋城'
          },
          {
            'citysName': '忻州'
          },
          {
            'citysName': '吕梁'
          },
          {
            'citysName': '晋中'
          },
          {
            'citysName': '临汾'
          },
          {
            'citysName': '运城'
          },
          {
            'citysName': '古交'
          },
          {
            'citysName': '潞城'
          },
          {
            'citysName': '高平'
          },
          {
            'citysName': '原平'
          },
          {
            'citysName': '孝义'
          },
          {
            'citysName': '汾阳'
          },
          {
            'citysName': '介休'
          },
          {
            'citysName': '侯马'
          },
          {
            'citysName': '霍州'
          },
          {
            'citysName': '永济'
          },
          {
            'citysName': '河津'
          }
        ],
        'provinceName': '山西'
      },
      {
        'citys': [
          {
            'citysName': '呼和浩特'
          },
          {
            'citysName': '包头'
          },
          {
            'citysName': '乌海'
          },
          {
            'citysName': '赤峰'
          },
          {
            'citysName': '呼伦贝尔'
          },
          {
            'citysName': '通辽'
          },
          {
            'citysName': '乌兰察布'
          },
          {
            'citysName': '鄂尔多斯'
          },
          {
            'citysName': '巴彦淖尔'
          },
          {
            'citysName': '满洲里'
          },
          {
            'citysName': '扎兰屯'
          },
          {
            'citysName': '牙克石'
          },
          {
            'citysName': '根河'
          },
          {
            'citysName': '额尔古纳'
          },
          {
            'citysName': '乌兰浩特'
          },
          {
            'citysName': '阿尔山'
          },
          {
            'citysName': '霍林郭勒'
          },
          {
            'citysName': '锡林浩特'
          },
          {
            'citysName': '二连浩特'
          },
          {
            'citysName': '丰镇'
          }
        ],
        'provinceName': '内蒙古'
      },
      {
        'citys': [
          {
            'citysName': '沈阳'
          },
          {
            'citysName': '大连'
          },
          {
            'citysName': '朝阳'
          },
          {
            'citysName': '阜新'
          },
          {
            'citysName': '铁岭'
          },
          {
            'citysName': '抚顺'
          },
          {
            'citysName': '本溪'
          },
          {
            'citysName': '辽阳'
          },
          {
            'citysName': '鞍山'
          },
          {
            'citysName': '丹东'
          },
          {
            'citysName': '营口'
          },
          {
            'citysName': '盘锦'
          },
          {
            'citysName': '锦州'
          },
          {
            'citysName': '葫芦岛'
          },
          {
            'citysName': '新民'
          },
          {
            'citysName': '瓦房店'
          },
          {
            'citysName': '庄河'
          },
          {
            'citysName': '北票'
          },
          {
            'citysName': '凌源'
          },
          {
            'citysName': '调兵山'
          },
          {
            'citysName': '开原'
          },
          {
            'citysName': '灯塔'
          },
          {
            'citysName': '海城'
          },
          {
            'citysName': '凤城'
          },
          {
            'citysName': '东港'
          },
          {
            'citysName': '大石桥'
          },
          {
            'citysName': '盖州'
          },
          {
            'citysName': '凌海'
          },
          {
            'citysName': '北镇'
          },
          {
            'citysName': '兴城'
          }
        ],
        'provinceName': '辽宁'
      },
      {
        'citys': [
          {
            'citysName': '长春'
          },
          {
            'citysName': '吉林'
          },
          {
            'citysName': '白城'
          },
          {
            'citysName': '松原'
          },
          {
            'citysName': '四平'
          },
          {
            'citysName': '辽源'
          },
          {
            'citysName': '通化'
          },
          {
            'citysName': '白山'
          },
          {
            'citysName': '德惠'
          },
          {
            'citysName': '榆树'
          },
          {
            'citysName': '磐石'
          },
          {
            'citysName': '蛟河'
          },
          {
            'citysName': '桦甸'
          },
          {
            'citysName': '舒兰'
          },
          {
            'citysName': '洮南'
          },
          {
            'citysName': '大安'
          },
          {
            'citysName': '双辽'
          },
          {
            'citysName': '公主岭'
          },
          {
            'citysName': '梅河口'
          },
          {
            'citysName': '集安'
          },
          {
            'citysName': '临江'
          },
          {
            'citysName': '延吉'
          },
          {
            'citysName': '图们'
          },
          {
            'citysName': '敦化'
          },
          {
            'citysName': '珲春'
          },
          {
            'citysName': '龙井'
          },
          {
            'citysName': '和龙'
          },
          {
            'citysName': '扶余'
          }
        ],
        'provinceName': '吉林'
      },
      {
        'citys': [
          {
            'citysName': '哈尔滨'
          },
          {
            'citysName': '齐齐哈尔'
          },
          {
            'citysName': '黑河'
          },
          {
            'citysName': '大庆'
          },
          {
            'citysName': '伊春'
          },
          {
            'citysName': '鹤岗'
          },
          {
            'citysName': '佳木斯'
          },
          {
            'citysName': '双鸭山'
          },
          {
            'citysName': '七台河'
          },
          {
            'citysName': '鸡西'
          },
          {
            'citysName': '牡丹江'
          },
          {
            'citysName': '绥化'
          },
          {
            'citysName': '尚志'
          },
          {
            'citysName': '五常'
          },
          {
            'citysName': '讷河'
          },
          {
            'citysName': '北安'
          },
          {
            'citysName': '五大连池'
          },
          {
            'citysName': '铁力'
          },
          {
            'citysName': '同江'
          },
          {
            'citysName': '富锦'
          },
          {
            'citysName': '虎林'
          },
          {
            'citysName': '密山'
          },
          {
            'citysName': '绥芬河'
          },
          {
            'citysName': '海林'
          },
          {
            'citysName': '宁安'
          },
          {
            'citysName': '安达'
          },
          {
            'citysName': '肇东'
          },
          {
            'citysName': '海伦'
          },
          {
            'citysName': '穆棱'
          },
          {
            'citysName': '东宁'
          },
          {
            'citysName': '抚远'
          }
        ],
        'provinceName': '黑龙江'
      },
      {
        'citys': [
          {
            'citysName': '南京'
          },
          {
            'citysName': '徐州'
          },
          {
            'citysName': '连云港'
          },
          {
            'citysName': '宿迁'
          },
          {
            'citysName': '淮安'
          },
          {
            'citysName': '盐城'
          },
          {
            'citysName': '扬州'
          },
          {
            'citysName': '泰州'
          },
          {
            'citysName': '南通'
          },
          {
            'citysName': '镇江'
          },
          {
            'citysName': '常州'
          },
          {
            'citysName': '无锡'
          },
          {
            'citysName': '苏州'
          },
          {
            'citysName': '常熟'
          },
          {
            'citysName': '张家港'
          },
          {
            'citysName': '太仓'
          },
          {
            'citysName': '昆山'
          },
          {
            'citysName': '江阴'
          },
          {
            'citysName': '宜兴'
          },
          {
            'citysName': '溧阳'
          },
          {
            'citysName': '扬中'
          },
          {
            'citysName': '句容'
          },
          {
            'citysName': '丹阳'
          },
          {
            'citysName': '如皋'
          },
          {
            'citysName': '海门'
          },
          {
            'citysName': '启东'
          },
          {
            'citysName': '高邮'
          },
          {
            'citysName': '仪征'
          },
          {
            'citysName': '兴化'
          },
          {
            'citysName': '泰兴'
          },
          {
            'citysName': '靖江'
          },
          {
            'citysName': '东台'
          },
          {
            'citysName': '邳州'
          },
          {
            'citysName': '新沂'
          }
        ],
        'provinceName': '江苏'
      },
      {
        'citys': [
          {
            'citysName': '杭州'
          },
          {
            'citysName': '宁波'
          },
          {
            'citysName': '湖州'
          },
          {
            'citysName': '嘉兴'
          },
          {
            'citysName': '舟山'
          },
          {
            'citysName': '绍兴'
          },
          {
            'citysName': '衢州'
          },
          {
            'citysName': '金华'
          },
          {
            'citysName': '台州'
          },
          {
            'citysName': '温州'
          },
          {
            'citysName': '丽水'
          },
          {
            'citysName': '临安'
          },
          {
            'citysName': '建德'
          },
          {
            'citysName': '慈溪'
          },
          {
            'citysName': '余姚'
          },
          {
            'citysName': '平湖'
          },
          {
            'citysName': '海宁'
          },
          {
            'citysName': '桐乡'
          },
          {
            'citysName': '诸暨'
          },
          {
            'citysName': '嵊州'
          },
          {
            'citysName': '江山'
          },
          {
            'citysName': '兰溪'
          },
          {
            'citysName': '永康'
          },
          {
            'citysName': '义乌'
          },
          {
            'citysName': '东阳'
          },
          {
            'citysName': '临海'
          },
          {
            'citysName': '温岭'
          },
          {
            'citysName': '瑞安'
          },
          {
            'citysName': '乐清'
          },
          {
            'citysName': '龙泉'
          }
        ],
        'provinceName': '浙江'
      },
      {
        'citys': [
          {
            'citysName': '合肥'
          },
          {
            'citysName': '芜湖'
          },
          {
            'citysName': '蚌埠'
          },
          {
            'citysName': '淮南'
          },
          {
            'citysName': '马鞍山'
          },
          {
            'citysName': '淮北'
          },
          {
            'citysName': '铜陵'
          },
          {
            'citysName': '安庆'
          },
          {
            'citysName': '黄山'
          },
          {
            'citysName': '滁州'
          },
          {
            'citysName': '阜阳'
          },
          {
            'citysName': '宿州'
          },
          {
            'citysName': '六安'
          },
          {
            'citysName': '亳州'
          },
          {
            'citysName': '池州'
          },
          {
            'citysName': '宣城'
          },
          {
            'citysName': '巢湖'
          },
          {
            'citysName': '桐城'
          },
          {
            'citysName': '天长'
          },
          {
            'citysName': '明光'
          },
          {
            'citysName': '界首'
          },
          {
            'citysName': '宁国'
          }
        ],
        'provinceName': '安徽'
      },
      {
        'citys': [
          {
            'citysName': '厦门'
          },
          {
            'citysName': '福州'
          },
          {
            'citysName': '南平'
          },
          {
            'citysName': '三明'
          },
          {
            'citysName': '莆田'
          },
          {
            'citysName': '泉州'
          },
          {
            'citysName': '漳州'
          },
          {
            'citysName': '龙岩'
          },
          {
            'citysName': '宁德'
          },
          {
            'citysName': '福清'
          },
          {
            'citysName': '长乐'
          },
          {
            'citysName': '邵武'
          },
          {
            'citysName': '武夷山'
          },
          {
            'citysName': '建瓯'
          },
          {
            'citysName': '永安'
          },
          {
            'citysName': '石狮'
          },
          {
            'citysName': '晋江'
          },
          {
            'citysName': '南安'
          },
          {
            'citysName': '龙海'
          },
          {
            'citysName': '漳平'
          },
          {
            'citysName': '福安'
          },
          {
            'citysName': '福鼎'
          }
        ],
        'provinceName': '福建'
      },
      {
        'citys': [
          {
            'citysName': '南昌'
          },
          {
            'citysName': '九江'
          },
          {
            'citysName': '景德镇'
          },
          {
            'citysName': '鹰潭'
          },
          {
            'citysName': '新余'
          },
          {
            'citysName': '萍乡'
          },
          {
            'citysName': '赣州'
          },
          {
            'citysName': '上饶'
          },
          {
            'citysName': '抚州'
          },
          {
            'citysName': '宜春'
          },
          {
            'citysName': '吉安'
          },
          {
            'citysName': '瑞昌'
          },
          {
            'citysName': '共青城'
          },
          {
            'citysName': '乐平'
          },
          {
            'citysName': '瑞金'
          },
          {
            'citysName': '德兴'
          },
          {
            'citysName': '丰城'
          },
          {
            'citysName': '樟树'
          },
          {
            'citysName': '高安'
          },
          {
            'citysName': '井冈山'
          },
          {
            'citysName': '贵溪'
          }
        ],
        'provinceName': '江西'
      },
      {
        'citys': [
          {
            'citysName': '济南'
          },
          {
            'citysName': '青岛'
          },
          {
            'citysName': '聊城'
          },
          {
            'citysName': '德州'
          },
          {
            'citysName': '东营'
          },
          {
            'citysName': '淄博'
          },
          {
            'citysName': '潍坊'
          },
          {
            'citysName': '烟台'
          },
          {
            'citysName': '威海'
          },
          {
            'citysName': '日照'
          },
          {
            'citysName': '临沂'
          },
          {
            'citysName': '枣庄'
          },
          {
            'citysName': '济宁'
          },
          {
            'citysName': '泰安'
          },
          {
            'citysName': '莱芜'
          },
          {
            'citysName': '滨州'
          },
          {
            'citysName': '菏泽'
          },
          {
            'citysName': '胶州'
          },
          {
            'citysName': '即墨'
          },
          {
            'citysName': '平度'
          },
          {
            'citysName': '莱西'
          },
          {
            'citysName': '临清'
          },
          {
            'citysName': '乐陵'
          },
          {
            'citysName': '禹城'
          },
          {
            'citysName': '安丘'
          },
          {
            'citysName': '昌邑'
          },
          {
            'citysName': '高密'
          },
          {
            'citysName': '青州'
          },
          {
            'citysName': '诸城'
          },
          {
            'citysName': '寿光'
          },
          {
            'citysName': '栖霞'
          },
          {
            'citysName': '海阳'
          },
          {
            'citysName': '龙口'
          },
          {
            'citysName': '莱阳'
          },
          {
            'citysName': '莱州'
          },
          {
            'citysName': '蓬莱'
          },
          {
            'citysName': '招远'
          },
          {
            'citysName': '荣成'
          },
          {
            'citysName': '乳山'
          },
          {
            'citysName': '滕州'
          },
          {
            'citysName': '曲阜'
          },
          {
            'citysName': '邹城'
          },
          {
            'citysName': '新泰'
          },
          {
            'citysName': '肥城'
          }
        ],
        'provinceName': '山东'
      },
      {
        'citys': [
          {
            'citysName': '郑州'
          },
          {
            'citysName': '开封'
          },
          {
            'citysName': '洛阳'
          },
          {
            'citysName': '平顶山'
          },
          {
            'citysName': '安阳'
          },
          {
            'citysName': '鹤壁'
          },
          {
            'citysName': '新乡'
          },
          {
            'citysName': '焦作'
          },
          {
            'citysName': '濮阳'
          },
          {
            'citysName': '许昌'
          },
          {
            'citysName': '漯河'
          },
          {
            'citysName': '三门峡'
          },
          {
            'citysName': '南阳'
          },
          {
            'citysName': '商丘'
          },
          {
            'citysName': '周口'
          },
          {
            'citysName': '驻马店'
          },
          {
            'citysName': '信阳'
          },
          {
            'citysName': '荥阳'
          },
          {
            'citysName': '新郑'
          },
          {
            'citysName': '登封'
          },
          {
            'citysName': '新密'
          },
          {
            'citysName': '偃师'
          },
          {
            'citysName': '孟州'
          },
          {
            'citysName': '沁阳'
          },
          {
            'citysName': '卫辉'
          },
          {
            'citysName': '辉县'
          },
          {
            'citysName': '林州'
          },
          {
            'citysName': '禹州'
          },
          {
            'citysName': '长葛'
          },
          {
            'citysName': '舞钢'
          },
          {
            'citysName': '义马'
          },
          {
            'citysName': '灵宝'
          },
          {
            'citysName': '项城'
          },
          {
            'citysName': '巩义'
          },
          {
            'citysName': '邓州'
          },
          {
            'citysName': '永城'
          },
          {
            'citysName': '汝州'
          },
          {
            'citysName': '济源'
          }
        ],
        'provinceName': '河南'
      },
      {
        'citys': [
          {
            'citysName': '武汉'
          },
          {
            'citysName': '十堰'
          },
          {
            'citysName': '襄阳'
          },
          {
            'citysName': '荆门'
          },
          {
            'citysName': '孝感'
          },
          {
            'citysName': '黄冈'
          },
          {
            'citysName': '鄂州'
          },
          {
            'citysName': '黄石'
          },
          {
            'citysName': '咸宁'
          },
          {
            'citysName': '荆州'
          },
          {
            'citysName': '宜昌'
          },
          {
            'citysName': '随州'
          },
          {
            'citysName': '丹江口'
          },
          {
            'citysName': '老河口'
          },
          {
            'citysName': '枣阳'
          },
          {
            'citysName': '宜城'
          },
          {
            'citysName': '钟祥'
          },
          {
            'citysName': '汉川'
          },
          {
            'citysName': '应城'
          },
          {
            'citysName': '安陆'
          },
          {
            'citysName': '广水'
          },
          {
            'citysName': '麻城'
          },
          {
            'citysName': '武穴'
          },
          {
            'citysName': '大冶'
          },
          {
            'citysName': '赤壁'
          },
          {
            'citysName': '石首'
          },
          {
            'citysName': '洪湖'
          },
          {
            'citysName': '松滋'
          },
          {
            'citysName': '宜都'
          },
          {
            'citysName': '枝江'
          },
          {
            'citysName': '当阳'
          },
          {
            'citysName': '恩施'
          },
          {
            'citysName': '利川'
          },
          {
            'citysName': '仙桃'
          },
          {
            'citysName': '天门'
          },
          {
            'citysName': '潜江'
          }
        ],
        'provinceName': '湖北'
      },
      {
        'citys': [
          {
            'citysName': '长沙'
          },
          {
            'citysName': '衡阳'
          },
          {
            'citysName': '张家界'
          },
          {
            'citysName': '常德'
          },
          {
            'citysName': '益阳'
          },
          {
            'citysName': '岳阳'
          },
          {
            'citysName': '株洲'
          },
          {
            'citysName': '湘潭'
          },
          {
            'citysName': '郴州'
          },
          {
            'citysName': '永州'
          },
          {
            'citysName': '邵阳'
          },
          {
            'citysName': '怀化'
          },
          {
            'citysName': '娄底'
          },
          {
            'citysName': '耒阳'
          },
          {
            'citysName': '常宁'
          },
          {
            'citysName': '浏阳'
          },
          {
            'citysName': '津'
          },
          {
            'citysName': '沅江'
          },
          {
            'citysName': '汨罗'
          },
          {
            'citysName': '临湘'
          },
          {
            'citysName': '醴陵'
          },
          {
            'citysName': '湘乡'
          },
          {
            'citysName': '韶山'
          },
          {
            'citysName': '资兴'
          },
          {
            'citysName': '武冈'
          },
          {
            'citysName': '洪江'
          },
          {
            'citysName': '冷水江'
          },
          {
            'citysName': '涟源'
          },
          {
            'citysName': '吉首'
          }
        ],
        'provinceName': '湖南'
      },
      {
        'citys': [
          {
            'citysName': '广州'
          },
          {
            'citysName': '深圳'
          },
          {
            'citysName': '清远'
          },
          {
            'citysName': '韶关'
          },
          {
            'citysName': '河源'
          },
          {
            'citysName': '梅州'
          },
          {
            'citysName': '潮州'
          },
          {
            'citysName': '汕头'
          },
          {
            'citysName': '揭阳'
          },
          {
            'citysName': '汕尾'
          },
          {
            'citysName': '惠州'
          },
          {
            'citysName': '东莞'
          },
          {
            'citysName': '珠海'
          },
          {
            'citysName': '中山'
          },
          {
            'citysName': '江门'
          },
          {
            'citysName': '佛山'
          },
          {
            'citysName': '肇庆'
          },
          {
            'citysName': '云浮'
          },
          {
            'citysName': '阳江'
          },
          {
            'citysName': '茂名'
          },
          {
            'citysName': '湛江'
          },
          {
            'citysName': '英德'
          },
          {
            'citysName': '连州'
          },
          {
            'citysName': '乐昌'
          },
          {
            'citysName': '南雄'
          },
          {
            'citysName': '兴宁'
          },
          {
            'citysName': '普宁'
          },
          {
            'citysName': '陆丰'
          },
          {
            'citysName': '恩平'
          },
          {
            'citysName': '台山'
          },
          {
            'citysName': '开平'
          },
          {
            'citysName': '鹤山'
          },
          {
            'citysName': '四会'
          },
          {
            'citysName': '罗定'
          },
          {
            'citysName': '阳春'
          },
          {
            'citysName': '化州'
          },
          {
            'citysName': '信宜'
          },
          {
            'citysName': '高州'
          },
          {
            'citysName': '吴川'
          },
          {
            'citysName': '廉江'
          },
          {
            'citysName': '雷州'
          }
        ],
        'provinceName': '广东'
      },
      {
        'citys': [
          {
            'citysName': '南宁'
          },
          {
            'citysName': '桂林'
          },
          {
            'citysName': '柳州'
          },
          {
            'citysName': '梧州'
          },
          {
            'citysName': '贵港'
          },
          {
            'citysName': '玉林'
          },
          {
            'citysName': '钦州'
          },
          {
            'citysName': '北海'
          },
          {
            'citysName': '防城港'
          },
          {
            'citysName': '崇左'
          },
          {
            'citysName': '百色'
          },
          {
            'citysName': '河池'
          },
          {
            'citysName': '来宾'
          },
          {
            'citysName': '贺州'
          },
          {
            'citysName': '岑溪'
          },
          {
            'citysName': '桂平'
          },
          {
            'citysName': '北流'
          },
          {
            'citysName': '东兴'
          },
          {
            'citysName': '凭祥'
          },
          {
            'citysName': '宜州'
          },
          {
            'citysName': '合山'
          },
          {
            'citysName': '靖西'
          }
        ],
        'provinceName': '广西'
      },
      {
        'citys': [
          {
            'citysName': '海口'
          },
          {
            'citysName': '三亚'
          },
          {
            'citysName': '三沙'
          },
          {
            'citysName': '儋州'
          },
          {
            'citysName': '文昌'
          },
          {
            'citysName': '琼海'
          },
          {
            'citysName': '万宁'
          },
          {
            'citysName': '东方'
          },
          {
            'citysName': '五指山'
          }
        ],
        'provinceName': '海南'
      },
      {
        'citys': [
          {
            'citysName': '成都'
          },
          {
            'citysName': '广元'
          },
          {
            'citysName': '绵阳'
          },
          {
            'citysName': '德阳'
          },
          {
            'citysName': '南充'
          },
          {
            'citysName': '广安'
          },
          {
            'citysName': '遂宁'
          },
          {
            'citysName': '内江'
          },
          {
            'citysName': '乐山'
          },
          {
            'citysName': '自贡'
          },
          {
            'citysName': '泸州'
          },
          {
            'citysName': '宜宾'
          },
          {
            'citysName': '攀枝花'
          },
          {
            'citysName': '巴中'
          },
          {
            'citysName': '达州'
          },
          {
            'citysName': '资阳'
          },
          {
            'citysName': '眉山'
          },
          {
            'citysName': '雅安'
          },
          {
            'citysName': '崇州'
          },
          {
            'citysName': '邛崃'
          },
          {
            'citysName': '都江堰'
          },
          {
            'citysName': '彭州'
          },
          {
            'citysName': '江油'
          },
          {
            'citysName': '什邡'
          },
          {
            'citysName': '广汉'
          },
          {
            'citysName': '绵竹'
          },
          {
            'citysName': '阆中'
          },
          {
            'citysName': '华蓥'
          },
          {
            'citysName': '峨眉山'
          },
          {
            'citysName': '万源'
          },
          {
            'citysName': '简阳'
          },
          {
            'citysName': '西昌'
          },
          {
            'citysName': '康定'
          },
          {
            'citysName': '马尔康'
          }
        ],
        'provinceName': '四川'
      },
      {
        'citys': [
          {
            'citysName': '贵阳'
          },
          {
            'citysName': '六盘水'
          },
          {
            'citysName': '遵义'
          },
          {
            'citysName': '安顺'
          },
          {
            'citysName': '毕节'
          },
          {
            'citysName': '铜仁'
          },
          {
            'citysName': '清镇'
          },
          {
            'citysName': '赤水'
          },
          {
            'citysName': '仁怀'
          },
          {
            'citysName': '凯里'
          },
          {
            'citysName': '都匀'
          },
          {
            'citysName': '兴义'
          },
          {
            'citysName': '福泉'
          }
        ],
        'provinceName': '贵州'
      },
      {
        'citys': [
          {
            'citysName': '昆明'
          },
          {
            'citysName': '曲靖'
          },
          {
            'citysName': '玉溪'
          },
          {
            'citysName': '丽江'
          },
          {
            'citysName': '昭通'
          },
          {
            'citysName': '普洱'
          },
          {
            'citysName': '临沧'
          },
          {
            'citysName': '保山'
          },
          {
            'citysName': '安宁'
          },
          {
            'citysName': '宣威'
          },
          {
            'citysName': '芒'
          },
          {
            'citysName': '瑞丽'
          },
          {
            'citysName': '大理'
          },
          {
            'citysName': '楚雄'
          },
          {
            'citysName': '个旧'
          },
          {
            'citysName': '开远'
          },
          {
            'citysName': '蒙自'
          },
          {
            'citysName': '弥勒'
          },
          {
            'citysName': '景洪'
          },
          {
            'citysName': '文山'
          },
          {
            'citysName': '香格里拉'
          },
          {
            'citysName': '腾冲'
          }
        ],
        'provinceName': '云南'
      },
      {
        'citys': [
          {
            'citysName': '西安'
          },
          {
            'citysName': '延安'
          },
          {
            'citysName': '铜川'
          },
          {
            'citysName': '渭南'
          },
          {
            'citysName': '咸阳'
          },
          {
            'citysName': '宝鸡'
          },
          {
            'citysName': '汉中'
          },
          {
            'citysName': '榆林'
          },
          {
            'citysName': '商洛'
          },
          {
            'citysName': '安康'
          },
          {
            'citysName': '韩城'
          },
          {
            'citysName': '华阴'
          },
          {
            'citysName': '兴平'
          }
        ],
        'provinceName': '陕西'
      },
      {
        'citys': [
          {
            'citysName': '兰州'
          },
          {
            'citysName': '嘉峪关'
          },
          {
            'citysName': '金昌'
          },
          {
            'citysName': '白银'
          },
          {
            'citysName': '天水'
          },
          {
            'citysName': '酒泉'
          },
          {
            'citysName': '张掖'
          },
          {
            'citysName': '武威'
          },
          {
            'citysName': '庆阳'
          },
          {
            'citysName': '平凉'
          },
          {
            'citysName': '定西'
          },
          {
            'citysName': '陇南'
          },
          {
            'citysName': '玉门'
          },
          {
            'citysName': '敦煌'
          },
          {
            'citysName': '临夏'
          },
          {
            'citysName': '合作'
          }
        ],
        'provinceName': '甘肃'
      },
      {
        'citys': [
          {
            'citysName': '西宁'
          },
          {
            'citysName': '海东'
          },
          {
            'citysName': '格尔木'
          },
          {
            'citysName': '德令哈'
          },
          {
            'citysName': '玉树'
          }
        ],
        'provinceName': '青海'
      },
      {
        'citys': [
          {
            'citysName': '拉萨'
          },
          {
            'citysName': '日喀则'
          },
          {
            'citysName': '昌都'
          },
          {
            'citysName': '林芝'
          },
          {
            'citysName': '山南'
          }
        ],
        'provinceName': '西藏'
      },
      {
        'citys': [
          {
            'citysName': '银川'
          },
          {
            'citysName': '石嘴山'
          },
          {
            'citysName': '吴忠'
          },
          {
            'citysName': '中卫'
          },
          {
            'citysName': '固原'
          },
          {
            'citysName': '灵武'
          },
          {
            'citysName': '青铜峡'
          }
        ],
        'provinceName': '宁夏'
      },
      {
        'citys': [
          {
            'citysName': '台北'
          },
          {
            'citysName': '新北'
          },
          {
            'citysName': '桃园'
          },
          {
            'citysName': '台中'
          },
          {
            'citysName': '台南'
          },
          {
            'citysName': '高雄'
          },
          {
            'citysName': '基隆'
          },
          {
            'citysName': '新竹'
          },
          {
            'citysName': '嘉义'
          }
        ],
        'provinceName': '台湾'
      },
      {
        'citys': [
          {
            'citysName': '北京'
          }
        ],
        'provinceName': '北京'
      },
      {
        'citys': [
          {
            'citysName': '天津'
          }
        ],
        'provinceName': '天津'
      },
      {
        'citys': [
          {
            'citysName': '上海'
          }
        ],
        'provinceName': '上海'
      },
      {
        'citys': [
          {
            'citysName': '重庆'
          }
        ],
        'provinceName': '重庆'
      },
      {
        'citys': [
          {
            'citysName': '香港特别行政区'
          }
        ],
        'provinceName': '香港'
      },
      {
        'citys': [
          {
            'citysName': '澳门特别行政区'
          }
        ],
        'provinceName': '澳门'
      },
      {
        'citys': [
          {
            'citysName': '乌鲁木齐'
          },
          {
            'citysName': '克拉玛依'
          },
          {
            'citysName': '吐鲁番'
          },
          {
            'citysName': '哈密'
          },
          {
            'citysName': '喀什'
          },
          {
            'citysName': '阿克苏'
          },
          {
            'citysName': '和田'
          },
          {
            'citysName': '阿图什'
          },
          {
            'citysName': '阿拉山口'
          },
          {
            'citysName': '博乐'
          },
          {
            'citysName': '昌吉'
          },
          {
            'citysName': '阜康'
          },
          {
            'citysName': '库尔勒'
          },
          {
            'citysName': '伊宁'
          },
          {
            'citysName': '奎屯'
          },
          {
            'citysName': '塔城'
          },
          {
            'citysName': '乌苏'
          },
          {
            'citysName': '阿勒泰'
          },
          {
            'citysName': '霍尔果斯'
          },
          {
            'citysName': '石河子'
          },
          {
            'citysName': '阿拉尔'
          },
          {
            'citysName': '图木舒克'
          },
          {
            'citysName': '五家渠'
          },
          {
            'citysName': '北屯'
          },
          {
            'citysName': '铁门关'
          },
          {
            'citysName': '双河'
          },
          {
            'citysName': '可克达拉'
          },
          {
            'citysName': '昆玉'
          }
        ],
        'provinceName': '新疆'
      }
    ]
  }

  // 市echart
  var data2 = []
  dataO.provinces.forEach(cities => {
    cities.citys.forEach(city => {
      var dataTemp1 = { name: '', value: 0 }
      dataTemp1.name = city.citysName
      data2.push(dataTemp1)
    })
  })
  data.nodes.forEach(node => {
    data2.forEach(data => {
      // if ((node.labels.includes('专利') || node.labels.includes('期刊') || node.labels.includes('会议论文') || node.labels.includes('标准')) && node.properties.province.match(data.name)) {
      if ((node.labels.includes('代理机构') || node.labels.includes('高新技术企业') || node.labels.includes('单位')) && node.properties.name.includes(data.name)) {
        data.value = data.value + 1
      // } else if ((node.labels.includes('专利') && node.properties.reqaddr != null) && node.properties.reqaddr.includes(data.name + '市')) {
      } else if ((node.labels.includes('专利') && ((node.properties.reqaddr != null && node.properties.reqaddr.includes(data.name + '市')) || (node.properties.reqCity != null && node.properties.reqCity.includes(data.name + '市'))))) {
        data.value = data.value + 1
      } else if ((node.labels.includes('期刊') || node.labels.includes('会议论文') || node.labels.includes('标准')) && node.properties.city.includes(data.name)) {
        data.value = data.value + 1
      } else if (((node.labels.includes('专家') || node.labels.includes('科学装置')) && node.properties.address != null && node.properties.address.includes(data.name + '市'))) {
        data.value = data.value + 1
      } else if ((node.labels.includes('供应商') && node.properties.address != null && node.properties.address.includes(data.name))) {
        data.value = data.value + 1
      }
    })
  })
  window.mapData = data2
}

export function result2ChinaMap(data) {
  // echart 原始
  var dataO = {
    'provinces': [
      {
        'citys': [
          {
            'citysName': '石家庄'
          },
          {
            'citysName': '邯郸'
          },
          {
            'citysName': '唐山'
          },
          {
            'citysName': '保定'
          },
          {
            'citysName': '秦皇岛'
          },
          {
            'citysName': '邢台'
          },
          {
            'citysName': '张家口'
          },
          {
            'citysName': '承德'
          },
          {
            'citysName': '沧州'
          },
          {
            'citysName': '廊坊'
          },
          {
            'citysName': '衡水'
          },
          {
            'citysName': '辛集'
          },
          {
            'citysName': '晋州'
          },
          {
            'citysName': '新乐'
          },
          {
            'citysName': '遵化'
          },
          {
            'citysName': '迁安'
          },
          {
            'citysName': '霸州'
          },
          {
            'citysName': '三河'
          },
          {
            'citysName': '定州'
          },
          {
            'citysName': '涿州'
          },
          {
            'citysName': '安国'
          },
          {
            'citysName': '高碑店'
          },
          {
            'citysName': '泊头'
          },
          {
            'citysName': '任丘'
          },
          {
            'citysName': '黄骅'
          },
          {
            'citysName': '河间'
          },
          {
            'citysName': '冀州'
          },
          {
            'citysName': '深州'
          },
          {
            'citysName': '南宫'
          },
          {
            'citysName': '沙河'
          },
          {
            'citysName': '武安'
          }
        ],
        'provinceName': '河北'
      },
      {
        'citys': [
          {
            'citysName': '太原'
          },
          {
            'citysName': '大同'
          },
          {
            'citysName': '朔州'
          },
          {
            'citysName': '阳泉'
          },
          {
            'citysName': '长治'
          },
          {
            'citysName': '晋城'
          },
          {
            'citysName': '忻州'
          },
          {
            'citysName': '吕梁'
          },
          {
            'citysName': '晋中'
          },
          {
            'citysName': '临汾'
          },
          {
            'citysName': '运城'
          },
          {
            'citysName': '古交'
          },
          {
            'citysName': '潞城'
          },
          {
            'citysName': '高平'
          },
          {
            'citysName': '原平'
          },
          {
            'citysName': '孝义'
          },
          {
            'citysName': '汾阳'
          },
          {
            'citysName': '介休'
          },
          {
            'citysName': '侯马'
          },
          {
            'citysName': '霍州'
          },
          {
            'citysName': '永济'
          },
          {
            'citysName': '河津'
          }
        ],
        'provinceName': '山西'
      },
      {
        'citys': [
          {
            'citysName': '呼和浩特'
          },
          {
            'citysName': '包头'
          },
          {
            'citysName': '乌海'
          },
          {
            'citysName': '赤峰'
          },
          {
            'citysName': '呼伦贝尔'
          },
          {
            'citysName': '通辽'
          },
          {
            'citysName': '乌兰察布'
          },
          {
            'citysName': '鄂尔多斯'
          },
          {
            'citysName': '巴彦淖尔'
          },
          {
            'citysName': '满洲里'
          },
          {
            'citysName': '扎兰屯'
          },
          {
            'citysName': '牙克石'
          },
          {
            'citysName': '根河'
          },
          {
            'citysName': '额尔古纳'
          },
          {
            'citysName': '乌兰浩特'
          },
          {
            'citysName': '阿尔山'
          },
          {
            'citysName': '霍林郭勒'
          },
          {
            'citysName': '锡林浩特'
          },
          {
            'citysName': '二连浩特'
          },
          {
            'citysName': '丰镇'
          }
        ],
        'provinceName': '内蒙古'
      },
      {
        'citys': [
          {
            'citysName': '沈阳'
          },
          {
            'citysName': '大连'
          },
          {
            'citysName': '朝阳'
          },
          {
            'citysName': '阜新'
          },
          {
            'citysName': '铁岭'
          },
          {
            'citysName': '抚顺'
          },
          {
            'citysName': '本溪'
          },
          {
            'citysName': '辽阳'
          },
          {
            'citysName': '鞍山'
          },
          {
            'citysName': '丹东'
          },
          {
            'citysName': '营口'
          },
          {
            'citysName': '盘锦'
          },
          {
            'citysName': '锦州'
          },
          {
            'citysName': '葫芦岛'
          },
          {
            'citysName': '新民'
          },
          {
            'citysName': '瓦房店'
          },
          {
            'citysName': '庄河'
          },
          {
            'citysName': '北票'
          },
          {
            'citysName': '凌源'
          },
          {
            'citysName': '调兵山'
          },
          {
            'citysName': '开原'
          },
          {
            'citysName': '灯塔'
          },
          {
            'citysName': '海城'
          },
          {
            'citysName': '凤城'
          },
          {
            'citysName': '东港'
          },
          {
            'citysName': '大石桥'
          },
          {
            'citysName': '盖州'
          },
          {
            'citysName': '凌海'
          },
          {
            'citysName': '北镇'
          },
          {
            'citysName': '兴城'
          }
        ],
        'provinceName': '辽宁'
      },
      {
        'citys': [
          {
            'citysName': '长春'
          },
          {
            'citysName': '吉林'
          },
          {
            'citysName': '白城'
          },
          {
            'citysName': '松原'
          },
          {
            'citysName': '四平'
          },
          {
            'citysName': '辽源'
          },
          {
            'citysName': '通化'
          },
          {
            'citysName': '白山'
          },
          {
            'citysName': '德惠'
          },
          {
            'citysName': '榆树'
          },
          {
            'citysName': '磐石'
          },
          {
            'citysName': '蛟河'
          },
          {
            'citysName': '桦甸'
          },
          {
            'citysName': '舒兰'
          },
          {
            'citysName': '洮南'
          },
          {
            'citysName': '大安'
          },
          {
            'citysName': '双辽'
          },
          {
            'citysName': '公主岭'
          },
          {
            'citysName': '梅河口'
          },
          {
            'citysName': '集安'
          },
          {
            'citysName': '临江'
          },
          {
            'citysName': '延吉'
          },
          {
            'citysName': '图们'
          },
          {
            'citysName': '敦化'
          },
          {
            'citysName': '珲春'
          },
          {
            'citysName': '龙井'
          },
          {
            'citysName': '和龙'
          },
          {
            'citysName': '扶余'
          }
        ],
        'provinceName': '吉林'
      },
      {
        'citys': [
          {
            'citysName': '哈尔滨'
          },
          {
            'citysName': '齐齐哈尔'
          },
          {
            'citysName': '黑河'
          },
          {
            'citysName': '大庆'
          },
          {
            'citysName': '伊春'
          },
          {
            'citysName': '鹤岗'
          },
          {
            'citysName': '佳木斯'
          },
          {
            'citysName': '双鸭山'
          },
          {
            'citysName': '七台河'
          },
          {
            'citysName': '鸡西'
          },
          {
            'citysName': '牡丹江'
          },
          {
            'citysName': '绥化'
          },
          {
            'citysName': '尚志'
          },
          {
            'citysName': '五常'
          },
          {
            'citysName': '讷河'
          },
          {
            'citysName': '北安'
          },
          {
            'citysName': '五大连池'
          },
          {
            'citysName': '铁力'
          },
          {
            'citysName': '同江'
          },
          {
            'citysName': '富锦'
          },
          {
            'citysName': '虎林'
          },
          {
            'citysName': '密山'
          },
          {
            'citysName': '绥芬河'
          },
          {
            'citysName': '海林'
          },
          {
            'citysName': '宁安'
          },
          {
            'citysName': '安达'
          },
          {
            'citysName': '肇东'
          },
          {
            'citysName': '海伦'
          },
          {
            'citysName': '穆棱'
          },
          {
            'citysName': '东宁'
          },
          {
            'citysName': '抚远'
          }
        ],
        'provinceName': '黑龙江'
      },
      {
        'citys': [
          {
            'citysName': '南京'
          },
          {
            'citysName': '徐州'
          },
          {
            'citysName': '连云港'
          },
          {
            'citysName': '宿迁'
          },
          {
            'citysName': '淮安'
          },
          {
            'citysName': '盐城'
          },
          {
            'citysName': '扬州'
          },
          {
            'citysName': '泰州'
          },
          {
            'citysName': '南通'
          },
          {
            'citysName': '镇江'
          },
          {
            'citysName': '常州'
          },
          {
            'citysName': '无锡'
          },
          {
            'citysName': '苏州'
          },
          {
            'citysName': '常熟'
          },
          {
            'citysName': '张家港'
          },
          {
            'citysName': '太仓'
          },
          {
            'citysName': '昆山'
          },
          {
            'citysName': '江阴'
          },
          {
            'citysName': '宜兴'
          },
          {
            'citysName': '溧阳'
          },
          {
            'citysName': '扬中'
          },
          {
            'citysName': '句容'
          },
          {
            'citysName': '丹阳'
          },
          {
            'citysName': '如皋'
          },
          {
            'citysName': '海门'
          },
          {
            'citysName': '启东'
          },
          {
            'citysName': '高邮'
          },
          {
            'citysName': '仪征'
          },
          {
            'citysName': '兴化'
          },
          {
            'citysName': '泰兴'
          },
          {
            'citysName': '靖江'
          },
          {
            'citysName': '东台'
          },
          {
            'citysName': '邳州'
          },
          {
            'citysName': '新沂'
          }
        ],
        'provinceName': '江苏'
      },
      {
        'citys': [
          {
            'citysName': '杭州'
          },
          {
            'citysName': '宁波'
          },
          {
            'citysName': '湖州'
          },
          {
            'citysName': '嘉兴'
          },
          {
            'citysName': '舟山'
          },
          {
            'citysName': '绍兴'
          },
          {
            'citysName': '衢州'
          },
          {
            'citysName': '金华'
          },
          {
            'citysName': '台州'
          },
          {
            'citysName': '温州'
          },
          {
            'citysName': '丽水'
          },
          {
            'citysName': '临安'
          },
          {
            'citysName': '建德'
          },
          {
            'citysName': '慈溪'
          },
          {
            'citysName': '余姚'
          },
          {
            'citysName': '平湖'
          },
          {
            'citysName': '海宁'
          },
          {
            'citysName': '桐乡'
          },
          {
            'citysName': '诸暨'
          },
          {
            'citysName': '嵊州'
          },
          {
            'citysName': '江山'
          },
          {
            'citysName': '兰溪'
          },
          {
            'citysName': '永康'
          },
          {
            'citysName': '义乌'
          },
          {
            'citysName': '东阳'
          },
          {
            'citysName': '临海'
          },
          {
            'citysName': '温岭'
          },
          {
            'citysName': '瑞安'
          },
          {
            'citysName': '乐清'
          },
          {
            'citysName': '龙泉'
          }
        ],
        'provinceName': '浙江'
      },
      {
        'citys': [
          {
            'citysName': '合肥'
          },
          {
            'citysName': '芜湖'
          },
          {
            'citysName': '蚌埠'
          },
          {
            'citysName': '淮南'
          },
          {
            'citysName': '马鞍山'
          },
          {
            'citysName': '淮北'
          },
          {
            'citysName': '铜陵'
          },
          {
            'citysName': '安庆'
          },
          {
            'citysName': '黄山'
          },
          {
            'citysName': '滁州'
          },
          {
            'citysName': '阜阳'
          },
          {
            'citysName': '宿州'
          },
          {
            'citysName': '六安'
          },
          {
            'citysName': '亳州'
          },
          {
            'citysName': '池州'
          },
          {
            'citysName': '宣城'
          },
          {
            'citysName': '巢湖'
          },
          {
            'citysName': '桐城'
          },
          {
            'citysName': '天长'
          },
          {
            'citysName': '明光'
          },
          {
            'citysName': '界首'
          },
          {
            'citysName': '宁国'
          }
        ],
        'provinceName': '安徽'
      },
      {
        'citys': [
          {
            'citysName': '厦门'
          },
          {
            'citysName': '福州'
          },
          {
            'citysName': '南平'
          },
          {
            'citysName': '三明'
          },
          {
            'citysName': '莆田'
          },
          {
            'citysName': '泉州'
          },
          {
            'citysName': '漳州'
          },
          {
            'citysName': '龙岩'
          },
          {
            'citysName': '宁德'
          },
          {
            'citysName': '福清'
          },
          {
            'citysName': '长乐'
          },
          {
            'citysName': '邵武'
          },
          {
            'citysName': '武夷山'
          },
          {
            'citysName': '建瓯'
          },
          {
            'citysName': '永安'
          },
          {
            'citysName': '石狮'
          },
          {
            'citysName': '晋江'
          },
          {
            'citysName': '南安'
          },
          {
            'citysName': '龙海'
          },
          {
            'citysName': '漳平'
          },
          {
            'citysName': '福安'
          },
          {
            'citysName': '福鼎'
          }
        ],
        'provinceName': '福建'
      },
      {
        'citys': [
          {
            'citysName': '南昌'
          },
          {
            'citysName': '九江'
          },
          {
            'citysName': '景德镇'
          },
          {
            'citysName': '鹰潭'
          },
          {
            'citysName': '新余'
          },
          {
            'citysName': '萍乡'
          },
          {
            'citysName': '赣州'
          },
          {
            'citysName': '上饶'
          },
          {
            'citysName': '抚州'
          },
          {
            'citysName': '宜春'
          },
          {
            'citysName': '吉安'
          },
          {
            'citysName': '瑞昌'
          },
          {
            'citysName': '共青城'
          },
          {
            'citysName': '乐平'
          },
          {
            'citysName': '瑞金'
          },
          {
            'citysName': '德兴'
          },
          {
            'citysName': '丰城'
          },
          {
            'citysName': '樟树'
          },
          {
            'citysName': '高安'
          },
          {
            'citysName': '井冈山'
          },
          {
            'citysName': '贵溪'
          }
        ],
        'provinceName': '江西'
      },
      {
        'citys': [
          {
            'citysName': '济南'
          },
          {
            'citysName': '青岛'
          },
          {
            'citysName': '聊城'
          },
          {
            'citysName': '德州'
          },
          {
            'citysName': '东营'
          },
          {
            'citysName': '淄博'
          },
          {
            'citysName': '潍坊'
          },
          {
            'citysName': '烟台'
          },
          {
            'citysName': '威海'
          },
          {
            'citysName': '日照'
          },
          {
            'citysName': '临沂'
          },
          {
            'citysName': '枣庄'
          },
          {
            'citysName': '济宁'
          },
          {
            'citysName': '泰安'
          },
          {
            'citysName': '莱芜'
          },
          {
            'citysName': '滨州'
          },
          {
            'citysName': '菏泽'
          },
          {
            'citysName': '胶州'
          },
          {
            'citysName': '即墨'
          },
          {
            'citysName': '平度'
          },
          {
            'citysName': '莱西'
          },
          {
            'citysName': '临清'
          },
          {
            'citysName': '乐陵'
          },
          {
            'citysName': '禹城'
          },
          {
            'citysName': '安丘'
          },
          {
            'citysName': '昌邑'
          },
          {
            'citysName': '高密'
          },
          {
            'citysName': '青州'
          },
          {
            'citysName': '诸城'
          },
          {
            'citysName': '寿光'
          },
          {
            'citysName': '栖霞'
          },
          {
            'citysName': '海阳'
          },
          {
            'citysName': '龙口'
          },
          {
            'citysName': '莱阳'
          },
          {
            'citysName': '莱州'
          },
          {
            'citysName': '蓬莱'
          },
          {
            'citysName': '招远'
          },
          {
            'citysName': '荣成'
          },
          {
            'citysName': '乳山'
          },
          {
            'citysName': '滕州'
          },
          {
            'citysName': '曲阜'
          },
          {
            'citysName': '邹城'
          },
          {
            'citysName': '新泰'
          },
          {
            'citysName': '肥城'
          }
        ],
        'provinceName': '山东'
      },
      {
        'citys': [
          {
            'citysName': '郑州'
          },
          {
            'citysName': '开封'
          },
          {
            'citysName': '洛阳'
          },
          {
            'citysName': '平顶山'
          },
          {
            'citysName': '安阳'
          },
          {
            'citysName': '鹤壁'
          },
          {
            'citysName': '新乡'
          },
          {
            'citysName': '焦作'
          },
          {
            'citysName': '濮阳'
          },
          {
            'citysName': '许昌'
          },
          {
            'citysName': '漯河'
          },
          {
            'citysName': '三门峡'
          },
          {
            'citysName': '南阳'
          },
          {
            'citysName': '商丘'
          },
          {
            'citysName': '周口'
          },
          {
            'citysName': '驻马店'
          },
          {
            'citysName': '信阳'
          },
          {
            'citysName': '荥阳'
          },
          {
            'citysName': '新郑'
          },
          {
            'citysName': '登封'
          },
          {
            'citysName': '新密'
          },
          {
            'citysName': '偃师'
          },
          {
            'citysName': '孟州'
          },
          {
            'citysName': '沁阳'
          },
          {
            'citysName': '卫辉'
          },
          {
            'citysName': '辉县'
          },
          {
            'citysName': '林州'
          },
          {
            'citysName': '禹州'
          },
          {
            'citysName': '长葛'
          },
          {
            'citysName': '舞钢'
          },
          {
            'citysName': '义马'
          },
          {
            'citysName': '灵宝'
          },
          {
            'citysName': '项城'
          },
          {
            'citysName': '巩义'
          },
          {
            'citysName': '邓州'
          },
          {
            'citysName': '永城'
          },
          {
            'citysName': '汝州'
          },
          {
            'citysName': '济源'
          }
        ],
        'provinceName': '河南'
      },
      {
        'citys': [
          {
            'citysName': '武汉'
          },
          {
            'citysName': '十堰'
          },
          {
            'citysName': '襄阳'
          },
          {
            'citysName': '荆门'
          },
          {
            'citysName': '孝感'
          },
          {
            'citysName': '黄冈'
          },
          {
            'citysName': '鄂州'
          },
          {
            'citysName': '黄石'
          },
          {
            'citysName': '咸宁'
          },
          {
            'citysName': '荆州'
          },
          {
            'citysName': '宜昌'
          },
          {
            'citysName': '随州'
          },
          {
            'citysName': '丹江口'
          },
          {
            'citysName': '老河口'
          },
          {
            'citysName': '枣阳'
          },
          {
            'citysName': '宜城'
          },
          {
            'citysName': '钟祥'
          },
          {
            'citysName': '汉川'
          },
          {
            'citysName': '应城'
          },
          {
            'citysName': '安陆'
          },
          {
            'citysName': '广水'
          },
          {
            'citysName': '麻城'
          },
          {
            'citysName': '武穴'
          },
          {
            'citysName': '大冶'
          },
          {
            'citysName': '赤壁'
          },
          {
            'citysName': '石首'
          },
          {
            'citysName': '洪湖'
          },
          {
            'citysName': '松滋'
          },
          {
            'citysName': '宜都'
          },
          {
            'citysName': '枝江'
          },
          {
            'citysName': '当阳'
          },
          {
            'citysName': '恩施'
          },
          {
            'citysName': '利川'
          },
          {
            'citysName': '仙桃'
          },
          {
            'citysName': '天门'
          },
          {
            'citysName': '潜江'
          }
        ],
        'provinceName': '湖北'
      },
      {
        'citys': [
          {
            'citysName': '长沙'
          },
          {
            'citysName': '衡阳'
          },
          {
            'citysName': '张家界'
          },
          {
            'citysName': '常德'
          },
          {
            'citysName': '益阳'
          },
          {
            'citysName': '岳阳'
          },
          {
            'citysName': '株洲'
          },
          {
            'citysName': '湘潭'
          },
          {
            'citysName': '郴州'
          },
          {
            'citysName': '永州'
          },
          {
            'citysName': '邵阳'
          },
          {
            'citysName': '怀化'
          },
          {
            'citysName': '娄底'
          },
          {
            'citysName': '耒阳'
          },
          {
            'citysName': '常宁'
          },
          {
            'citysName': '浏阳'
          },
          {
            'citysName': '津'
          },
          {
            'citysName': '沅江'
          },
          {
            'citysName': '汨罗'
          },
          {
            'citysName': '临湘'
          },
          {
            'citysName': '醴陵'
          },
          {
            'citysName': '湘乡'
          },
          {
            'citysName': '韶山'
          },
          {
            'citysName': '资兴'
          },
          {
            'citysName': '武冈'
          },
          {
            'citysName': '洪江'
          },
          {
            'citysName': '冷水江'
          },
          {
            'citysName': '涟源'
          },
          {
            'citysName': '吉首'
          }
        ],
        'provinceName': '湖南'
      },
      {
        'citys': [
          {
            'citysName': '广州'
          },
          {
            'citysName': '深圳'
          },
          {
            'citysName': '清远'
          },
          {
            'citysName': '韶关'
          },
          {
            'citysName': '河源'
          },
          {
            'citysName': '梅州'
          },
          {
            'citysName': '潮州'
          },
          {
            'citysName': '汕头'
          },
          {
            'citysName': '揭阳'
          },
          {
            'citysName': '汕尾'
          },
          {
            'citysName': '惠州'
          },
          {
            'citysName': '东莞'
          },
          {
            'citysName': '珠海'
          },
          {
            'citysName': '中山'
          },
          {
            'citysName': '江门'
          },
          {
            'citysName': '佛山'
          },
          {
            'citysName': '肇庆'
          },
          {
            'citysName': '云浮'
          },
          {
            'citysName': '阳江'
          },
          {
            'citysName': '茂名'
          },
          {
            'citysName': '湛江'
          },
          {
            'citysName': '英德'
          },
          {
            'citysName': '连州'
          },
          {
            'citysName': '乐昌'
          },
          {
            'citysName': '南雄'
          },
          {
            'citysName': '兴宁'
          },
          {
            'citysName': '普宁'
          },
          {
            'citysName': '陆丰'
          },
          {
            'citysName': '恩平'
          },
          {
            'citysName': '台山'
          },
          {
            'citysName': '开平'
          },
          {
            'citysName': '鹤山'
          },
          {
            'citysName': '四会'
          },
          {
            'citysName': '罗定'
          },
          {
            'citysName': '阳春'
          },
          {
            'citysName': '化州'
          },
          {
            'citysName': '信宜'
          },
          {
            'citysName': '高州'
          },
          {
            'citysName': '吴川'
          },
          {
            'citysName': '廉江'
          },
          {
            'citysName': '雷州'
          }
        ],
        'provinceName': '广东'
      },
      {
        'citys': [
          {
            'citysName': '南宁'
          },
          {
            'citysName': '桂林'
          },
          {
            'citysName': '柳州'
          },
          {
            'citysName': '梧州'
          },
          {
            'citysName': '贵港'
          },
          {
            'citysName': '玉林'
          },
          {
            'citysName': '钦州'
          },
          {
            'citysName': '北海'
          },
          {
            'citysName': '防城港'
          },
          {
            'citysName': '崇左'
          },
          {
            'citysName': '百色'
          },
          {
            'citysName': '河池'
          },
          {
            'citysName': '来宾'
          },
          {
            'citysName': '贺州'
          },
          {
            'citysName': '岑溪'
          },
          {
            'citysName': '桂平'
          },
          {
            'citysName': '北流'
          },
          {
            'citysName': '东兴'
          },
          {
            'citysName': '凭祥'
          },
          {
            'citysName': '宜州'
          },
          {
            'citysName': '合山'
          },
          {
            'citysName': '靖西'
          }
        ],
        'provinceName': '广西'
      },
      {
        'citys': [
          {
            'citysName': '海口'
          },
          {
            'citysName': '三亚'
          },
          {
            'citysName': '三沙'
          },
          {
            'citysName': '儋州'
          },
          {
            'citysName': '文昌'
          },
          {
            'citysName': '琼海'
          },
          {
            'citysName': '万宁'
          },
          {
            'citysName': '东方'
          },
          {
            'citysName': '五指山'
          }
        ],
        'provinceName': '海南'
      },
      {
        'citys': [
          {
            'citysName': '成都'
          },
          {
            'citysName': '广元'
          },
          {
            'citysName': '绵阳'
          },
          {
            'citysName': '德阳'
          },
          {
            'citysName': '南充'
          },
          {
            'citysName': '广安'
          },
          {
            'citysName': '遂宁'
          },
          {
            'citysName': '内江'
          },
          {
            'citysName': '乐山'
          },
          {
            'citysName': '自贡'
          },
          {
            'citysName': '泸州'
          },
          {
            'citysName': '宜宾'
          },
          {
            'citysName': '攀枝花'
          },
          {
            'citysName': '巴中'
          },
          {
            'citysName': '达州'
          },
          {
            'citysName': '资阳'
          },
          {
            'citysName': '眉山'
          },
          {
            'citysName': '雅安'
          },
          {
            'citysName': '崇州'
          },
          {
            'citysName': '邛崃'
          },
          {
            'citysName': '都江堰'
          },
          {
            'citysName': '彭州'
          },
          {
            'citysName': '江油'
          },
          {
            'citysName': '什邡'
          },
          {
            'citysName': '广汉'
          },
          {
            'citysName': '绵竹'
          },
          {
            'citysName': '阆中'
          },
          {
            'citysName': '华蓥'
          },
          {
            'citysName': '峨眉山'
          },
          {
            'citysName': '万源'
          },
          {
            'citysName': '简阳'
          },
          {
            'citysName': '西昌'
          },
          {
            'citysName': '康定'
          },
          {
            'citysName': '马尔康'
          }
        ],
        'provinceName': '四川'
      },
      {
        'citys': [
          {
            'citysName': '贵阳'
          },
          {
            'citysName': '六盘水'
          },
          {
            'citysName': '遵义'
          },
          {
            'citysName': '安顺'
          },
          {
            'citysName': '毕节'
          },
          {
            'citysName': '铜仁'
          },
          {
            'citysName': '清镇'
          },
          {
            'citysName': '赤水'
          },
          {
            'citysName': '仁怀'
          },
          {
            'citysName': '凯里'
          },
          {
            'citysName': '都匀'
          },
          {
            'citysName': '兴义'
          },
          {
            'citysName': '福泉'
          }
        ],
        'provinceName': '贵州'
      },
      {
        'citys': [
          {
            'citysName': '昆明'
          },
          {
            'citysName': '曲靖'
          },
          {
            'citysName': '玉溪'
          },
          {
            'citysName': '丽江'
          },
          {
            'citysName': '昭通'
          },
          {
            'citysName': '普洱'
          },
          {
            'citysName': '临沧'
          },
          {
            'citysName': '保山'
          },
          {
            'citysName': '安宁'
          },
          {
            'citysName': '宣威'
          },
          {
            'citysName': '芒'
          },
          {
            'citysName': '瑞丽'
          },
          {
            'citysName': '大理'
          },
          {
            'citysName': '楚雄'
          },
          {
            'citysName': '个旧'
          },
          {
            'citysName': '开远'
          },
          {
            'citysName': '蒙自'
          },
          {
            'citysName': '弥勒'
          },
          {
            'citysName': '景洪'
          },
          {
            'citysName': '文山'
          },
          {
            'citysName': '香格里拉'
          },
          {
            'citysName': '腾冲'
          }
        ],
        'provinceName': '云南'
      },
      {
        'citys': [
          {
            'citysName': '西安'
          },
          {
            'citysName': '延安'
          },
          {
            'citysName': '铜川'
          },
          {
            'citysName': '渭南'
          },
          {
            'citysName': '咸阳'
          },
          {
            'citysName': '宝鸡'
          },
          {
            'citysName': '汉中'
          },
          {
            'citysName': '榆林'
          },
          {
            'citysName': '商洛'
          },
          {
            'citysName': '安康'
          },
          {
            'citysName': '韩城'
          },
          {
            'citysName': '华阴'
          },
          {
            'citysName': '兴平'
          }
        ],
        'provinceName': '陕西'
      },
      {
        'citys': [
          {
            'citysName': '兰州'
          },
          {
            'citysName': '嘉峪关'
          },
          {
            'citysName': '金昌'
          },
          {
            'citysName': '白银'
          },
          {
            'citysName': '天水'
          },
          {
            'citysName': '酒泉'
          },
          {
            'citysName': '张掖'
          },
          {
            'citysName': '武威'
          },
          {
            'citysName': '庆阳'
          },
          {
            'citysName': '平凉'
          },
          {
            'citysName': '定西'
          },
          {
            'citysName': '陇南'
          },
          {
            'citysName': '玉门'
          },
          {
            'citysName': '敦煌'
          },
          {
            'citysName': '临夏'
          },
          {
            'citysName': '合作'
          }
        ],
        'provinceName': '甘肃'
      },
      {
        'citys': [
          {
            'citysName': '西宁'
          },
          {
            'citysName': '海东'
          },
          {
            'citysName': '格尔木'
          },
          {
            'citysName': '德令哈'
          },
          {
            'citysName': '玉树'
          }
        ],
        'provinceName': '青海'
      },
      {
        'citys': [
          {
            'citysName': '拉萨'
          },
          {
            'citysName': '日喀则'
          },
          {
            'citysName': '昌都'
          },
          {
            'citysName': '林芝'
          },
          {
            'citysName': '山南'
          }
        ],
        'provinceName': '西藏'
      },
      {
        'citys': [
          {
            'citysName': '银川'
          },
          {
            'citysName': '石嘴山'
          },
          {
            'citysName': '吴忠'
          },
          {
            'citysName': '中卫'
          },
          {
            'citysName': '固原'
          },
          {
            'citysName': '灵武'
          },
          {
            'citysName': '青铜峡'
          }
        ],
        'provinceName': '宁夏'
      },
      {
        'citys': [
          {
            'citysName': '台北'
          },
          {
            'citysName': '新北'
          },
          {
            'citysName': '桃园'
          },
          {
            'citysName': '台中'
          },
          {
            'citysName': '台南'
          },
          {
            'citysName': '高雄'
          },
          {
            'citysName': '基隆'
          },
          {
            'citysName': '新竹'
          },
          {
            'citysName': '嘉义'
          }
        ],
        'provinceName': '台湾'
      },
      {
        'citys': [
          {
            'citysName': '北京'
          }
        ],
        'provinceName': '北京'
      },
      {
        'citys': [
          {
            'citysName': '天津'
          }
        ],
        'provinceName': '天津'
      },
      {
        'citys': [
          {
            'citysName': '上海'
          }
        ],
        'provinceName': '上海'
      },
      {
        'citys': [
          {
            'citysName': '重庆'
          }
        ],
        'provinceName': '重庆'
      },
      {
        'citys': [
          {
            'citysName': '香港特别行政区'
          }
        ],
        'provinceName': '香港'
      },
      {
        'citys': [
          {
            'citysName': '澳门特别行政区'
          }
        ],
        'provinceName': '澳门'
      },
      {
        'citys': [
          {
            'citysName': '乌鲁木齐'
          },
          {
            'citysName': '克拉玛依'
          },
          {
            'citysName': '吐鲁番'
          },
          {
            'citysName': '哈密'
          },
          {
            'citysName': '喀什'
          },
          {
            'citysName': '阿克苏'
          },
          {
            'citysName': '和田'
          },
          {
            'citysName': '阿图什'
          },
          {
            'citysName': '阿拉山口'
          },
          {
            'citysName': '博乐'
          },
          {
            'citysName': '昌吉'
          },
          {
            'citysName': '阜康'
          },
          {
            'citysName': '库尔勒'
          },
          {
            'citysName': '伊宁'
          },
          {
            'citysName': '奎屯'
          },
          {
            'citysName': '塔城'
          },
          {
            'citysName': '乌苏'
          },
          {
            'citysName': '阿勒泰'
          },
          {
            'citysName': '霍尔果斯'
          },
          {
            'citysName': '石河子'
          },
          {
            'citysName': '阿拉尔'
          },
          {
            'citysName': '图木舒克'
          },
          {
            'citysName': '五家渠'
          },
          {
            'citysName': '北屯'
          },
          {
            'citysName': '铁门关'
          },
          {
            'citysName': '双河'
          },
          {
            'citysName': '可克达拉'
          },
          {
            'citysName': '昆玉'
          }
        ],
        'provinceName': '新疆'
      }
    ]
  }

  // 市echart
  var data2 = []
  dataO.provinces.forEach(cities => {
    cities.citys.forEach(city => {
      var dataTemp1 = { name: '', value: 0 }
      dataTemp1.name = city.citysName
      data2.push(dataTemp1)
    })
  })

  data.nodes.forEach(node => {
    data2.forEach(dataCount => {
      if ((node.labels.includes('代理机构') || node.labels.includes('高新技术企业') || node.labels.includes('单位')) && node.properties.name.includes(dataCount.name)) {
        dataCount.value = dataCount.value + 1
      } else if ((node.labels.includes('专利') && node.properties.reqaddr != null) && node.properties.reqaddr.includes(dataCount.name)) {
        dataCount.value = dataCount.value + 1
      } else if ((node.labels.includes('期刊') || node.labels.includes('会议论文') || node.labels.includes('标准')) && node.properties.city.includes(dataCount.name)) {
        dataCount.value = dataCount.value + 1
      } else if (((node.labels.includes('专家') || node.labels.includes('科学装置')) && node.properties.address != null && node.properties.address.includes(dataCount.name))) {
        dataCount.value = dataCount.value + 1
      } else if ((node.labels.includes('供应商') && node.properties.sup_address != null && node.properties.sup_address.includes(dataCount))) {
        dataCount.value = dataCount.value + 1
      }
    })
  })

  // 省echart
  var data3 = []
  dataO.provinces.forEach(cities => {
    var dataTemp3 = { name: '', value: 0 }
    dataTemp3.name = cities.provinceName
    data3.push(dataTemp3)
  })
  data2.forEach(dataPiece => {
    if (dataPiece.value !== 0) {
      dataO.provinces.forEach(cities => {
        cities.citys.forEach(city => {
          if (city.citysName === dataPiece.name) {
            data3.forEach(province => {
              if (province.name === cities.provinceName) {
              // 将城市的统计值加到省统计值中
                province.value = province.value + dataPiece.value
              }
            })
          }
        })
      })
    }
  })
  console.log('data3:', data3)
  window.mapChinaData = data3
}

export function result2echartWordcloud(data) {
  var echartData = []
  data.forEach(item => {
    if (item !== ',' && item !== '，' && item !== '.' && item !== '。' && item !== ':' && item !== '：' && item !== '、' && item !== '；' && item !== ';' && item !== ' ' && item !== '-' && item !== '_' && item !== 'is' && item !== 'a' && item !== 'and' && item !== 'with' && item !== 'or' && item !== 'to' && item !== 'other' && item !== 'of' && item !== 'the' && item !== 'that' && item !== 'for') {
      var obj = {}
      obj['name'] = item
      // obj['value'] = Math.ceil(Math.random() * 10)
      obj['value'] = 10
      echartData.push(obj)
    }
  })

  window.echartWordcloud = echartData
}

export function result2echartTree(data, searchRadio, treeTrunkNode = '') {
  var label = []
  var id = []
  var echartData = {
    name: '产品资源',
    'children': []
  }
  data.nodes.forEach(node => {
    if (searchRadio === 'mainStructure') {
      node.labels.forEach(item => {
        if (item.includes(treeTrunkNode) && !label.includes(item)) {
          label.push(item)
        }
      })
    } else if (searchRadio === 'product') {
      if (!label.includes(getProductLabel(node.labels))) {
        label.push(getProductLabel(node.labels))
      }
    }
  })
  if (searchRadio === 'mainStructure') {
    for (let i = 0; i < label.length; i++) {
      echartData.children.push({ 'name': label[i].split('_').slice(-1)[0], 'value': label[i], 'label': '', 'children': [] }) // .split('_').slice(-1, )[0].slice(2, )
    }
  } else if (searchRadio === 'product') {
    for (let i = 0; i < label.length; i++) {
      echartData.children.push({ 'name': label[i], 'value': label[i], 'label': label[i], 'children': [] }) // .split('_').slice(-1, )[0].slice(2, )
    }
  }
  data.nodes.forEach(node => {
    for (let i = 0; i < label.length; i++) {
      node.labels.forEach(nodeLabel => {
        if (echartData.children[i].value === nodeLabel && !id.includes(node.id)) {
        // 树节点上色
          if (echartData.children[i].name.includes('基本')) {
            echartData.children[i].itemStyle = {
              color: '#67C23A',
              borderColor: '#67C23A'
            }
          } else if (echartData.children[i].name.includes('可选')) {
            echartData.children[i].itemStyle = {
              color: '#E6A23C',
              borderColor: '#E6A23C'
            }
          } else if (echartData.children[i].name.includes('必选')) {
            echartData.children[i].itemStyle = {
              color: '#409EFF',
              borderColor: '#409EFF'
            }
          }

          id.push(node.id)

          echartData.children[i].children.push({ 'name': node.properties.name, 'value': node.properties['名称'], 'label': nodeLabel, 'children': [] })
        // const k = echartData.children[i].children.length
        // for (let j = 0; j < underscore.keys(node.properties).length; j++) {
        //   echartData.children[i].children[k - 1].children.push({ 'name': underscore.values(node.properties)[j], 'children': [] })
        // }
        }
      })
    }
  })
  window.echartTree = echartData
}

export function result2MainStrCol(data) {
  var dataTmp = data.split('$')[0].split('\n')
  var res = []
  dataTmp.forEach(item => {
    var col = item.split(',')
    res.push(col)
  })
  return res
}

export function result2EvalCol(data) {
  var dataTmp = data.split('$').slice(1, -1)
  var res = [['cluster', 'mty1', 'mty2', 'mty3', 'mty4', 'mty5', 'mty6', 'mty7', 'mdl']]
  for (var i = 0; i < dataTmp.length; i = i + 2) {
    var bar = dataTmp[i + 1].replace(/\n/g, '').split(',')
    bar.unshift(dataTmp[i].replace(/\n/g, ''))
    // console.log('sadfasdf', bar)
    res.push(bar)
  }
  return res
}
export function readXLSX(file) {
  const nameSplit = file.name.split('.')
  const format = nameSplit[nameSplit.length - 1]
  if (!['xlsx', 'csv'].includes(format)) {
    return false
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file.raw)
    reader.onload = evt => {
      const data = evt.target.result // 读到的数据
      const workbook = XLSX.read(data, { type: 'binary' })
      resolve(workbook)
    }
  })
}

export function XLSX2Tabel(result, sheet) {
  var inputTabelList = []
  if (!result.Sheets[sheet]) {
    return []
  } else {
    var dataTmp = result.Sheets[sheet]
    var col = dataTmp['!ref'].split(':')[1].replace(/[^a-zA-Z]/g, '') // A
    var row = dataTmp['!ref'].split(':')[1].replace(/[^\d]/g, '') // 1
    // 英文 .replace(/[^a-zA-Z]/g,'')
    // 中文 .replace(/[^\u4E00-\u9FA5]/g,'')
    // 数字 .replace(/[^\d]/g, '')

    // 被写死在50行，z列内，行列读取需要优化。
    if (Number(row) > 200) {
      row = 200
    }
    if (col.length > 1) {
      col = 'Z'
    }
    for (var i = 1; i <= row; i++) {
      var rowTmp = {}
      for (var j = 0; j < 26; j++) {
        var key = String.fromCharCode((65 + j)) + i
        if (String.fromCharCode((65 + j)) === col) {
          if (!dataTmp[key]) {
            rowTmp[j] = 'null'
          } else {
            rowTmp[j] = dataTmp[key].v
          }
          inputTabelList.push(rowTmp)
          break
        } else {
          if (!dataTmp[key]) {
            rowTmp[j] = 'null'
          } else {
            rowTmp[j] = dataTmp[key].v
          }
        }
      }
    }
  }
  return inputTabelList
}

export const knowledgeService = {
  getInit: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/init', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  initTable: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryKgInterface', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  /* getInitPatent: function(params) {
    if (!params) {
      params = {}
    }
    return request({
      url: NEO4J_HOST + '/kg/init',
      method: 'get',
      params
    })
  },*/
  getInitPatent: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/initPatent', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  nodeClick: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/nodeClick', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  nodeClickSecrete: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/nodeClickSecrete', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  getAllLabel: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/getAllLabel', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  getSchema: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/getSchema', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  // jiagu toolkit
  keywordExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/keywordExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  cutExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/cutExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  nerExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/nerExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  posExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/posExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  kgExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/kgExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  sentimentExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/sentimentExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  nluExtraction: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/nluExtraction', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },

  shortestPath: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/shortestPath', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  assertion: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/assertion', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryRelationship: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryRelationship', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  deleteRelationship: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/deleteRelationship', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  querySingleLabel: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/querySingleLabel', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryLabel: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryLabel', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryLabelCount: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryLabelCount', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryEntity: async function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryEntity', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryTail: async function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryTail', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryChild: async function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryChild', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryPathLength: async function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryPathLength', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryKgInterface: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/queryKgInterface', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  queryPrecise: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/querySingleResource', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  setEntity: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/setEntity', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  deleteDB: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/deleteDB', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  sunburstModel: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/sunburstModel', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  supplierPart: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/supplierPart', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  // queryWf: function(params) {
  //   return request({
  //     url: WF + '/EsSearch',
  //     method: 'get',
  //     params
  //   })
  // },
  // queryWfCount: function(params) {
  //   return request({
  //     url: WF + '/Count',
  //     method: 'get',
  //     params
  //   })
  // },
  // queryWfAnalysis: function(params) {
  //   return request({
  //     url: WF + '/KnowledgeTrendAnalysis',
  //     method: 'get',
  //     params
  //   })
  // },
  device2kg: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/device2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  // wfPatent2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfPatent2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfPaper2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfPaper2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfMeeting2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfMeeting2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfStandard2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfStandard2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfRef2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfRef2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfScholar2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfScholar2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfKjResource2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfKjResource2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // wfKjComment2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/wfKjComment2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // nbPatent2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/nbPatent2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // nbAgency2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/nbAgency2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // nbHignTech2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/nbHignTech2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // nbExpert2kg: function(params) {
  //   var param = new FormData()
  //   for (const item in params) {
  //     param.append(item, params[item])
  //   }
  //   return axios.post(NEO4J_HOST + '/kg/nbExpert2kg', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  // },
  // queryNbAgency: function(params) {
  //   return request({
  //     url: NB + '/PatentService',
  //     method: 'get',
  //     params
  //   })
  // },
  // queryNbPatent: function(params) {
  //   return request({
  //     url: NB + '/PatentDetail',
  //     method: 'get',
  //     params
  //   })
  // },
  // queryNbHignTech: function(params) {
  //   return request({
  //     url: NB + '/HignTech',
  //     method: 'get',
  //     params
  //   })
  // },
  // queryNbExpert: function(params) {
  //   return request({
  //     url: NB + '/Expert',
  //     method: 'get',
  //     params
  //   })
  // },
  fileDownloading: function(params) {
    return request({
      url: NEO4J_HOST + '/file/download',
      method: 'get',
      params
    })
  },
  fileUploading: function(params) {
    return axios.post(NEO4J_HOST + '/file/uploadKG', params, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  loadcsvMergeOnEntity: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/loadcsvMergeOnEntity', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  loadcsvMergeRelationshipBatchRel: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/loadcsvMergeRelationshipBatchRel', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  loadcsvMergeAll: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/loadcsvMergeAll', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  loadcsvMergeDeProRule: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/loadcsvMergeDeProRule', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  loadcsvMergeDeParRule: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/loadcsvMergeDeParRule', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  words: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/words', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  graphEmbeddingNode2Vec: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/nlp/graphEmbeddingNode2Vec', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },

  // 华为模块化
  productConfigurationGraph: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationGraph', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationList: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationList', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationTree: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationTree', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRule: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRule', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRuleGraph: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRuleGraph', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRuleQuery: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRuleQuery', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRuleReasoning: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRuleReasoning', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRuleCompletion: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRuleCompletion', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRuleGenList: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRuleGenList', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productConfigurationRuleGenGraph: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productConfigurationRuleGenGraph', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  rulePreProcess: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/rulePreProcess', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  mainStructure: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/mainStructure', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  mainstructureEnd2End: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/mainstructureEnd2End', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  processSimStep1: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/processSimStep1', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  processSimStep2: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/processSimStep2', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  productionSchedule: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/productionSchedule', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  AHP: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/AHP', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  partition: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/partition', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  XTOproportion: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/XTOproportion', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  producePriority: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/producePriority', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  XTOforecast: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/XTOforecast', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  independenceEval: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/independenceEval', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  },
  // PLM集成
  PLMIntegration: function(params) {
    var param = new FormData()
    for (const item in params) {
      param.append(item, params[item])
    }
    return axios.post(NEO4J_HOST + '/kg/PLMIntegration', param, { headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7' }})
  }
}
