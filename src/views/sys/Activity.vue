<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 活动管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="mr10"
                    @click="handleBatchDel"
                    >批量删除</el-button
                >
                <perms-button
                    type="primary"
                    perms="sys:activity:add"
                    class="mr10"
                    @click="handleAdd"
                    >添加活动</perms-button
                >

                <el-input
                    v-model="query.name"
                    placeholder="活动名称"
                    class="handle-input mr10"
                ></el-input>
                <perms-button
                    type="primary"
                    perms="sys:activity:select"
                    icon="el-icon-search"
                    @click="handleSearch"
                    >搜索</perms-button
                >
            </div>
            <el-table
                :data="activitys"
                border
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    width="55"
                    align="center"
                ></el-table-column>
                <el-table-column prop="name" label="活动名称"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    :formatter="timestampFormat"
                    prop="start_time"
                    label="开始时间"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    :formatter="timestampFormat"
                    prop="end_time"
                    label="结束时间"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="skin"
                    label="皮肤"
                ></el-table-column>
                <el-table-column
                    prop="forced_rule"
                    :formatter="forcedRuleFormat"
                    label="规则弹框"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="rule"
                    label="规则"
                ></el-table-column>
                <el-table-column
                    prop="threshold"
                    :formatter="thresholdFormat"
                    label="门槛"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="game_url"
                    label="游戏地址"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="register_url"
                    label="注册地址"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="authorize_url"
                    label="授权地址"
                ></el-table-column>

                <el-table-column
                    prop="status"
                    :formatter="statusFormat"
                    label="状态"
                ></el-table-column>
                <el-table-column
                    prop="create_by"
                    label="创建人"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="create_time"
                    :formatter="timestampFormat"
                    label="创建时间"
                ></el-table-column>

                <el-table-column
                    label="操作"
                    width="180"
                    fixed="right"
                    align="center"
                >
                    <template slot-scope="scope">
                        <perms-button
                            type="text"
                            icon="el-icon-edit"
                            perms="sys:activity:edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            >编辑</perms-button
                        >
                        <perms-button
                            type="text"
                            icon="el-icon-delete"
                            perms="sys:activity:del"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</perms-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.size"
                    :total="totalRows"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog
            :title="operation ? '新增' : '编辑'"
            :visible.sync="editVisible"
            width="30%"
        >
            <el-form
                ref="dataForm"
                :rules="formRules"
                :model="dataForm"
                label-width="80px"
            >
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="dataForm.name"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="start_time">
                    <el-date-picker
                        v-model="dataForm.start_time"
                        type="datetime"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="end_time">
                    <el-date-picker
                        v-model="dataForm.end_time"
                        type="datetime"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="皮肤" prop="skin">
                    <template>
                        <el-input
                            v-model="dataForm.skin"
                            style="width:60%;margin-right:10px"
                        ></el-input>
                        <upload-zip
                            @on-success="handleUploadSuccess"
                            @on-error="handleUploadError"
                            class="upload"
                            >点击上传</upload-zip
                        >
                    </template>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="dataForm.status"
                        placeholder="请选择"
                        class="handle-select mr10"
                    >
                        <el-option key="1" label="正常" value="0"></el-option>
                        <el-option key="2" label="禁用" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="规则弹框">
                    <el-select
                        v-model="dataForm.forced_rule"
                        placeholder="请选择"
                        class="handle-select mr10"
                    >
                        <el-option
                            key="1"
                            label="强制弹框"
                            value="0"
                        ></el-option>
                        <el-option key="2" label="不弹框" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则">
                    <el-input
                        type="textarea"
                        rows="5"
                        v-model="dataForm.rule"
                    ></el-input>
                </el-form-item>
                <el-form-item label="门槛">
                    <el-select
                        v-model="dataForm.threshold"
                        placeholder="请选择"
                        class="handle-select mr10"
                    >
                        <el-option key="1" label="无门槛" value="0"></el-option>
                        <el-option key="2" label="会员" value="1"></el-option>
                        <el-option key="3" label="关注" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="游戏地址" prop="game_url">
                    <el-input v-model="dataForm.game_url"></el-input>
                </el-form-item>

                <el-form-item label="注册地址" prop="register_url">
                    <el-input v-model="dataForm.register_url"></el-input>
                </el-form-item>

                <el-form-item label="授权地址" prop="authorize_url">
                    <el-input v-model="dataForm.authorize_url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import utils from "@/utils/utils";
