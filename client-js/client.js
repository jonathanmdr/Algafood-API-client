const config = {
  clientId: "food-analytics",
  clientSecret: "@food-4n4lytic$",
  authorizeUrl: "http://localhost:8095/oauth/authorize",
  tokenUrl: "http://localhost:8095/oauth/token",
  callbackUrl: "http://localhost:8082",
  paymentFormsUrl: "http://localhost:8080/v1/payment-forms"
}

let accessToken = "";

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
      consultar();

      alert("Forma de pagamento removida!");
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
  let clientAuth = btoa(config.clientId + ":" + config.clientSecret);
  
  let params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", config.callbackUrl);

  $.ajax({
    url: config.tokenUrl,
    type: "post",
    data: params.toString(),
    contentType: "application/x-www-form-urlencoded",

    beforeSend: function(request) {
      request.setRequestHeader("Authorization", "Basic " + clientAuth);
    },

    success: function(response) {
      accessToken = response.access_token;
    },

    error: function(error) {
      alert("Erro ao gerar access key");
    }
  });
}

function login() {
  // https://auth0.com/docs/protocols/oauth2/oauth-state
  let state = btoa(Math.random());
  localStorage.setItem("clientState", state);

  window.location.href = `${config.authorizeUrl}?response_type=code&client_id=${config.clientId}&state=${state}&redirect_uri=${config.callbackUrl}`;
}

$(document).ready(function() {
  let params = new URLSearchParams(window.location.search);

  let code = params.get("code");
  let state = params.get("state");
  let currentState = localStorage.getItem("clientState");

  if (code) {
    if (currentState == state) {
      gerarAccessToken(code);
    } else {
      alert("State inválido");
    }
  }
});

$("#btn-consultar").click(consultar);
$("#btn-cadastrar").click(cadastrar);
$("#btn-login").click(login);