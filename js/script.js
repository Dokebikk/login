   import { createClient } from "https://esm.sh/@supabase/supabase-js";

    const supabaseUrl = "https://cdahzjliaatyukafugfn.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkYWh6amxpYWF0eXVrYWZ1Z2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUxNjU3NiwiZXhwIjoyMDczMDkyNTc2fQ.lU_EY8F5F9FxF_B1uO_0Dv_64nvgsZAXA78e2Ne7GWc";
    const supabase = createClient(supabaseUrl, supabaseKey);

    async function cadastrar(event) {
      event.preventDefault();
      const nome = document.getElementById("nomeCadastro").value;
      const senha = document.getElementById("senhaCadastro").value;

      // Verifica se já existe o nome de usuário
      const { data: usuarios, error: erroBusca } = await supabase
        .from("login")
        .select("nome, senha");

      if (erroBusca) {
        alert("Erro ao verificar usuários: " + erroBusca.message);
        return;
      }

      // Checa se o nome já existe
      const nomeExistente = usuarios.find(u => u.nome === nome);
      if (nomeExistente) {
        alert("Já existe um usuário com esse nome!");
        return;
      }

      // Checa se a senha já pertence a outro usuário
      const usuarioSenha = usuarios.find(u => u.senha === senha);
      if (usuarioSenha) {
        alert(`Esta senha já pertence a ${usuarioSenha.nome}`);
        return;
      }

      // Se passou, cadastra normalmente
      const { data, error } = await supabase
        .from("login")
        .insert([{ nome, senha }]);

      if (error) alert("Erro ao cadastrar: " + error.message);
      else alert("Usuário cadastrado: " + data[0].nome);
    }

    async function login(event) {
      event.preventDefault();
      const nome = document.getElementById("nomeLogin").value;
      const senha = document.getElementById("senhaLogin").value;

      // Busca todos os usuários para verificar senha
      const { data: usuarios, error: erroBusca } = await supabase
        .from("login")
        .select("nome, senha");

      if (erroBusca) {
        alert("Erro ao verificar usuários: " + erroBusca.message);
        return;
      }

      // Verifica se existe usuário com esse nome e senha
      const usuarioCorreto = usuarios.find(u => u.nome === nome && u.senha === senha);
      if (usuarioCorreto) {
        alert("Bem-vindo, " + usuarioCorreto.nome + "!");
        return;
      }

      // Se não achou, verifica se a senha pertence a outro usuário
      const usuarioSenha = usuarios.find(u => u.senha === senha);
      if (usuarioSenha) {
        alert(`Esta senha já pertence a ${usuarioSenha.nome}`);
        return;
      }

      // Senão, usuário ou senha inválidos
      alert("Usuário ou senha inválidos!");
    }

    window.addEventListener("DOMContentLoaded", () => {
      const cadastroForm = document.getElementById("formCadastro");
      const loginForm = document.getElementById("formLogin");
      if (cadastroForm) cadastroForm.addEventListener("submit", cadastrar);
      if (loginForm) loginForm.addEventListener("submit", login);
    });