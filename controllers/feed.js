const Article = require('../models/Article')
const Archive = require('../models/Archive')
const Project = require('../models/Project')
const Query = require('../models/Query')
const User = require('../models/User')

exports.getFeed = async(req, res)=>{
    try {
        // get all the articles, projects, queries, archives from database
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

    // Fetch documents from each collection with pagination
        const articles = await Article.find()
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        const projects = await Project.find()
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        const queries = await Query.find()
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        const archives = await Archive.find()
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        // combining all the documents in single array
        let feed = [...articles, ...archives, ...projects, ...queries]

        // sorting array according to timestamp
        feed.sort((a,b) => b.updatedAt - a.updatedAt)

        // sending response
        res.status(200).json(feed)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getFriendSuggestions = async (req, res) => {
    try {
      const { userId } = req.params.userId

      // Select 3 random users using the $sample aggregation operator
      const selectedUsers = await User.aggregate([ { $sample: { size: 3 } },
        {
          $match: {
            userId: { $ne: userId }     // ignored own profile details
          }
        }]);
  
      res.status(200).json(selectedUsers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }