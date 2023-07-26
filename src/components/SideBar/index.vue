<!-- TODO only clicking on the content of router link make page change. Clicking on blank spaces on menu does nothing -->
<template>
    <el-aside class="sidebar">
      <el-menu :default-active="activeMenu" class="el-menu-vertical">
        <el-menu-item>
          <router-link to="/" @click.native="handleLinkClick">Devices</router-link>
        </el-menu-item>
        <el-menu-item>
          <router-link to="/alerts" @click.native="handleLinkClick">Alerts</router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </template>
  
<script>
  export default {
    name: "Sidebar",
    computed: {
      activeMenu() {
        return this.$route.path;
      },
    },
    methods: {
      handleLinkClick(event) {
        // Prevent the default behavior of el-menu-item click
        event.stopPropagation();
      },
    },
  };
</script>
  
<style scoped>
.sidebar {
  width: 200px; /* Set the width of the sidebar */
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto; /* Enable vertical scrollbar if content exceeds height */
}

.el-menu {
  border: none;
}

.menu-text {
  line-height: 40px; /* Set the height of each menu item */
  text-decoration: none; /* Remove hyperlink underline */
  color: #333; /* Set the color of the menu item text */
  font-size: 14px; /* Adjust the font size of the menu item */
}

.el-menu-item.is-active,
.el-submenu.is-active > .el-submenu__title {
  background-color: #e4e7ed; /* Set the background color for active menu items */
}

.el-menu-item:hover,
.el-submenu__title:hover {
  background-color: #ebf0f6; /* Set the background color for menu items on hover */
}

/* override the default browser styling on hyperlinks */
a {
  color: #333; /* Set the color of the menu item text */
  text-decoration: none; /* Remove hyperlink underline */
  cursor: pointer;
}

</style>
