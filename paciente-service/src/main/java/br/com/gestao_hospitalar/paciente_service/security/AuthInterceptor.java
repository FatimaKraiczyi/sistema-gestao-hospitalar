package br.com.gestao_hospitalar.paciente_service.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(
    HttpServletRequest request,
    HttpServletResponse response,
    Object handler
  ) throws Exception {
    String userId = request.getHeader("x-user-id");
    String userCpf = request.getHeader("x-user-cpf");
    String userEmail = request.getHeader("x-user-email");
    String userType = request.getHeader("x-user-type");

    if (
      userId == null || userCpf == null || userEmail == null || userType == null
    ) {
      response.sendError(
        HttpServletResponse.SC_UNAUTHORIZED,
        "Missing authentication headers"
      );
      return false;
    }

    if (!userType.equalsIgnoreCase("PACIENTE")) {
      response.sendError(
        HttpServletResponse.SC_FORBIDDEN,
        "Access denied for user type: " + userType
      );
      return false;
    }

    return true;
  }
}
