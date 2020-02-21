export const login = (data) => ({
  type: "LOGIN",
  payload: data
})

export const updateFirstLoading = (status) => ({
  type: "UPDATE_FIRST_LOADING",
  status
})

export const logout = () => ({
  type: "LOGOUT",
})
