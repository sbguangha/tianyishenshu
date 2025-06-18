import { Schema, model, Document } from 'mongoose';

// 定义用户文档接口
export interface IUser extends Document {
  phone: string;
  name?: string;
  avatar?: string;
  gender?: '男' | '女' | '未知';
  birthDate?: Date;
  birthTime?: string;
  isLunar?: boolean;
  needsUserInfo: boolean;
  roles: string[];
  exchangeCodes: string[];
  isSuperUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 定义用户 Schema
const UserSchema = new Schema<IUser>({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String },
  avatar: { type: String },
  gender: { type: String, enum: ['男', '女', '未知'], default: '未知' },
  birthDate: { type: Date },
  birthTime: { type: String },
  isLunar: { type: Boolean, default: false },
  needsUserInfo: {
    type: Boolean,
    default: true,
  },
  roles: {
    type: [String],
    default: ['user'],
  },
  exchangeCodes: {
    type: [String],
    default: [],
  },
  isSuperUser: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt
});

// 创建并导出 User 模型
const User = model<IUser>('User', UserSchema);

export default User; 