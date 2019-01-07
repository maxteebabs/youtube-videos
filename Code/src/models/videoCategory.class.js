export class VideoCategory {
    id='';
    name = '';
    constructor (item) {
        this.id = item['id'];
        this.name = item['snippet']['title'];
    }
}