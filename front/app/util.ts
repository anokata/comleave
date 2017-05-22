
export class Util {

    public static setupDate() {
        let datep: any;
        datep = $("#datepicker");
        datep.datepicker();
        datep.datepicker("option", "dateFormat", "dd.mm.yy");
        datep.datepicker("option", "changeMonth", "true");
        datep.datepicker("option", "changeYear", "true");
        let date: Date = new Date();
        let month: string = (date.getMonth() + 1).toString();
        let day: string = (date.getDate()).toString();
        if (date.getMonth() < 10) month = '0' + month;
        if (date.getDate() < 10) day = '0' + day;
        return (date.getDate()) + '.' + month + '.' + date.getFullYear();
    }
}
