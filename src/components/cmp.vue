<template>
  <div class="cmp">
    <div class="cmp__term">
      <div class="cmp__term--box">
        <div class="text__title">We Care About Your Privacy</div>
        <div>
          We and our partners store and/or access information on a device, such
          as unique IDs in cookies to process personal data. You may accept or
          manage your choices by clicking below, including your right to object
          where legitimate interest is used, or at any time in the privacy
          policy page. These choices will be signaled to our partners and will
          not affect browsing data.
        </div>
      </div>
      <div class="cmp__term--separate"></div>
      <div class="cmp__term--box">
        <div class="text__subtitle">
          We and our partners process data to provide:
        </div>
        <div>
          Store and/or access information on a device. Precise geolocation data,
          and identification through device scanning. Personalised ads and
          content, ad and content measurement, audience insights and product
          development.
        </div>
        <el-button
          type="info"
          plain
          style="padding: 8px; margin-top: 12px"
          @click="showVendor()"
          ref="list"
        >
          List of Partners (vendors)
        </el-button>
      </div>
    </div>
    <div class="cmp__option">
      <div class="cmp__option--button">
        <el-button
          class="button"
          type="primary"
          @click="acceptAll"
          ref="accept"
          plain
          >I Accept</el-button
        >
      </div>
      <div class="cmp__option--button">
        <el-button
          class="button"
          type="primary"
          @click="rejectAll"
          ref="reject"
          plain
          >Reject All</el-button
        >
      </div>
      <div>
        <el-button
          @click="showPurpose()"
          class="button"
          type="primary"
          plain
          ref="purpose"
          >Show Purpose</el-button
        >
      </div>
    </div>
    <div class="cmp__close">
      <el-button
        ref="close"
        icon="el-icon-close"
        @click="closeCmp()"
        plain
        circle
      ></el-button>
      <div
        class="cmp__version"
        style="position: absolute;right: 4px; bottom: 0px;"
      >
        v1
      </div>
    </div>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="isDialogShow"
      ref="dialog"
    >
      <div slot="title" class="purpose__title text__title">
        {{ dialogComponentName }}
      </div>
      <component
        :is="dialogComponentName"
        @allowAll="acceptAll"
        @focusReject="focusReject()"
        @focusConfirm="focusConfirm()"
        @focusClose="focusClose()"
      >
      </component>
      <div slot="footer">
        <el-button type="primary" @click="rejectAll" ref="dialogReject" plain
          >Reject All</el-button
        >
        <el-button type="primary" @click="confirmChoice" ref="confirm" plain
          >Confirm My Choices</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Purpose from "@/components/cmp/purpose.vue";
