/* eslint-disable new-cap */
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */

export function reset(input, url) {
  // 向nodejs搭建的服务器发送请求
  $.ajax({
    type: 'post',
    async: false,
    url: url,
    contentType: 'application/json',
    dataType: 'json',
    crossDomain: true,
    data: input,
    processData: false,
    success: function(data) {
      for (var n in data.data.nodes) {
        data.data.nodes[n].id = data.data.nodes[n].identity.low
      }
      for (var r in data.data.relationships) {
        data.data.relationships[r].id =
          data.data.relationships[r].identity.low
      }

      var show = JSON.parse(input)
      show.limit = 10
      show = JSON.stringify(show)
      $.ajax({
        type: 'post',
        async: false,
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        crossDomain: true,
        data: show,
        processData: false,
        success: function(data) {
          for (var n in data.data.nodes) {
            data.data.nodes[n].id = data.data.nodes[n].identity.low
          }
          for (var r in data.data.relationships) {
            data.data.relationships[r].id =
              data.data.relationships[r].identity.low
          }
          // 图谱需求submit
          window.neo4jd3.resetWithNeo4jData(data.data)
          window.neo4jd3Edit.resetWithNeo4jData(data.data)
        }
      })

      window.queryData = data.data
      // console.log(this.queryData)
    },
    error: function(err) {
      console.log(err)
    }
  })
}

export function edit(H, hUpdate, url) {
  var input = '{ H: ' + H + ', hUpdate: ' + hUpdate + ' }'
  console.log(input)
  // 向nodejs搭建的服务器发送请求
  $.ajax({
    type: 'post',
    async: false,
    url: url,
    contentType: 'application/json',
    dataType: 'json',
    crossDomain: true,
    data: input,
    processData: false,
    success: function(data) {
      for (var n in data.data.nodes) {
        data.data.nodes[n].id = data.data.nodes[n].identity.low
      }
      for (var r in data.data.relationships) {
        data.data.relationships[r].id =
          data.data.relationships[r].identity.low
      }
      // 图谱需求submit
      window.neo4jd3.resetWithNeo4jData(data.data)
    },
    error: function(err) {
      console.log(err)
    }
  })
}

export function query4table(input, url) {
  // 向nodejs搭建的服务器发送请求
  $.ajax({
    type: 'post',
    async: false,
    url: url,
    contentType: 'application/json',
    dataType: 'json',
    crossDomain: true,
    data: input,
    processData: false,
    success: function(data) {
      for (var n in data.data.nodes) {
        data.data.nodes[n].id = data.data.nodes[n].identity.low
      }
      for (var r in data.data.relationships) {
        data.data.relationships[r].id =
          data.data.relationships[r].identity.low
      }
      window.query4table = data.data
      // console.log(this.queryData)
    },
    error: function(err) {
      console.log(err)
    }
  })
}

export function inputParser(str) {
  window.knvalue = str.split(/[\n,]/g)
  for (var i = 0; i < window.knvalue.length; i++) {
    if (window.knvalue[i] === '') {
      window.knvalue.splice(i, 1)
      // 删除数组索引位置应保持不变
      i--
    }
  }
  console.log(window.knvalue)
}

export function queryInput(reknType, knvalue) {
  var H = '{ "label": "' + reknType[0][0] + '" , "'
  for (var i = 0; i < knvalue.length; i++) {
    H = H + reknType[0][i + 1] + '" : "' + knvalue[i] + '" , "'
  }
  H = H.slice(0, -1) + ' "skip": 0, "limit": 10 }'
  H = JSON.parse(H)
  H = JSON.stringify(H)
  window.H = H
}
