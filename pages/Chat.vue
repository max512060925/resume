<template lang="pug">
.chat
  el-scrollbar.flex-1(ref='scrollbarRef')
    .w-full.border-b.text-gray-100(
      v-for='({ role, content }, i) in messages',
      class='border-gray-900/50',
      :class='role === "assistant" ? "bg-[#444654]" : "bg-gray-800"'
    )
      .text-base.gap-4.p-4.flex.m-auto(
        class='md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 lg:px-0'
      )
        .flex.items-center.justify-center.rounded-sm(
          class='w-[30px] h-[30px] bg-[#10a37f]',
          v-if='role === "assistant"'
        )
          IconOpenAi
        .flex.items-center.bg-purple-800.justify-center.rounded-sm(
          class='w-[30px] h-[30px]',
          v-else
        ) Q
        .flex.flex-col.gap-1(
          class='w-[calc(100%-50px)] md:gap-3 lg:w-[calc(100%-115px)]',
          :class='{ writing: waiting && role === "assistant" && i === messages.length - 1, answer: role === "assistant" }',
          :ref='el => (messages[i].elm = el)'
        )
          template(v-if='role === "user"') {{ content }}
  el-form(@submit.native='submit', :model='params', v-if='show')
    .relative.mx-auto(class='w-3/4 lg:max-w-2xl xl:max-w-3xl')
      el-input(
        ref='inputRef',
        v-model='params.input',
        type='textarea',
        resize='none',
        autosize,
        autofocus,
        placeholder='输入内容...',
        :disabled='waiting',
        @keydown.enter='inputEnter',
        class='border-black/10 dark:border-gray-900/50 dark:text-white dark:bg-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
      )
      button.absolute.p-1.rounded-md.text-gray-500.right-1.bottom-3.bg-transparent(
        class='hover:bg-gray-900',
        v-if='!waiting',
        type='submit'
      )
        IconSend
      button.spin.absolute.flex.p-1.rounded-md.text-gray-500.right-1.cursor-wait.bottom-4.bg-transparent(
        class='gap-x-[3px]',
        type='button',
        v-else
      )
        span
        span
        span
</template>
<script lang="ts" setup>
import type { ElScrollbar, ElInput } from 'element-plus'
import { chatCompletion } from '@/api'
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { markedHighlight } from 'marked-highlight'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
useHead({
  title: 'Chat-GPT 聊天',
})

marked.use(mangle())
marked.use(gfmHeadingId())
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  })
)
let scrollbarRef: InstanceType<typeof ElScrollbar> = $ref()
let inputRef: InstanceType<typeof ElInput> = $ref()
let show = $ref(false)
let messages = shallowReactive([])
let params = shallowReactive({
  input: '',
})
let waiting = $ref(false)
let cursor = shallowReactive({ x: 0, y: 0 })
let scrollHeight = 0

watch(
  () => waiting,
  val => {
    if (!val) {
      inputRef.focus()
    }
  }
)

const inputEnter = e => {
  if (e.isComposing) {
    return
  }
  send()
}

const submit = e => {
  e.preventDefault()
  send()
}

const send = async () => {
  if (waiting) {
    return
  } else if (!params.input?.trim()) {
    return customMessage.error('请输入内容！')
  }
  waiting = true
  messages.push({
    role: 'user',
    content: params.input,
  })
  params.input = ''
  const params = messages.map(({ role, content }) => ({ role, content }))
  const info = {
    role: 'assistant',
    content: '',
    elm: null as HTMLDivElement | null,
  }
  messages.push(info)
  const res = await chatCompletion(params)
  if (res) {
    const reader = res.getReader()
    scrollHeight = scrollbarRef.wrapRef.scrollHeight
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
              waiting = false
              return
            }
            try {
              const {
                choices: [{ delta }],
              } = JSON.parse(msg)
              if (!delta.hasOwnProperty('content')) {
                continue
              }
              info.content += delta.content
              info.elm.innerHTML = marked.parse(info.content)
              updateCursor(info.elm)
              if (scrollHeight !== scrollbarRef.wrapRef.scrollHeight) {
                scrollHeight = scrollbarRef.wrapRef.scrollHeight
                scrollbarRef.setScrollTop(scrollHeight)
              }
            } catch (error) {
              console.error('内容解析出错', msg, error)
            }
          }
        }
      },
    })
  } else {
    waiting = false
  }
}

const getLastTextNode = el => {
  const last = el.lastChild
  if (last?.nodeValue === '\n') {
    last.remove()
    return getLastTextNode(el)
  }
  if (last?.nodeType === Node.ELEMENT_NODE) {
    return getLastTextNode(last)
  }
  return last
}

const updateCursor = el => {
  const textNode = getLastTextNode(el)
  const parentElement = textNode?.parentElement || el
  const cursorText = document.createTextNode('\u200B')
  parentElement.appendChild(cursorText)
  const domRect = el.getBoundingClientRect()
  const range = document.createRange()
  range.setStart(cursorText, 0)
  range.setEnd(cursorText, 0)
  const rect = range.getBoundingClientRect()
  cursor.x = rect.left - domRect.left
  cursor.y = rect.top - domRect.top
  parentElement.removeChild(cursorText)
}

onMounted(() => (show = true))
</script>
<style lang="scss" scoped>
.chat {
  @apply bg-slate-700 w-full h-full flex flex-col;
  tab-size: 4;

  &:after {
    @apply content-[''] fixed w-full h-1/5 bg-gradient-to-t from-[#00000080] left-0 bottom-0 z-[1] pointer-events-none;
  }
  .answer {
    ::v-deep(p),
    ::v-deep(li) {
      @apply mb-5;
      &:not(:first) {
        @apply mt-5;
      }
      &:last-child {
        @apply mt-0;
      }
    }
    ::v-deep(pre) {
      @apply bg-black rounded-md mb-4 p-4 overflow-y-auto;
    }
  }
  .writing {
    --cursor-x: calc(v-bind('cursor.x') * 1px);
    --cursor-y: calc(v-bind('cursor.y') * 1px);
    @apply relative;
    &:after {
      @apply content-[""] absolute w-3 h-5 bg-slate-100 opacity-0 left-[var(--cursor-x)] top-[var(--cursor-y)] animate-[opacity_1.5s_infinite];
    }
  }
  .el-form {
    @apply mb-7 w-full flex z-10 flex-shrink-0 flex-grow-0 basis-auto;
    .spin span {
      @apply w-1 h-1 bg-white/40 rounded-[50%] opacity-0 animate-[opacity_0.9s_infinite];
      &:nth-child(2) {
        animation-delay: 0.3s;
      }
      &:nth-child(3) {
        animation-delay: 0.6s;
      }
    }
  }
  .el-textarea {
    @apply flex-1 flex-grow border py-2 bg-gray-700 border-gray-900/50 text-white rounded-md shadow-[0_0_15px_rgba(0,0,0,0.10)];

    ::v-deep(.el-textarea__inner) {
      @apply border-none shadow-none bg-transparent pr-8 text-white text-base focus:ring-0 focus-visible:ring-0;
    }
  }
}
</style>
