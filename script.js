document.addEventListener("DOMContentLoaded", function () {
  const salasContainer = document.getElementById("salas-container");
  const gerarRelatorioBtn = document.getElementById("gerar-relatorio");
  const agendarSalaBtn = document.getElementById("agendar-sala");
  let ocupacoes = []; // Array para armazenar as ocupações
  let agendamentos = []; // Array para armazenar os agendamentos

  // Definição flexível das salas existentes na instituição
  const salasExistentes = [];

  // Gerar salas automaticamente seguindo o padrão
  for (let andar = 1; andar <= 5; andar++) {
    let maxSalaA, maxSalaB;
    
    if (andar === 1) {
      maxSalaA = 8; // A101 até A108
      maxSalaB = 8; // B101 até B108
    } else if (andar === 2) {
      maxSalaA = 8; // A201 até A208
      maxSalaB = 9; // B201 até B209
    } else if (andar >= 3) {
      maxSalaA = 9; // A301 até A309, A401 até A409, A501 até A509
      maxSalaB = 9; // B301 até B309, B401 até B409, B501 até B509
    }

    // Criar salas do lado A
    for (let i = 1; i <= maxSalaA; i++) {
      const numeroFormatado = i.toString().padStart(2, '0');
      salasExistentes.push({
        numero: `A${andar}${numeroFormatado}`,
        andar: andar,
        lado: "A"
      });
    }

    // Criar salas do lado B
    for (let i = 1; i <= maxSalaB; i++) {
      const numeroFormatado = i.toString().padStart(2, '0');
      salasExistentes.push({
        numero: `B${andar}${numeroFormatado}`,
        andar: andar,
        lado: "B"
      });
    }
  }

  // Organizar salas por andar
  const salasPorAndar = {};
  salasExistentes.forEach(sala => {
    if (!salasPorAndar[sala.andar]) {
      salasPorAndar[sala.andar] = { A: [], B: [] };
    }
    salasPorAndar[sala.andar][sala.lado].push(sala.numero);
  });

  // Criar interface para cada andar que tem salas
  Object.keys(salasPorAndar).sort((a, b) => parseInt(a) - parseInt(b)).forEach(andar => {
    const divAndar = document.createElement("div");
    divAndar.classList.add("andar");

    const tituloAndar = document.createElement("div");
    tituloAndar.classList.add("titulo-andar");
    tituloAndar.textContent = `${andar}º Andar`;
    divAndar.appendChild(tituloAndar);

    // Criar salas do lado A se existirem
    if (salasPorAndar[andar].A.length > 0) {
      const tituloA = document.createElement("div");
      tituloA.classList.add("titulo-linha");
      tituloA.textContent = "Lado A";
      divAndar.appendChild(tituloA);

      const divSalasA = document.createElement("div");
      divSalasA.classList.add("salas");

      salasPorAndar[andar].A.forEach(numeroSala => {
        const divSala = criarElementoSala(numeroSala);
        divSalasA.appendChild(divSala);
      });

      divAndar.appendChild(divSalasA);
    }

    // Criar salas do lado B se existirem
    if (salasPorAndar[andar].B.length > 0) {
      const tituloB = document.createElement("div");
      tituloB.classList.add("titulo-linha");
      tituloB.textContent = "Lado B";
      divAndar.appendChild(tituloB);

      const divSalasB = document.createElement("div");
      divSalasB.classList.add("salas");

      salasPorAndar[andar].B.forEach(numeroSala => {
        const divSala = criarElementoSala(numeroSala);
        divSalasB.appendChild(divSala);
      });

      divAndar.appendChild(divSalasB);
    }

    salasContainer.appendChild(divAndar);
  });

  // Função para criar elemento de sala (reutilizável)
  function criarElementoSala(numeroSala) {
    const divSala = document.createElement("div");
    divSala.classList.add("sala", "livre");
    divSala.textContent = `Sala ${numeroSala}`;

              // Criar campos de Nome e RA

              const infoDiv = document.createElement("div");
              infoDiv.classList.add("info");

              const nomeInput = document.createElement("input");
              nomeInput.setAttribute("type", "text");
              nomeInput.setAttribute("placeholder", "Nome");

              const raInput = document.createElement("input");
              raInput.setAttribute("type", "text");
              raInput.setAttribute("placeholder", "RA");

             // Criar seletor de tipo de usuário
             const tipoSelect = document.createElement("select");
             tipoSelect.style.width = "100%";
             tipoSelect.style.padding = "4px";
             tipoSelect.style.margin = "2px 0";
             tipoSelect.style.border = "1px solid #ddd";
             tipoSelect.style.borderRadius = "4px";
             tipoSelect.style.fontSize = "10px";
             tipoSelect.style.background = "rgba(255,255,255,0.9)";

             const optionDefault = document.createElement("option");
             optionDefault.value = "";
             optionDefault.textContent = "Selecione o tipo";
             tipoSelect.appendChild(optionDefault);

             const optionAluno = document.createElement("option");
             optionAluno.value = "aluno";
             optionAluno.textContent = "Aluno";
             tipoSelect.appendChild(optionAluno);

             const optionServidor = document.createElement("option");
             optionServidor.value = "servidor";
             optionServidor.textContent = "Servidor";
             tipoSelect.appendChild(optionServidor);

             // Criar campo de contato (inicialmente oculto)
             const contatoInput = document.createElement("input");
             contatoInput.setAttribute("type", "text");
             contatoInput.setAttribute("placeholder", "Contato (WhatsApp/Email)");
             contatoInput.style.width = "100%";
             contatoInput.style.padding = "4px";
             contatoInput.style.margin = "2px 0";
             contatoInput.style.border = "1px solid #ddd";
             contatoInput.style.borderRadius = "4px";
             contatoInput.style.fontSize = "10px";
             contatoInput.style.background = "rgba(255,255,255,0.9)";
             contatoInput.style.display = "none";

             // Event listener para mostrar/ocultar campo de contato
             tipoSelect.addEventListener("change", function() {
                 if (tipoSelect.value === "aluno") {
                     contatoInput.style.display = "block";
                 } else {
                     contatoInput.style.display = "none";
                     contatoInput.value = "";
                 }
             });

             infoDiv.appendChild(tipoSelect);
             infoDiv.appendChild(contatoInput);

              // Criar temporizador
              const timerDisplay = document.createElement("p");
              timerDisplay.classList.add("timer");
              timerDisplay.style.display = "none";

              infoDiv.appendChild(nomeInput);
              infoDiv.appendChild(raInput);
              infoDiv.appendChild(timerDisplay);
              divSala.appendChild(infoDiv);

              let timerInterval;

              // Criar botões de ação
              const botoesContainer = document.createElement("div");
              botoesContainer.classList.add("botoes-sala");
              botoesContainer.style.display = "none";

              const btnReservar = document.createElement("button");
              btnReservar.textContent = "Reservar";
              btnReservar.classList.add("btn-reservar");

              const btnDevolver = document.createElement("button");
              btnDevolver.textContent = "Devolver";
              btnDevolver.classList.add("btn-devolver");
              btnDevolver.style.display = "none";

              botoesContainer.appendChild(btnReservar);
              botoesContainer.appendChild(btnDevolver);
              infoDiv.appendChild(botoesContainer);

              // Event listener para mostrar formulário ao clicar na sala
              divSala.addEventListener("click", function (event) {
                  if (event.target === divSala) {
                      if (divSala.classList.contains("livre") || divSala.classList.contains("agendada")) {
                          infoDiv.style.display = "block";
                          botoesContainer.style.display = "flex";
                          btnReservar.style.display = "block";
                          btnDevolver.style.display = "none";
                          nomeInput.focus();
                      }
                  }
              });

              // Função para ocultar formulário
              function ocultarFormulario() {
                  if (!divSala.classList.contains("ocupada")) {
                      infoDiv.style.display = "none";
                      botoesContainer.style.display = "none";
                      // Limpar campos se não estiver ocupada
                      nomeInput.value = "";
                      raInput.value = "";
                      tipoSelect.value = "";
                      contatoInput.value = "";
                      contatoInput.style.display = "none";
                  }
              }

              // Event listener para botão Reservar
              btnReservar.addEventListener("click", function (event) {
                  event.stopPropagation();

                  if (!nomeInput.value || !raInput.value || !tipoSelect.value) {
                      alert("Preencha todos os campos obrigatórios!");
                      return;
                  }

                  if (tipoSelect.value === "aluno" && !contatoInput.value) {
                      alert("Alunos devem preencher o campo de contato!");
                      return;
                  }

                  // Remover status anterior e marcar como ocupada
                  divSala.classList.remove("livre", "agendada");
                  divSala.classList.add("ocupada");

                  // Mostrar botão devolver e ocultar reservar
                  btnReservar.style.display = "none";
                  btnDevolver.style.display = "block";

                  // Iniciar contador crescente
                  let tempoDecorrido = 0;
                  timerDisplay.style.display = "block";

                  timerInterval = setInterval(function () {
                      let horas = Math.floor(tempoDecorrido / 3600);
                      let minutos = Math.floor((tempoDecorrido % 3600) / 60);
                      let segundos = tempoDecorrido % 60;

                      timerDisplay.textContent = `Tempo: ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

                      tempoDecorrido++;
                  }, 1000);
              });

              // Event listener para botão Devolver
              btnDevolver.addEventListener("click", function (event) {
                  event.stopPropagation();

                  // Registrar ocupação
                  const salaNumero = divSala.textContent.split('\n')[0].replace('Sala ', '');
                  const dataAtual = new Date();
                  const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
                  const horaInicio = "14:00"; // Simulando horário de início
                  const horaFim = dataAtual.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
                  const tipoUsuario = tipoSelect.value;
                  const contato = contatoInput.value || 'não informado';

                  ocupacoes.push(`${salaNumero} ${dataFormatada} ${horaInicio} às ${horaFim} ${nomeInput.value} ${tipoUsuario} ${contato}`);

                  // Parar temporizador
                  clearInterval(timerInterval);
                  timerDisplay.style.display = "none";

                  // Limpar formulário
                  nomeInput.value = "";
                  raInput.value = "";
                  tipoSelect.value = "";
                  contatoInput.value = "";
                  contatoInput.style.display = "none";

                  // Ocultar interface
                  infoDiv.style.display = "none";
                  botoesContainer.style.display = "none";
                  btnReservar.style.display = "block";
                  btnDevolver.style.display = "none";

                  // Verificar se há agendamento para esta sala
                  const temAgendamento = agendamentos.find(ag => ag.sala === salaNumero);

                  divSala.classList.remove("ocupada");
                  if (temAgendamento) {
                      divSala.classList.add("agendada");
                      // Manter info do agendamento visível
                      const agendamentoInfo = divSala.querySelector('.agendamento-info');
                      if (agendamentoInfo) {
                          agendamentoInfo.style.display = "block";
                      }
                  } else {
                      divSala.classList.add("livre");
                  }

                  alert("Chave devolvida com sucesso!");
              });
    return divSala;
  }

  // Função para agendar sala
  agendarSalaBtn.addEventListener("click", function () {
      const salaNumero = prompt("Digite o número da sala (ex: 100A, 201B):").trim().toUpperCase();
      if (!salaNumero) return;

      const dataAgendamento = prompt("Digite a data e horário do agendamento (ex: 15/12/2024 14:30):");
      if (!dataAgendamento) return;

      const nomeResponsavel = prompt("Digite o nome do responsável:");
      if (!nomeResponsavel) return;

      // Encontrar a sala correspondente
      const salas = document.querySelectorAll('.sala');
      let salaEncontrada = null;

      salas.forEach(sala => {
          const textoSala = sala.textContent.split('\n')[0].trim();
          const salaComparacao = `Sala ${salaNumero}`;
          if (textoSala === salaComparacao || textoSala.includes(salaNumero)) {
              salaEncontrada = sala;
          }
      });

      if (!salaEncontrada) {
          alert("Sala não encontrada!");
          return;
      }

      if (salaEncontrada.classList.contains("ocupada")) {
          alert("Sala está ocupada no momento!");
          return;
      }

      // Adicionar agendamento
      agendamentos.push({
          sala: salaNumero,
          data: dataAgendamento,
          responsavel: nomeResponsavel
      });

      // Atualizar visual da sala
      salaEncontrada.classList.remove("livre");
      salaEncontrada.classList.add("agendada");

      // Adicionar informações do agendamento
      let agendamentoInfo = salaEncontrada.querySelector('.agendamento-info');
      if (!agendamentoInfo) {
          agendamentoInfo = document.createElement("div");
          agendamentoInfo.classList.add("agendamento-info");
          salaEncontrada.appendChild(agendamentoInfo);
      }

      agendamentoInfo.innerHTML = `
          <div class="agendamento-texto">
              <strong>Agendado:</strong><br>
              ${dataAgendamento}<br>
              <small>${nomeResponsavel}</small>
          </div>
      `;
      agendamentoInfo.style.display = "block";

      alert(`Sala ${salaNumero} agendada com sucesso!`);
  });

  // Event listener global para ocultar formulários ao clicar fora
  document.addEventListener("click", function (event) {
      const salas = document.querySelectorAll('.sala');
      salas.forEach(sala => {
          const infoDiv = sala.querySelector('.info');
          const botoesContainer = sala.querySelector('.botoes-sala');

          // Se o clique não foi na sala nem nos elementos internos
          if (!sala.contains(event.target) && infoDiv.style.display === "block") {
              // Só ocultar se não estiver ocupada
              if (!sala.classList.contains("ocupada")) {
                  infoDiv.style.display = "none";
                  botoesContainer.style.display = "none";

                  // Limpar campos
                  const nomeInput = sala.querySelector('input[placeholder="Nome"]');
                  const raInput = sala.querySelector('input[placeholder="RA"]');
                  const tipoSelect = sala.querySelector('select');
                  const contatoInput = sala.querySelector('input[placeholder*="Contato"]');

                  if (nomeInput) nomeInput.value = "";
                  if (raInput) raInput.value = "";
                  if (tipoSelect) tipoSelect.value = "";
                  if (contatoInput) {
                      contatoInput.value = "";
                      contatoInput.style.display = "none";
                  }
              }
          }
      });
  });

  // Adicionar dados de exemplo ao histórico
  ocupacoes.push("B209 25/06/2025 19:00 às 22:45 André Leme Professor não informado");

  // Função para gerar relatório ao clicar no botão
  gerarRelatorioBtn.addEventListener("click", function () {
      // Salvar dados no localStorage para a página de relatório
      localStorage.setItem('ocupacoes', JSON.stringify(ocupacoes));
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

      // Abrir página de relatório
      window.open('relatorio.html', '_blank');
  });
});