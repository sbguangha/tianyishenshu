import { Request, Response } from 'express'
import { AnalysisService } from '../services/analysisService'

export const analysisController = {
  performAnalysis: async (req: Request, res: Response) => {
    try {
      const { name, birthDate, birthTime, birthPlace, gender } = req.body
      const result = await AnalysisService.performAnalysis({
        name,
        birthDate,
        birthTime,
        birthPlace,
        gender
      })

      res.json({
        success: true,
        bazi: result.bazi,
        personality: result.personality,
        career: result.career,
        health: result.health,
        relationship: result.relationship,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('分析错误:', error)
      res.status(500).json({
        success: false,
        error: '分析过程中发生错误'
      })
    }
  },

  getAnalysisHistory: async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: [],
        message: '暂无历史记录'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: '获取历史记录失败'
      })
    }
  },

  getAnalysisById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      res.json({
        success: true,
        data: null,
        message: '功能开发中'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: '获取分析结果失败'
      })
    }
  }
} 