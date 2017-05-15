
export class Interval {
    public title: string;

    constructor (public value:number) {
        this.title = Math.floor(value / 60).toString() + ' hour ';
        if ((value % 60) != 0) {
            this.title += (value % 60).toString() + ' min';
        }
    }
}
