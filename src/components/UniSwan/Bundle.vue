<template>
  <div class="">
    <nft-card
      v-for="(n,idx) in bundle"
      :key="'id'+idx"
      :root="root"
      :nft="n"/>
  </div>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  import NftCard from '@/components/UniSwan/NftCard';
  export default {
    name: 'bundle',
    props: ["bundle", "root"],
    components: {
      NftCard
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
