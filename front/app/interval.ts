
export class Interval {
    public title: string;

    constructor (public value:number) {
        /*
        this.title = Math.floor(value / 60).toString() + ' hour ';
        if ((value % 60) != 0) {
            this.title += (value % 60).toString() + ' min';
        }
         */
        this.title = Interval.makeRuTitle(value);
    }

    public static makeRuTitle(value: number) {
        let suffix = '';
        let h = Math.floor(value / 60);
        let m = value % 60;
        let decad = h % 10;
        let hundr = h % 100;
        //console.log(value, h, m, decad, hundr);
        if (decad == 0) {
            suffix = 'ов';
        } else if (decad == 1 && hundr > 11) {
            suffix = '';
        } else if (decad > 1 && decad < 5 && (hundr > 15 || hundr < 10)) {
            suffix = 'а';
        } else if (decad > 4 || (hundr > 10 && hundr < 15)) {
            suffix = 'ов';
        }

        let hour = ' час' + suffix;
        if (m != 0) {
            return h + hour.toString() + ' ' + m + ' минут';
        } else {
            return h + hour.toString();
        }
    }
    /*
     один час
     два часа
     3 часа
     4 часа
     5 часов
     6 часов
     7 часов
     9 ов
     10 ов
     11 ов
     21 час
     22 часа
     23 часа
     24 часа
     25 часов
     26 часов
     30 часов
     31
     */
}
