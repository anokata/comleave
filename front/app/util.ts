import { Overs } from './overs';

export class Util {

    public static dateToStr(date: Date) {
        let month: string = (date.getMonth() + 1).toString();
        let day: string = (date.getDate()).toString();
        if (date.getMonth() < 10) month = '0' + month;
        if (date.getDate() < 10) day = '0' + day;
        return day + '.' + month + '.' + date.getFullYear();
    }

    public static setupDate() {
        let datep: JQuery;
        datep = $(".datepicker");
        datep.each((i: number, datep: any) => {
            let date: any = $(datep);
            date.datepicker();
            date.datepicker("option", "dateFormat", "dd.mm.yy");
            date.datepicker("option", "changeMonth", "true");
            date.datepicker("option", "changeYear", "true");
        })
        return Util.dateToStr(new Date());
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
        let maxDate = new Date('1900');
        overs.forEach((over: Overs) => {
            if (new Date(over.start_date) > maxDate) {
                maxDate = new Date(over.start_date);
            }
        });
        return Util.dateToStr(maxDate);
    }
}
