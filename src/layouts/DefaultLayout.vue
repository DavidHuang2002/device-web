<template>
    <div class="default-layout">
      <Sidebar />
      <el-main class="default-content">
        <router-view></router-view>
      </el-main>
    </div>
  </template>
  
  <script>
  import Sidebar from "@/components/SideBar/index.vue";
  
  export default {
    name: "DefaultLayout",
    components: {
      Sidebar,
    },
  };
  </script>
  
  <style>
  .default-layout {
    display: flex;
    height: 100vh;
  }
  
  .sidebar-container {
    flex-basis: 200px; /* Set the width of the sidebar */
    background-color: #f5f7fa;
    border-right: 1px solid #e4e7ed;
    overflow-y: auto; /* Enable vertical scrollbar if content exceeds height */
  }
  
  .el-menu {
    border: none;
  }
  
  .el-main {
    flex-grow: 1; /* Allow the main content to grow and take remaining space */
    padding: 20px;
  }
  </style>
  