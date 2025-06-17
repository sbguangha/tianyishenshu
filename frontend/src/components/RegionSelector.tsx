import React, { useState, useEffect } from 'react'
import './RegionSelector.css'

interface Region {
  code: string
  name: string
}

interface RegionSelectorProps {
  value?: {
    province?: Region
    city?: Region
    district?: Region
    fullName?: string
  }
  onChange: (region: {
    province?: Region
    city?: Region
    district?: Region
    fullName?: string
  }) => void
  placeholder?: string
  disabled?: boolean
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择地区',
  disabled = false
}) => {
  const [provinces, setProvinces] = useState<Region[]>([])
  const [cities, setCities] = useState<Region[]>([])
  const [districts, setDistricts] = useState<Region[]>([])
  
  const [selectedProvince, setSelectedProvince] = useState<Region | undefined>(value?.province)
  const [selectedCity, setSelectedCity] = useState<Region | undefined>(value?.city)
  const [selectedDistrict, setSelectedDistrict] = useState<Region | undefined>(value?.district)
  
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    type: string
    code: string
    name: string
    fullName: string
  }>>([])

  // 获取省份列表
  useEffect(() => {
    fetchProvinces()
  }, [])

  // 当选择的省份改变时，获取城市列表
  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince.code)
    } else {
      setCities([])
      setDistricts([])
    }
  }, [selectedProvince])

  // 当选择的城市改变时，获取区县列表
  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity.code)
    } else {
      setDistricts([])
    }
  }, [selectedCity])

  // 当选择改变时，通知父组件
  useEffect(() => {
    const fullName = [
      selectedProvince?.name,
      selectedCity?.name,
      selectedDistrict?.name
    ].filter(Boolean).join(' ')

    onChange({
      province: selectedProvince,
      city: selectedCity,
      district: selectedDistrict,
      fullName: fullName || undefined
    })
  }, [selectedProvince, selectedCity, selectedDistrict, onChange])

  const fetchProvinces = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/region/provinces')
      const data = await response.json()
      if (data.success) {
        setProvinces(data.data)
      }
    } catch (error) {
      console.error('获取省份列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async (provinceCode: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/region/cities/${provinceCode}`)
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error('获取城市列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDistricts = async (cityCode: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/region/districts/${cityCode}`)
      const data = await response.json()
      if (data.success) {
        setDistricts(data.data)
      }
    } catch (error) {
      console.error('获取区县列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchRegions = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/region/search?keyword=${encodeURIComponent(keyword)}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error('搜索地区失败:', error)
    }
  }

  const handleProvinceSelect = (province: Region) => {
    setSelectedProvince(province)
    setSelectedCity(undefined)
    setSelectedDistrict(undefined)
  }

  const handleCitySelect = (city: Region) => {
    setSelectedCity(city)
    setSelectedDistrict(undefined)
  }

  const handleDistrictSelect = (district: Region) => {
    setSelectedDistrict(district)
    setShowDropdown(false)
  }

  const handleSearchSelect = (result: any) => {
    // 根据搜索结果类型设置相应的选择
    if (result.type === 'province') {
      const province = provinces.find(p => p.code === result.code)
      if (province) {
        handleProvinceSelect(province)
      }
    } else if (result.type === 'city') {
      // 需要先找到对应的省份
      const provinceCode = result.code.substring(0, 2) + '0000'
      const province = provinces.find(p => p.code === provinceCode)
      if (province) {
        setSelectedProvince(province)
        // 等待城市列表加载后再选择城市
        setTimeout(() => {
          const city = cities.find(c => c.code === result.code)
          if (city) {
            handleCitySelect(city)
          }
        }, 100)
      }
    } else if (result.type === 'district') {
      // 需要先找到对应的省份和城市
      const provinceCode = result.code.substring(0, 2) + '0000'
      const cityCode = result.code.substring(0, 4) + '00'
      const province = provinces.find(p => p.code === provinceCode)
      if (province) {
        setSelectedProvince(province)
        setTimeout(() => {
          const city = cities.find(c => c.code === cityCode)
          if (city) {
            setSelectedCity(city)
            setTimeout(() => {
              const district = districts.find(d => d.code === result.code)
              if (district) {
                handleDistrictSelect(district)
              }
            }, 100)
          }
        }, 100)
      }
    }
    setSearchKeyword('')
    setSearchResults([])
    setShowDropdown(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value
    setSearchKeyword(keyword)
    searchRegions(keyword)
  }

  const displayValue = value?.fullName || placeholder

  return (
    <div className="region-selector">
      <div 
        className={`region-input ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setShowDropdown(!showDropdown)}
      >
        <span className={value?.fullName ? 'selected' : 'placeholder'}>
          {displayValue}
        </span>
        <span className={`arrow ${showDropdown ? 'up' : 'down'}`}>▼</span>
      </div>

      {showDropdown && !disabled && (
        <div className="region-dropdown">
          {/* 搜索框 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索省市区..."
              value={searchKeyword}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <div className="section-title">搜索结果</div>
              {searchResults.map((result) => (
                <div
                  key={result.code}
                  className="search-result-item"
                  onClick={() => handleSearchSelect(result)}
                >
                  <span className="result-name">{result.name}</span>
                  <span className="result-full-name">{result.fullName}</span>
                </div>
              ))}
            </div>
          )}

          {/* 三级联动选择 */}
          {searchResults.length === 0 && (
            <div className="cascade-selector">
              {/* 省份选择 */}
              <div className="selector-column">
                <div className="column-title">省份</div>
                <div className="options-list">
                  {loading && provinces.length === 0 ? (
                    <div className="loading">加载中...</div>
                  ) : (
                    provinces.map((province) => (
                      <div
                        key={province.code}
                        className={`option-item ${
                          selectedProvince?.code === province.code ? 'selected' : ''
                        }`}
                        onClick={() => handleProvinceSelect(province)}
                      >
                        {province.name}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 城市选择 */}
              {selectedProvince && (
                <div className="selector-column">
                  <div className="column-title">城市</div>
                  <div className="options-list">
                    {loading && cities.length === 0 ? (
                      <div className="loading">加载中...</div>
                    ) : cities.length === 0 ? (
                      <div className="no-data">暂无数据</div>
                    ) : (
                      cities.map((city) => (
                        <div
                          key={city.code}
                          className={`option-item ${
                            selectedCity?.code === city.code ? 'selected' : ''
                          }`}
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 区县选择 */}
              {selectedCity && (
                <div className="selector-column">
                  <div className="column-title">区县</div>
                  <div className="options-list">
                    {loading && districts.length === 0 ? (
                      <div className="loading">加载中...</div>
                    ) : districts.length === 0 ? (
                      <div className="no-data">暂无数据</div>
                    ) : (
                      districts.map((district) => (
                        <div
                          key={district.code}
                          className={`option-item ${
                            selectedDistrict?.code === district.code ? 'selected' : ''
                          }`}
                          onClick={() => handleDistrictSelect(district)}
                        >
                          {district.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RegionSelector 