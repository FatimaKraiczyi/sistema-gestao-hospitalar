package br.com.gestao_hospitalar.auth_service.utils;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ViaCepClient {
    public String buscarEndereco(String cep) {
        RestTemplate client = new RestTemplate();
        Map<?, ?> resposta = client.getForObject("https://viacep.com.br/ws/" + cep + "/json/", Map.class);
        if (resposta.containsKey("erro")) throw new RuntimeException("CEP inválido");
        return resposta.get("logradouro") + ", " + resposta.get("bairro") + ", " + resposta.get("localidade") + "/" + resposta.get("uf");
    }
}