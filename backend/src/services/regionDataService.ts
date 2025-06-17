import * as fs from 'fs'
import * as path from 'path'

interface Region {
  code: string
  name: string
  children?: Region[]
}

class RegionDataService {
  private data: Region[] = []
  private dataPath = path.join(__dirname, '../data/pca-code.json')

  constructor() {
    this.loadData()
  }

  private loadData() {
    try {
      const jsonData = fs.readFileSync(this.dataPath, 'utf-8')
      this.data = JSON.parse(jsonData)
    } catch (error) {
      console.error('加载行政区划数据失败:', error)
      this.data = []
    }
  }

  // 获取省份列表
  async getProvinces(): Promise<Omit<Region, 'children'>[]> {
    return this.data.map(({ code, name }) => ({ code, name }))
  }

  // 获取城市列表
  async getCities(provinceCode: string): Promise<Omit<Region, 'children'>[]> {
    const province = this.data.find(p => p.code === provinceCode)
    if (province && province.children) {
      return province.children.map(({ code, name }) => ({ code, name }))
    }
    return []
  }

  // 获取区县列表
  async getDistricts(cityCode: string): Promise<Omit<Region, 'children'>[]> {
    for (const province of this.data) {
      if (province.children) {
        const city = province.children.find(c => c.code === cityCode)
        if (city && city.children) {
          return city.children.map(({ code, name }) => ({ code, name }))
        }
      }
    }
    return []
  }

  // 搜索地区
  async searchRegions(keyword: string): Promise<Array<{
    type: string
    code: string
    name: string
    fullName: string
  }>> {
    const results: Array<{
      type: string
      code: string
      name: string
      fullName: string
    }> = []

    if (!keyword) {
      return []
    }

    // 搜索省份
    for (const province of this.data) {
      if (province.name.includes(keyword)) {
        results.push({
          type: 'province',
          code: province.code,
          name: province.name,
          fullName: province.name
        })
      }

      // 搜索城市
      if (province.children) {
        for (const city of province.children) {
          if (city.name.includes(keyword)) {
            results.push({
              type: 'city',
              code: city.code,
              name: city.name,
              fullName: `${province.name} ${city.name}`
            })
          }

          // 搜索区县
          if (city.children) {
            for (const district of city.children) {
              if (district.name.includes(keyword)) {
                results.push({
                  type: 'district',
                  code: district.code,
                  name: district.name,
                  fullName: `${province.name} ${city.name} ${district.name}`
                })
              }
            }
          }
        }
      }
    }

    return results.slice(0, 20) // 限制返回20条结果
  }

  // 重新加载数据
  reloadData() {
    this.loadData()
  }
}

// 添加默认导出
export default new RegionDataService()
