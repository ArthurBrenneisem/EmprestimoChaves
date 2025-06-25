
document.addEventListener("DOMContentLoaded", function () {
    const tabelaOcupacoes = document.getElementById("tabela-ocupacoes").getElementsByTagName('tbody')[0];
    const tabelaAgendamentos = document.getElementById("tabela-agendamentos").getElementsByTagName('tbody')[0];
    const exportarBtn = document.getElementById("exportar-txt");
    const limparBtn = document.getElementById("limpar-historico");

    // Carregar dados do localStorage
    let ocupacoes = JSON.parse(localStorage.getItem('ocupacoes')) || [];
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Se não houver dados, adicionar exemplo
    if (ocupacoes.length === 0) {
        ocupacoes = ["B209 25/06/2025 19:00 às 22:45 André Leme Professor não informado"];
    }

    function carregarOcupacoes() {
        tabelaOcupacoes.innerHTML = '';
        
        if (ocupacoes.length === 0) {
            const row = tabelaOcupacoes.insertRow();
            row.innerHTML = '<td colspan="5" class="sem-dados">Nenhuma ocupação registrada</td>';
            return;
        }

        ocupacoes.forEach(ocupacao => {
            const partes = ocupacao.split(' ');
            if (partes.length >= 6) {
                const sala = partes[0];
                const data = partes[1];
                const horario = `${partes[2]} ${partes[3]} ${partes[4]}`;
                const nome = `${partes[5]} ${partes[6]}`;
                const contato = partes.slice(7).join(' ') || 'não informado';

                const row = tabelaOcupacoes.insertRow();
                row.innerHTML = `
                    <td>${sala}</td>
                    <td>${data}</td>
                    <td>${horario}</td>
                    <td>${nome}</td>
                    <td>${contato}</td>
                `;
            }
        });
    }

    function carregarAgendamentos() {
        tabelaAgendamentos.innerHTML = '';
        
        if (agendamentos.length === 0) {
            const row = tabelaAgendamentos.insertRow();
            row.innerHTML = '<td colspan="4" class="sem-dados">Nenhum agendamento ativo</td>';
            return;
        }

        agendamentos.forEach(agendamento => {
            const row = tabelaAgendamentos.insertRow();
            row.innerHTML = `
                <td>${agendamento.sala}</td>
                <td>${agendamento.data}</td>
                <td>${agendamento.responsavel}</td>
                <td><span class="status-ativo">Agendado</span></td>
            `;
        });
    }

    // Função para exportar relatório
    exportarBtn.addEventListener("click", function () {
        let conteudo = "=== RELATÓRIO DE USO DAS SALAS ===\n\n";
        conteudo += `Data de geração: ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        conteudo += "OCUPAÇÕES REGISTRADAS:\n";
        conteudo += "Sala | Data | Horário | Nome | Tipo | Contato\n";
        conteudo += "".padEnd(60, "-") + "\n";
        
        if (ocupacoes.length === 0) {
            conteudo += "Nenhuma ocupação registrada\n";
        } else {
            ocupacoes.forEach(ocupacao => {
                conteudo += ocupacao + "\n";
            });
        }
        
        conteudo += "\n\nAGENDAMENTOS ATIVOS:\n";
        conteudo += "Sala | Data/Horário | Responsável\n";
        conteudo += "".padEnd(40, "-") + "\n";
        
        if (agendamentos.length === 0) {
            conteudo += "Nenhum agendamento ativo\n";
        } else {
            agendamentos.forEach(agendamento => {
                conteudo += `${agendamento.sala} | ${agendamento.data} | ${agendamento.responsavel}\n`;
            });
        }

        const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Relatorio_Salas_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Função para limpar histórico
    limparBtn.addEventListener("click", function () {
        if (confirm("Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.")) {
            localStorage.removeItem('ocupacoes');
            localStorage.removeItem('agendamentos');
            ocupacoes = [];
            agendamentos = [];
            carregarOcupacoes();
            carregarAgendamentos();
            alert("Histórico limpo com sucesso!");
        }
    });

    // Carregar dados nas tabelas
    carregarOcupacoes();
    carregarAgendamentos();

    // Atualizar dados a cada 30 segundos
    setInterval(function() {
        ocupacoes = JSON.parse(localStorage.getItem('ocupacoes')) || [];
        agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        carregarOcupacoes();
        carregarAgendamentos();
    }, 30000);
});
