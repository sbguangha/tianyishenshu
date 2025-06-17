import { Router, Request, Response } from 'express'
import { analysisController } from '../controllers/analysisController'
import { validateAnalysisInput } from '../middleware/validation'

const router = Router()

// 命理分析
router.post('/', validateAnalysisInput, analysisController.performAnalysis)

// 获取分析历史
router.get('/history', analysisController.getAnalysisHistory)

// 获取单个分析结果
router.get('/:id', analysisController.getAnalysisById)

export default router 