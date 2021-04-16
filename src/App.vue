<template>
  <div id="app">
    <Cmp v-if="isCmpShow" />
  </div>
</template>

<script>
import "babel-polyfill";
import Cmp from "./components/cmp.vue";
import store from "./store";
import { mapActions, mapGetters, mapMutations } from "vuex";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default {
  store,
  name: "App",
  components: {
    Cmp,
  },
  created() {
    let euConsentV2 = this.getCookie("euconsent-v2");
    if (euConsentV2) {
      this.cmpApiUpdate({ tcString: euConsentV2, showing: false });
      this.setIsCmpShow(false);
    } else {
      this.cmpApiUpdate({ tcString: "", showing: true });
      this.initTcModel();
    }
  },
  methods: {
    ...mapMutations(["setIsCmpShow", "cmpApiUpdate"]),
    ...mapActions(["initTcModel"]),
    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
  },
  computed: {
    ...mapGetters(["isCmpShow"]),
  },
};
</script>

<style lang="scss">
@import "assets/main.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
