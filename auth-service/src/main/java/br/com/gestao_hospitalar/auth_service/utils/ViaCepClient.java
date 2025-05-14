package br.com.gestao_hospitalar.auth_service.utils;

import br.com.gestao_hospitalar.auth_service.dto.ViaCepResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ViaCepClient {
    public ViaCepResponse buscarEndereco(String cep) {
        String url = "https://viacep.com.br/ws/" + cep + "/json/";
        return new RestTemplate().getForObject(url, ViaCepResponse.class);
    }
}
