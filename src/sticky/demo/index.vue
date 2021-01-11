<template>
  <demo-section>
    <demo-block :title="t('basicUsage')">
      <van-sticky>
        <van-button type="primary" style="margin-left: 15px;">
          {{ t('basicUsage') }}
        </van-button>
      </van-sticky>
    </demo-block>

    <demo-block :title="t('offsetTop')">
      <van-sticky :offset-top="50">
        <van-button type="info" style="margin-left: 115px;">
          {{ t('offsetTop') }}
        </van-button>
      </van-sticky>
    </demo-block>

    <demo-block v-if="!isWeapp" :title="t('setContainer')">
      <div ref="container" style="height: 150px; background-color: #fff;">
        <van-sticky :container="container">
          <van-button type="warning" style="margin-left: 215px;">
            {{ t('setContainer') }}
          </van-button>
        </van-sticky>
      </div>
    </demo-block>

    <div class="position-bottom">
      <demo-block :title="t('positionBottom')">
        <van-sticky position="bottom">
          <van-button type="primary" style="margin-left: 15px;">
            {{ t('positionBottom') }}
          </van-button>
        </van-sticky>
      </demo-block>

      <demo-block :title="t('offsetBottom')">
        <van-sticky :offset-bottom="50" position="bottom">
          <van-button type="info" style="margin-left: 115px;">
            {{ t('offsetBottom') }}
          </van-button>
        </van-sticky>
      </demo-block>

      <demo-block v-if="!isWeapp" :title="t('setBottomContainer')">
        <div ref="bottomContainer" style="height: 150px; background-color: #fff;">
          <van-sticky :container="bottomContainer" position="bottom">
            <van-button type="warning" style="margin-left: 215px;">
              {{ t('setBottomContainer') }}
            </van-button>
          </van-sticky>
        </div>
      </demo-block>
    </div>

  </demo-section>
</template>

<script>
export default {
  i18n: {
    'zh-CN': {
      offsetTop: '吸顶距离',
      setContainer: '指定容器',
      positionBottom: '吸底用法',
      offsetBottom: '吸底距离',
      setBottomContainer: '容器吸底',
    },
    'en-US': {
      offsetTop: 'Offset Top',
      setContainer: 'Set Container',
      positionBottom: 'Position Bottom',
      offsetBottom: 'Offset Bottom',
      setBottomContainer: 'Set Bottom Container',
    },
  },

  data() {
    return {
      container: null,
      bottomContainer: null,
    };
  },

  mounted() {
    this.container = this.$refs.container;
    this.bottomContainer = this.$refs.bottomContainer;
  },
};
</script>

<style lang="less">
@import '../../style/var';

.demo-sticky {
  height: 200vh;

  .van-button {
    margin-left: @padding-md;
  }
  .position-bottom {
    padding-top: 30vh;
    padding-bottom: 30vh;
  }
}
</style>
