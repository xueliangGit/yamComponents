/* eslint-disable */
export default class CalendarProvider {
  time = new Date();
  year = this.time.getFullYear();
  month = this.time.getMonth() + 1;
  day = this.time.getDate();
  week = this.time.getDay();
  Range = 10
  date = []
  showData = []
  constructor() {
    //console.log('Hello CalendarProvider Provider');
  }
  setTime (time = { year: NaN, month: NaN, day: NaN, range: NaN }) {
    this.year = time.year ? time.year : this.year;
    this.month = time.month ? time.month : this.month;
    this.day = time.day ? time.day : this.day;
    this.Range = time.range ? time.range : this.Range;
  }
  initTime (fn) {
    this.date = [];
    function isLeap(year) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 2;
      }
      return 3;
    }
    /*创建公共的月日，2月暂定位29天*/
    let month = [];
    let numb = '135781012';
    let days = [];
    for (let p = 1; p <= 31; p++) {//生产日
      days.push(p);
    }
    for (let o = 1; o <= 12; o++) {//生产日
      let d = days.concat();
      if (numb.indexOf(o) > -1) {
        month.push({ month: o, content: d });//31
      } else {
        d.length--;
        month.push({ month: o, content: d });//30
      }
    }
    month[1].content = [];
    /*创建年 数据流*/
    for (let i = this.Range * -1; i <= this.Range; i++) {
      let a = days.concat();
      let newmonth = month.concat();
      a.length -= isLeap(this.year + i);
      newmonth[1] = { month: 2, content: a };
      this.date.push({
        year: this.year + i,
        month: newmonth
      });
      newmonth = a = [];
    }
    /*合并 日期*/
    fn && fn();
    return this;
  }
  getDaysOfMonth (year, month) {
    if (year && month) {
      if (month == 2) {
        //2月闰年判断
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return 29;
        }
        return 28;
      }
      let bigMonth = [1, 3, 5, 7, 8, 10, 12];
      let littleMonth = [4, 6, 9, 11];
      for (let m in bigMonth) {
        if (bigMonth[m] == month)
          return 31;
      }
      for (let m in littleMonth) {
        if (littleMonth[m] == month)
          return 30;
      }
    }
  }
  showTime (year, month) {
    this.showData = [];
    year = year ? year : this.year;
    month = month ? month : this.month;
    let date = new Date(year, month - 1, 1);//month月的第一天
    let day = date.getDay();//星期
    let days = this.getDaysOfMonth(year, month);//month月的总天数
    let temp = Math.floor((days + day) / 7);
    let rows = (days + day) % 7 === 0 ? temp : (temp + 1);//要循环的行数
    let d = 1;
    for (let i = 1; i <= rows; i++) {//循环行
      this.showData.push([]);
      for (let j = 1; j <= 7; j++) {//循环列
        //超过最大天数赋空
        if (d > days) {
          this.showData[i - 1].push(0);
          continue;
        }
        if (i == 1) {
          //第一行判断month月第一天是星期几，例如星期二前面空两个周日、周一
          if (j >= day + 1) {
            this.showData[i - 1].push(d);
            d++;
          } else {
            this.showData[i - 1].push(0);
          }
        } else {
          this.showData[i - 1].push(d);
          d++;
        }
      }
    }
    return this;
  }
}