<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="toMainStructure" @mouseenter="onFocus">
          <div class="card-panel-icon-wrapper icon-patent">
            <svg-icon icon-class="patent-resource" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              主结构
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="toProductConfig">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="expert-resource" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              配置设计
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="toPatent">
          <div class="card-panel-icon-wrapper icon-supplier">
            <svg-icon icon-class="supRes" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              专利图谱
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="toServiceOrg">
          <div class="card-panel-icon-wrapper icon-device">
            <svg-icon icon-class="device" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              文献图谱
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  components: {
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    toMainStructure() {
      this.$goRoute({ name: '主结构生成' })
    },
    toProductConfig() {
      this.$goRoute({ name: '配置设计' })
    },
    toPatent() {
      this.$goRoute({ name: '专利资源' })
    },
    toServiceOrg() {
      this.$goRoute({ name: '专利代理机构' })
    },

    onFocus() {
      /* this.$notify({
        message: 'focus',
        type: 'success',
        duration: 3000
      })*/
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 80px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }
      .icon-patent {
        background: #E6A23C;
      }

      .icon-message {
        background: #bdf736;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }

      .icon-product {
        background: #ff7729e8
      }

      .icon-supplier {
        background: #d83cd0
      }

      .icon-device {
        background: #463cd8
      }

      .icon-graphApp {
        background: #333232
      }
    }

    .icon-people {
      color: #40c9c6;
    }
    .icon-patent {
      color: #E6A23C;
    }
    .icon-message {
      color: #bdf736;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .icon-product {
      color: #ff7729e8
    }

    .icon-supplier {
      color: #d83cd0
    }

    .icon-device {
      color: #463cd8
    }

    .icon-graphApp {
      color: #333232
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 28px;
    }

    .card-panel-description {
      float: flex;
      font-weight: bold;
      margin: 14px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 60px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 16px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
