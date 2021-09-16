<template>
  <span class="" v-if="address">
    <!-- {{address.substr(0,6)}} -->
    <router-link :to="'/account/'+address + '?tab=nfts'">
      <i>{{
        address.toLowerCase() === root.signeraddr.toLowerCase() ?
        'Me'
        :
        address.substr(0,6)
      }}</i>
    </router-link>
  </span>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  // import NftCard from '@/components/UniSwan/NftCard';
  export default {
    name: 'account-card',
    props: ["address", "root"],
    components: {
      // NftCard
      // [Table.name]: Table,
      // [TableColumn.name]: TableColumn,
      // [Dropdown.name]: Dropdown,
      // [DropdownItem.name]: DropdownItem,
      // [DropdownMenu.name]: DropdownMenu,
    },
    data() {
      return {

      }
    }
  }
</script>
<style>
</style>
