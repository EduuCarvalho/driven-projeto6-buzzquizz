let quizz = [],
	quizzEscolhido,
	pontosObtidos;

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
        <div id="${quizz[i].id}" onclick="extrairQuizzEscolhido(this)" class="selecionar-quizz">
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

function extrairQuizzEscolhido(objetoSelecionarQuizz) {
	const idQuizz = 10080;
	//const idQuizz = objetoSelecionarQuizz.id;

	const promessa = axios.get(
		`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`
	);

	promessa.then(construirHTMLQuizzEscolhido);
	promessa.catch(() => console.log("Quizz não pode ser carregado"));
}

function construirHTMLQuizzEscolhido(objetoQuizz) {
	console.log(objetoQuizz);
	quizzEscolhido = objetoQuizz;
	objetoQuizzData = quizzEscolhido.data;

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

	for (let i = 0; i < listaPerguntasQuizz.length; i++) {
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
        <div class="titulo-pergunta" style="background-color: ${corTituloPergunta};">
          <bold>${tituloPergunta}</bold>
        </div>
        <div class="opcoes-pergunta">
        `;

		for (let j = 0; j < listaOpcoes.length; j++) {
			const objetoOpcao = listaOpcoes[j];

			const validacaoOpcao = objetoOpcao.isCorrectAnswer;

			const opcaoHTML = `
          <div class="opcao">
            <input
			  class="resposta-${validacaoOpcao}"
              type="image"
			  id='{"pergunta":${i}, "opcao":${j}}'
              alt="Opcao ${j + 1}"
              src="${objetoOpcao.image}"
			  onclick="verificarRespostaCerta(this)"
            />
            <label for='{"pergunta":${i}, "opcao":${j}}'><bold>${
				objetoOpcao.text
			}</bold></label>
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
	pontosObtidos = 0;
}

// funçao verificar resposta certa - Pedro
function verificarRespostaCerta(inputEscolhido) {
	objetoOpcaoEscolhida = JSON.parse(inputEscolhido.id);
	console.log(objetoOpcaoEscolhida);

	perguntaEscolhida = objetoOpcaoEscolhida.pergunta;

	qtdOpcoes = quizzEscolhido.data.questions[perguntaEscolhida].answers.length;

	if (inputEscolhido.classList.contains("resposta-true")) {
		pontosObtidos += 1;
	}

	for (let i = 0; i < qtdOpcoes; i++) {
		let inputAtual = document.getElementById(
			`{"pergunta":${perguntaEscolhida}, "opcao":${i}}`
		);

		if (inputAtual.classList.contains("resposta-true")) {
			inputAtual.classList.add("opcao-certa");

			inputAtual.parentNode
				.querySelector("label")
				.classList.add("opcao-certa");
		} else {
			inputAtual.classList.add("opcao-errada");

			inputAtual.parentNode
				.querySelector("label")
				.classList.add("opcao-errada");
		}

		inputAtual.disabled = true;
	}
	console.log(pontosObtidos);
}

//**VINI
//
//
//
//*/
