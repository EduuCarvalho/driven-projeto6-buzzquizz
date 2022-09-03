let quizzUsuario = [],
	quizz = [],
	quizzEscolhido,
	pontosObtidos,
	qtdPerguntasNovoQuizz,
	qtdNiveisNovoQuizz,
	objetoNovoQuizz = {};

const criarPerguntasForm = document.querySelector(".criar-perguntas form");
// console.log(criarPerguntasForm);
const criarNiveisForm = document.querySelector(".criar-niveis form");
//console.log(criarNiveisForm);

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

		const listaOpcoesRandomizadas = randomizarArray(listaOpcoes);
		for (let j = 0; j < listaOpcoesRandomizadas.length; j++) {
			const objetoOpcao = listaOpcoesRandomizadas[j];

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

function randomizarArray(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

//**VINI
//
//
//
//*/

function criarPerguntas() {
	////		ESCONDER 	, 		MOSTRAR
	trocarTela(".info-quizz", ".criar-perguntas");

	for (let i = 0; i < Number(qtdPerguntasNovoQuizz); i++) {
		criarPerguntasForm.innerHTML += divPerguntas(i);
	}

	criarPerguntasForm.innerHTML += `<div onclick="submeterPerguntasQuizz()">Proseguir para </div>`;
}

function criarNiveis() {
	////		ESCONDER 	, 		MOSTRAR
	trocarTela(".criar-perguntas", ".criar-niveis");
	for (let i = 0; i < Number(qtdNiveisNovoQuizz); i++) {
		criarNiveisForm.innerHTML += divNiveis(i);
	}

	criarNiveisForm.innerHTML += `<input type="submit" onclick="validarNiveis(this)" value="Proseguir para criação de níveis">`;
}

function divPerguntas(i) {
	return `
				<div class="form-container divPergunta">
						<div class="dobravel pergunta-numero" onclick="abrirCaixaDobravel(this)">
						Pergunta ${i + 1}
							<ion-icon id="create-outline" class="esconder"></ion-icon>
						</div>

						<div class="conteudo-dobravel">

							<fieldset class="info-gerais-pergunta">
								<input class="tituloPergunta" type="text" placeholder="Texto da pergunta" minlength="20">
								<input class="corPergunta" type="text" placeholder="Cor de fundo da pergunta">
							</fieldset>

						<div class="opcoes-respostas">
							<!-- RESPOSTA CORRETA -->
							<fieldset class="resposta-correta">
								<div class="legend">Resposta correta</div class="legend">
								<input class="resposta" type="text" placeholder="Resposta correta" minlength="">
								<input class="imagem" type="url" placeholder="URL da imagem do seu quizz">
							</fieldset>

							<!-- RESPOSTAS INCORRETAS -->
							<div class="respostas-incorretas">
								<div class="legend">Respostas incorretas</div class="legend">
								<fieldset>
									<input class="resposta" type="text" placeholder="Resposta incorreta 1" minlength="">
									<input class="imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input class = "resposta" type="text" placeholder="Resposta incorreta 2" minlength="">
									<input class = "imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input class = "resposta" type="text" placeholder="Resposta incorreta 3" minlength="">
									<input class = "imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>
							</div>
						</div>
						</div>
					</div>
		`;
}

function divNiveis(i) {
	return `<div class="form-container">
						<div class="dobravel pergunta-numero" onclick="abrirCaixaDobravel(this)">Nível ${i + 1
		}
							<ion-icon name="create-outline" class="esconder"></ion-icon>
						</div>

						<div class="conteudo-dobravel">
							<fieldset class="">
								<input class="titulo-nivel" type="text" placeholder="Titulo do nivel">
								<input class="acerto-minimo-nivel" type="text" placeholder="% de acerto minimo">
								<input class="imagem-nivel"type="text" placeholder="URL da imagem do nível">
								<input class="text-nivel" type="text" placeholder="Descrição do nível">
							</fieldset>
						</div>
					</div>
					`;
}

function abrirCaixaDobravel(e) {
	const content = e.nextElementSibling;
	content.classList.toggle("ativo");
}

function submeterDadosQuizz() {
	objetoNovoQuizz["title"] = document.getElementById("titulo").value;
	objetoNovoQuizz["image"] = document.getElementById("imagem-quizz").value;

	qtdPerguntasNovoQuizz = document.getElementById(
		"quantidadePerguntas"
	).value;
	qtdNiveisNovoQuizz = document.getElementById("quantidadeNiveis").value;

	document.getElementById("titulo").value = "";
	document.getElementById("imagem-quizz").value = "";
	document.getElementById("quantidadePerguntas").value = "";
	document.getElementById("quantidadeNiveis").value = "";

	criarPerguntas();
}

function submeterPerguntasQuizz() {
	let listaPerguntasHTML = document.querySelectorAll(".divPergunta");
	let listaPerguntas = [];

	console.log("listaPerguntasHTML" + listaPerguntasHTML);

	for (let i = 0; i < qtdPerguntasNovoQuizz; i++) {
		listaPerguntas.push({
			title: listaPerguntasHTML[i].querySelector(".tituloPergunta").value,
			color: listaPerguntasHTML[i].querySelector(".corPergunta").value,
			answers: resgatarRespostas(listaPerguntasHTML[i]),
		});
	}

	objetoNovoQuizz["questions"] = listaPerguntas;

	// console.log("objetoAposCriarPerguntas" + objetoNovoQuizz);
	// console.log("listaPerguntas" + listaPerguntas);

	criarNiveis();
}

function resgatarRespostas(perguntaAtual) {
	const listaOpcoesHTML = perguntaAtual.querySelectorAll(
		".opcoes-respostas fieldset"
	);

	let listaRespostas = [];

	for (let j = 0; j < listaOpcoesHTML.length; j++) {
		const valorInputResposta =
			listaOpcoesHTML[j].querySelector(".resposta");

		const valorInputImagem = listaOpcoesHTML[j].querySelector(".imagem");

		if (j === 0) {
			listaRespostas.push({
				text: valorInputResposta.value,
				image: valorInputImagem.value,
				isCorrectAnswer: true,
			});

			valorInputResposta.value = "";
			valorInputImagem.value = "";
		} else {
			listaRespostas.push({
				text: valorInputResposta.value,
				image: valorInputImagem.value,
				isCorrectAnswer: false,
			});

			valorInputResposta.value = "";
			valorInputImagem.value = "";
		}
	}

	return listaRespostas;
}

function submeterNiveisQuizz() {
	let listaNiveis = [];

	const listaNiveisHTML = document.querySelectorAll(
		".criar-niveis .form-container"
	);

	for (let i = 0; i < listaNiveisHTML.length; i++) {
		const titulo = listaNiveisHTML[i].querySelector(".titulo-nivel");
		const image = listaNiveisHTML[i].querySelector(".imagem-nivel");
		const texto = listaNiveisHTML[i].querySelector(".text-nivel");
		const acertoMinimoNivel = listaNiveisHTML[i].querySelector(
			".acerto-minimo-nivel"
		);

		listaNiveis.push({
			title: titulo.value,
			image: image.value,
			text: texto.value,
			minValue: acertoMinimoNivel.value,
		});

		titulo.value = "";
		image.value = "";
		texto.value = "";
		acertoMinimoNivel.value = "";
	}

	objetoNovoQuizz["levels"] = listaNiveis;

	trocarTela(".criar-niveis", ".info-quizz");
	console.log(objetoNovoQuizz);
}

function criarQuizz(obj) {
	const promise = axios.post(
		"https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
		obj
	);
}

function validarFormularioNiveis(element) {
	const form = element.parentNode;
	const inputs = form.querySelectorAll(".form-container fieldset input");
	// console.log(inputs);
	const inputsMinimoNivel = form.querySelectorAll(".form-container fieldset input.acerto-minimo-nivel");

	let tudoCerto = true;
	let umMinimoTemZero = false;

	//verifica se pelo menos um input 
	//de % de acerto minimo tem o valor zero
	for (let i = 0; i < inputsMinimoNivel.length; i++) {
		const input = inputsMinimoNivel[i];

		if (parseInt(input.value) === 0) {
			umMinimoTemZero = true;
			break;
		}

	}

	//faz todas as validaçoes
	//o label loopExterno é usado para dar um break e nao continuar
	//rodando quando uma condiçao for true
	loopExterno: for (let i = 0; i < inputs.length; i++) {
		const input = inputs[i];
		const valorInput = input.value;
		const classeInput = input.classList.value;


		switch (classeInput) {
			case "titulo-nivel":

				if (typeof valorInput !== "string" || valorInput.length < 10) {
					console.log("titulo nivel");
					alert("Titulo do nivel precisa ter pelo menos 10 caracteres");
					tudoCerto = false;
					break loopExterno;
				} else break;

			case "acerto-minimo-nivel":

				if (valorInput == "" || typeof parseInt(valorInput) !== "number" || parseInt(valorInput) < 0 || parseInt(valorInput) > 100) {
					console.log("acerto minimo nivel");
					alert("% minimo de acertos dever ser um numero entre 0 e 100");
					tudoCerto = false;
					break loopExterno;
				} else break;

			case "imagem-nivel":

				if (typeof valorInput !== "string"
					|| !valorInput.toLowerCase().startsWith("https://")) {
					console.log("imagem nivel");
					alert("Insira uma URL válida!");
					tudoCerto = false;
					break loopExterno;
				} else break;

			case "text-nivel":

				if (valorInput.length < 30) {
					console.log("text nivel");
					alert("A descrição precisa ter pelo menos 30 caracteres");
					tudoCerto = false;
					break loopExterno;
				} else break;
		}

	}

	console.log(umMinimoTemZero, tudoCerto);

	if (umMinimoTemZero && tudoCerto) {
		submeterNiveisQuizz();
	}
}

function renderizarQuizzCriado(objQuizzCriado) {
	const telaQuizzPronto = document.querySelector(".quizz-pronto");

	const conteudo = `<p>Seu quizz esta pronto!</p>
				<div id="${objQuizzCriado.id}" onclick="" class="selecionar-quizz" style="width: 500px; height: 266px;">
					<img src="${objQuizzCriado.image}">
					<p>${objQuizzCriado.title}</p>
				</div>

				<input type="submit" value="Acessar Quizz" oonclick="extrairQuizzEscolhido(this)">
				<p class="voltar-home" onclick="voltarHome(this)">Voltar para home</p>`;

	telaQuizzPronto.innerHTML = conteudo;
}

function voltarHome(e) {
	const telaAtual = e.parentNode.parentNode.classList.value;
	console.log(telaAtual)
	trocarTela(`.${telaAtual}`, `.pagina-inicial`);
}