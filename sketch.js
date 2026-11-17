
let imagemOriginal;
let imagemRuido;
let mostrarRuido = true;

async function setup() {

    imagemOriginal = await loadImage("assets/Indominus.png");

    let porcentagemRuido = configurarRuido();

    prepararImagem(porcentagemRuido);

    noLoop();
}

function configurarRuido() {

    while (true) {

        let resposta = prompt(
            "Digite a porcentagem de ruído (0 a 1):"
        );

        if (resposta === null) {
            return 0;
        }

        let porcentagem = Number(resposta);

        if (
            resposta.trim() !== "" &&
            Number.isFinite(porcentagem) &&
            porcentagem >= 0 &&
            porcentagem <= 1
        ) {
            return porcentagem;
        }

        alert("Valor inválido! Digite um número entre 0 e 1.");
    }
}

function prepararImagem(porcentagemRuido) {

    if (porcentagemRuido === 0) {

        mostrarRuido = false;

    } else {

        imagemRuido = imagemOriginal.get();

        let totalPixels = imagemRuido.width * imagemRuido.height;

        let quantidadeRuido = Math.floor(
            totalPixels * porcentagemRuido
        );

        aplicarRuido(imagemRuido, quantidadeRuido);
    }

    if (mostrarRuido) {

        createCanvas(
            imagemOriginal.width * 2,
            imagemOriginal.height + 40
        );

        criarBotaoCancelar();

    } else {

        createCanvas(
            imagemOriginal.width,
            imagemOriginal.height + 40
        );
    }
}

function criarBotaoCancelar() {

    let botaoCancelar = createButton(
        "Cancelar aplicação de ruído"
    );

    botaoCancelar.position(10, height + 10);

    botaoCancelar.mousePressed(() => {

        mostrarRuido = false;

        resizeCanvas(
            imagemOriginal.width,
            imagemOriginal.height + 40
        );

        redraw();

        botaoCancelar.remove();
    });
}

function draw() {

    background(240);

    fill(0);
    textSize(16);

    text("Imagem Original", 10, 25);

    image(imagemOriginal, 0, 40);

    if (mostrarRuido) {

        text("Imagem com Ruído", imagemOriginal.width + 10, 25);

        image(imagemRuido, imagemOriginal.width, 40);
    }
}

function aplicarRuido(imagem, quantidade) {

    imagem.loadPixels();

    let totalPixels = imagem.width * imagem.height;

    let totalAlteracoes = Math.min(
        Math.max(0, Math.floor(quantidade)),
        totalPixels
    );

    let indices = [];

    for (let i = 0; i < totalPixels; i++) {
        indices.push(i);
    }

    for (let i = 0; i < totalAlteracoes; i++) {

        let sorteio = floor(random(i, totalPixels));

        [indices[i], indices[sorteio]] =
            [indices[sorteio], indices[i]];

        let indice = indices[i];
        let posicao = indice * 4;

        let valor = random() < 0.5 ? 0 : 255;

        imagem.pixels[posicao] = valor;
        imagem.pixels[posicao + 1] = valor;
        imagem.pixels[posicao + 2] = valor;
    }

    imagem.updatePixels();
}
