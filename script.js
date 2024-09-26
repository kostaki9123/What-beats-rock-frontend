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
               
               const url = `https://what-beats-rock-backend.onrender.com/chatgpt/?previous=${this.previous}&current=${InputValue}`;

               this.current = InputValue

               const response = await fetch(url)
 
               const data = await response.json();
                
               console.log("Res chatgpt from backend:" ,data);
             //  console.log(data.choices[0].message.content);

               //loaging stop
               this.loader.style.display = "none"; 
            
               //trasform respanse message from string to object

               //selecting each element from the object 
               let previous = data.previous;         ;
               let current = data.current;

               let beats = data.beats;
               let why = data.why;

              
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
            this.previous = "Rock"
            this.NgtResult.style.display = "none";
            this.elementDecision.style.display = "flex";
            this.elementDecisiontInput.value = "" 
            this.elementDecisionElementText.innerHTML = "Rock"
            this.elementDecisionScoreNumber.innerHTML = this.score
            this.elementDecisionImage.src = "https://symbl-world.akamaized.net/i/webp/f2/0e29d778af528ff18585b3c4088835.webp"
        }
        



      async fetchPhoto(word){

          if(word.toLocaleLowerCase() === "rock"){
            
              let rockUrl =  "https://symbl-world.akamaized.net/i/webp/f2/0e29d778af528ff18585b3c4088835.webp"
              return rockUrl
          }

          let url = `https://what-beats-rock-backend.onrender.com/photoUrl/?word=${word}`;

          let response = await fetch(url,)
          

          let data = await response.json();
          
          if (!data.ok){
            console.log(data) }

          console.log("photoUrl from backend:" , data)

          return data
      }
       

}


document.addEventListener("DOMContentLoaded", () => {
   const game = new Game();
});
