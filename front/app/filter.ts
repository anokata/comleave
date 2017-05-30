export class Filter {
    constructor (
        public action: string, 
        public date1: string,
        public date2: string,
        public type: number,
        public status: string,
        public person_id: number
    ) {}
}
