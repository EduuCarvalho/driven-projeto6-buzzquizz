let quizzEscolhido,
	pontosObtidos,
	respostasVerificadas,
	qtdPerguntasNovoQuizz,
	qtdNiveisNovoQuizz,
	todosQuizzesAPI = [],
	todosQuizzesCriados = [],
	objetoNovoQuizz = {};

receberDadosAPI();

// Funções para carregar e renderizar dados da API
function receberDadosAPI() {
	const promessa = axios.get(
		"https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
	);
	promessa.then(respostaAPI);
	promessa.catch(receberFalhou);
}

function receberFalhou(erro) {
	console.log(erro);
}

function respostaAPI(resposta) {
	todosQuizzesAPI = resposta.data;
	console.log(todosQuizzesAPI);

	todosQuizzesAPI.forEach((quizz) => {
		if (IDsCriadosPeloUsuario.includes(quizz.id)) {
			todosQuizzesCriados.push(quizz);
		}
	});

	console.log(todosQuizzesCriados);
	renderizarQuizzesGerais();
	renderizarQuizzesProprios();
}

function renderizarQuizzesGerais() {
	const quizzesProntos = document.querySelector(".container-quizzes");
	quizzesProntos.innerHTML = "";
	for (let i = 0; i < todosQuizzesAPI.length; i++) {
		quizzesProntos.innerHTML += `
        <div data-identifier="quizz-card" data-id="${todosQuizzesAPI[i].id}" onclick="extrairQuizzEscolhido(this)" class="selecionar-quizz">
			<img src="${todosQuizzesAPI[i].image}">
			<div class='overlay'>
				<p>${todosQuizzesAPI[i].title}</p>
			
        </div>
        `;
	}

	quizzesProntos.parentNode.classList.remove("esconder");
}

function renderizarQuizzesProprios() {
	const quizzCriado = document.querySelector(".container-quizzCriado");
	quizzCriado.innerHTML = "";
	for (let i = 0; i < todosQuizzesCriados.length; i++) {
		quizzCriado.innerHTML += `
		<div data-identifier="quizz-card" data-id="${todosQuizzesCriados[i].id}" onclick="extrairQuizzEscolhido(this)" class="selecionar-quizz">
            <img src="${todosQuizzesCriados[i].image}">
			<div class='overlay'>
            	<p>${todosQuizzesCriados[i].title}</p>
			</div>
        </div>
		`;
	}

	if (todosQuizzesCriados.length === 0) {
		document
			.querySelector(".caixa-criarQuizz")
			.classList.remove("esconder");

		document.querySelector(".caixa-quizzCriado").classList.add("esconder");
	} else {
		document
			.querySelector(".caixa-quizzCriado")
			.classList.remove("esconder");

		document.querySelector(".caixa-criarQuizz").classList.add("esconder");
	}

	todosQuizzesCriados = [];
}

// Funções para renderizar e executar a aplicação do quizz
function extrairQuizzEscolhido(objetoSelecionarQuizz) {
	console.log(objetoSelecionarQuizz);
	console.log(objetoSelecionarQuizz.dataset.id);
	const idQuizz = objetoSelecionarQuizz.dataset.id;

	const promessa = axios.get(
		`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`
	);

	promessa.then(construirHTMLQuizzEscolhido);
	promessa.catch(() => console.log("Quizz não pode ser carregado"));
}

