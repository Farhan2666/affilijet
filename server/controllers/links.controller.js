import { getDb } from '../config/firebase.js'
import { shortenLink } from '../services/bitly.service.js'

export async function getAffiliateLinks(req, res) {
  try {
    const db = getDb()
    const snapshot = await db.collection('affiliate_links')
      .orderBy('createdAt', 'desc')
      .get()
    
    const links = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    res.json({
      success: true,
      data: links
    })
    
  } catch (error) {
    console.error('Error in getAffiliateLinks:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function addAffiliateLink(req, res) {
  try {
    const { name, url, niche, shortenLinks = true } = req.body
    
    if (!name || !url || !niche) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, url, niche'
      })
    }
    
    let shortUrl = url
    let bitlyId = null
    
    if (shortenLinks) {
      try {
        const shortened = await shortenLink(url)
        shortUrl = shortened.shortUrl
        bitlyId = shortened.id
      } catch (err) {
        console.warn('Failed to shorten link, using original:', err.message)
      }
    }
    
    const db = getDb()
    const linkData = {
      name,
      url,
      shortUrl,
      bitlyId,
      niche,
      shortenLinks,
      status: 'active',
      conversions: 0,
      ctr: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const docRef = await db.collection('affiliate_links').add(linkData)
    
    res.json({
      success: true,
      data: {
        id: docRef.id,
        ...linkData
      }
    })
    
  } catch (error) {
    console.error('Error in addAffiliateLink:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function updateAffiliateLink(req, res) {
  try {
    const { id } = req.params
    const updates = req.body
    
    const db = getDb()
    updates.updatedAt = new Date().toISOString()
    
    await db.collection('affiliate_links').doc(id).update(updates)
    
    const updatedDoc = await db.collection('affiliate_links').doc(id).get()
    
    res.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    })
    
  } catch (error) {
    console.error('Error in updateAffiliateLink:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function deleteAffiliateLink(req, res) {
  try {
    const { id } = req.params
    
    const db = getDb()
    await db.collection('affiliate_links').doc(id).delete()
    
    res.json({
      success: true,
      message: 'Link deleted successfully'
    })
    
  } catch (error) {
    console.error('Error in deleteAffiliateLink:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function importLinksCSV(req, res) {
  try {
    const { csvData } = req.body
    
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    const db = getDb()
    const imported = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const linkData = {}
      
      headers.forEach((header, index) => {
        linkData[header] = values[index]
      })
      
      if (linkData.name && linkData.url && linkData.niche) {
        let shortUrl = linkData.url
        if (linkData.shortenLinks !== 'false') {
          try {
            const shortened = await shortenLink(linkData.url)
            shortUrl = shortened.shortUrl
          } catch (err) {
            console.warn(`Failed to shorten link for ${linkData.name}:`, err.message)
          }
        }
        
        const docData = {
          name: linkData.name,
          url: linkData.url,
          shortUrl,
          niche: linkData.niche,
          shortenLinks: linkData.shortenLinks !== 'false',
          status: 'active',
          conversions: 0,
          ctr: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const docRef = await db.collection('affiliate_links').add(docData)
        imported.push({ id: docRef.id, ...docData })
      }
    }
    
    res.json({
      success: true,
      data: {
        imported: imported.length,
        links: imported
      }
    })
    
  } catch (error) {
    console.error('Error in importLinksCSV:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
