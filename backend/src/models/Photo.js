import mongoose from 'mongoose';

/**
 * 照片数据模型
 */
const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  year: {
    type: Number
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  caption: {
    type: String,
    trim: true,
    default: ''
  },
  position: {
    branch: {
      type: Number,
      default: 0
    },
    angle: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    size: Number,
    mimeType: String,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// 在保存前自动计算年月
photoSchema.pre('save', function(next) {
  if (this.isModified('date')) {
    const date = new Date(this.date);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
  }
  next();
});

// 创建索引以提高查询性能
photoSchema.index({ year: 1, month: 1 });
photoSchema.index({ date: -1 });

export default mongoose.model('Photo', photoSchema);
