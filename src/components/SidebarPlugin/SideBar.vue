<template>
    <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">
            <navbar-toggle-button @click.native="showSidebar">
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/dashboard">
              <b-img src="img/brand/uniswan0.png" fluid/>
            </router-link>

            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <base-dropdown class="nav-item" menu-on-right tag="li" title-tag="a">
                        <a slot="title-container" class="nav-link nav-link-icon" href="#" role="button"
                           aria-haspopup="true" aria-expanded="false">
                            <i class="ni ni-bell-55"></i>
                        </a>
                    </base-dropdown>
                    <base-dropdown class="nav-item" menu-on-right tag="li" title-tag="a">
                        <a slot="title-container" class="nav-link" href="#" role="button">
                            <div class="media align-items-center">
                              <span class="avatar avatar-sm rounded-circle">
                                <img :src="$parent.makeBlockie($parent.signeraddr)" alt="">
                              </span>
                            </div>
                        </a>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <router-link to="/dashboard" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>My profile</span>
                        </router-link>
                    </base-dropdown>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show" id="sidenav-collapse-main">
                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>
                <ul class="navbar-nav">
                  <slot name="links">
                  </slot>
                </ul>
                <hr class="my-3">
                <h6 class="navbar-heading text-muted">Documentation</h6>
                <ul class="navbar-nav mb-md-3">
                  <li class="nav-item">
                      <a class="nav-link"
                      href="/#/about">
                      <i class="ni ni-spaceship"></i> Getting started
                    </a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link"
                         href="/#/orders">
                          <i class="ni ni-ui-04"></i> Stats
                      </a>
                  </li>
                </ul>
                <hr class="my-3">
                <h6 class="navbar-heading text-muted">Blockchain</h6>
                <ul class="navbar-nav mb-md-3" v-if="$parent.network">
                  <li class="nav-item">
                    <a class="nav-link" href="#!">
                      <i class="ni ni-compass-04 text-success"></i>
                      <b>
                        {{$parent.network.name}}
                      </b>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#!">
                      <i class="ni ni-bullet-list-67 text-danger"></i>
                      <b>
                        #{{$parent.formatNum($parent.blockNumber, 0)}}
                      </b>
                    </a>
                  </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '@/components/NavbarToggleButton'

  export default {
    name: 'sidebar',
    components: {
      NavbarToggleButton
    },
    props: {
      logo: {
        type: String,
        default: 'img/brand/uniswan0.png',
        description: 'Sidebar app logo'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      }
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>
