export const transform_status = (status) => {
  switch(status) {
    case "wating":
      return "等待中"
    case "refused":
      return "訂單被拒絕"
    case "carrying":
      return "運送中"
    case "completed":
      return "已送達"
  }
}