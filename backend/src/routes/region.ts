import { Router, Request, Response } from 'express'
import regionDataService from '../services/regionDataService'
import regionStats from '../utils/regionStats'
import regionManager from '../utils/regionManager'

const router = Router()

// 获取所有省份
router.get('/provinces', async (req: Request, res: Response): Promise<void> => {
  try {
    const provinces = await regionDataService.getProvinces()
    res.json({
      success: true,
      data: provinces
    })
  } catch (error) {
    console.error('获取省份列表失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 根据省份代码获取城市列表
router.get('/cities/:provinceCode', async (req: Request, res: Response): Promise<void> => {
  try {
    const { provinceCode } = req.params
    const cities = await regionDataService.getCities(provinceCode)
    
    res.json({
      success: true,
      data: cities
    })
  } catch (error) {
    console.error('获取城市列表失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 根据城市代码获取区县列表
router.get('/districts/:cityCode', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cityCode } = req.params
    const districts = await regionDataService.getDistricts(cityCode)
    
    res.json({
      success: true,
      data: districts
    })
  } catch (error) {
    console.error('获取区县列表失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 搜索地区（支持模糊搜索）
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query
    
    if (!keyword || typeof keyword !== 'string') {
      res.status(400).json({ 
        success: false, 
        error: '请提供搜索关键词' 
      })
      return
    }
    
    const results = await regionDataService.searchRegions(keyword)
    
    res.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('搜索地区失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 获取数据统计
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await regionStats.getStats()
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 获取详细统计
router.get('/stats/detailed', async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await regionStats.getDetailedStats()
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('获取详细统计失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 数据验证
router.get('/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = await regionManager.validateData()
    res.json({
      success: true,
      data: validation
    })
  } catch (error) {
    console.error('数据验证失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

// 生成数据报告
router.get('/report', async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await regionManager.generateReport()
    res.json({
      success: true,
      data: { report }
    })
  } catch (error) {
    console.error('生成报告失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
})

export default router 