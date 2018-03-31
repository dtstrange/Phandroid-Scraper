function scrape(){
    axios.get("/scrape")
    .then(resp =>{
        console.log(resp)
        location.href = "/"
    })
}