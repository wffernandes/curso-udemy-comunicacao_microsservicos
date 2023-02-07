package br.com.cursoudemy.productapi.config;

import br.com.cursoudemy.productapi.config.Exception.ValidadionException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

public class RequestUtil {

    public static HttpServletRequest getCurrentRequest() {
        try {
            return ((ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes())
                    .getRequest();
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ValidadionException("The current request could not be proccessed.");
        }
    }
}
