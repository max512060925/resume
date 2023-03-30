import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
const CustomMessage = options => {
  ElMessage.closeAll()
  nextTick(() => ElMessage({ ...options, grouping: true }))
}

const message = (msg, type) => {
  ElMessage.closeAll()
  nextTick(() =>
    ElMessage({
      type,
      message: msg,
      grouping: true
    })
  )
}

CustomMessage.success = msg => message(msg, 'success')
CustomMessage.warning = msg => message(msg, 'warning')
CustomMessage.info = msg => message(msg, 'info')
CustomMessage.error = msg => message(msg, 'error')

export default CustomMessage as typeof ElMessage
