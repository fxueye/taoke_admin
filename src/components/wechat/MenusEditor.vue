<template>
  <div class="wechat-edit-area">
    <div class="wechat-preview">
      <div class="wechat-header">
        <span>公众号</span>
      </div>
      <menus :menus.sync="menus" :menu-auto-id.sync="menuAutoId"></menus>
    </div>
    <div v-if="currentMenu" class="wechat-form">
      <div class="wechat-header">
        <span>{{ currentMenu.name }}</span>
        <el-button type="text" @click="onRemoveCurrent">删除菜单</el-button>
      </div>
      <el-form ref="form" :model="currentMenu" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="currentMenu.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!currentHasSub" label="菜单内容">
          <el-select v-model="currentMenu.type" placeholder="请选择" class="handle-select mr10">
            <el-option
              v-for="key of Object.keys(menuTypes)"
              :key="key"
              :label="menuTypes[key]"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="!currentHasSub">
          <el-card shadow="never">
            <el-form-item v-if="currentMenu.type == 'view'" label="页面地址">
              <el-input v-model="currentMenu.url"></el-input>
            </el-form-item>

            <el-form-item
              v-if="currentMenu.type != 'view' && currentMenu.type!='miniprogram'"
              label="选择事件"
            >
              <el-select v-model="currentMenu.key" placeholder="请选择" class="handle-select mr10">
                <el-option
                  v-for="event in events"
                  :key="event.key"
                  :label="event.remark"
                  :value="event.key"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="currentMenu.type == 'miniprogram'" label="备用地址">
              <el-input v-model="currentMenu.url"></el-input>
            </el-form-item>
            <el-form-item v-if="currentMenu.type == 'miniprogram'" label="APPID">
              <el-input v-model="currentMenu.appid"></el-input>
            </el-form-item>
            <el-form-item v-if="currentMenu.type == 'miniprogram'" label="打开页面">
              <el-input v-model="currentMenu.pagepath"></el-input>
            </el-form-item>
          </el-card>
        </template>

        <el-form-item v-show="currentHasSub">
          <span>已设置子菜单，只能编辑菜单名</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Menus from "./Menus";
import { MENU_TYPES } from "@/common/constants";
import { mapGetters } from "vuex";
import bus from "@/common/bus";
export default {
  name: "MenusEditor",
  components: {
    Menus
  },
  computed: {
    menuAutoId: {
      get() {
        return this.$store.getters["wechat/id"];
      },
      set(val) {
        this.$store.commit("wechat/set_id", val);
      }
    },
    currentMenu: {
      get() {
        return this.$store.getters["wechat/currentMenu"];
      },
      set(val) {
        this.$store.commit("wechat/set_current_menu", val);
      }
    },
    menus: {
      get() {
        return this.$store.getters["wechat/menus"];
      },
      set(val) {
        this.$store.commit("wechat/set_menus", val);
      }
    },
    menuTypes() {
      return MENU_TYPES;
    },
    currentHasSub() {
      return this.currentMenu.sub_button.length > 0;
    },
    ...mapGetters("wechat", {
      currentMenuIndex: "currentMenuIndex",
      events: "events"
    })
  },
  updated() {},
  data() {
    return {};
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$store
        .dispatch("wechat/eventList", {
          type: "1",
          page: 1,
          size: 100
        })
        .then(res => {})
        .catch(err => {});
    },
    onRemoveCurrent() {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          const [parent, sub] = this.currentMenuIndex.split("-");
          let nextActive = null;
          if (sub === undefined) {
            this.menus.splice(parent, 1);
          } else {
            const parentMenu = this.menus[parent];
            parentMenu.sub_button.splice(sub, 1);
            nextActive = parentMenu;
          }
          bus.$emit("wechat-menu-active", nextActive);
        })

        .catch(() => {});
    }
  }
};
</script>
<style scoped lang="scss">
$grey-border: 1px solid #e7e7eb;
.wechat-edit-area {
  height: 600px;
  display: flex;
}
.wechat-preview {
  min-width: 300px;
  margin-right: 20px;
  border: $grey-border;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .wechat-header {
    height: 50px;
    background: #3a3a3e;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.wechat-form {
  padding: 0 20px;
  border: $grey-border;
  width: 880px;
  background-color: #f4f5f9;
  .wechat-header {
    height: 40px;
    line-height: 40px;
    border-bottom: $grey-border;
    border-width: 2px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>