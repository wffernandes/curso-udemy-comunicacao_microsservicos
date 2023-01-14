package br.com.cursoudemy.productapi.config.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidadionException extends RuntimeException {

    public ValidadionException(String message) {
        super(message);
    }
}
