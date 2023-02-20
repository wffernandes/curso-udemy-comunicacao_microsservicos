package br.com.cursoudemy.productapi.config.interceptor;

import br.com.cursoudemy.productapi.config.Exception.ValidadionException;
import br.com.cursoudemy.productapi.modules.jwt.service.JwtServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

import static org.springframework.util.ObjectUtils.isEmpty;

@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private static final String AUTHORIZATION = "Authorization";
    private static final String TRANSACTION_ID = "transactionid";

    private final JwtServices jwtService;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        if (isOptions(request)) {
            return true;
        }
        if (isEmpty(request.getHeader(TRANSACTION_ID))) {
            throw new ValidadionException("The transactionid header is required.");
        }
        var authorization = request.getHeader(AUTHORIZATION);
        jwtService.validateAuthorization(authorization);
        request.setAttribute("serviceid", UUID.randomUUID().toString());
        return true;
    }

    private boolean isOptions(HttpServletRequest request) {
        return HttpMethod.OPTIONS.name().equals(request.getMethod());
    }
}
