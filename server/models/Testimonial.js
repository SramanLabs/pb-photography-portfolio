import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date: {
    type: String,
    required: true // e.g., "January 2025"
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster visibility filtering and date sorting
testimonialSchema.index({ visible: 1, createdAt: -1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
