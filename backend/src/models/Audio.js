import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    trim: true,
    default: '未知艺术家'
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  metadata: {
    size: Number,
    mimeType: String,
    format: String
  }
}, {
  timestamps: true
});

// Index for user's uploaded audio
audioSchema.index({ uploadedBy: 1, createdAt: -1 });

const Audio = mongoose.model('Audio', audioSchema);

export default Audio;
