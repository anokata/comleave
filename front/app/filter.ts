export class Filter {
    constructor (
        public action: string, 
        public date1: string,
        public date2: string,
        public type: number,
        public status: string,
        public person_id: number,
        public limit: number = 0,
        public offset: number = 0,
        public is_over: number = 0,
    ) {}
}
