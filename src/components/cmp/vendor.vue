<template>
  <div
    class="vendor"
    @keypress.down.stop=""
    @keydown.down.stop=""
    @keyup.down.stop=""
    ref="vendor"
  >
    <div class="vendor__privacy">
      <div class="text__content">
        Review and set your consent preferences for each partner below. Expand
        each partner list item for more information to help make your choice.
        Some personal data is processed without your consent, but you have the
        right to object.
      </div>
    </div>
    <el-collapse v-model="activeName" class="collapse">
      <el-collapse-item
        v-for="(id, index) in gvlIdsWithArr"
        :key="id"
        class="collapse__item"
        :name="index"
      >
        <div slot="title" class="collapse__item--title">
          <div class="focus">
            {{ gvlVendors[id].name }}
          </div>
          <el-switch
            v-model="vendorConsent[id]"
            @change="setVendorConsent($event, id)"
            @click.native.stop=""
            @keypress.enter.native.stop=""
            @keydown.enter.native.stop=""
            @keyup.enter.native.stop=""
            active-color="#13ce66"
            inactive-color="#ff4949"
            class="right"
          >
          </el-switch>
        </div>
        <div class="term__title" v-if="gvlVendors[id].purposes.length">
          Purpose
        </div>
        <ul>
          <li
            class="term__description"
            v-for="purposeId in gvlVendors[id].purposes"
            :key="purposeId"
          >
            {{ gvlPurpose[purposeId].name }}
          </li>
        </ul>
        <div class="term__title" v-if="gvlVendors[id].specialPurposes.length">
          special Purpose
        </div>
        <ul>
          <li
            class="term__description"
            v-for="specialPurposeId in gvlVendors[id].specialPurposes"
            :key="specialPurposeId"
          >
            {{ gvlSpecialPurpose[specialPurposeId].name }}
          </li>
        </ul>
        <div class="term__title" v-if="gvlVendors[id].features.length">
          Feature
        </div>
        <ul>
          <li
            class="term__description"
            v-for="featureId in gvlVendors[id].features"
            :key="featureId"
          >
            {{ gvlFeature[featureId].name }}
          </li>
        </ul>
        <div class="term__title" v-if="gvlVendors[id].specialFeatures.length">
          Special Feature
        </div>
        <ul>
          <li
            class="term__description"
            v-for="specailFeatureId in gvlVendors[id].specialFeatures"
            :key="specailFeatureId"
          >
            {{ gvlSpecialFeature[specailFeatureId].name }}
          </li>
        </ul>
        <div class="term__title" v-if="gvlVendors[id].legIntPurposes.length">
          Legitimate Interest Purpose(s)
        </div>
        <ul>
          <li
            class="term__description"
            v-for="legIntPurposesId in gvlVendors[id].legIntPurposes"
            :key="legIntPurposesId"
          >
            {{ gvlPurpose[legIntPurposesId].name }}
          </li>
        </ul>
        <div
          v-if="
            vendorLegInts.includes(parseInt(id)) &&
              gvlVendors[id].legIntPurposes.length
          "
          class="term__objection"
        >
          <el-button @click="deleteVendorLegIntsId(parseInt(id))"
            >object to legitimate interest</el-button
          >
        </div>
        <div
          v-if="
            !vendorLegInts.includes(parseInt(id)) &&
              gvlVendors[id].legIntPurposes.length
          "
          type="primary"
          class="term__objection"
        >
          <el-button @click="addVendorLegIntsId(parseInt(id))" type="primary"
            >remove objection</el-button
          >
          <div style="color: red; margin-left: 8px; font-weight: bold;">
            Objected
          </div>
        </div>
        <el-link
          style="margin-top: 12px;"
          type="primary"
          :href="gvlVendors[id].policyUrl"
          target="_blank"
          >policy Url</el-link
        >
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "vendor",
  data() {
    return {
      activeName: [],
      vendorConsent: {},
      allVendorsStatus: false,
      focusList: {},
      outSideButtonId: 0,
      lastNode: "",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["tcModel", "vendorLegInts"]),
    gvl() {
      return this.tcModel.gvl;
    },
    gvlIdsWithArr() {
      return Object.keys(this.gvl.vendors);
    },
    gvlVendors() {
      return this.gvl.vendors;
    },
    gvlPurpose() {
      return this.gvl.purposes;
    },
    gvlFeature() {
      return this.gvl.features;
    },
    gvlSpecialFeature() {
      return this.gvl.specialFeatures;
    },
    gvlSpecialPurpose() {
      return this.gvl.specialPurposes;
    },
    maxIpId() {
      return this.gvlIdsWithArr.length * 3 - 1;
    },
  },
  created() {
    this.initVendorConsent();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.navagation, true);
  },
  mounted() {
    window.addEventListener("keydown", this.navagation, true);
    let nodes = this.showNavagationDom();
    this.lastSelectNode = nodes[0];
    nodes[0].focus();
  },
  methods: {
    ...mapMutations([
      "addVendorConsent",
      "deleteVendorConsentById",
      "addVendorLegIntsId",
      "deleteVendorLegIntsId",
    ]),
    initVendorConsent() {
      this.gvlIdsWithArr.forEach((id) => {
        this.$set(this.vendorConsent, id, false);
      });
    },
    showNavagationDom() {
      let titleText = ".el-collapse-item__header";
      let titleSwitch = ".collapse__item--title input";
      let isActivButton = ".el-collapse-item.is-active button";
      let isActiveLink = ".el-collapse-item.is-active a";
      let total = this.$refs.vendor.querySelectorAll(
        `${titleText},${titleSwitch},${isActivButton},${isActiveLink}`
      );
      return total;
    },
    setVendorConsent(status, id) {
      if (status) {
        this.addVendorConsent(parseInt(id));
      } else {
        this.deleteVendorConsentById(parseInt(id));
      }
    },
    setOutSideFocus(id) {
      if (id % 3 === 0) {
        this.$emit("focusClose");
      } else if (id % 3 === 1) {
        this.$emit("focusReject");
      } else if (id % 3 === 2) {
        this.$emit("focusConfirm");
      }
    },
    navagation(key) {
      if (key.code === "ArrowDown") {
        let node = this.showNavagationDom();
        let nodeIndex;
        node.forEach((res, index) => {
          if (res === this.lastSelectNode) {
            nodeIndex = index;
          }
        });
        nodeIndex++;
        if (nodeIndex > node.length - 1) {
          nodeIndex = 0;
        }
        this.lastSelectNode = node[nodeIndex];
        node[nodeIndex].focus();
        key.preventDefault();
      } else if (key.code === "ArrowUp") {
        let node = this.showNavagationDom();
        let nodeIndex;
        node.forEach((res, index) => {
          if (res === this.lastSelectNode) {
            nodeIndex = index;
          }
        });
        nodeIndex--;
        if (nodeIndex < 0) {
          nodeIndex = node.length - 1;
        }
        this.lastSelectNode = node[nodeIndex];
        node[nodeIndex].focus();
        key.preventDefault();
      } else if (key.code === "ArrowLeft") {
        this.outSideButtonId--;
        if (this.outSideButtonId < 0) {
          this.outSideButtonId = 2;
        }
        this.setOutSideFocus(this.outSideButtonId);
      } else if (key.code === "ArrowRight") {
        this.outSideButtonId++;
        if (this.outSideButtonId > 2) {
          this.outSideButtonId = 0;
        }
        this.setOutSideFocus(this.outSideButtonId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-switch__input {
    width: 50px;
    height: 18px;
    opacity: 1;
  }
}
.focus {
  &:focus {
    border: 1px black solid;
    color: pink;
  }
}
::v-deep .el-link {
  &:focus {
    border: 1px black solid;
  }
}
.vendor {
  text-align: left;
  &__option {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
}
.collapse {
  margin-top: 12px;
  &__item {
    ::v-deep .el-collapse-item__arrow {
      order: -1;
      margin: 0px;
    }
    &--title {
      flex-grow: 1;
      margin-left: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: normal;
      .right {
        min-width: 80px;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        .switch {
        }
        &.active {
          color: blue;
        }
      }
    }
    ::v-deep .el-collapse-item__content {
      padding: 8px 0px 8px 8px;
      background-color: #e6e6e6;
      .term {
        &__title {
          font-weight: bold;
        }
        &__description {
          margin: 0px 8px;
          word-break: break-word;
        }
        &__box {
          margin: 0px 0px 0px 12px;
          &--title {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }
          &--description {
            margin-top: 8px;
            padding: 0px 16px 0px 0px;
          }
          &--objection {
            margin-top: 12px;
            display: flex;
            align-items: center;
          }
          .el-divider--horizontal {
            margin: 12px 0px;
          }
        }
        &__objection {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
