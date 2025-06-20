
class apiService{
    constructor(){
   
    }

   get(url,params = {}){
    if(Object.keys(params).length !== 0)
    {
      const queryString ='?'+ Object.keys(params)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');

      url+=queryString;
    }
    return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
   }

   hello(){

   }

  post(url,data){
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };
  return fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
   }

   delete(){

   }

   update(){

   }
}

export default apiService;