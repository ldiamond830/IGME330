//effectively a template class for creating bookmarks based on
class favorite {
constructor(text, url, comments, fid){
    this.fid = crypto.randomUUID();
    this.text = text;
    this.url = url;
    this.comments = comments
}


}

export {favorite}