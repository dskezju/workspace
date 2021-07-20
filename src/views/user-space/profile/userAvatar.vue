<template>
  <div>
    <!-- 根据options.img显示头像，class控制样式 -->
    <div class="user-info-head" @click="editCropper()">
      <img v-bind:src="options.img" title="点击上传头像" class="img-circle img-lg" />
    </div>

    <!-- 对话框，visible控制是否显示对话框，opend为打开后的回调，将visible设为true -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @opened="modalOpened"  @close="closeDialog()">
      <el-row>
        <!-- 分两列，一列是cropper，第二列是预览 -->
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <!-- 图谱裁剪，options控制各项参数，v-if='visible'我觉得没必要就删了 -->
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <!-- 图片预览 -->
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <!-- 点击上传，action是上传的地址，beforeUpload为上传前钩子 -->
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <!-- 提交到后端 -->
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { VueCropper } from "vue-cropper"; //vue裁剪图片的工具
import { uploadAvatar } from "@/api/system/user";

export default {
  components: { VueCropper },
  props: {
    user: { //user传过来没有用到
      type: Object
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: "修改头像",
      options: {
        img: store.getters.avatar, //裁剪图片的地址，从getters里获取
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {}
    };
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true;
    },
    // 打开弹出层结束时的回调，将visible设置为true，显示vue-cropper
    //感觉没必要，本来vue-cropper就是在dialog里的，会和dialog一起
    modalOpened() {
      // this.visible = true;
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result; //解析文件上传后改变options.img，此时还没有提交到后端
        };
      }
    },
    // 点击提交，上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => { //获取截图的blob数据
        let formData = new FormData();
        formData.append("avatarfile", data);
        uploadAvatar(formData).then(response => {
          this.open = false;
          this.options.img = process.env.VUE_APP_BASE_API + response.imgUrl;
          store.commit('SET_AVATAR', this.options.img);
          this.msgSuccess("修改成功");
          this.visible = false;
        });
      });
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    // 关闭窗口
    closeDialog() {
      this.options.img = store.getters.avatar
	    // this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after { //悬停时显示 + 号，改变背景色
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>
