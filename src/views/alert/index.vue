<template>
  <div>
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" inline>
        <el-form-item label="Device ID">
          <el-input v-model="queryParams.deviceId" placeholder="Device ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="Timestamp Range">
          <el-date-picker
            v-model="queryParams.timestampRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start Timestamp"
            end-placeholder="End Timestamp"
            @change="adjustToUTC(queryParams.timestampRange)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Severity">
          <el-input v-model="queryParams.severity" placeholder="Severity" clearable></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-input v-model="queryParams.status" placeholder="Status" clearable></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="queryParams.description" placeholder="Description" clearable></el-input>
        </el-form-item>
        <el-form-item label="Acknowledged By">
          <el-input v-model="queryParams.acknowledgedBy" placeholder="Acknowledged By" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="Search" @click="handleQuery"> Search </el-button>
            <el-button :icon="Refresh" @click="resetQuery"> Reset </el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Plus" @click="openAddMenu"> Add </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="alert-table-container">
    <el-card class="box-card">
      <el-table :data="alerts" style="width: 100%" border>
        <el-table-column prop="alertId" label="Alert ID" width="120" align="center" fixed show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceId" label="Device ID" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="Timestamp" width="200" align="center" show-overflow-tooltip>
            <template #default="scope">
                {{ formatDateFromStr(scope.row.timestamp, 'YYYY-mm-dd HH:MM:SS') }}
            </template>
        </el-table-column>
        <el-table-column prop="severity" label="Severity" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="Description" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="Status" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="acknowledgedBy" label="Acknowledged By" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="Acknowledged Timestamp" width="200" align="center" show-overflow-tooltip>
            <template #default="scope">
                {{ formatDateFromStr(scope.row.acknowledgedTimestamp, 'YYYY-mm-dd HH:MM:SS') }}
            </template>
        </el-table-column>
        <el-table-column prop="resolvedBy" label="Resolved By" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="Resolved Timestamp" width="200" align="center" show-overflow-tooltip>
            <template #default="scope">
                {{ formatDateFromStr(scope.row.resolvedTimestamp, 'YYYY-mm-dd HH:MM:SS') }}
            </template>
        </el-table-column>
        <el-table-column prop="additionalInfo" label="Additional Info" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="Operations" width="140" align="center" fixed="right">
            <template #default="scope">
                <el-button :icon="Edit" size="small" text type="primary" @click="openEditMenu(scope.row)" v-auth="'sysMenu:update'"> Edit </el-button>
                <el-button :icon="Delete" size="small" text type="danger" @click="delAlert(scope.row)"> Delete </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
  <EditAlertDialog ref="editDialogRef" @alertAdded="handleAlertAdded" @alertEdited="handleAlertEdited" />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import AlertDataService from '../../services/AlertDataService';
import EditAlertDialog from './component/EditAlertDialog.vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { formatDateFromStr } from '../../utils/dateUtils';

const queryParams = ref({
  deviceId: undefined,
  timestampRange: undefined,
  severity: undefined,
  status: undefined,
  description: undefined,
  acknowledgedBy: undefined,
});

let alerts = ref([]);
const editDialogRef = ref();

const queryIsEmty = () => {
  return Object.keys(queryParams.value).every((key) => {
    return queryParams.value[key] === undefined;
  });
};

// to adjust the selected time into UTC time
const adjustToUTC = (timestampRange) => {
  if (timestampRange && timestampRange.length === 2) {
    timestampRange[0].setMinutes(timestampRange[0].getMinutes() - timestampRange[0].getTimezoneOffset());
    timestampRange[1].setMinutes(timestampRange[1].getMinutes() - timestampRange[1].getTimezoneOffset());
  }
};

const setAlertTableData = (data) => {
  alerts.value = data;
};

const handleQuery = () => {
  if (queryIsEmty()) {
    AlertDataService.getAll()
      .then((response) => {
        setAlertTableData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    AlertDataService.search(queryParams.value)
      .then((response) => {
        setAlertTableData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const resetQuery = () => {
  queryParams.value = {
    deviceId: undefined,
    timestampRange: undefined,
    severity: undefined,
    status: undefined,
    description: undefined,
    acknowledgedBy: undefined,
  };
};

const openAddMenu = () => {
  openEditMenu();
};

const openEditMenu = (row) => {
  editDialogRef.value?.openDialog(row);
};

const delAlert = (row) => {
  ElMessageBox.confirm(`Are you sure you want to delete alert with ID "${row.alertId}"?`, 'Confirmation', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await AlertDataService.delete(row.alertId);
      ElMessage.success('Delete success');
      handleQuery();
    })
    .catch((e) => {
      console.error(e);
    });
};

const handleAlertAdded = () => {
  ElMessage.success('Successfully added alert');
  handleQuery();
};

const handleAlertEdited = () => {
  ElMessage.success('Successfully edited alert');
  handleQuery();
};

onMounted(handleQuery);
</script>
<style scoped>
/* Add custom styles here */
</style>