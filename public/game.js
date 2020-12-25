let qns = null;
let ind=0,curScore=0;
let cAnsOption,yourAnswer;

// increase Score
function increaseScore(score){
  document.querySelector('.score').innerHTML = score;
}


// shuffling question
function shuffleArray(array) { 
  for (var i = array.length - 1; i > 0; i--) {  
      var j = Math.floor(Math.random() * (i + 1)); 
                    
      var temp = array[i]; 
      array[i] = array[j]; 
      array[j] = temp; 
  }       
  return array; 
} 

// which radio is checked
const checkWhoAmI = ()=>{
  const radio = document.getElementsByName('option');
  for(let i=0;i<radio.length;i++){
    if(radio[i].checked){
      yourAnswer = i;
      radio[yourAnswer].parentElement.classList.add('select');
      continue;
    }
    radio[i].parentElement.classList.remove('select');
  }
}

// checking  whether any radio button is checked or not
const checked = ()=>{
  const radio = document.getElementsByName('option');
  for(let i=0;i<radio.length;i++){
    if(radio[i].checked){
      return true;
    }
  }
  return false;
}

// enable or disable radio button
const disable = (val)=>{
  document.querySelector('#op1').disabled = val;
  document.querySelector('#op2').disabled = val;
  document.querySelector('#op3').disabled = val;
  document.querySelector('#op4').disabled = val;
}

// displaying each question
const game = data=>{

  document.querySelector('.check').style.pointerEvents = 'auto';
  document.querySelector('.next').style.pointerEvents = 'none';

  document.querySelector('.nameDisplay .name').innerHTML = `<h2>${JSON.parse(localStorage.getItem('name'))}'s Game</h2>`;
  document.querySelector('.nameDisplay .score').innerHTML = `
  <h2>Score</h2>
  <span>${curScore}</span>
  `;

  document.querySelector('p.question').innerHTML = data[ind].question;
  let tag = `<span class="tag">${ind+1}/15</span>`;
  document.querySelector('p.question').innerHTML += tag;
  let options = [data[ind].correct_answer,data[ind].incorrect_answers[0],data[ind].incorrect_answers[1],data[ind].incorrect_answers[2]];

  options = shuffleArray(options);

  let optn = '';
  options.forEach((option,index)=>{
    if(option === data[ind].correct_answer){
      cAnsOption = index;
    }
    optn += `
    <div class="option">
      <input type="radio" onclick="checkWhoAmI()" name="option" id="op${index+1}" value="${option}">
      <label class="opt${index+1}" for="op${index+1}">${option}</label>
    </div>    
    `
  });

  document.querySelector('.options').innerHTML = optn;
}

const loader = (opac,dis)=>{
  document.querySelector('.container').style.opacity = opac;
  document.querySelector('.loader').style.display = dis;
}

// event listener for check button
document.querySelector('.check').addEventListener('click',(e)=>{

  if(checked()){

    // displaying loader
    loader('0.4','block');

    setTimeout(()=>{
      // removing loader
      loader('1','none');
        
      const op1 = document.querySelector('#op1');
      const op2 = document.querySelector('#op2');
      const op3 = document.querySelector('#op3');
      const op4 = document.querySelector('#op4');
      const cAns = qns[ind].correct_answer;

      if(yourAnswer === cAnsOption){
        document.getElementsByName('option')[yourAnswer].parentElement.classList.remove('select');
        document.getElementsByName('option')[yourAnswer].parentElement.classList.add('correct');
        curScore++
      }else{
        // For your wrong Answer
        document.getElementsByName('option')[yourAnswer].parentElement.classList.remove('select');
        document.getElementsByName('option')[yourAnswer].parentElement.classList.add('wrong');

        // For the correct Answer
        document.getElementsByName('option')[cAnsOption].parentElement.classList.remove('select');
        document.getElementsByName('option')[cAnsOption].parentElement.classList.add('correct');
      }

      // disable check
      document.querySelector('.check').style.pointerEvents = "none";
      // enable next
      document.querySelector('.next').style.pointerEvents = "auto";

      ind++;

      if(ind === 15){
        e.target.style.display = "none";
        document.querySelector('.next').style.display = "none";
        document.querySelector('.gameOver').style.display = "block";
        localStorage.setItem('cScore',JSON.stringify(curScore));
      }

      // disable all radio button after check
      disable('true');

      // button color swap
      e.target.classList.remove('clicked');
      document.querySelector('.next').classList.add('clicked');

    },1500);

  }else{
    alert('Please, make sure that you have selected any option!');
  }
  
});

// event listener for next question button
document.querySelector('.next').addEventListener('click',(e)=>{
  e.target.classList.remove('clicked');
  document.querySelector('.check').classList.add('clicked');
  increaseScore(curScore);
  disable('false');
  game(qns);
})


// below all are fetching part
const getToken = ()=>{
  fetch('https://opentdb.com/api_token.php?command=request')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('token',JSON.stringify(data.token));
      fetch(`https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple&token=${data.token}`)
      .then(res =>  res.json())
      .then(data => {
        qns = data.results;
        game(qns);
      });
    });
}

// Fetching Data
const call = ()=>{
  if(!(JSON.parse(localStorage.getItem('token')))){
    getToken();
  }else{
    let token = JSON.parse(localStorage.getItem('token'));
    fetch(`https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple&token=${token}`)
    .then(res =>  res.json())
    .then(data => {
      if(data.results.length){
        qns = data.results;
        game(qns);
      }else{
        getToken();
      }
    });
  }
}
  
// function call for fetch
call();