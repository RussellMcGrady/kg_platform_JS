<template>
  <div id="app">
    <div style="display: flex;flex-direction: row;height:60px;line-height:60px;background-color:#304156;color:white;font-weight:600;font-size:25px;justify-content: left;">
      <div style="flex:2;display: flex;flex-direction: row;">
        <div style="margin-left: 40px;">
          工业知识图谱平台
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
