const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 建立快捷访问
  token: state => state.user.token,
  // 建立用户名称的映射
  name: state => state.user.userInfo.username,
  // 建立用户id的映射
  userId: state => state.user.userInfo.userId,
  // 建立用户头像映射
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
