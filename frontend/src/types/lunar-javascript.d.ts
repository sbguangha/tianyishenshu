declare module 'lunar-javascript' {
  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar
    getSolar(): Solar
    getYear(): LunarYear
    getYearInChinese(): string
    getMonthInChinese(): string
    getDayInChinese(): string
  }

  export class Solar {
    getYear(): number
    getMonth(): number
    getDay(): number
  }

  export class LunarYear {
    getLeapMonth(): number
  }
} 