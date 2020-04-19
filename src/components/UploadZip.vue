<template>
    <div>
        <input
            class="upload-input"
            ref="userfile"
            type="file"
            name="userfile"
            @input="changeInput"
        />
        <el-button
            :size="size"
            :type="type"
            :icon="icon"
            :loading="loading"
            :disabled="disabled"
            @click="handleClick"
        >
            <slot></slot>
        </el-button>
    </div>
</template>
<script>
import { do_upload_zip } from "@/api/upload";
export default {
    name: "UploadZip",
    props: {
        icon: {
            // 按钮显示图标
            type: String,
            default: ""
        },
        size: {
            // 按钮尺寸
            type: String,
            default: "mini"
        },
        type: {
            // 按钮类型
            type: String,
            default: "primary"
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        handleClick() {
            this.$refs.userfile.click();
        },
        changeInput() {
            this.loading = true;
            let file = this.$refs.userfile.files[0];
            if (file.type == "application/x-zip-compressed") {
                do_upload_zip(file)
                    .then(res => {
                        this.loading = false;
                        const { data } = res;
                        this.$refs.userfile.value="";
                        this.$emit("on-success", data);
                    })
                    .catch(error => {
                        this.loading = false;
                        this.$refs.userfile.value="";
                        this.$emit("on-error", error);
                    });
            } else {
                this.loading = false;
                 this.$message.error("只能上传zip");
            }
        }
    }
};
</script>
<style scoped>
.upload-input {
    display: none;
}
</style>
