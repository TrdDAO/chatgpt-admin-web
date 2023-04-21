/**
 * icon:菜单项图标
 * roles:标明当前菜单项在何种角色下可以显示，如果不写此选项，表示该菜单项完全公开，在任何角色下都显示
 */
const menuList = [
  {
    title: "首页",
    path: "/dashboard",
    icon: "home"
  },
  {
    title: "管理员原理",
    path: "/administrators",
    icon: "bot",
  },
  {
    title: "用户管理",
    path: "/customers",
    icon: "bot"
  },
  {
    title: "订阅管理",
    path: "/subscriptions",
    icon: "user",
  },
  {
    title: "用户权益查询",
    path: "/userEquities",
    icon: "user",
  },
];

export default menuList;
