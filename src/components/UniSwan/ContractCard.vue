<template>
  <div class="contract">
    <!-- @click="$parent.closeSearch();" -->
    <h4 >
      <router-link :to="'/explorer?contract='+contract.id">
        {{contract.name}}
      </router-link>
    </h4>
    <!-- <pre>{{contract}}</pre> -->
  </div>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  // import NftCard from '@/components/UniSwan/NftCard';
  export default {
    name: 'contract-card',
    props: ["contract", "root"],
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
