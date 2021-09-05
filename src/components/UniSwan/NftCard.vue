<template>
  <div class="nftcard">
    <b-media no-body class="align-items-center">
      <a :href="'/#/nft/'+nft.contract+'/'+nft.tokenID" class="avatar avatar-sm rounded-circle">
        <!-- <img alt="Image placeholder" :src="nft.tokenJSON.image"> -->
        <img class="bgim smallim" :style="{backgroundImage: 'url('+nft.tokenJSON.image+')'}" alt=""/>
      </a>&nbsp;
      <b-media-body>
          <span class="font-weight-400 name mb-0 text-sm">
            {{nft.tokenJSON.name}}
          </span>
          <!-- <pre>{{nft}}</pre> -->
      </b-media-body>
    </b-media>
    <!-- <a :href="'/#/nft/'+nft.contract+'/'+nft.tokenID"
      v-b-popover.hover.bottom="nft.tokenJSON.name"
      class="avatar avatar-md rounded-circle"
      data-toggle="tooltip"
       data-original-title="Ryan Tompson">
        <img class="bgim smallim" :style="{backgroundImage: 'url('+nft.tokenJSON.image+')'}" alt=""/>
    </a>
    {{nft.tokenJSON.name}} -->
  <!-- <b-avatar variant="info"></b-avatar> -->
  <!-- <div class="nftcard">
    <b-media no-body class="align-items-center">
      <a href="#" class="avatar avatar-sm rounded-circle">
        <img alt="Image placeholder" :src="nft.tokenJSON.image">
      </a>
      <b-media-body>
          <span class="font-weight-600 name mb-0 text-sm">
            {{nft.tokenJSON.name}}
          </span>
      </b-media-body>
    </b-media> -->

  </div>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  export default {
    name: 'nft-card',
    props: ["nft", "display"],
    components: {
      // [Table.name]: Table,
      // [TableColumn.name]: TableColumn,
      // [Dropdown.name]: Dropdown,
      // [DropdownItem.name]: DropdownItem,
      // [DropdownMenu.name]: DropdownMenu,
    },
    data() {
      return {

      }
    },
    methods: {
      cleanInt(val) {
        var toret = val
        if (val.hex)
          toret = parseInt(val.hex)
        else if (typeof(val) === 'object')
          toret = val.toNumber()

        return toret
      }
    }
  }
</script>
<style>
.nftcard {
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  /* font-size: 10px; */
  /* display: inline-block;
  line-height: 36px; */
}
.smallim {
  height: 100%;
  width: calc(36px);
  /* height: 36px;
  width: 36px; */
  /* border: 1px solid #000; */
  border-radius: 50%;
}
</style>