function construirHTMLQuizzEscolhido(objetoQuizz) {
	console.log(objetoQuizz);
	quizzEscolhido = objetoQuizz;
	const objetoQuizzData = quizzEscolhido.data;

	const tituloQuizz = objetoQuizzData.title;
	const listaPerguntasQuizz = objetoQuizzData.questions;
	const imagemTituloQuizz = objetoQuizzData.image;

	let tituloQuizzHTML = "";
	let perguntasFeedHTML = "";

	tituloQuizzHTML = `
  <div class="titulo-pagina-quizz titulo-pagina-quizz-inicio" style="background-image: url('${imagemTituloQuizz}')">
    ${tituloQuizz}

	<button onclick="iniciarQuizz()">Começar Quizz</button>
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
    <div class="pergunta pergunta${i}">
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
			  data-npergunta="${i}"
			  id="${i}${j}"
              alt="Opcao ${j + 1}"
              src="${objetoOpcao.image}"
			  onclick="verificarRespostaCerta(this)"
            />
            <label for="${i}${j}"><bold>${objetoOpcao.text}</bold></label>
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

	window.scrollTo(0, 0);

	trocarTela(`.${retornarTelaAtual()}`, ".pagina-quizz");
	pontosObtidos = 0;
	respostasVerificadas = 0;
}

function iniciarQuizz() {
	document
		.querySelector(".titulo-pagina-quizz-inicio")
		.classList.remove("titulo-pagina-quizz-inicio");

	document
		.querySelector(".titulo-pagina-quizz button")
		.classList.add("esconder");

	setTimeout(() => {
		document.querySelector(".pergunta0").scrollIntoView({
			block: "center",
			behavior: "instant",
		});
	}, 1000);

	console.log(document.querySelector(".pergunta0"));
}

function verificarRespostaCerta(inputEscolhido) {
	const indexPerguntaEscolhida = inputEscolhido.dataset.npergunta;
	const qtdOpcoes =
		quizzEscolhido.data.questions[indexPerguntaEscolhida].answers.length;

	if (inputEscolhido.classList.contains("resposta-true")) {
		pontosObtidos += 1;
	}

	for (let i = 0; i < qtdOpcoes; i++) {
		let inputAtual = document.getElementById(
			`${indexPerguntaEscolhida}${i}`
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
	respostasVerificadas += 1;

	if (respostasVerificadas === quizzEscolhido.data.questions.length) {
		resultadoQuizz();
	} else {
		const elementoPergunta = document.querySelector(
			`.pergunta${indexPerguntaEscolhida}`
		);
		elementoPergunta.nextElementSibling.scrollIntoView({
			block: "center",
			behavior: "smooth",
		});
	}
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

function resultadoQuizz() {
	const qtdPerguntasQuizzEscolhido = quizzEscolhido.data.questions.length;

	const porcentagemAcerto = Math.floor(
		(pontosObtidos / qtdPerguntasQuizzEscolhido) * 100
	);

	const listaLevelsQuizz = quizzEscolhido.data.levels;

	const listaValoresMinimos = [];

	for (let i = 0; i < listaLevelsQuizz.length; i++) {
		listaValoresMinimos.push(listaLevelsQuizz[i].minValue);
	}

	let listValoresMinimosOrdemCrescente = listaValoresMinimos.sort(
		(a, b) => a - b
	);

	let levelAlcancado = 0;

	for (let i = 0; i < listValoresMinimosOrdemCrescente.length; i++) {
		if (listValoresMinimosOrdemCrescente[i] <= porcentagemAcerto) {
			levelAlcancado = listValoresMinimosOrdemCrescente[i];
		}
	}

	setTimeout(renderizarTelaResultadoQuizz, 2000, levelAlcancado);
}

function renderizarTelaResultadoQuizz(porcentagemAlcancada) {
	const listaLevelsQuizz = quizzEscolhido.data.levels;
	let tituloTelaResultado, textoTelaResultado, imageTelaResultado;

	for (let i = 0; i < listaLevelsQuizz.length; i++) {
		console.log(listaLevelsQuizz[i].minValue);
		console.log(porcentagemAlcancada);
		if (listaLevelsQuizz[i].minValue == porcentagemAlcancada) {
			tituloTelaResultado = listaLevelsQuizz[i].title;
			textoTelaResultado = listaLevelsQuizz[i].text;
			imageTelaResultado = listaLevelsQuizz[i].image;
			break;
		}
	}

	const telaFinalizaQuizzHTML = `
	<div class="caixa-padrao">
				<div class="conteudo-caixa-padrao">
					<div class="titulo-quizz-finalizado">
						${porcentagemAlcancada}% de acerto: ${tituloTelaResultado}
					</div>
					<div class="conteudo-quizz-finalizado">
						<img
							src="${imageTelaResultado}">

						<div class="texto-quizz-finalizado">${textoTelaResultado}</div>
					</div>
				</div>
	</div>

					<button data-id="${quizzEscolhido.data.id}" onclick="extrairQuizzEscolhido(this)">Reiniciar quizz</button>
					<p class="voltar-home" onclick="voltarHome(this)">Voltar para home</p>
				
	`;

	document.querySelector(".finalizar-quizz").innerHTML =
		telaFinalizaQuizzHTML;

	trocarTela(".pagina-quizz", ".finalizar-quizz");

	document.querySelector(".finalizar-quizz .caixa-padrao").scrollIntoView({
		block: "center",
		behavior: "instant",
	});
}

function finalizarQuizz() {
	document
		.querySelector(".titulo-pagina-quizz-inicio")
		.classList.add("titulo-pagina-quizz-inicio");

	document
		.querySelector(".titulo-pagina-quizz button")
		.classList.remove("esconder");
}

// Funções para renderizar telas de criação do novo quizz
function criarFormularioPerguntas() {
	const elementoFormularioPerguntas = document.querySelector(
		".criar-perguntas form"
	);

	for (let i = 0; i < Number(qtdPerguntasNovoQuizz); i++) {
		elementoFormularioPerguntas.innerHTML += divPerguntas(i);
	}

	elementoFormularioPerguntas.innerHTML += `<input type="button" onclick="validarFormularioPerguntas(this)" value="Prosseguir para criação dos níveis">`;

	trocarTela(".comeco-quizz", ".criar-perguntas");
}

function criarFormularioNiveis() {
	const elementoFormularioNiveis =
		document.querySelector(".criar-niveis form");

	for (let i = 0; i < Number(qtdNiveisNovoQuizz); i++) {
		elementoFormularioNiveis.innerHTML += divNiveis(i);
	}

	elementoFormularioNiveis.innerHTML += `<input type="button" onclick="validarFormularioNiveis(this)" value="Finalizar criação do Quizz">`;

	trocarTela(".criar-perguntas", ".criar-niveis");
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
								<input data-tipo="texto-pergunta" class="tituloPergunta" type="text" placeholder="Texto da pergunta"">
								<input data-tipo="cor" class="corPergunta" type="text" placeholder="Cor de fundo da pergunta">
							</fieldset>

						<div class="opcoes-respostas">
							<!-- RESPOSTA CORRETA -->
							<fieldset class="resposta-correta">
								<div class="legend">Resposta correta</div class="legend">
								<input data-tipo="texto-opcao" class="resposta resposta-correta" type="text" placeholder="Resposta correta">
								<input data-tipo="URL" class="imagem" type="url" placeholder="URL da imagem do seu quizz">
							</fieldset>

							<!-- RESPOSTAS INCORRETAS -->
							<div class="respostas-incorretas">
								<div class="legend">Respostas incorretas</div class="legend">
								<fieldset>
									<input data-tipo="texto-opcao" class="resposta resposta-incorreta" type="text" placeholder="Resposta incorreta 1">
									<input data-tipo="URL" class="imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input data-tipo="texto-opcao" class = "resposta resposta-incorreta" type="text" placeholder="Resposta incorreta 2">
									<input data-tipo="URL" class = "imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input data-tipo="texto-opcao" class = "resposta resposta-incorreta" type="text" placeholder="Resposta incorreta 3">
									<input data-tipo="URL" class = "imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>
							</div>
						</div>
						</div>
					</div>
		`;
}