import { list } from "@/api/role";
import PermsButton from "@/components/PermsButton";
import UploadZip from "@/components/UploadZip";
import { getToken } from "@/utils/auth";
export default {
    // name: "activity",
    data() {
        return {
            query: {
                page: 1,
                size: 10
            },
            headers: {},
            uploading: false,
            operation: false, // true:新增, false:编辑
            editVisible: false,
            dataForm: {},
            roles: {},
            formRules: {
                name: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "长度在 3 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                start_time: [
                    {
                        required: true,
                        message: "请选择开始时间",
                        trigger: "blur"
                    }
                ],
                end_time: [
                    {
                        required: true,
                        message: "请选择开始时间",
                        trigger: "blur"
                    }
                ]
            },

            multipleSelection: []
        };
    },
    components: {
        PermsButton: PermsButton,
        UploadZip: UploadZip
    },
    computed: {
        ...mapGetters("activity", {
            activitys: "activitys",
            totalRows: "total_rows"
        })
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store
                .dispatch("activity/getActivitys", this.query)
                .then(res => {})
                .catch(err => {});
            list()
                .then(res => {
                    const { data } = res;
                    this.roles = data.roles;
                })
                .catch(error => {});
            this.$set(this.headers, "Authorization", "comic " + getToken());
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
                    return this.$store.dispatch("activity/del", { id: row.id });
                })
                .then(res => {
                    this.$message.success("删除成功");
                    // this.activitys.splice(index, 1);
                })
                .catch(() => {});
        },
        handleAdd() {
            this.dataForm = {
                id: "",
                name: "",
                status: "0",
                start_time: "",
                end_time: "",
                skin: "",
                forced_rule: "0",
                rule: "",
                threshold: "0",
                game_url: "",
                register_url: "",
                authorize_url: ""
            };
            this.editVisible = true;
            this.operation = true;
        },
        handleEdit(index, row) {
            this.dataForm = { ...row };
            this.dataForm["start_time"] = this.timestamp2Date(
                this.dataForm["start_time"]
            );
            this.dataForm["end_time"] = this.timestamp2Date(
                this.dataForm["end_time"]
            );
            this.editVisible = true;
            this.operation = false;
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleBatchDel() {
            const length = this.multipleSelection.length;
            let delIds = [];

            for (let i = 0; i < length; i++) {
                let id = this.multipleSelection[i].id;
                delIds.push(id);
            }

            this.multipleSelection = [];
            this.$store
                .dispatch("activity/batchDel", delIds)
                .then(res => {
                    this.$message.success("操作成功！");
                })
                .catch(error => {
                    this.$message.error("操作失败！");
                });
        },
        submitForm() {
            this.editVisible = false;

            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.dataForm["start_time"] =
                        this.dataForm["start_time"].getTime() / 1000;
                    this.dataForm["end_time"] =
                        this.dataForm["end_time"].getTime() / 1000;
                    console.log(this.dataForm);
                    this.$store
                        .dispatch("activity/save", this.dataForm)
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
        timestamp2Date(timestamp) {
            return utils.timestamp2Date(timestamp);
        },
        statusFormat(row, column, cellValue, index) {
            return cellValue == "0" ? "正常" : "禁用";
        },
        forcedRuleFormat(row, column, cellValue, index) {
            return cellValue == "0" ? "强制弹框" : "不弹框";
        }, //upload
        thresholdFormat(row, column, cellValue, index) {
            let text = "";
            switch(cellValue){
                case '0':
                    text = "无门槛";
                    break;
                case '1':
                    text = "会员";
                    break;
                case '2':
                    text = "关注";
                    break;
            }
            return text;
        },
        handleUploadSuccess(data) {
            console.log(data);
            this.dataForm.skin = data.name;
        },
        handleUploadError(error) {
            console.log(error);
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

.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.upload {
    width: 85px;
    height: 33px;
    float: right;
}
</style>
