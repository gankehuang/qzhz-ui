<template>
  <div class="dashboard-editor-container">
    <div class="box">
      <img class="img" :src="logo" alt="" />
      欢迎您使用全总互助管理后台
    </div>
  </div>
</template>
<script>
import logoImg from "@/assets/logo/logo.png";
export default {
  name: "Index",
  data() {
    return {
      logo: logoImg,
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: #20b2aa;
  color: #ffffff;
  position: absolute;
  height: 100%;
  line-height: 700px;
  width: 100%;

  text-align: center;
  .box {
    font-size: 38px;
    .img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
