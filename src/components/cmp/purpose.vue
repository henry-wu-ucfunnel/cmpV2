<template>
  <div class="purpose" ref="purpose">
    <div class="purpose__privacy">
      <div class="text__subtitle">
        About your Privacy
      </div>
      <div class="text__content">
        We process your data to deliver content or advertisements and measure
        the delivery of such content or advertisements to extract insights about
        our website. We share this information with our partners on the basis of
        consent and legitimate interest. You may exercise your right to consent
        or object to a legitimate interest, based on a specific purpose below or
        at a partner level in the link under each purpose. These choices will be
        signaled to our vendors participating in the Transparency and Consent
        Framework.
      </div>
    </div>
    <el-button
      class="button"
      type="primary"
      @click="allowAll"
      plain
      ref="allowAll"
      >Allow all</el-button
    >
    <div class="purpose__manage">
      <div class="text__subtitle">Manage Preferences</div>
      <el-collapse v-model="activeName">
        <el-collapse-item
          class="collapse__item"
          :name="0"
          v-for="(id, index) in [0]"
          :key="`a${index}`"
          ref="ip_0"
        >
          <div slot="title" class="collapse__item--title">
            <div>{{ preference[1].name }}</div>
            <el-switch
              @click.native.stop=""
              @keypress.enter.native.stop=""
              @keydown.enter.native.stop=""
              @keyup.enter.native.stop=""
              v-model="preferenceStatus[preference[1].type][preference[1].id]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              class="right"
            >
            </el-switch>
          </div>
          <div class="term__description">
            {{ preference[1].description }}
          </div>
          <LegalDescription
            style="margin: 8px 0px;"
            :descriptionLegal="preference[1].legalDescription"
          >
          </LegalDescription>
        </el-collapse-item>
        <el-collapse-item
          class="collapse__item"
          :name="1"
          v-for="(id, index) in [0]"
          :key="`b${index}`"
        >
          <div slot="title" class="collapse__item--title">
            <div>{{ preference[2].name }}</div>
            <el-switch
              @keypress.enter.native.stop=""
              @keydown.enter.native.stop=""
              @keyup.enter.native.stop=""
              @click.native.stop=""
              @change="switchAllForEachPreference($event, preference[2].terms)"
              v-model="switchAllButtonStatus[2]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              class="right"
            >
            </el-switch>
          </div>
          <div
            class="term__box"
            v-for="(term, index) in preference[2].terms"
            :key="index"
          >
            <el-divider v-if="index > 0"></el-divider>
            <div class="term__box--title">
              <div>
                {{ term.name }}
              </div>
              <el-switch
                @keypress.enter.native.stop=""
                @keydown.enter.native.stop=""
                @keyup.enter.native.stop=""
                @click.native.stop=""
                v-model="preferenceStatus[term.type][term.id]"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </div>
            <div class="term__box--description">
              {{ term.description }}
            </div>
            <LegalDescription
              style="margin: 8px 0px;"
              :descriptionLegal="term.legalDescription"
            >
            </LegalDescription>
          </div>
        </el-collapse-item>
        <el-collapse-item
          class="collapse__item"
          :name="2"
          v-for="(id, index) in [0]"
          :key="`c${index}`"
        >
          <div slot="title" class="collapse__item--title">
            <div>{{ preference[3].name }}</div>
            <el-switch
              @keypress.enter.native.stop=""
              @keydown.enter.native.stop=""
              @keyup.enter.native.stop=""
              @click.native.stop=""
              @change="switchAllForEachPreference($event, preference[3].terms)"
              v-model="switchAllButtonStatus[3]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              class="right"
            >
            </el-switch>
          </div>
          <div
            class="term__box"
            v-for="(term, index) in preference[3].terms"
            :key="index"
          >
            <el-divider v-if="index > 0"></el-divider>
            <div class="term__box--title">
              <div>
                {{ term.name }}
              </div>
              <el-switch
                @keypress.enter.native.stop=""
                @keydown.enter.native.stop=""
                @keyup.enter.native.stop=""
                @click.native.stop=""
                v-model="preferenceStatus[term.type][term.id]"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </div>
            <div class="term__box--description">
              {{ term.description }}
            </div>
            <LegalDescription
              style="margin: 8px 0px;"
              :descriptionLegal="term.legalDescription"
            >
            </LegalDescription>
            <div
              v-if="!preferenceStatus.purposeObjection[term.id]"
              class="term__box--objection"
            >
              <el-button
                style="padding: 12px"
                @click="setPurposeObjectionStatus(term.id, true)"
                >object to legitimate interest</el-button
              >
            </div>

            <div
              v-if="preferenceStatus.purposeObjection[term.id]"
              class="term__box--objection"
            >
              <el-button
                style="padding: 12px; "
                @click="setPurposeObjectionStatus(term.id, false)"
                type="primary"
              >
                remove objection
              </el-button>
              <div style="color: red; margin-left: 8px; font-weight: bold;">
                Objected
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item
          class="collapse__item"
          :name="index + 3"
          v-for="(id, index) in alwaysActivePurposeID"
          :key="`d${index}`"
        >
          <div slot="title" class="collapse__item--title">
            <div>{{ preference[id].name }}</div>
            <div class="right active">always active</div>
          </div>
          <div class="term__description">
            {{ preference[id].description }}
          </div>
          <LegalDescription
            style="margin: 8px 0px;"
            :descriptionLegal="preference[id].legalDescription"
          >
          </LegalDescription>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import LegalDescription from "@/components/cmp/legalDescription.vue";
