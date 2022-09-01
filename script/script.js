let quizz = [];
pegarDados();

function trocarTela(esconder, mostrar) {
	document.querySelector(esconder).classList.add("esconder");
	document.querySelector(mostrar).classList.remove("esconder");
}

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
	console.log(quizz);
	renderizarQuizzesProntos();
}

function renderizarQuizzesProntos() {
	const quizzesProntos = document.querySelector(".container-quizzes");
	quizzesProntos.innerHTML = "";
	for (let i = 0; i < quizz.length; i++) {
		quizzesProntos.innerHTML += `
        <div id="${quizz[i].id}" onclick="extrairQuizzDesejado(this)" class="selecionar-quizz">
            <img src="${quizz[i].image}">
            <p>${quizz[i].title}</p>
        </div>
        `;
	}
}

//**PEDRO
//
//
//
//*/

function extrairQuizzDesejado(objetoSelecionarQuizz) {
	//const idQuizz = 10080;
	const idQuizz = objetoSelecionarQuizz.id;

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
	const imagemTituloQuizz = objetoQuizzData.image;

	let tituloQuizzHTML = "";
	let perguntasFeedHTML = "";

	tituloQuizzHTML = `
  <div class="titulo-pagina-quizz" style="background-image: url('${imagemTituloQuizz}')">
    ${tituloQuizz}
  </div>

  <div class="perguntas-feed">
  `;

	for (i = 0; i < listaPerguntasQuizz.length; i++) {
		const objetoPergunta = listaPerguntasQuizz[i];

		const listaOpcoes = objetoPergunta.answers;
		const tituloPergunta = objetoPergunta.title;
		const corTituloPergunta = objetoPergunta.color;

		let perguntaHTML = "";
		let tituloPerguntaHTML = "";
		let opcoesHTML = "";

		tituloPerguntaHTML = `
    <div class="pergunta">
      <div class="conteudo-pergunta">
        <div class="titulo-pergunta" style="background-color: ${corTituloPergunta} ;">
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

	trocarTela(".pagina-inicial", ".pagina-quizz");
}

// funçao verificar resposta certa - Pedro

//**VINI
//
//
//
//*/
