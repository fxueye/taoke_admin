<template>
  <section>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 公众号菜单管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="菜单管理" name="menu">
          <menus-editor></menus-editor>
          <div class="menu-foot">
            <el-button @click="menuSave">保存</el-button>
            <el-button @click="menuRefresh">刷新</el-button>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="事件管理" name="event">事件管理</el-tab-pane> -->
      </el-tabs>
    </div>
  </section>
</template>
<script>
import MenusEditor from "@/components/wechat/MenusEditor";
export default {
  components: {
    MenusEditor
  },
  created() {
    this.getData();
  },
  data() {
    return {
      activeName: "menu"
    };
  },
  methods: {
    getData() {
      this.$store
        .dispatch("wechat/menuList")
        .then(res => {})
        .catch(err => {});
    },
    handleClick(tab, event) {
      console.log(this.$store.wechat);
      console.log(tab, event);
    },
    menuSave() {
      this.$store
        .dispatch("wechat/menuSave")
        .then(res => {
          this.$message.success("保存成功！");
        })
        .catch(err => {});
    },
    menuRefresh(){
      this.getData();
    }
  }
};
</script>
<style scoped>
.menu-foot {
  border: 1px solid #E4E7ED;;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>