import Vendor from "@/components/cmp/vendor.vue";
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "cmp",
  data() {
    return {
      isDialogShow: false,
      dialogComponentName: "",
      focusList: {
        1: "list",
        2: "accept",
        3: "reject",
        4: "purpose",
        5: "close",
      },
      focusId: 1,
    };
  },
  components: {
    Purpose,
    Vendor,
  },
  watch: {
    isDialogShow() {
      if (!this.isDialogShow) {
        this.$refs[this.focusList[this.focusId]].$el.focus();
        window.addEventListener("keydown", this.navagation, true);
      } else {
        window.removeEventListener("keydown", this.navagation, true);
      }
    },
  },
  mounted() {
    this.$refs[this.focusList[this.focusId]].$el.focus();
    window.addEventListener("keydown", this.navagation, true);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.navagation, true);
  },
  computed: {
    ...mapGetters([
      "tcModel",
      "consent",
      "objection",
      "vendorLegInts",
      "tcString",
    ]),
    gvl() {
      return this.tcModel.gvl;
    },
  },
  methods: {
    ...mapMutations([
      "setTcModelVector",
      "encodeTcString",
      "setIsCmpShow",
      "cmpApiUpdate",
    ]),
    ...mapActions(["initTcModel"]),
    closeCmp() {
      this.setIsCmpShow(false);
      this.cmpApiUpdate({ tcString: this.tcString, showing: false });
    },
    focusReject() {
      this.$refs.dialogReject.$el.focus();
    },
    focusConfirm() {
      this.$refs.confirm.$el.focus();
    },
    focusClose() {
      this.$refs.dialog.$el.childNodes[0].childNodes[0].childNodes[1].focus();
    },
    navagation(key) {
      if (key.code === "ArrowDown") {
        this.keyArrowDown();
      } else if (key.code === "ArrowUp") {
        this.keyArrowUp();
      } else if (key.code === "ArrowLeft") {
        this.keyArrowLeft();
      } else if (key.code === "ArrowRight") {
        this.keyArrowRight();
      }
    },
    focusButton(id) {
      this.$refs[this.focusList[id]].$el.focus();
    },
    blurButton(id) {
      this.$refs[this.focusList[id]].$el.blur();
    },
    keyArrowDown() {
      this.blurButton(this.focusId);
      this.focusId++;
      if (this.focusId > 5) {
        this.focusId = 1;
      }
      this.focusButton(this.focusId);
    },
    keyArrowRight() {
      this.blurButton(this.focusId);
      this.focusId++;
      if (this.focusId > 5) {
        this.focusId = 1;
      }
      this.focusButton(this.focusId);
    },
    keyArrowUp() {
      this.blurButton(this.focusId);
      this.focusId--;
      if (this.focusId < 1) {
        this.focusId = 5;
      }
      this.focusButton(this.focusId);
    },
    keyArrowLeft() {
      this.blurButton(this.focusId);
      this.focusId--;
      if (this.focusId < 1) {
        this.focusId = 5;
      }
      this.focusButton(this.focusId);
    },
    confirmChoice() {
      const { purpose, specialFeature } = this.consent;
      const { purpose: objectionPurpose } = this.objection;
      this.setTcModelVector({
        key: "specialFeatureOptins",
        id_arr: specialFeature,
      });
      this.setTcModelVector({ key: "purposeConsents", id_arr: purpose });
      let legitimatePurpose = this.gvl.stacks[42].purposes; // because we use GVL STACK[42]
      legitimatePurpose = legitimatePurpose.filter((res) => {
        return !objectionPurpose.includes(res);
      });
      this.setTcModelVector({
        key: "purposeLegitimateInterests",
        id_arr: legitimatePurpose,
      });
      if (legitimatePurpose.length > 0) {
        this.setTcModelVector({
          key: "vendorLegitimateInterests",
          id_arr: this.vendorLegInts,
        });
      }
      this.setTcModelVector({
        key: "publisherConsents",
        id_arr: purpose,
      });
      this.setTcModelVector({
        key: "publisherLegitimateInterests",
        id_arr: legitimatePurpose,
      });
      this.encodeTcString();
      this.setCookie("euconsent-v2", this.tcString, 180);
      this.cmpApiUpdate({ tcString: this.tcString, showing: false });
      this.setIsCmpShow(false);
    },
    showPurpose() {
      this.isDialogShow = true;
      this.dialogComponentName = "Purpose";
    },
    showVendor() {
      for (let i = 1; i < 6; i++) {
        this.blurButton(i);
      }
      this.isDialogShow = true;
      this.dialogComponentName = "Vendor";
    },
    getAllIdsForGvlPreferenceKey(key) {
      return Object.keys(this.gvl[key]).map((res) => parseInt(res));
    },
    acceptAll() {
      const specialFeatureIds = this.getAllIdsForGvlPreferenceKey(
        "specialFeatures"
      );
      this.setTcModelVector({
        key: "specialFeatureOptins",
        id_arr: specialFeatureIds,
      });
      const purposeIds = this.getAllIdsForGvlPreferenceKey("purposes");
      this.setTcModelVector({
        key: "purposeConsents",
        id_arr: purposeIds,
      });
      const purposeLegitimateIntersetIds = this.gvl.stacks[42].purposes;
      this.setTcModelVector({
        key: "purposeLegitimateInterests",
        id_arr: purposeLegitimateIntersetIds,
      });
      const vendorsIds = this.getAllIdsForGvlPreferenceKey("vendors");
      this.setTcModelVector({
        key: "vendorConsents",
        id_arr: vendorsIds,
      });
      this.setTcModelVector({
        key: "vendorLegitimateInterests",
        id_arr: this.vendorLegInts,
      });
      this.setTcModelVector({
        key: "publisherConsents",
        id_arr: purposeIds,
      });
      this.setTcModelVector({
        key: "publisherLegitimateInterests",
        id_arr: purposeLegitimateIntersetIds,
      });
      this.encodeTcString();
      this.setCookie("euconsent-v2", this.tcString, 180);
      this.cmpApiUpdate({ tcString: this.tcString, showing: false });
      this.setIsCmpShow(false);
    },
    rejectAll() {
      this.encodeTcString();
      this.setCookie("euconsent-v2", this.tcString, 180);
      this.cmpApiUpdate({ tcString: this.tcString, showing: false });
      this.setIsCmpShow(false);
    },
    setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__headerbtn {
  &:focus {
    border: 1px black solid;
  }
}
.button {
  width: 125px;
}
.purpose {
  &__title {
    text-align: left;
  }
}
.cmp {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background-color: pink;
  display: flex;
  padding: 12px;
  &__term {
    width: calc(100% - 200px - 50px);
    display: flex;
    &--separate {
      border-left: black 1px solid;
      border-color: black;
    }
    &--box {
      text-align: left;
      margin: 8px;
      width: 50%;
    }
  }
  &__option {
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  &__close {
    width: 50px;
    margin: 10px;
    position: relative;
  }
  ::v-deep .el-dialog__wrapper {
    .el-dialog {
      height: 80%;
      margin-top: 10vh !important;
    }
    .el-dialog__header {
      height: 75px;
      box-sizing: border-box;
    }
    .el-dialog__body {
      height: calc(100% - 75px - 60px);
      overflow: auto;
      box-sizing: border-box;
      padding: 8px 20px;
    }
    .el-dialog__footer {
      height: 60px;
      box-sizing: border-box;
    }
  }
}
</style>
