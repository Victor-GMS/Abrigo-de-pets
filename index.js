import express from "express";

const app = express();

app.use(express.json());

let ultimoId = 12;

let pets = [
  { idPet: 1, dsNome: "Rex", dsEspecie: "cachorro", nuIdade: 3, fgAdotado: false },
  { idPet: 2, dsNome: "Mia", dsEspecie: "gato", nuIdade: 2, fgAdotado: true },
  { idPet: 3, dsNome: "Thor", dsEspecie: "cachorro", nuIdade: 5, fgAdotado: false },
  { idPet: 4, dsNome: "Luna", dsEspecie: "gato", nuIdade: 1, fgAdotado: false },
  { idPet: 5, dsNome: "Bob", dsEspecie: "cachorro", nuIdade: 7, fgAdotado: true },
  { idPet: 6, dsNome: "Nina", dsEspecie: "coelho", nuIdade: 1, fgAdotado: false },
  { idPet: 7, dsNome: "Pipoca", dsEspecie: "hamster", nuIdade: 1, fgAdotado: true },
  { idPet: 8, dsNome: "Mel", dsEspecie: "cachorro", nuIdade: 4, fgAdotado: false },
  { idPet: 9, dsNome: "Simba", dsEspecie: "gato", nuIdade: 6, fgAdotado: true },
  { idPet: 10, dsNome: "Piu", dsEspecie: "pássaro", nuIdade: 2, fgAdotado: false },
  { idPet: 11, dsNome: "Fred", dsEspecie: "tartaruga", nuIdade: 15, fgAdotado: false },
  { idPet: 12, dsNome: "Amora", dsEspecie: "cachorro", nuIdade: 2, fgAdotado: true },
];

function buscarTodos() {
  return pets;
}

function buscarUm(idPet) {
  return pets.find((pet) => {
    return pet.idPet === idPet;
  });
}

function criar(dsNome, dsEspecie, nuIdade) {
  ultimoId++;

  let novoPet = {
    idPet: ultimoId,
    dsNome: dsNome,
    dsEspecie: dsEspecie,
    nuIdade: nuIdade,
    fgAdotado: false,
  };

  pets.push(novoPet);

  return novoPet;
}

function editar(idPet, dsNome, dsEspecie, nuIdade, fgAdotado) {
  let pet = buscarUm(idPet);

  if (dsNome !== undefined) pet.dsNome = dsNome;
  if (dsEspecie !== undefined) pet.dsEspecie = dsEspecie;
  if (nuIdade !== undefined) pet.nuIdade = nuIdade;
  if (fgAdotado !== undefined) pet.fgAdotado = fgAdotado;

  return pet;
}

function deletar(idPet) {
  let indexPet = pets.findIndex((pet) => {
    return pet.idPet === idPet;
  });

  if (indexPet === -1) {
    return false;
  }

  pets.splice(indexPet, 1);
  return true;
}

function textoInvalido(valor) {
  return typeof valor !== "string" || valor.trim() === "";
}

function idadeInvalida(valor) {
  return typeof valor !== "number" || isNaN(valor) || valor < 0;
}

app.get("/pets", (req, res) => {
  res.status(200).json(buscarTodos());
});

app.get("/pets/:id", (req, res) => {
  const idPet = parseInt(req.params.id);

  if (isNaN(idPet)) {
    return res.status(400).json({ mensagem: "identificador deve ser um numero" });
  }

  let pet = buscarUm(idPet);

  if (!pet) {
    return res.status(404).send();
  }

  res.status(200).json(pet);
});

app.post("/pets", (req, res) => {
  let dsNome = req.body.dsNome;
  let dsEspecie = req.body.dsEspecie;
  let nuIdade = req.body.nuIdade;

  if (textoInvalido(dsNome) || textoInvalido(dsEspecie)) {
    return res
      .status(400)
      .json({ mensagem: "dsNome e dsEspecie são obrigatórios e não podem ser vazios" });
  }

  if (idadeInvalida(nuIdade)) {
    return res
      .status(400)
      .json({ mensagem: "nuIdade é obrigatório e deve ser um número maior ou igual a 0" });
  }

  let novoPet = criar(dsNome, dsEspecie, nuIdade);

  res.status(201).json(novoPet);
});

app.patch("/pets/:id", (req, res) => {
  const idPet = parseInt(req.params.id);

  if (isNaN(idPet)) {
    return res.status(400).json({ mensagem: "identificador deve ser um numero" });
  }

  if (!buscarUm(idPet)) {
    return res.status(404).send();
  }

  let dsNome = req.body.dsNome;
  let dsEspecie = req.body.dsEspecie;
  let nuIdade = req.body.nuIdade;
  let fgAdotado = req.body.fgAdotado;

  if (
    dsNome === undefined &&
    dsEspecie === undefined &&
    nuIdade === undefined &&
    fgAdotado === undefined
  ) {
    return res.status(400).json({ mensagem: "nenhum campo válido enviado" });
  }

  if (dsNome !== undefined && textoInvalido(dsNome)) {
    return res.status(400).json({ mensagem: "dsNome não pode ser vazio" });
  }

  if (dsEspecie !== undefined && textoInvalido(dsEspecie)) {
    return res.status(400).json({ mensagem: "dsEspecie não pode ser vazio" });
  }

  if (nuIdade !== undefined && idadeInvalida(nuIdade)) {
    return res
      .status(400)
      .json({ mensagem: "nuIdade deve ser um número maior ou igual a 0" });
  }

  if (fgAdotado !== undefined && typeof fgAdotado !== "boolean") {
    return res.status(400).json({ mensagem: "fgAdotado deve ser true ou false" });
  }

  let petAtualizado = editar(idPet, dsNome, dsEspecie, nuIdade, fgAdotado);

  res.status(200).json(petAtualizado);
});

app.delete("/pets/:id", (req, res) => {
  const idPet = parseInt(req.params.id);

  if (isNaN(idPet)) {
    return res.status(400).json({ mensagem: "identificador deve ser um numero" });
  }

  let removeu = deletar(idPet);

  if (!removeu) {
    return res.status(404).send();
  }

  res.sendStatus(204);
});


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});