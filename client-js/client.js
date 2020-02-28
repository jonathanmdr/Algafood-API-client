const config = {
  clientId: "food-analytics",  
  authorizeUrl: "http://localhost:8080/oauth/authorize",
  tokenUrl: "http://localhost:8080/oauth/token",
  callbackUrl: "http://localhost:8082",
  paymentFormsUrl: "http://localhost:8080/v1/payment-forms"
}

let accessToken = "";

function generateCodeVerifier() {
  let codeVerifier = generateRandomString(128);
  localStorage.setItem("codeVerifier", codeVerifier);

  return codeVerifier;
}

function generateRandomString(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

function generateCodeChallenge(codeVerifier) {
  return base64URL(CryptoJS.SHA256(codeVerifier));
}

function getCodeVerifier() {
  return localStorage.getItem("codeVerifier");
}

function base64URL(string) {
  return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function consultar() {
  $.ajax({
    url: config.paymentFormsUrl,
    type: "get",

    beforeSend: function(request) {
      request.setRequestHeader("Authorization", "Bearer " + accessToken);
    },

    success: function(response) {
      preencherTabela(response._embedded.paymentForms);
    },

    error: function(error) {
      alert("Ocorreu um erro ao tentar realizar a consulta!");
    }
  });
}

function cadastrar() {
  var formaPagamentoJson = JSON.stringify({
    "name": $("#campo-descricao").val()
  });

  console.log(formaPagamentoJson);

  $.ajax({
    url: config.paymentFormsUrl,
    type: "post",
    data: formaPagamentoJson,
    contentType: "application/json",

    beforeSend: function(request) {
      request.setRequestHeader("Authorization", "Bearer " + accessToken);
    },

    success: function(response) {
      alert("Forma de pagamento adicionada!");
      consultar();
    },

    error: function(error) {
      if (error.status == 400) {
        var problem = JSON.parse(error.responseText);
        alert(problem.userMessage);
      } else {
        alert("Erro ao cadastrar forma de pagamento!");
      }
    }
  });
}

function excluir(formaPagamento) {
  var url = config.paymentFormsUrl + "/" + formaPagamento.id;

  $.ajax({
    url: url,
    type: "delete",

    beforeSend: function(request) {
      request.setRequestHeader("Authorization", "Bearer " + accessToken);
    },

    success: function(response) {      
      alert("Forma de pagamento removida!");
      consultar();
    },

    error: function(error) {
      // tratando todos os erros da categoria 4xx
      if (error.status >= 400 && error.status <= 499) {
        var problem = JSON.parse(error.responseText);
        alert(problem.userMessage);
      } else {
        alert("Erro ao remover forma de pagamento!");
      }
    }
  });
}

function preencherTabela(formasPagamento) {
  $("#tabela tbody tr").remove();
  
  $.each(formasPagamento, function(i, formaPagamento) {
    var linha = $("<tr>");

    var linkAcao = $("<a href='#'>")
      .text("Excluir")
      .click(function(event) {
        event.preventDefault();
        excluir(formaPagamento);
      });

    linha.append(
      $("<td>").text(formaPagamento.id),
      $("<td>").text(formaPagamento.name),
      $("<td>").append(linkAcao)
    );

    linha.appendTo("#tabela");
  });
}

function gerarAccessToken(code) { 
  let codeVerifier = getCodeVerifier();

  let params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", config.callbackUrl);
  params.append("client_id", config.clientId);
  params.append("code_verifier", codeVerifier);

  $.ajax({
    url: config.tokenUrl,
    type: "post",
    data: params.toString(),
    contentType: "application/x-www-form-urlencoded",

    success: function(response) {
      accessToken = response.access_token;
      alert("Token gerado com sucesso!")
    },

    error: function(error) {
      alert("Erro ao gerar access key");
    }
  });
}

function login() {
  let codeVerifier = generateCodeVerifier();
  let codeChallenge = generateCodeChallenge(codeVerifier);

  window.location.href = `${config.authorizeUrl}?response_type=code&client_id=${config.clientId}&redirect_uri=${config.callbackUrl}&code_challenge_method=s256&code_challenge=${codeChallenge}`;
}

$(document).ready(function() {
  let params = new URLSearchParams(window.location.search);

  let code = params.get("code");
  if (code) {
    gerarAccessToken(code);
  }
});

$("#btn-consultar").click(consultar);
$("#btn-cadastrar").click(cadastrar);
$("#btn-login").click(login);