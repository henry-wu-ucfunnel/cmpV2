import Vue from "vue";
import Vuex from "vuex";
import { TCModel, TCString, GVL } from "@iabtcf/core";
import * as cmpstub from "@iabtcf/stub";
import { CmpApi } from "@iabtcf/cmpapi";
cmpstub();
const queue = __tcfapi();
const cmpApi = new CmpApi(360, 2, true);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCmpShow: true,
    vendorListBaseUrl: "http://cdn.aralego.net/cmp2/only-uc-vendors",
    tcModel: {},
    tcString: "",
    consent: {
      purpose: [],
      specialFeature: [],
      vendor: [],
    },
    objection: {
      purpose: [],
    },
    vendorLegInts: [],
  },
  mutations: {
    cmpApiUpdate(state, { tcString, showing }) {
      cmpApi.update(tcString, showing);
    },
    setTcModel(state, obj) {
      state.tcModel = obj;
    },
    encodeTcString(state) {
      state.tcString = TCString.encode(state.tcModel);
    },
    setTcModelVector(state, { key, id_arr }) {
      state.tcModel[key].set(id_arr);
    },
    setPurposeConsent(state, arr) {
      state.consent.purpose = arr;
    },
    setSpecialFeatureConsent(state, arr) {
      state.consent.specialFeature = arr;
    },
    setObjectionPurpose(state, arr) {
      state.objection.purpose = arr;
    },
    addVendorConsent(state, id) {
      state.consent.vendor.push(id);
    },
    deleteVendorConsentById(state, id) {
      let index = state.consent.vendor.findIndex((res) => res === id);
      state.consent.vendor.splice(index, 1);
    },
    setIsCmpShow(state, status) {
      state.isCmpShow = status;
    },
    initVendorLegInts(state) {
      state.vendorLegInts = Object.keys(state.tcModel.gvl.vendors)
        .map((res) => parseInt(res))
        .filter((res) => state.tcModel.gvl.vendors[res].legIntPurposes.length);
    },
    addVendorLegIntsId(state, id) {
      if (state.vendorLegInts.includes(id)) {
        return;
      } else {
        state.vendorLegInts.push(id);
      }
    },
    deleteVendorLegIntsId(state, id) {
      if (!state.vendorLegInts.includes(id)) {
        return;
      } else {
        let index = state.vendorLegInts.findIndex((res) => res === id);
        state.vendorLegInts.splice(index, 1);
      }
    },
  },
  actions: {
    initTcModel({ commit, state }) {
      GVL.baseUrl = state.vendorListBaseUrl;
      const tcModel = new TCModel(new GVL());
      tcModel.gvl.readyPromise.then(() => {
        tcModel.cmpId = 360;
        tcModel.cmpVersion = 1;
        tcModel.consentScreen = 1;
        tcModel.isServiceSpecific = true;
        commit("setTcModel", tcModel);
        commit("initVendorLegInts");
      });
    },
  },
  getters: {
    tcModel: (state) => state.tcModel,
    consent: (state) => state.consent,
    objection: (state) => state.objection,
    vendorLegInts: (state) => state.vendorLegInts,
    isCmpShow: (state) => state.isCmpShow,
    tcString: (state) => state.tcString,
  },
  modules: {},
});
