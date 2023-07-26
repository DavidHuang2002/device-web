<template>
    <el-dialog
      title="Add New Alert"
      v-model="state.dialogVisible"
      width="30%"
    >
      <el-form :model="alert" :rules="rules" ref="alertForm">
        <el-form-item label="Device ID" prop="deviceId">
          <el-input v-model="alert.deviceId"></el-input>
        </el-form-item>
        <el-form-item label="Timestamp" prop="timestamp">
          <el-date-picker
            v-model="alert.timestamp"
            type="datetime"
            placeholder="Select date and time"
            @change="adjustToUTC(alert.timestamp)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Severity" prop="severity">
          <el-input v-model="alert.severity"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="alert.description"></el-input>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-input v-model="alert.status"></el-input>
        </el-form-item>
        <el-form-item label="Acknowledged By" prop="acknowledgedBy">
          <el-input v-model="alert.acknowledgedBy"></el-input>
        </el-form-item>
        <el-form-item label="Acknowledged Timestamp" prop="acknowledgedTimestamp">
          <el-date-picker
            v-model="alert.acknowledgedTimestamp"
            type="datetime"
            placeholder="Select date and time"
            @change="adjustToUTC(alert.acknowledgedTimestamp)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Resolved By" prop="resolvedBy">
          <el-input v-model="alert.resolvedBy"></el-input>
        </el-form-item>
        <el-form-item label="Resolved Timestamp" prop="resolvedTimestamp">
          <el-date-picker
            v-model="alert.resolvedTimestamp"
            type="datetime"
            placeholder="Select date and time"
            @change="adjustToUTC(alert.resolvedTimestamp)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Additional Info" prop="additionalInfo">
          <el-input type="textarea" v-model="alert.additionalInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submit">{{ isEditMode() ? "Save" : "Add" }}</el-button>
      </span>
    </el-dialog>
  </template>
  <script setup>
  import { ref, defineEmits, reactive, defineExpose } from 'vue';
  import AlertDataService from '../../../services/AlertDataService';
  
  const defaultFormValues = {
    deviceId: undefined,
    timestamp: undefined,
    severity: undefined,
    description: undefined,
    status: undefined,
    acknowledgedBy: undefined,
    acknowledgedTimestamp: undefined,
    resolvedBy: undefined,
    resolvedTimestamp: undefined,
    additionalInfo: undefined,
  };
  
  const emits = defineEmits(['alertAdded', 'alertEdited']);
  const alertForm = ref(defaultFormValues);
  const alert = ref();
  const rules = ref({
    deviceId: [{ required: true, message: 'Please input Device ID', trigger: 'blur' }],
    severity: [{ required: true, message: 'Please input severity', trigger: 'blur' }],
    description: [{ required: true, message: 'Please input description', trigger: 'blur' }],
    status: [{ required: true, message: 'Please input status', trigger: 'blur' }],
  });
  
  const state = reactive({
    dialogVisible: false,
  });
  
  const adjustToUTC = (date) => {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  };
  
  const isEditMode = () => {
    return alert.value.AlertId !== undefined;
  };
  
  // Open dialog
  const openDialog = (row) => {
    state.dialogVisible = true;
    if (row !== undefined) {
      alert.value = row;
    } else {
      alert.value = defaultFormValues;
    }
  };
  
  // Close dialog
  const closeDialog = () => {
    state.dialogVisible = false;
  };
  
  // Cancel
  const cancel = () => {
    state.dialogVisible = false;
  };
  
  // Submit
  const submit = () => {
    alertForm.value.validate(async (valid) => {
      if (!valid) return;
  
      if (isEditMode()) {
        // Edit
        await AlertDataService.update(alert.value.AlertId, alert.value);
        closeDialog();
        emits('alertEdited');
      } else {
        // Add
        await AlertDataService.create(alert.value);
        closeDialog();
        emits('alertAdded');
      }
    });
  };
  
  // Export object
  defineExpose({ openDialog });
  </script>