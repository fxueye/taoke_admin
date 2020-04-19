<template>
  <div v-if="add" class="wechat-menu wechat-add" :style="{width:`${menuWidth}%`}">
    <span class="wechat-name">+</span>
  </div>
  <div v-else class="wechat-menu" :style="{width:`${menuWidth}%`}">
    <span class="wechat-name" :class="{'wechat-active':active}" @click="onActive">{{menu.name}}</span>
    <div v-if="isParent" v-show="showSub" class="wechat-sub-menus" :style="subMenusStyles">
      <draggable v-model="menu.sub_button" :options="{group:`${menu.id}-subMenus`}">
        <menu-item
          v-for="(subMenu,subIndex) of subMenus"
          :index="subIndex"
          :menu="subMenu"
          :key="subMenu.id"
          :deep-index="`${deepIndex}-${subIndex}`"
        />
        <menu-item v-if="!subIsMaximum" add @click.native="onAddSubMenu(index)" />
      </draggable>
      <div class="wechat-arrow-down" />
    </div>
  </div>
</template>
<script>
import {
  MAX_SUB_COUNT,
  MENU_HEIGHT,
  SUB_MENUS_OFFSET
} from "@/common/constants";
import bus from "@/common/bus";
import Draggable from "vuedraggable";
import { mapGetters } from "vuex";
export default {
  name: "MenuItem",
  components: {
    Draggable
  },
  data() {
    return {
      active: false
    };
  },
  props: {
    add: Boolean,
    menu: Object,
    menuWidth: Number,
    index: Number,
    isParent: Boolean,
    deepIndex: String
  },
  computed: {
    ...mapGetters("wechat", {
      currentMenu: "currentMenu",
      currentMenuIndex: "currentMenuIndex"
    }),
    subMenus() {
      return this.menu.sub_button;
    },
    subIsMaximum() {
      return this.subMenus.length == MAX_SUB_COUNT;
    },
    subsCount() {
      const count = this.subMenus.length;
      if (this.subIsMaximum || count == MAX_SUB_COUNT - 1) {
        return MAX_SUB_COUNT;
      } else {
        return count + 1;
      }
    },
    subMenusStyles() {
      const top = -(this.subsCount * MENU_HEIGHT + SUB_MENUS_OFFSET) + "px";

      return {
        top
      };
    },
    showSub() {
      return this.active || this.anySubActive;
    },
    anySubActive() {
      return this.subMenus.indexOf(this.currentMenu) !== -1;
    }
  },
  mounted() {
    !this.add && bus.$on("wechat-menu-active", this.onOtherActivated);
  },
  beforeDestroy() {
    bus.$off("wechat-menu-active", this.onOtherActivated);
  },
  methods: {
    onActive() {
      bus.$emit("wechat-menu-active", this.menu);
    },
    onAddSubMenu(parentIndex) {
      bus.$emit("wechat-add-sub-menu", parentIndex);
    },
    onOtherActivated(menu) {
      this.$store.commit("wechat/set_current_menu", menu);
      if (this.menu === menu) {
        this.active = true;
        this.$store.commit("wechat/set_current_menu_index", this.deepIndex);
      } else {
        this.active = false;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.wechat-menu {
  flex-grow: 1;
  text-align: center;
  color: #969696;
  border-left: 1px solid #e7e7eb;
  position: relative;
  height: 50px;
  &:first-child {
    border-left: none;
  }
  &.wechat-add .wechat-name {
    font-size: 35px !important;
    font-weight: 100;
    cursor: pointer;
  }
}

.wechat-sub-menus {
  top: 60px;
  position: absolute;
  width: 100%;

  .wechat-menu {
    border: 1px solid #e7e7eb;
    border-top: none;

    &:first-child {
      border-top: 1px solid #e7e7eb;
    }
  }
}

.wechat-name {
  display: block;
  word-break: keep-all;
  overflow: hidden;
  height: 50px;
  line-height: 48px;
  cursor: move;

  &:hover {
    color: #000;
  }

  &.wechat-active {
    border: 2px solid #44b549;
    line-height: 44px;
    color: #44b549;
  }
}

.wechat-arrow-down {
  position: absolute;
  bottom: -6px;
  left: 45%;
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 6px;
  border-style: dashed;
  border-color: transparent;
  border-bottom-width: 0;
  border-top-color: #d0d0d0;
  border-top-style: solid;
}

.wechat-sortable-ghost > .wechat-name {
  transform: scale(1.2);
  background: #efefef;
}
</style>