import request from '@/utils/request'

export const chatCompletion = data =>
  request.post('/api/chat/completion', data, {
    responseType: 'stream',
  })
export const chatAudio = data => request.post('/api/chat/audio', data)

export const fileUpload = data => request.post('/api/file/upload', data)
