<template>
  <!-- :style="{background: (nft.owner === root.signeraddr) ? '#ccc' : '#fff'}" -->
  <div

    class="nftcard"
    >
    <b-media no-body class="">
      <a :href="'/#/nft/'+nft.contract+'/'+nft.tokenID" class="avatar avatar-sm rounded-circle">
        <img class="bgim smallim" :style="{backgroundImage: 'url('+nft.tokenJSON.image+')'}" alt=""/>
      </a>&nbsp;
      <b-media-body>
          <span
            :style="{fontWeight: (nft.owner === root.signeraddr) ? 900 : 400}"
            class="name mb-0 text-sm">
            {{nft.tokenJSON.name}}
          </span>
          <br>
          <router-link :to="'/account/'+nft.owner">
            <i>{{
              nft.owner === root.signeraddr ?
              'Me'
              :
              nft.owner.substr(0,6)
            }}</i>
          </router-link>
          <!-- <pre>{{nft}}</pre> -->
      </b-media-body>
    </b-media>
  </div>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  export default {
    name: 'nft-card',
    props: ["nft", "display", "root"],
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
