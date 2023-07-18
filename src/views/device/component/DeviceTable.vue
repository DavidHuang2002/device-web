<template>
  <div class="device-table-container">
    <el-card class="box-card">
      <el-table :data="devices">
        <el-table-column prop="id" label="Id"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="type" label="Type"></el-table-column>
        <el-table-column prop="status" label="Status"></el-table-column>
        <el-table-column prop="location" label="Location"></el-table-column>
        <el-table-column prop="addedDate" label="Added Date"></el-table-column>
        <el-table-column prop="lastCheckInTime" label="Last Check In Time"></el-table-column>
        <el-table-column prop="notes" label="Notes"></el-table-column>
      </el-table>
    </el-card>
  </div> 
</template>

<script>
import DeviceDataService from '../../../services/DeviceDataService';
export default {
  name: 'DeviceTable',
  data() {
    return {
      devices: [],
    };
  },

  methods: {
    async fetchDevices() {
        DeviceDataService.getAll()
        .then(response => {
          this.devices = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },

  async mounted() {
    this.fetchDevices();
  },
};
</script>

<style scoped>
/* Add custom styles here */
</style>
