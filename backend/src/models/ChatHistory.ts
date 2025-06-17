import mongoose, { Document, Schema } from 'mongoose'

export interface IChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface IChatHistory extends Document {
  userId: string
  title: string
  messages: IChatMessage[]
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
  id: { type: String, required: true },
  type: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true }
})

const ChatHistorySchema = new Schema<IChatHistory>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  messages: [ChatMessageSchema],
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// 更新时间中间件
ChatHistorySchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// 索引优化
ChatHistorySchema.index({ userId: 1, createdAt: -1 })
ChatHistorySchema.index({ userId: 1, isPinned: -1, updatedAt: -1 })

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema) 