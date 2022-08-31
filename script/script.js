let quizz = [];
pegarDados();
function pegarDados() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );
  promessa.then(receberQuizz);
  promessa.catch(receberFalhou);
}

function receberFalhou(erro) {
  console.log(erro);
}

function receberQuizz(resposta) {
  console.log(resposta);
  quizz = resposta.data;
  renderizarQuizzesProntos();
}

function renderizarQuizzesProntos() {
  const quizzesProntos = document.querySelector(".container-quizzes");
  quizzesProntos.innerHTML = "";
  for (let i = 0; i < quizz.length; i++) {
    quizzesProntos.innerHTML += `
        <div class="selecionar-quizz">
            <img src="./Rectangle 34.png">
            <p>Acerte os personagens corretos e teste teste teste</p>
        </div>
        `;
  }
}
