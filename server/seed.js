import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Album from './models/Album.js';
import Testimonial from './models/Testimonial.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const users = [
  { email: 'pbvideography.0032@gmail.com', password: 'pb@1326' },
  { email: 'aretirajendrakumar@gmail.com', password: 'pb@1326' },
  { email: 'sravyavaranasi2005@gmail.com', password: 'pb@1326' },
  { email: 'venkatamastan.mudigonda@gmail.com', password: 'pb@1326' },
];

const albums = [
  {
    title: "Wedding Stories",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    description: "Elegant wedding photography capturing love stories and timeless moments of joy.",
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e0adad242d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1465495910483-0d5522e0b1c9?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&h=1000&fit=crop"
    ],
    order: 1
  },
  {
    title: "Portrait Sessions",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    description: "Artistic portraits that reveal personality, depth, and character through the lens.",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1554151228-14d9def656ec?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop"
    ],
    order: 2
  },
  {
    title: "Nature & Landscape",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    description: "Breathtaking landscapes and natural beauty captured across varying terrains.",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=1000&fit=crop"
    ],
    order: 3
  },
  {
    title: "Events & Celebrations",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=800&fit=crop",
    description: "Capturing special moments, celebrations, and professional events with energy and style.",
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1514525253361-bee8a19740c1?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=1000&fit=crop"
    ],
    order: 4
  },
  {
    title: "Fashion & Editorial",
    coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop",
    description: "High-end fashion photography and editorial styles for brands and magazines.",
    photos: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1529139513055-1191924c61e7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1524311585934-245ed7e7998b?w=800&h=1000&fit=crop"
    ],
    order: 5
  },
  {
    title: "Street & Urban",
    coverImage: "https://images.unsplash.com/photo-1493605335038-f9cb907293a9?w=600&h=800&fit=crop",
    description: "Candid life and striking architecture in the metropolis, explored through street photography.",
    photos: [
      "https://images.unsplash.com/photo-1493605335038-f9cb907293a9?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1492576016075-f55a0720616b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1518391846015-55a960211273?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1502602732942-775ea4a6051a?w=800&h=1000&fit=crop"
    ],
    order: 6
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Wedding Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "Absolutely breathtaking work! The photos captured every special moment of our wedding day perfectly. The attention to detail and creativity was outstanding. We'll cherish these memories forever.",
    rating: 5,
    date: "December 2024"
  },
  {
    name: "Michael Chen",
    role: "Portrait Client",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "Incredible photographer! Made me feel completely comfortable during the shoot. The results exceeded all expectations. Professional, creative, and truly talented.",
    rating: 5,
    date: "November 2024"
  },
  {
    name: "Emily Rodriguez",
    role: "Family Session",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "Amazing experience from start to finish. The photos captured our family's personality perfectly.",
    rating: 5,
    date: "January 2025"
  },
  {
    name: "David Kim",
    role: "Corporate Event",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    content: "Professional, punctual, and produced stunning results. The team captured our corporate event perfectly.",
    rating: 5,
    date: "October 2024"
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Album.deleteMany();
    await Testimonial.deleteMany();

    await User.create(users);
    await Album.insertMany(albums);
    await Testimonial.insertMany(testimonials);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
