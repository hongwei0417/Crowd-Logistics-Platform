export const transform_status = (status) => {
  switch(status) {
    case "wating":
      return "待處理"
    case "refused":
      return "訂單已拒絕"
    case "carrying":
      return "運送中"
    case "completed":
      return "已送達"
  }
}