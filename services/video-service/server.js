const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    service: 'video-service',
    timestamp: new Date().toISOString()
  });
});

// Mock video data
const videos = [
  { 
    id: 1, 
    title: 'Introduction to Kubernetes', 
    duration: '15:30',
    genre: 'Technology',
    views: 1250,
    uploadDate: '2024-01-15'
  },
  { 
    id: 2, 
    title: 'Docker Basics Tutorial', 
    duration: '22:45',
    genre: 'Technology',
    views: 3400,
    uploadDate: '2024-02-10'
  },
  { 
    id: 3, 
    title: 'CI/CD Pipeline Setup', 
    duration: '18:20',
    genre: 'DevOps',
    views: 890,
    uploadDate: '2024-03-05'
  },
  { 
    id: 4, 
    title: 'Microservices Architecture', 
    duration: '25:15',
    genre: 'Architecture',
    views: 2100,
    uploadDate: '2024-03-20'
  }
];

// Version endpoint
app.get('/api/version', (req, res) => {
  res.json({ 
    service: 'video-service',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all videos
app.get('/api/videos', (req, res) => {
  res.json(videos);
});

// Get video by ID
app.get('/api/videos/:id', (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.json(video);
});

// Get videos by genre
app.get('/api/videos/genre/:genre', (req, res) => {
  const filteredVideos = videos.filter(
    v => v.genre.toLowerCase() === req.params.genre.toLowerCase()
  );
  res.json(filteredVideos);
});

// Create new video
app.post('/api/videos', (req, res) => {
  const newVideo = {
    id: videos.length + 1,
    title: req.body.title,
    duration: req.body.duration,
    genre: req.body.genre,
    views: 0,
    uploadDate: new Date().toISOString().split('T')[0]
  };
  videos.push(newVideo);
  res.status(201).json(newVideo);
});

// Increment video views
app.post('/api/videos/:id/view', (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) return res.status(404).json({ error: 'Video not found' });
  
  video.views += 1;
  res.json({ message: 'View counted', video });
});

// Start server
app.listen(PORT, () => {
  console.log(`Video Service running on port ${PORT}`);
});
