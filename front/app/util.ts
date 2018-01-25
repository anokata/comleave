import { Overs } from './overs';
import { Interval } from './interval';
// vi: filetype=javascript

export class Util {

    public static dateToStr(date: Date) {
        let month: string = (date.getMonth() + 1).toString();
        let day: string = (date.getDate()).toString();
        if ((date.getMonth() + 1) < 10) month = '0' + month;
        if (date.getDate() < 10) day = '0' + day;
        return day + '.' + month + '.' + date.getFullYear();
    }

    public static strToDate(date: any) {
        let l = date.split('.');
        let day = parseInt(l[0]);
        let month = parseInt(l[1]);
        let year = parseInt(l[2]);
        return new Date(year, month - 1, day);
    }

    public static dateStrToStr(date: any) {
        let l = date.split('.');
        let day = (l[0]);
        let month = (l[1]);
        let year = (l[2]);
        return year + '-' + month + '-' + day;
    }

    public static setupDate() {
        let datep: JQuery;
        datep = $(".datepicker");
        datep.each((i: number, datep: any) => {
            let date: any = $(datep);
            date.datepicker();
        })
        return Util.dateToStr(new Date());
    }
    public static makeIntervalTitles(overs: Overs[]): Overs[] {
        overs.map((e: Overs) => {
            if (e.kind == 'I') {
                e.interval_str = Interval.makeRuTitleDays(e.interval);
            } else {
                e.interval_str = Interval.makeRuTitle(e.interval);
            }
        });
        return overs;
    }

    public static getMinDateStr(overs: Overs[]): string {
        let minDate = new Date();
        overs.forEach((over: Overs) => {
            if (new Date(over.start_date) < minDate) {
                minDate = new Date(over.start_date);
            }
        });
        return Util.dateToStr(minDate);
    }

    public static getMaxDateStr(overs: Overs[]): string {
        let maxDate = new Date('2020');
        overs.forEach((over: Overs) => {
            if (new Date(over.start_date) > maxDate) {
                maxDate = new Date(over.start_date);
            }
        });
        maxDate.setDate(maxDate.getDate() + 1);
        return Util.dateToStr(maxDate);
    }
}
