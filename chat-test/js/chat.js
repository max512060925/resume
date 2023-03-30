// 清空上下文，开启全新的聊天
const apiUrl = 'http://localhost:3000/api/chat/completion'

function clear() {
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clear: true,
    }),
  })
}

clear()

const form = document.querySelector('.send')
const textArea = document.querySelector('.send textarea')

textArea.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    form.dispatchEvent(new Event('submit'))
  }
})

form.onsubmit = e => {
  e.preventDefault()
  // 发送消息
  sendMsg()
}

let isReplying = false // 是否正在回复中
async function sendMsg() {
  if (isReplying) {
    // 机器人正在回复之前的内容
    return
  }
  const content = textArea.value.trim()
  if (!content) {
    return // 无内容
  }
  createUserContent('问')
  isReplying = true
  const robot = createRobotContent()
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role: 'user',
      content,
    }),
  })
  // const reader = resp.body.getReader()
  // const decoder = new TextDecoder('utf-8')
  // while (1) {
  //   const { done, value } = await reader.read()
  //   if (done) {
  //     // 读完了，没有了
  //     break
  //   }
  //   const txt = decoder.decode(value)
  //   robot.append(txt)
  // }
  const reader = resp.body.getReader()
  new ReadableStream({
    async start(controller) {
      while (1) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          break
        }
        const decoder = new TextDecoder('utf-8')
        const chunk = decoder.decode(value)
        const messages = chunk.split(/data:|\n/).filter(s => s?.trim())
        for (const msg of messages) {
          if (/\[DONE\]/.test(msg)) {
            return
          }
          try {
            const {
              choices: [{ delta }],
            } = JSON.parse(msg)
            console.log(delta)
            if (!delta.hasOwnProperty('content')) {
              continue
            }
            robot.append(delta.content)
          } catch (error) {
            console.error('内容解析出错', msg, error)
          }
        }
      }
    },
  })
  robot.over()
  isReplying = false
}
