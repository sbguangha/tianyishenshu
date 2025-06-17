import * as fs from 'fs'
import * as path from 'path'

interface RegionValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface RegionStats {
  provinces: number
  cities: number
  districts: number
  provincesWithCities: number
  citiesWithDistricts: number
}

class RegionManager {
  private dataPath = path.join(__dirname, '../data')

  // 验证数据完整性
  async validateData(): Promise<RegionValidationResult> {
    const result: RegionValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    }

    try {
      // 验证省份数据
      const provincesPath = path.join(this.dataPath, 'provinces.json')
      if (!fs.existsSync(provincesPath)) {
        result.errors.push('省份数据文件不存在')
        result.isValid = false
        return result
      }

      const provinces = JSON.parse(fs.readFileSync(provincesPath, 'utf-8'))
      
      // 验证每个省份的城市数据
      for (const province of provinces) {
        const cityPath = path.join(this.dataPath, 'cities', `${province.code}.json`)
        if (!fs.existsSync(cityPath)) {
          result.warnings.push(`${province.name} 缺少城市数据`)
          continue
        }

        const cities = JSON.parse(fs.readFileSync(cityPath, 'utf-8'))
        if (cities.length === 0) {
          result.warnings.push(`${province.name} 城市数据为空`)
        }

        // 验证区县数据
        for (const city of cities) {
          const districtPath = path.join(this.dataPath, 'districts', `${city.code}.json`)
          if (!fs.existsSync(districtPath)) {
            // 只对重要城市报告缺少区县数据
            const importantCities = ['北京市', '上海市', '广州市', '深圳市', '成都市', '杭州市']
            if (importantCities.includes(city.name)) {
              result.warnings.push(`${province.name} ${city.name} 缺少区县数据`)
            }
          }
        }
      }

      console.log(`✅ 数据验证完成`)
      console.log(`📊 错误: ${result.errors.length}个, 警告: ${result.warnings.length}个`)
      
    } catch (error) {
      // 修复类型错误 - 正确处理unknown类型的error
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      result.errors.push(`数据验证失败: ${errorMessage}`)
      result.isValid = false
    }

    return result
  }

  // 获取数据统计信息 - 补充缺失的方法
  async getStats(): Promise<RegionStats> {
    const stats: RegionStats = {
      provinces: 0,
      cities: 0,
      districts: 0,
      provincesWithCities: 0,
      citiesWithDistricts: 0
    }

    try {
      // 统计省份数量
      const provincesPath = path.join(this.dataPath, 'provinces.json')
      if (fs.existsSync(provincesPath)) {
        const provinces = JSON.parse(fs.readFileSync(provincesPath, 'utf-8'))
        stats.provinces = provinces.length

        // 统计城市数量
        for (const province of provinces) {
          const cityPath = path.join(this.dataPath, 'cities', `${province.code}.json`)
          if (fs.existsSync(cityPath)) {
            stats.provincesWithCities++
            const cities = JSON.parse(fs.readFileSync(cityPath, 'utf-8'))
            stats.cities += cities.length

            // 统计区县数量
            for (const city of cities) {
              const districtPath = path.join(this.dataPath, 'districts', `${city.code}.json`)
              if (fs.existsSync(districtPath)) {
                stats.citiesWithDistricts++
                const districts = JSON.parse(fs.readFileSync(districtPath, 'utf-8'))
                stats.districts += districts.length
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('获取统计信息时出错:', error)
    }

    return stats
  }

  // 生成数据统计报告
  async generateReport(): Promise<string> {
    const validation = await this.validateData()
    const stats = await this.getStats()
    
    const report = `
# 地区数据统计报告

## 数据概览
- 省份数量: ${stats.provinces}
- 城市数量: ${stats.cities}
- 区县数量: ${stats.districts}
- 省份覆盖率: ${Math.round((stats.provincesWithCities / stats.provinces) * 100)}%
- 城市区县覆盖率: ${Math.round((stats.citiesWithDistricts / stats.cities) * 100)}%

## 验证结果
- 数据有效性: ${validation.isValid ? '✅ 通过' : '❌ 失败'}
- 错误数量: ${validation.errors.length}
- 警告数量: ${validation.warnings.length}

${validation.errors.length > 0 ? `\n### 错误列表\n${validation.errors.map(e => `- ${e}`).join('\n')}` : ''}
${validation.warnings.length > 0 ? `\n### 警告列表\n${validation.warnings.map(w => `- ${w}`).join('\n')}` : ''}
`
    return report
  }
}

export default new RegionManager() 