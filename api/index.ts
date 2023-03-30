import request from '@/utils/request'

export const chatCompletion = async data =>
  await request.post('/api/chat/completion', data, {
    responseType: 'stream',
  })
