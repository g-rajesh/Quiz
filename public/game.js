let qns = null;
let ind=0,curScore=0;
let cAnsOption,yourAnswer;

// increase Score
function increaseScore(score){
  document.querySelector('.score').innerHTML = score;
}

// gameover
const gameOver = ()=>{
  localStorage.setItem('cScore',JSON.stringify(curScore));
  document.querySelector('.check').style.display = "none";
  document.querySelector('.gameOver').style.display = "block";
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

  document.querySelector('.number').innerHTML = ind+1;
  document.querySelector('.score').innerHTML = curScore;
  document.querySelector('p.question').innerText = data[ind].question;
  let tag = `<span class="tag">${ind+1}/10</span>`;
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
      // disable check
      document.querySelector('.check').style.pointerEvents = "none";
      // enable next
      document.querySelector('.next').style.pointerEvents = "auto";

      ind++,curScore++;

      if(curScore === 10){
        localStorage.setItem('cScore',JSON.stringify(curScore));
        window.location.href = 'playAgain.html';
      }

    }else{
      // For your wrong Answer
      document.getElementsByName('option')[yourAnswer].parentElement.classList.remove('select');
      document.getElementsByName('option')[yourAnswer].parentElement.classList.add('wrong');

      // For the correct Answer
      document.getElementsByName('option')[cAnsOption].parentElement.classList.remove('select');
      document.getElementsByName('option')[cAnsOption].parentElement.classList.add('correct');

      // storing player's score
      localStorage.setItem('cScore',JSON.stringify(curScore));

      // disable check and next 
      document.querySelector('.check').style.display = "none";
      document.querySelector('.next').style.display = "none";

      // enable gameOver
      document.querySelector('.gameOver').style.display = "block";
    }

    // disable all radio button after check
    disable('true');
  },1500);
  
});

// event listener for next question button
document.querySelector('.next').addEventListener('click',(e)=>{
  increaseScore(curScore);
  disable('false');
  game(qns);
})

// Fetching Data
const call = ()=>{
  if(!(JSON.parse(localStorage.getItem('token')))){
    fetch('https://opentdb.com/api_token.php?command=request')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('token',JSON.stringify(data.token));
      fetch(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple&token=${data.token}`)
      .then(res =>  res.json())
      .then(data => {
        qns = data.results;
        game(qns);
      });
    });
  }else{
    let token = JSON.parse(localStorage.getItem('token'));
    fetch(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple&token=${token}`)
    .then(res =>  res.json())
    .then(data => {
      qns = data.results;
      game(qns);
    });
  }
}
  
// function call for fetch
call();