export default {
  name: "purpose",
  components: { LegalDescription },
  data() {
    return {
      switchAllButtonStatus: {
        2: false,
        3: false,
      },
      preferenceStatus: {
        purposeObjection: {
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false,
          9: false,
          10: false,
        },
        purpose: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false,
          9: false,
          10: false,
        },
        specialPurpose: {
          1: true,
          2: true,
        },
        specialFeature: {
          1: false,
          2: false,
        },
        feature: {
          1: true,
          2: true,
          3: true,
        },
      },
      activeName: [],
      activeNamePurpose: [],
      ipId: 0,
      outSideButtonId: 0,
      lastSelectNode: "",
    };
  },
  watch: {
    preferenceStatus: {
      deep: true,
      handler: function() {
        let purposeArr = this.getPreferenceStatusTrueToArray("purpose");
        let specialFeatureArr = this.getPreferenceStatusTrueToArray(
          "specialFeature"
        );
        let purposeObjection = this.getPreferenceStatusTrueToArray(
          "purposeObjection"
        );
        this.setPurposeConsent(purposeArr);
        this.setSpecialFeatureConsent(specialFeatureArr);
        this.setObjectionPurpose(purposeObjection);
      },
    },
  },
  computed: {
    ...mapGetters(["tcModel", "consent", "objection"]),
    gvl() {
      return this.tcModel.gvl;
    },
    preference() {
      return {
        1: {
          type: "purpose",
          id: 1,
          name: this.gvl.purposes[1].name,
          description: this.gvl.purposes[1].description,
          legalDescription: this.gvl.purposes[1].descriptionLegal,
        },
        2: {
          name: this.gvl.stacks[1].name,
          terms: [
            {
              type: "specialFeature",
              id: 1,
              name: this.gvl.specialFeatures[1].name,
              description: this.gvl.specialFeatures[1].description,
              legalDescription: this.gvl.specialFeatures[1].descriptionLegal,
            },
            {
              type: "specialFeature",
              id: 2,
              name: this.gvl.specialFeatures[2].name,
              description: this.gvl.specialFeatures[2].description,
              legalDescription: this.gvl.specialFeatures[2].descriptionLegal,
            },
          ],
        },
        3: {
          name: this.gvl.stacks[42].name,
          terms: [
            {
              type: "purpose",
              id: 3,
              name: this.gvl.purposes[3].name,
              description: this.gvl.purposes[3].description,
              legalDescription: this.gvl.purposes[3].descriptionLegal,
            },
            {
              type: "purpose",
              id: 8,
              name: this.gvl.purposes[8].name,
              description: this.gvl.purposes[8].description,
              legalDescription: this.gvl.purposes[8].descriptionLegal,
            },
            {
              type: "purpose",
              id: 9,
              name: this.gvl.purposes[9].name,
              description: this.gvl.purposes[9].description,
              legalDescription: this.gvl.purposes[9].descriptionLegal,
            },
            {
              type: "purpose",
              id: 6,
              name: this.gvl.purposes[6].name,
              description: this.gvl.purposes[6].description,
              legalDescription: this.gvl.purposes[6].descriptionLegal,
            },
            {
              type: "purpose",
              id: 4,
              name: this.gvl.purposes[4].name,
              description: this.gvl.purposes[4].description,
              legalDescription: this.gvl.purposes[4].descriptionLegal,
            },
            {
              type: "purpose",
              id: 5,
              name: this.gvl.purposes[5].name,
              description: this.gvl.purposes[5].description,
              legalDescription: this.gvl.purposes[5].descriptionLegal,
            },
            {
              type: "purpose",
              id: 2,
              name: this.gvl.purposes[2].name,
              description: this.gvl.purposes[2].description,
              legalDescription: this.gvl.purposes[2].descriptionLegal,
            },
            {
              type: "purpose",
              id: 7,
              name: this.gvl.purposes[7].name,
              description: this.gvl.purposes[7].description,
              legalDescription: this.gvl.purposes[7].descriptionLegal,
            },
            {
              type: "purpose",
              id: 10,
              name: this.gvl.purposes[10].name,
              description: this.gvl.purposes[10].description,
              legalDescription: this.gvl.purposes[10].descriptionLegal,
            },
          ],
        },
        4: {
          type: "feature",
          id: 1,
          name: this.gvl.features[1].name,
          description: this.gvl.features[1].description,
          legalDescription: this.gvl.features[1].descriptionLegal,
        },
        5: {
          type: "specialPurpose",
          id: 1,
          name: this.gvl.specialPurposes[1].name,
          description: this.gvl.specialPurposes[1].description,
          legalDescription: this.gvl.specialPurposes[1].descriptionLegal,
        },
        6: {
          type: "feature",
          id: 3,
          name: this.gvl.features[3].name,
          description: this.gvl.features[3].description,
          legalDescription: this.gvl.features[3].descriptionLegal,
        },
        7: {
          type: "feature",
          id: 2,
          name: this.gvl.features[2].name,
          description: this.gvl.features[2].description,
          legalDescription: this.gvl.features[2].descriptionLegal,
        },
        8: {
          type: "specialPurpose",
          id: 2,
          name: this.gvl.specialPurposes[2].name,
          description: this.gvl.specialFeatures[2].description,
          legalDescription: this.gvl.specialFeatures[2].descriptionLegal,
        },
      };
    },
    alwaysActivePurposeID() {
      return [4, 5, 6, 7, 8];
    },
    maxIpId() {
      return 30;
    },
  },
  created() {},
  beforeDestroy() {
    window.removeEventListener("keydown", this.navagation, true);
  },
  mounted() {
    window.addEventListener("keydown", this.navagation, true);
    this.lastSelectNode = this.showNavagationDom()[0];
    this.lastSelectNode.focus();
  },
  methods: {
    ...mapMutations([
      "setTcModelVector",
      "encodeTcString",
      "setPurposeConsent",
      "setSpecialFeatureConsent",
      "setObjectionPurpose",
    ]),
    showNavagationDom() {
      let titleText = ".el-collapse-item__header";
      let titleSwitch = ".collapse__item--title input";
      let isActiveSwitch =
        ".el-collapse-item.is-active div[role=tabpanel] input";
      let isActivButton = ".el-collapse-item.is-active button";
      let total = this.$refs.purpose.querySelectorAll(
        `${titleText},${titleSwitch},${isActiveSwitch},${isActivButton}`
      );
      return total;
    },
    allowAll() {
      this.$emit("allowAll");
    },
    switchAllForEachPreference(status, terms) {
      terms.forEach((element) => {
        this.preferenceStatus[element.type][element.id] = status;
      });
    },
    getPreferenceStatusTrueToArray(key) {
      const arr = [];
      const keys = Object.keys(this.preferenceStatus[key]);
      keys.forEach((res) => {
        this.preferenceStatus[key][res] ? arr.push(parseInt(res)) : "";
      });
      return arr;
    },
    setPurposeObjectionStatus(key, status) {
      this.preferenceStatus.purposeObjection[key] = status;
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
          this.outSideButtonId = 3;
        }
        this.setOutSideFocus(this.outSideButtonId);
      } else if (key.code === "ArrowRight") {
        this.outSideButtonId++;
        if (this.outSideButtonId > 3) {
          this.outSideButtonId = 0;
        }
        this.setOutSideFocus(this.outSideButtonId);
      }
    },
    setOutSideFocus(id) {
      if (id === 0) {
        this.$emit("focusClose");
      } else if (id === 1) {
        this.$refs.allowAll.$el.focus();
      } else if (id === 2) {
        this.$emit("focusReject");
      } else if (id === 3) {
        this.$emit("focusConfirm");
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
.purpose {
  text-align: left;
}
.button {
  width: 125px;
  margin: 12px 0px;
}
.collapse {
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
      }
    }
  }
}
</style>
