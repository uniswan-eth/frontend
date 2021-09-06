<template>
  <span class="">
    <!-- {{address.substr(0,6)}} -->
    <router-link :to="'/account/'+address">
      <i>{{
        address === root.signeraddr ?
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