function divNiveis(i) {
	return `<div class="form-container">
						<div class="dobravel pergunta-numero" onclick="abrirCaixaDobravel(this)">Nível ${
							i + 1
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

// Funções de validação dos inputs fornecidos na criação do novo quizz
function validarFormularioPerguntas(formulario) {
	const listaElementosPerguntas =
		formulario.parentNode.querySelectorAll(".form-container");

	let mensagemAlert = "";

	for (let i = 0; i < listaElementosPerguntas.length; i++) {
		mensagemAlert = validarPergunta(listaElementosPerguntas[i]);

		if (mensagemAlert !== "") {
			break;
		}
	}

	if (mensagemAlert === "") {
		submeterFormularioPerguntas();
	} else alert(mensagemAlert);
}

function validarPergunta(elementoPergunta) {
	console.log(elementoPergunta);

	const listaRespostas = elementoPergunta.querySelectorAll(".resposta");

	const inputs = elementoPergunta.querySelectorAll("input");

	for (let i = 0; i < inputs.length; i++) {
		const valorInput = inputs[i].value;
		let tipoInput = inputs[i].dataset.tipo;

		switch (tipoInput) {
			case "texto-pergunta":
				if (valorInput.length < 20) {
					return "Texto da pergunta inválido!";
				} else break;

			case "cor":
				const letras = ["a", "b", "c", "d", "e", "f"];
				const ehCor =
					typeof valorInput === "string" &&
					valorInput.length === 7 &&
					valorInput[0] === "#" &&
					letras.includes(valorInput[1].toLowerCase()) &&
					letras.includes(valorInput[2].toLowerCase()) &&
					letras.includes(valorInput[3].toLowerCase()) &&
					letras.includes(valorInput[4].toLowerCase()) &&
					letras.includes(valorInput[5].toLowerCase()) &&
					letras.includes(valorInput[6].toLowerCase());

				if (!ehCor) {
					return "Codigo de cor invalido!";
				} else break;

			case "texto-opcao":
				break;

			case "URL":
				break;
		}
	}

	let incorretasVazias = 0;

	const indicesIncorretasPreenchidas = [];

	for (let i = 0; i < listaRespostas.length; i++) {
		if (i === 0) {
			if (
				listaRespostas[i].value === "" ||
				!listaRespostas[i].nextElementSibling.value
					.toLowerCase()
					.startsWith("https://")
			) {
				return "Opcao correta inválida. Preencha os dados corretamente.";
			}
		}

		// So passa adiante quando há uma opçao correta válida.

		if (
			listaRespostas[i].value === "" &&
			listaRespostas[i].nextElementSibling.value === ""
		)
			incorretasVazias += 1;
		else indicesIncorretasPreenchidas.push(i);
	}

	if (incorretasVazias === 3) {
		return "A pergunta deve conter pelo menos uma opcao incorreta";
	}
	// So passa adiante quando há pelo menos uma opçao incorreta válida.

	for (let i = 0; i < indicesIncorretasPreenchidas.length; i++) {
		inputResposta = listaRespostas[indicesIncorretasPreenchidas[i]];

		if (
			listaRespostas[i].value === "" ||
			!inputResposta.nextElementSibling.value
				.toLowerCase()
				.startsWith("https://")
		)
			return `Erro de validação, preencha os campos de opcao incorreta corretamente`;
	}

	// So passa adiante quando todos pares de resposta incorreta são preenchidos corretamente;

	// Formulario validado
	return "";
}

function validarFormularioNiveis(element) {
	const form = element.parentNode;
	const inputs = form.querySelectorAll(".form-container fieldset input");
	// console.log(inputs);
	const inputsMinimoNivel = form.querySelectorAll(".acerto-minimo-nivel");

	let tudoCerto = true;
	let umMinimoTemZero = false;

	console.log(inputsMinimoNivel);

	//verifica se pelo menos um input
	//de % de acerto minimo tem o valor zero
	for (let i = 0; i < inputsMinimoNivel.length; i++) {
		const input = inputsMinimoNivel[i];
		console.log(parseInt(input.value));

		if (parseInt(input.value) === 0) {
			umMinimoTemZero = true;
			break;
		}
	}

	if (umMinimoTemZero == false) {
		alert("Uma das opcoes deve ter 0% de acerto.");
		return;
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
					alert(
						"Titulo do nivel precisa ter pelo menos 10 caracteres"
					);
					tudoCerto = false;
					break loopExterno;
				} else break;

			case "acerto-minimo-nivel":
				if (
					valorInput == "" ||
					typeof parseInt(valorInput) !== "number" ||
					parseInt(valorInput) < 0 ||
					parseInt(valorInput) > 100
				) {
					console.log("acerto minimo nivel");
					alert(
						"% minimo de acertos dever ser um numero entre 0 e 100"
					);
					tudoCerto = false;
					break loopExterno;
				} else break;

			case "imagem-nivel":
				if (
					typeof valorInput !== "string" ||
					!valorInput.toLowerCase().startsWith("https://")
				) {
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

// Funções para submissão e criação do novo Quizz após ser aprovado na validação
function submeterFormularioDadosGerais() {
	// Zerar objeto novo quizz
	objetoNovoQuizz = {};

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

	criarFormularioPerguntas();
}

function submeterFormularioPerguntas() {
	let listaPerguntasHTML = document.querySelectorAll(".divPergunta");
	let listaPerguntas = [];

	console.log("listaPerguntasHTML" + listaPerguntasHTML);

	for (let i = 0; i < qtdPerguntasNovoQuizz; i++) {
		const perguntaAtual = listaPerguntasHTML[i];

		listaPerguntas.push({
			title: perguntaAtual.querySelector(".tituloPergunta").value,
			color: perguntaAtual.querySelector(".corPergunta").value,
			answers: submeterPerguntaAtual(perguntaAtual),
		});
	}

	objetoNovoQuizz["questions"] = listaPerguntas;

	criarFormularioNiveis();
}

function submeterPerguntaAtual(perguntaAtual) {
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
			if (
				valorInputResposta.value != "" &&
				valorInputImagem.value != ""
			) {
				listaRespostas.push({
					text: valorInputResposta.value,
					image: valorInputImagem.value,
					isCorrectAnswer: false,
				});
			}

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
	console.log(objetoNovoQuizz);
	criarQuizz(objetoNovoQuizz);
}

function criarQuizz() {
	const promise = axios.post(
		"https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
		objetoNovoQuizz
	);

	promise.then((response) => {
		let objQuizzCriado = response.data;
		const idQuizzCriado = objQuizzCriado.id;

		console.log(idQuizzCriado);
		armazenarLocalStorage(idQuizzCriado);

		console.log(objQuizzCriado);
		renderizarTelaFinalCriarQuizz(objQuizzCriado);
	});
}

// Carrega ids criados ao inicializar o buzz quizz
let storageID = localStorage.getItem("guardarID");
storageID = JSON.parse(storageID);
let IDsCriadosPeloUsuario;

if (storageID == null) {
	IDsCriadosPeloUsuario = [];
} else {
	IDsCriadosPeloUsuario = storageID;
}

console.log("IDS", IDsCriadosPeloUsuario);

function armazenarLocalStorage(idQuizzCriado) {
	IDsCriadosPeloUsuario.push(idQuizzCriado);
	let stringIDUsuario = JSON.stringify(IDsCriadosPeloUsuario);
	localStorage.setItem("guardarID", stringIDUsuario);
}

function renderizarTelaFinalCriarQuizz(objQuizzCriado) {
	const telaQuizzPronto = document.querySelector(".quizz-pronto");

	const conteudo = `<p>Seu quizz esta pronto!</p>
				<div id="${objQuizzCriado.id}" class="selecionar-quizz">
					<img src="${objQuizzCriado.image}">
					<div class='overlay'>
						<p>${objQuizzCriado.title}</p>
					</div>
				</div>

				<input type="button" data-id="${objQuizzCriado.id}" value="Acessar Quizz" onclick="extrairQuizzEscolhido(this)">
				<p class="voltar-home" onclick="voltarHome(this)">Voltar para home</p>`;

	telaQuizzPronto.innerHTML = conteudo;

	trocarTela(".criar-niveis", ".quizz-pronto");
}

// Funções acessórias

function voltarHome(e) {
	let listaTelas = document.querySelectorAll(".conteudo-pagina > div");
	listaTelas = Array.from(listaTelas);

	console.log(listaTelas);

	let primeiroElemento = e.parentNode;

	let elementoAtual = primeiroElemento;

	console.log(elementoAtual);

	while (!listaTelas.includes(elementoAtual)) {
		elementoAtual = elementoAtual.parentNode;
	}

	const telaAtual = elementoAtual.classList.value;
	console.log(telaAtual);
	trocarTela(`.${telaAtual}`, `.pagina-inicial`);
	receberDadosAPI();

	trocarTela(".quizz-pronto", ".comeco-quizz");

	window.scrollTo(0, 0);

	//document.querySelector(".finalizar-quizz").classList.add("esconder");
	//document.querySelector(".pagina-quizz").classList.remove("esconder");
}

function retornarTelaAtual() {
	const listaTelas = document.querySelectorAll(".conteudo-pagina > div");

	console.log(listaTelas);

	let telaAtual;
	for (let i = 0; i < listaTelas.length; i++) {
		console.log(!listaTelas[i].classList.contains("esconder"));
		verify = listaTelas[i].classList.contains("esconder");
		if (!verify) {
			telaAtual = listaTelas[i];
		}
	}

	console.log(telaAtual.classList.value);
	return telaAtual.classList.value;
}

function trocarTela(esconder, mostrar) {
	document.querySelector(esconder).classList.add("esconder");
	document.querySelector(mostrar).classList.remove("esconder");
}

function windowReload() {
	document.location.reload(true);
}
