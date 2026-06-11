import express from 'express'
import { getTrendingTopics, getTopicDetails } from '../controllers/trending.controller.js'
import { 
  generateCommentForTopic, 
  deployComment, 
  getDeploymentHistory,
  getShadowbanRisk 
} from '../controllers/comments.controller.js'
import { 
  getAffiliateLinks, 
  addAffiliateLink, 
  updateAffiliateLink, 
  deleteAffiliateLink,
  importLinksCSV 
} from '../controllers/links.controller.js'
import { 
  initiateTwitterAuth, 
  handleTwitterCallback,
  disconnectTwitter 
} from '../controllers/auth.controller.js'

const router = express.Router()

router.get('/trending', getTrendingTopics)
router.get('/trending/:topic', getTopicDetails)

router.post('/comments/generate', generateCommentForTopic)
router.post('/comments/deploy', deployComment)
router.get('/comments/history', getDeploymentHistory)
router.get('/comments/risk', getShadowbanRisk)

router.get('/links', getAffiliateLinks)
router.post('/links', addAffiliateLink)
router.put('/links/:id', updateAffiliateLink)
router.delete('/links/:id', deleteAffiliateLink)
router.post('/links/import', importLinksCSV)

router.get('/auth/twitter', initiateTwitterAuth)
router.get('/auth/twitter/callback', handleTwitterCallback)
router.post('/auth/twitter/disconnect', disconnectTwitter)

export { router as apiRoutes }
