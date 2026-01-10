// const Community = require('../models/community');

// exports.createCommunity = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = req.user;

//     if (user.role !== 'volunteer' && user.role !== 'counsellor') {
//       return res.status(403).json({ error: 'Permission denied' });
//     }

//     const community = await Community.create({
//       name,
//       createdBy: user.userId,
//       members: [user.userId],
//       createdAt: new Date(),
//     });

//     res.status(201).json({ message: 'Community created', community });
//   } catch (err) {
//     console.error('Create Community Error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.joinCommunity = async (req, res) => {
//   try {
//     const communityId = req.params.id;
//     const userId = req.user.userId;

//     const community = await Community.findById(communityId);
//     if (!community) return res.status(404).json({ error: 'Community not found' });

//     if (!community.members.includes(userId)) {
//       community.members.push(userId);
//       await community.save();
//     }

//     res.status(200).json({ message: 'Joined community', communityId });
//   } catch (err) {
//     console.error('Join Community Error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.getCommunities = async (req, res) => {
//   try {
//     const communities = await Community.find();
//     res.status(200).json({ communities });
//   } catch (err) {
//     res.status(500).json({ error: 'Could not fetch communities' });
//   }
// };


