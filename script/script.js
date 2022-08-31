let quizz = [];
pegarDados();
extrairQuizDesejado();

//**EDU
//
//
//
//*/

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

//**PEDRO
//
//
//
//*/

function extrairQuizDesejado() {
  let idQuizz = 10080;

  const promessa = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`
  );

  promessa.then(construirHTMLQuizzEscolhido);
  promessa.catch(() => console.log("Quizz não pode ser carregado"));
}

function construirHTMLQuizzEscolhido(objetoQuizz) {
  console.log(objetoQuizz);
  objetoQuizzData = objetoQuizz.data;
  const tituloQuizz = objetoQuizzData.title;
  const listaPerguntasQuizz = objetoQuizzData.questions;

  let tituloQuizzHTML = "";
  let perguntasFeedHTML = "";

  tituloQuizzHTML = `
  <div class="titulo-pagina-quizz">
    ${tituloQuizz}
  </div>

  <div class="perguntas-feed">
  `;

  for (i = 0; i < listaPerguntasQuizz.length; i++) {
    const objetoPergunta = listaPerguntasQuizz[i];

    const listaOpcoes = objetoPergunta.answers;
    const tituloPergunta = objetoPergunta.title;

    let perguntaHTML = "";
    let tituloPerguntaHTML = "";
    let opcoesHTML = "";

    tituloPerguntaHTML = `
    <div class="pergunta">
      <div class="conteudo-pergunta">
        <div class="titulo-pergunta">
          <bold>${tituloPergunta}</bold>
        </div>
        <div class="opcoes-pergunta">
        `;

    for (j = 0; j < listaOpcoes.length; j++) {
      const objetoOpcao = listaOpcoes[j];

      const validacaoOpcao = objetoOpcao.isCorrectAnswer;

      const opcaoHTML = `
          <div class="opcao resposta-${validacaoOpcao}">
            <input
              type="image"
              id="ocpao${j + 1}"
              alt="Opcao ${j + 1}"
              src="${objetoOpcao.image}"
            />
            <label for="ocpao1"><bold>${objetoOpcao.text}</bold></label>
          </div>
          `;

      opcoesHTML += opcaoHTML;
    }

    const fecharDivPergunta = `
    </div>
    </div>
    </div>
    `;

    perguntaHTML = tituloPerguntaHTML + opcoesHTML + fecharDivPergunta;
    perguntasFeedHTML += perguntaHTML;
  }

  const fecharDivPerguntasFeed = `
  </div>
  `;

  const paginaQuizzHTML =
    tituloQuizzHTML + perguntasFeedHTML + fecharDivPerguntasFeed;

  document.querySelector(".pagina-quizz").innerHTML = paginaQuizzHTML;
  construirCSSQuizzEscolhido(objetoQuizzData);
}

function construirCSSQuizzEscolhido(objetoQuizzData) {
  imagemQuizzUrl = objetoQuizzData.image;
  document.querySelector(
    ".titulo-pagina-quizz"
  ).style.backgroundImage = `url(${imagemQuizzUrl})`;
}

//**VINI
//
//
//
//*/
