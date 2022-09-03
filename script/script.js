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
	trocarTela(".comeco-quizz", ".criar-perguntas");

	for (let i = 0; i < Number(qtdPerguntasNovoQuizz); i++) {
		criarPerguntasForm.innerHTML += divPerguntas(i);
	}

	criarPerguntasForm.innerHTML += `<div onclick="validarFormularioPerguntas(this)">Proseguir para </div>`;
}

function criarNiveis() {
	////		ESCONDER 	, 		MOSTRAR
	trocarTela(".criar-perguntas", ".criar-niveis");
	for (let i = 0; i < Number(qtdNiveisNovoQuizz); i++) {
		criarNiveisForm.innerHTML += divNiveis(i);
	}

	criarNiveisForm.innerHTML += `<input type="button" onclick="validarFormularioNiveis(this)" value="Proseguir para criação de níveis">`;
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
								<input data-tipo="texto-pergunta" class="tituloPergunta" type="text" placeholder="Texto da pergunta" minlength="20">
								<input data-tipo="cor" class="corPergunta" type="text" placeholder="Cor de fundo da pergunta">
							</fieldset>

						<div class="opcoes-respostas">
							<!-- RESPOSTA CORRETA -->
							<fieldset class="resposta-correta">
								<div class="legend">Resposta correta</div class="legend">
								<input data-tipo="texto-opcao" class="resposta resposta-correta" type="text" placeholder="Resposta correta" minlength="">
								<input data-tipo="URL" class="imagem" type="url" placeholder="URL da imagem do seu quizz">
							</fieldset>

							<!-- RESPOSTAS INCORRETAS -->
							<div class="respostas-incorretas">
								<div class="legend">Respostas incorretas</div class="legend">
								<fieldset>
									<input data-tipo="texto-opcao" class="resposta resposta-incorreta" type="text" placeholder="Resposta incorreta 1" minlength="">
									<input data-tipo="URL" class="imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input data-tipo="texto-opcao" class = "resposta resposta-incorreta" type="text" placeholder="Resposta incorreta 2" minlength="">
									<input data-tipo="URL" class = "imagem" type="url" placeholder="URL da imagem do seu quizz">
								</fieldset>

								<fieldset>
									<input data-tipo="texto-opcao" class = "resposta resposta-incorreta" type="text" placeholder="Resposta incorreta 3" minlength="">
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
}

function criarQuizz(obj) {
	const promise = axios.post(
		"https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
		obj
	);

	//.then( trocartela, niveis->home
	//load pegarDados() )
}

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
		submeterPerguntasQuizz();
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
	const inputsMinimoNivel = form.querySelectorAll(
		".form-container fieldset input.acerto-minimo-nivel"
	);

	let tudoCerto = true;
	let umMinimoTemZero = false;

	for (let i = 0; i < inputsMinimoNivel.length; i++) {
		const input = inputsMinimoNivel[i];

		if (parseInt(input.value) === 0) {
			umMinimoTemZero = true;
			break;
		} else {
			alert("Uma das opcoes deve ter 0% de acerto.");
			break;
		}
	}

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
