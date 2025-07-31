const express = require('express');
const Build = require('../models/Build');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/builds (save new build - logged in user)
router.post('/', auth, async (req, res) => {
  try {
    const { carModel, color, selectedParts, totalPrice } = req.body;

    const build = new Build({
      userId: req.user.id,
      carModel,
      color,
      selectedParts,
      totalPrice
    });

    await build.save();
    res.status(201).json(build);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/builds/:userId (get builds by user)
router.get('/:userId', auth, async (req, res) => {
  try {
    const builds = await Build.find({ userId: req.params.userId });
    res.json(builds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/builds/:buildId (update build)
router.put('/:buildId', auth, async (req, res) => {
  try {
    const { buildId } = req.params;
    
    // Validate buildId
    if (!buildId || buildId === 'undefined') {
      return res.status(400).json({ message: 'Invalid build ID' });
    }
    
    const { carModel, color, selectedParts, totalPrice } = req.body;
    
    // Find the build and check if it belongs to the user
    const build = await Build.findById(buildId);
    
    if (!build) {
      return res.status(404).json({ message: 'Build not found' });
    }
    
    if (build.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this build' });
    }
    
    // Update the build
    const updatedBuild = await Build.findByIdAndUpdate(
      buildId,
      {
        carModel,
        color,
        selectedParts,
        totalPrice,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    res.json(updatedBuild);
  } catch (error) {
    console.error('Update build error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/builds/:buildId (delete build)
router.delete('/:buildId', auth, async (req, res) => {
  try {
    const { buildId } = req.params;
    
    // Validate buildId
    if (!buildId || buildId === 'undefined') {
      return res.status(400).json({ message: 'Invalid build ID' });
    }
    
    // Find the build and check if it belongs to the user
    const build = await Build.findById(buildId);
    
    if (!build) {
      return res.status(404).json({ message: 'Build not found' });
    }
    
    if (build.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this build' });
    }
    
    // Delete the build
    await Build.findByIdAndDelete(buildId);
    
    res.json({ message: 'Build deleted successfully' });
  } catch (error) {
    console.error('Delete build error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 