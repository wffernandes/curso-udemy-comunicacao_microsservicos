package br.com.cursoudemy.productapi.config.interceptor;

import br.com.cursoudemy.productapi.modules.jwt.service.JwtServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

    @Bean
    public JwtServices jwtServices() {
        return new JwtServices();
    }

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor(jwtServices());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor());
    }
}
