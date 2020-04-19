<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 事件管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <perms-button
          type="primary"
          perms="sys:wechat:event:add"
          class="mr10"
          @click="handleAdd"
        >添加事件</perms-button>
        <el-select
          v-model="query.type"
          placeholder="事件类型"
          @change="handelEventTypesChange"
          class="handle-select mr10"
        >
          <el-option
            v-for="(type,index) of eventTypes"
            :label="''+type"
            :key="''+index"
            :value="''+index"
          ></el-option>
        </el-select>
        <el-input v-model="query.name" placeholder="事件" class="handle-input mr10"></el-input>
        <perms-button
          type="primary"
          perms="sys:wechat:event:select"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</perms-button>
      </div>
      <el-table :data="events" border>
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="key" label="事件标识"></el-table-column>
        <el-table-column prop="remark" label="事件备注"></el-table-column>
        <el-table-column prop="ctype" label="处理方法">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleCtype(scope)">{{scope.row.ctype | ctypeFormat}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <template v-if="scope.row.ctype == '0'">{{scope.row.content | checkContent}}</template>
            <template v-if="scope.row.ctype == '1'">{{scope.row.content }}</template>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="create_time"
          :formatter="timestampFormat"
          label="创建时间"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template slot-scope="scope">
            <perms-button
              type="text"
              icon="el-icon-edit"
              perms="sys:wechat:event:edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</perms-button>
            <perms-button
              type="text"
              icon="el-icon-delete"
              perms="sys:wechat:event:del"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</perms-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.page"
          :page-size="query.size"
          :total="totalEventsRows"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="operation ? '新增' : '编辑'" :visible.sync="editVisible" width="30%">
      <el-form ref="dataForm" :rules="formRules" :model="dataForm" label-width="80px">
        <el-form-item label="事件类型">
          <el-radio-group v-model="dataForm.type" @change="handelEventTypeChange">
            <el-radio
              v-for="(type, index) in eventTypeList"
              :label="'' + index"
              :key="'' + index"
            >{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="事件备注" prop="remark">
          <el-input class="handle-input" v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type == '0'" label="事件标识" prop="key">
          <el-select v-model="dataForm.key" placeholder="事件标识" class="handle-select mr10">
            <el-option
              v-for="(type,index) in systemEventTypes"
              :label="''+type"
              :key="''+index"
              :value="''+index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理方法" prop="key">
          <el-select v-model="dataForm.ctype" placeholder="处理方法" class="handle-select mr10">
            <el-option
              v-for="(type,index) in actionTypes"
              :label="''+type"
              :key="''+index"
              :value="''+index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.type != '0'" label="事件标识" prop="key">
          <el-input v-model="dataForm.key"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.ctype == '0'" label="内容" prop="content">
          <el-link class="handle-link mr10">{{dataForm.content|checkContent}}</el-link>
          <el-button @click="handelMaterial(dataForm.content)">选择材料</el-button>
        </el-form-item>
        <el-form-item v-if="dataForm.ctype == '1'" label="内容" prop="content">
          <el-input v-model="dataForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="素材选择" width="60%" :visible.sync="materialVisible">
      <el-tabs v-model="msg.type" @tab-click="handelChangeMsgType">
        <el-tab-pane label="文本" name="text">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="msg.content"></el-input>
        </el-tab-pane>
        <el-tab-pane label="图文" name="news">
          <el-table
            ref="tableNews"
            :data="news.items"
            :show-header="false"
            highlight-current-row
            @current-change="handleNewCurrentChange"
            style="width: 100%"
          >
            <el-table-column property="title" label="标题"></el-table-column>
            <el-table-column property="show_cover_pic" label="图片">
              <template slot-scope="scope">
                <el-image
                  class="table-td-thumb"
                  :src="scope.row.show_cover_pic"
                  :preview-src-list="[scope.row.show_cover_pic]"
                ></el-image>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="图片" name="image">
          <el-table
            :data="image.items"
            :show-header="false"
            highlight-current-row
            @current-change="handleImageCurrentChange"
            style="width: 100%"
          >
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="url" label="图片">
              <template slot-scope="scope">
                <el-image
                  class="table-td-thumb"
                  :src="scope.row.url"
                  :preview-src-list="[scope.row.url]"
                ></el-image>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="msg.page"
              :page-size="msg.size"
              :total="image.total"
              @current-change="handleMaterialPageChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="音频" name="voice">
          <el-table
            :data="voice.items"
            :show-header="false"
            highlight-current-row
            @current-change="handleVoiceCurrentChange"
            style="width: 100%"
          >
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="url" label="地址"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="msg.page"
              :page-size="msg.size"
              :total="voice.total"
              @current-change="handleMaterialPageChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="video">
          <el-table
            :data="video.items"
            :show-header="false"
            highlight-current-row
            @current-change="handleVideoCurrentChange"
            style="width: 100%"
          >
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="url" label="地址"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="msg.page"
              :page-size="msg.size"
              :total="video.total"
              @current-change="handleMaterialPageChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span v-if="msg.type=='text'" slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMaterial">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import utils from "@/utils/utils";
import PermsButton from "@/components/PermsButton";
import {
  SYSTEM_EVENT_TYPES,
  EVENT_TYPES,
  ACTION_TYPES,
  AUTO_REPLY_TYPES
} from "@/common/constants";
export default {
  // name: "user",
  data() {
    return {
      eventTypeList: ["系统事件", "菜单事件", "活动事件"],
      query: {
        type: "0",
        page: 1,
        size: 10
      },
      operation: false, // true:新增, false:编辑
      editVisible: false,
      dataForm: {},
      formRules: {
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ]
      },
      materialVisible: false,
      msg: {}
    };
  },
  components: {
    PermsButton: PermsButton
  },
  computed: {
    ...mapGetters("wechat", {
      events: "events",
      totalEventsRows: "totalEventsRows",
      news: "news",
      image: "image",
      voice: "voice",
      video: "video"
    }),
    systemEventTypes: {
      get() {
        return SYSTEM_EVENT_TYPES;
      }
    },
    eventTypes: {
      get() {
        return EVENT_TYPES;
      }
    },
    actionTypes: {
      get() {
        return ACTION_TYPES;
      }
    }
  },
  created() {
    this.getData();
  },
  filters: {
    ctypeFormat(ctype) {
      return ctype == "0" ? "自动回复" : "事件处理";
    },
    checkContent(content) {
      if (typeof content == "object") {
        if (content.type == "text") {
          return content.content;
        }
        return "已选择" + AUTO_REPLY_TYPES[content.type];
      } else {
        return "未选择材料";
      }
    }
  },
  methods: {
    getData() {
      this.$store
        .dispatch("wechat/eventList", this.query)
        .then(res => {})
        .catch(err => {});
    },
    // 触发搜索按钮
    handleSearch() {
      console.log(this.query);
      this.$set(this.query, "page", 1);
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          return this.$store.dispatch("wechat/eventDel", { id: row.id });
        })
        .then(res => {
          this.$message.success("删除成功");
          // this.users.splice(index, 1);
        })
        .catch(() => {});
    },
    handleAdd() {
      this.dataForm = {
        id: "",
        key: "text",
        type: "0",
        remark: "",
        content: "",
        ctype: "0"
      };
      this.editVisible = true;
      this.operation = true;
    },
    handleEdit(index, row) {
      this.dataForm = { ...row };
      this.editVisible = true;
      this.operation = false;
    },
    handelEventTypesChange(val) {
      this.getData();
    },

    submitForm() {
      this.editVisible = false;
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("wechat/eventSave", this.dataForm)
            .then(res => {
              this.dataForm.password = "";
              this.$message.success("操作成功！");
            })
            .catch(error => {
              this.$message.error("操作失败！");
            });
        } else {
          return false;
        }
      });
    },
    handlePageChange(val) {
      this.$set(this.query, "page", val);
      this.getData();
    },
    timestampFormat(row, column, cellValue, index) {
      return utils.timestampFormat(cellValue, "YYYY-mm-dd HH:MM:SS");
    },
    handleCtype(val) {
      console.log(val);
    },
    submitMaterial() {
      this.materialVisible = false;
      let content = { content: this.msg.content, type: this.msg.type };
      this.$set(this.dataForm, "content", content);
    },
    handelMaterial(content) {
      //TODO
      this.materialVisible = true;
      this.msg = {
        type: "text",
        page: 1,
        size: 5,
        content: ""
      };
    },
    handelEventTypeChange(val) {
      if (this.dataForm.type == "1") {
        this.dataForm.key = "text";
      }
      if (this.dataForm.type == "1") {
        this.dataForm.key = "";
      }
      if (this.dataForm.type == "2") {
        this.dataForm.key = "";
      }
    },
    handelChangeMsgType(val) {
      this.$store
        .dispatch("wechat/materialList", {
          type: this.msg.type,
          page: this.msg.page,
          size: this.msg.size
        })
        .then(res => {})
        .catch(err => {});
    },
    handleNewCurrentChange(val) {
      this.materialVisible = false;
      let content = { ...val, type: this.msg.type };
      this.$set(this.dataForm, "content", content);
    },
    handleImageCurrentChange(val) {
      this.materialVisible = false;
      let content = { ...val, type: this.msg.type };
      this.$set(this.dataForm, "content", content);
    },
    handleVoiceCurrentChange(val) {
      this.materialVisible = false;
      let content = { ...val, type: this.msg.type };
      this.$set(this.dataForm, "content", content);
    },
    handleVideoCurrentChange(val) {
      this.materialVisible = false;
      let content = { ...val, type: this.msg.type };
      this.$set(this.dataForm, "content", content);
    },
    handleMaterialPageChange(val) {
      this.$set(this.msg, "page", val);
      this.$store
        .dispatch("wechat/materialList", {
          type: this.msg.type,
          page: this.msg.page,
          size: this.msg.size
        })
        .then(res => {})
        .catch(err => {});
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.handle-link {
  width: 260px;
  display: inline-block;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>