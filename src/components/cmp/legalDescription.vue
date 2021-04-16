<template>
  <div class="legal-description">
    <el-button
      type="info"
      plain
      style="padding:8px ;font-size:12px"
      @click="changeStatus()"
    >
      {{ isShow ? "Hide Legal Description" : "Show Legal Description" }}
    </el-button>
    <div
      v-if="isShow"
      style="padding: 8px 12px; border: 1px black solid; margin: 4px 12px 4px 4px; word-break: normal;"
    >
      {{ descriptionLegal }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    descriptionLegal: String,
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {},
  methods: {
    changeStatus() {
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style lang="scss" scoped></style>
