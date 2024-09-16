class Game {
    constructor() {

        //component  elementDecision
           this.elementDecision= document.querySelector(".elementDecision");
           this.elementDecisionElementText = document.querySelector(".elementDecision .element");
           this.elementDecisionImage = document.querySelector(".elementDecision .img");
           this.elementDecisiontInput = document.querySelector(".elementDecision .input");
           this.elementDecisionBtn = document.querySelector(".elementDecision .btn");
           this.elementDecisionScoreNumber = document.querySelector(".elementDecision .score-number");

        ///component loader
           this.loader = document.querySelector(".loader-container");


        //component result
           this.result= document.querySelector(".result");
           this.resultElement1 = document.querySelector(".result .element1 ");
           this.resultElement2 = document.querySelector(".result .element2");
           this.resultParagraph = document.querySelector(".result .paragraph");
           this.resultImg1 = document.querySelector(".result .img-1");
           this.resultImg3 = document.querySelector(".result .img-3");
           this.resultScoreNumber = document.querySelector(".result .score-number");
           this.resultBtn = document.querySelector(".result .btn");

        //component ngt
           this.NgtResult= document.querySelector(".ngt-result");
           this.NgtresultElement1 = document.querySelector(".ngt-result .ngt-element1 ");
           this.NgtresultElement2 = document.querySelector(".ngt-result .ngt-element2");
           this.NgtresultParagraph = document.querySelector(".ngt-result .ngt-paragraph");
           this.NgtresultImg1 = document.querySelector(".ngt-result .img-1");
           this.NgtresultImg3 = document.querySelector(".ngt-result .img-3");
           this.NgtresultScoreNumber = document.querySelector(".ngt-result .ngt-score-number");
           this.NgtresultBtn = document.querySelector(".ngt-result .ngt-btn");


             // All click events
            
          this.elementDecisionBtn.addEventListener("click", (e) => this.fetchData(e));

          this.resultBtn.addEventListener("click", (e) => this.nextlevel(e));

          this.NgtresultBtn.addEventListener("click", (e) => this.restartGame(e))
           
          this.score = 0

          this.previous = "Rock"
          
          this.current = ""

          this.alreadyUsed = ['rock']
    } 
    


       async fetchData(e){      
               if (e) {
                   e.preventDefault();
               }

               console.log(import.meta.env.VITE_CHAT_KEY);

               const InputValue =  this.elementDecisiontInput.value

               if (InputValue === "") {  
                  console.log(InputValue)        
                   alert("Please enter your weapon of choice");
                   return;
               }

               if (this.alreadyUsed.includes(InputValue.toLocaleLowerCase())) {
                   alert("You have already used this weapon, please try another one");
                   return;
               }

               this.elementDecision.style.display = "none";
               this.loader.style.display = "flex"; 

               
               const url = 'https://api.openai.com/v1/chat/completions';

               this.current = InputValue

               let phrase =  `Tell me if the current word beats previous one and why(be funny and realist),and each element photo url
                respone like api respone shcema 
                  previous : ${this.previous},
                  previousPhotoUrl :    ,
                  current : ${InputValue} ,
                  curentPhotoCurrent :   ,
                  why :  
                  beats(true or false) : `


               const requestBody = {
                 model: 'gpt-3.5-turbo',
                 messages: [{ role: 'user', content: phrase }],
               };
               
               const response = await fetch(url , 
                  {
                      method: 'POST',
                      headers: { 
                           'Allow-Control-Allow-Origin': '*',
                           'Allow-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                           'Allow-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                           'Content-Type': 'application/json',
                           'Authorization': `Bearer ${import.meta.env.VITE_CHAT_KEY}`
                        },
                      body: JSON.stringify(requestBody),
                  })
 
               const data = await response.json();
                
               console.log("Res:" , data.choices[0].message.content);
             //  console.log(data.choices[0].message.content);

               //loaging stop
               this.loader.style.display = "none"; 
            
               this.fetchPhoto("dog")
               //trasform respanse message from string to object
               let parsedObject = JSON.parse(data.choices[0].message.content);

               //selecting each element from the object 
               let previous = parsedObject.previous;         ;
               let current = parsedObject.current;

               let beats = parsedObject.beats;
               let why = parsedObject.why;

              
               if (beats === true) {
                   this.score += 1;
                  
                   this.previous = this.current
                   this.current = ""
                   this.alreadyUsed.push(this.previous.toLocaleLowerCase())
                   this.result.style.display = "block";
                   this.resultElement1.innerHTML = current
                   this.resultElement2.innerHTML = previous
                   this.resultParagraph.innerHTML = why
                   let currentphotourl = await this.fetchPhoto(current)
                   
                   this.resultImg1.src = currentphotourl

                   let previousphotourl = await this.fetchPhoto(previous)
                   this.resultImg3.src = previousphotourl
                   this.resultScoreNumber.innerHTML = this.score
               }else{

                     this.NgtResult.style.display = "block";
                     this.NgtresultElement1.innerHTML = current
                     this.NgtresultElement2.innerHTML = previous
                     this.NgtresultParagraph.innerHTML = why
                     let currentphotourl = await this.fetchPhoto(current)
                     this.NgtresultImg1.src = currentphotourl
                     let previousphotourl = await this.fetchPhoto(previous)
                     this.NgtresultImg3.src = previousphotourl
                     this.NgtresultScoreNumber.innerHTML = this.score

               }
               // Output: Paper beats rock because paper covers rock, so paper wins in this scenario.
        }

        async nextlevel(e){
            e.preventDefault();
            this.result.style.display = "none";
            this.elementDecision.style.display = "flex";
            this.elementDecisionElementText.innerHTML = this.previous
            let previousphotourl = await this.fetchPhoto(this.previous)
            this.elementDecisionImage.src = previousphotourl
            this.elementDecisiontInput.value = "";
            this.elementDecisionScoreNumber.innerHTML = this.score
        }

        restartGame(e){
            e.preventDefault();
            this.score = 0;
            this.NgtResult.style.display = "none";
            this.elementDecision.style.display = "flex";
            this.elementDecisiontInput.value = "" 
            this.elementDecisionElementText.innerHTML = "Rock"
            this.elementDecisionScoreNumber.innerHTML = this.score
            this.elementDecisionImage.src = ''
        }
        



      async fetchPhoto(word){

          if(word.toLocaleLowerCase() === "rock"){
              let rockUrl =  "https://symbl-world.akamaized.net/i/webp/f2/0e29d778af528ff18585b3c4088835.webp"
              return rockUrl
          }

          let url = `https://api.unsplash.com/search/photos?query=${word}&page=1&per_page=10&client_id=${import.meta.env.VITE_PHOTO_KEY}`;

          let response = await fetch(url);

          let data = await response.json();

          console.log(data.results[0].urls.small)

          return data.results[0].urls.small
      }
       

}


document.addEventListener("DOMContentLoaded", () => {
   const game = new Game();
});
