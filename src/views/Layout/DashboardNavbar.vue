<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top navbar-expand"
    :class="{ 'navbar-dark': type === 'default' }"
  >
    <a
      href="#"
      aria-current="page"
      class="
        h4
        mb-0
        text-white text-uppercase
        d-none d-lg-inline-block
        active
        router-link-active
      "
    >
      {{ $parent.routeName }}
    </a>
    <b-navbar-nav class="align-items-center ml-md-auto">
      <li class="nav-item d-sm-none">
        <a
          class="nav-link"
          href="#"
          data-action="search-show"
          data-target="#navbar-search-main"
        >
          <i class="ni ni-zoom-split-in"></i>
        </a>
      </li>
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-auto ml-md-0">
      <b-form
        class="navbar-search form-inline mr-sm-3"
        :class="{
          'navbar-search-dark': type === 'default',
          'navbar-search-light': type === 'light',
        }"
        id="navbar-search-main"
      >
        <b-form-group class="mb-0">
          <b-input-group class="input-group-alternative input-group-merge">
            <b-form-input
              v-model="searchQuery"
              placeholder="Collection or Account"
              type="text"
            >
            </b-form-input>
            <div class="input-group-append">
              <span class="input-group-text"
                ><i class="fas fa-search"></i
              ></span>
            </div>
          </b-input-group>
        </b-form-group>
        <dashboard-search :searchQuery="searchQuery" :root="$parent" />
      </b-form>
      <base-dropdown
        menu-on-right
        class="nav-item"
        tag="li"
        title-tag="a"
        title-classes="nav-link pr-0"
      >
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <b-media no-body class="align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img :src="$parent.makeBlockie($parent.signeraddr)" alt="" />
            </span>
            <b-media-body class="ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold">{{
                $parent.signeraddr.substr(0, 6)
              }}</span>
            </b-media-body>
          </b-media>
        </a>
        <template>
          <b-dropdown-header class="noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </b-dropdown-header>
          <b-dropdown-item href="/#/account">
            <i class="ni ni-single-02"></i>
            <span>My Account</span>
          </b-dropdown-item>
        </template>
      </base-dropdown>
    </b-navbar-nav>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "@/components";
import DashboardSearch from "./DashboardSearch.vue";

export default {
  components: {
    DashboardSearch,
    CollapseTransition,
    BaseNav,
    Modal,
  },
  props: {
    type: {
      type: String,
      default: "default", // default|light
      description:
        "Look of the dashboard navbar. Default (Green) or light (gray)",
    },
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      searchQuery: "",
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
  },
};
</script>
