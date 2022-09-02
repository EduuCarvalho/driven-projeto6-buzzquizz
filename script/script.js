let quizzUsuario = [];
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
	// console.log(resposta);
	quizz = resposta.data;
	// console.log(quizz);
	renderizarQuizzesProntos();
	renderizarQuizzesCriados(); //ATENÇÃO, SOMENTE UM TESTE, ESSA FUNÇÃO PUXAR QUIZZ POR ID CRIADO PELO USUARIO
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

function renderizarQuizzesCriados() {
	const quizzCriado = document.querySelector(".container-quizzCriado");
	quizzCriado.innerHTML = "";
	for (let i = 0; i < 10; i++) {
		quizzCriado.innerHTML += `
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
            <label for='{"pergunta":${i}, "opcao":${j}}'><bold>${objetoOpcao.text
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

const infoQuizzForm = document.querySelector(".info-quizz form");
const criarPerguntasForm = document.querySelector(".criar-perguntas form");
const formDataObj = {};

const objQuizzCompleto = {
	title: "",
	image: "",
	questions: []
};

infoQuizzForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const myFormData = new FormData(event.target);
	myFormData.forEach((value, key) => (formDataObj[key] = value));

	if (formDataObj.title < 10 || formDataObj.title > 66 || formDataObj.quantidadePerguntas < 2 || formDataObj.quantidadeNiveis < 2) {
		alert("Preencha direito!");
		return;
	}

	objQuizzCompleto.title = formDataObj.title;
	objQuizzCompleto.image = formDataObj.image;

	criarPerguntas();
});

function criarObjQuizz() {

	//TODAS PERGUNAS 1, PERGUNTA 2, PERGUNTA 3 ...
	const perguntas = [...document.querySelectorAll(".criar-perguntas form .form-container")];

	//PERCORRE TODAS AS PERGUNTAS E ADICIONA PROPRIEDADES AO objPerguntas
	perguntas.forEach(formContainer => {
		const objPerguntas = {
			title: "",
			color: "",
			answers: []
		}

		objPerguntas.title = formContainer.querySelector("input[name='title']").value;
		objPerguntas.color = formContainer.querySelector("input[name='color']").value;

		const fieldsets = [...formContainer.querySelectorAll(".criar-quizz-respostas fieldset")];

		fieldsets.forEach(field => {
			const answer = buscarResposta(field);
			if (answer !== undefined) {
				objPerguntas.answers.push(answer);
			}
		});

		objQuizzCompleto.questions.push(objPerguntas);
	});


	console.log(objQuizzCompleto);
}

function buscarResposta(fieldset) {
	const objResposta = {
		text: "",
		image: "",
		isCorrectAnswer: false
	}

	if (fieldset.classList.value === "resposta-correta") {
		// console.log("resposta correta");
		objResposta.text = fieldset.querySelector("input[name='text']").value;
		objResposta.image = fieldset.querySelector("input[name='image']").value;
		objResposta.isCorrectAnswer = true;
		return objResposta;

	} else if (fieldset.parentNode.classList.value === "respostas-incorretas") {
		// console.log("resposta incoreta");
		objResposta.text = fieldset.querySelector("input[name='text']").value;
		objResposta.image = fieldset.querySelector("input[name='image']").value;
		objResposta.isCorrectAnswer = false;
		return objResposta;
	}

}

function criarPerguntas() {
	////		ESCONDER 	, 		MOSTRAR
	trocarTela(".info-quizz", ".criar-perguntas");

	for (let i = 0; i < Number(formDataObj.quantidadePerguntas); i++) {
		criarPerguntasForm.innerHTML += divPerguntas(i);

	}

	criarPerguntasForm.innerHTML += `<input type="submit" value="Prosseguir para criar níveis" onclick="criarObjQuizz()">`;

	botoes = [...document.querySelectorAll(".dobravel")];
}

function criarNiveis() {
	////		ESCONDER 	, 		MOSTRAR
	trocarTela(".criar-perguntas", ".criar-niveis");
}

function divPerguntas(i) {
	return `
				<div class="form-container" >
						<div class="dobravel pergunta-numero" onclick="abrirCaixaDobravel(this)">
						Pergunta ${i + 1}
							<ion-icon name="create-outline" class="esconder"></ion-icon>
						</div>

						<div class="conteudo-dobravel">

							<fieldset class="">
								<input name="title" type="text" placeholder="Texto da pergunta" minlength="20">
								<input name="color" type="text" placeholder="Cor de fundo da pergunta">
							</fieldset>

						<div class="criar-quizz-respostas">
							<!-- RESPOSTA CORRETA -->
							<fieldset class="resposta-correta">
								<div class="legend">Resposta correta</div class="legend">
								<input name="text" type="text" placeholder="Resposta correta" minlength="">
								<input name="image" type="url" placeholder="URL da imagem do seu quizz">
							</fieldset>

							<!-- RESPOSTAS INCORRETAS -->
							<fieldset class="respostas-incorretas">
								<div class="legend">Respostas incorretas</div class="legend">
								<fieldset>
									<input name="text" type="text" placeholder="Resposta incorreta 1" minlength="">
									<input name="image" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input name="text" type="text" placeholder="Resposta incorreta 2" minlength="">
									<input name="image" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input name="text" type="text" placeholder="Resposta incorreta 3" minlength="">
									<input name="image" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>
							</fieldset>
						</div>
						</div>
					</div>
		`
}

function divNiveis(i) {
	return `<div class="form-container">
						<div class="dobravel pergunta-numero" onclick="abrirCaixaDobravel(this)">Nível ${i + 1}
							<ion-icon name="create-outline" class="esconder"></ion-icon>
						</div>

						<div class="conteudo-dobravel">
							<fieldset class="">
								<input name="" type="text" placeholder="Titulo do nivel" minlength="20">
								<input name="" type="text" placeholder="% de acerto minimo">
								<input type="text" placeholder="URL da imagem do nível">
								<input type="text" placeholder="Descrição do nível">
							</fieldset>
						</div>
					</div>
					`
}

function criarQuizz(obj) {
	const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', obj);
}

function abrirCaixaDobravel(e) {
	const content = e.nextElementSibling;
	content.classList.toggle("ativo");
}