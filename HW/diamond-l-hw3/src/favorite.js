class favorite {
constructor(text, url, comments){
    this.fid = crypto.randomUUID();
    this.text = text;
    this.url = url;
    this.comments = comments
}


}

export {favorite}