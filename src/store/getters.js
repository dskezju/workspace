export default {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  avatar: state => state.user.avatar,
  //权限目前用不上
  // permissions: state => state.user.permissions,
}
