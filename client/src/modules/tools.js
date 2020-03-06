import { getWeb3 } from './eth'

const wating = "wating"
const refused = "refused"
const carrying = "carrying"
const confrim = "being confirm"
const completed = "completed"

export const transform_status_to_chinese = (status) => {
  switch(status) {
    case wating:
      return "待處理"
    case refused:
      return "訂單已拒絕"
    case carrying:
      return "運送中"
    case confrim:
      return "等待寄送者確認"
    case completed:
      return "已送達"
  }
}


export const get_Status_number = (status) => {
  switch(status) {
    case wating:
      return 0
    case refused:
      return 1
    case carrying:
      return 2
    case confrim:
      return 3
    case completed:
      return 4
  }
}

export const transform_unix_toLocal = (number) => {

  const date = new Date(parseInt(number)*1000)

  return date.toLocaleString()
}


export const ether_to_wei = (_ether) => {

  const web3 = getWeb3()

  let ether = _ether || 0

  let wei = web3.utils.toWei(ether.toString(), 'ether')

  return parseInt(wei)

}

export const wei_to_ether = (_wei, fixed) => {
  
  const web3 = getWeb3()

  let wei = _wei || 0

  let ether = parseFloat(web3.utils.fromWei(wei.toString(), 'ether'))

  if(fixed) {
    ether = ether.toFixed(4)
  }

  return ether
}